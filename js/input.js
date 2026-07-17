// Переменные keys и isRebinding уже объявлены в data.js, здесь их НЕ ОБЪЯВЛЯЕМ

document.addEventListener('keydown', e => {
    if (isRebinding) return;
    const k = e.key.toLowerCase();
    keys[k] = true;

    if (typeof lobbyActive !== 'undefined' && lobbyActive) {
        if (k === 'escape') {
            e.preventDefault();
            if (typeof settingsOpen !== 'undefined' && settingsOpen) { toggleSettings(); }
            else { toggleSettings(); }
            return;
        }
        if (k === 'e' || k === 'у') { e.preventDefault(); if (typeof lobbySelectClass === 'function') lobbySelectClass(); }
        return;
    }

    if (k === 'escape') {
        e.preventDefault();
        if (typeof settingsOpen !== 'undefined' && settingsOpen) { toggleSettings(); }
        else if (typeof skillMenuOpen !== 'undefined' && skillMenuOpen) { toggleSkillMenu(); }
        else if (typeof pendingPickup !== 'undefined' && pendingPickup) { skipPickup(); }
        else if (gameRunning) { togglePause(); }
        return;
    }

    const kb = (typeof gameSettings !== 'undefined' && gameSettings.keybinds) ? gameSettings.keybinds : {};

    if (k === (kb.dash || 'shift')) { if (typeof tryDash === 'function') tryDash(); }
    if (k === (kb.ability1 || '1')) { if (typeof tryAbility1 === 'function') tryAbility1(); }
    if (k === (kb.ability2 || '2')) { if (typeof tryAbility2 === 'function') tryAbility2(); }
    if (k === (kb.ability3 || '3')) { if (typeof tryUlt === 'function') tryUlt(); }
    if (k === (kb.upgrade || 'p')) { e.preventDefault(); if (typeof toggleSkillMenu === 'function') toggleSkillMenu(); }
    if (k === 'f' || k === 'а') { if (typeof pendingPickup !== 'undefined' && pendingPickup) { if (typeof takePickup === 'function') takePickup(); } }
    if (e.code === 'Space') { e.preventDefault(); if (typeof player !== 'undefined' && !player.charging) { if (typeof tryAttack === 'function') tryAttack(); } }
});

document.addEventListener('keyup', e => {
    const k = e.key.toLowerCase();
    keys[k] = false;
});

// Инициализация мыши ТОЛЬКО после полной загрузки HTML
document.addEventListener('DOMContentLoaded', () => {
    const cv = document.getElementById('game');
    if (!cv) {
        console.error('ОШИБКА: Canvas с id="game" не найден в index.html');
        return;
    }

    cv.addEventListener('mousemove', e => {
        const r = cv.getBoundingClientRect();
        mouse.x = (e.clientX - r.left) * (W / r.width) + (typeof camera !== 'undefined' ? camera.x : 0);
        mouse.y = (e.clientY - r.top) * (H / r.height) + (typeof camera !== 'undefined' ? camera.y : 0);
    });

    cv.addEventListener('mousedown', e => {
        if (e.button === 0) {
            mouse.down = true;
        }
        if (e.button === 2) {
            e.preventDefault();
            if (typeof playerClass !== 'undefined' && playerClass === 'melee') {
                if (typeof throwKnife === 'function') throwKnife();
            } else if (typeof playerClass !== 'undefined' && playerClass === 'tech') {
                if (typeof techieShield !== 'undefined') {
                    techieShield.active = true;
                    techieShield.broken = false;
                }
            }
        }
    });

    cv.addEventListener('mouseup', e => {
        if (e.button === 0) {
            mouse.down = false;
        }
        if (e.button === 2) {
            if (typeof playerClass !== 'undefined' && playerClass === 'tech') {
                if (typeof techieShield !== 'undefined') {
                    techieShield.active = false;
                    if (techieShield.hp <= 0) {
                        techieShield.broken = true;
                        techieShield.cooldown = 180;
                    }
                }
            }
        }
    });

    cv.addEventListener('contextmenu', e => e.preventDefault());
});