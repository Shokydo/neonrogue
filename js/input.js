1: let keys = {};
2: let isRebinding = false;
3: 
4: document.addEventListener('keydown', e => {
5:   if (isRebinding) return;
6:   const k = e.key.toLowerCase();
7:   keys[k] = true;
8: 
9:   if (lobbyActive) {
10:     if (k === 'escape') {
11:       e.preventDefault();
12:       if (settingsOpen) { toggleSettings(); }
13:       else { toggleSettings(); }
14:       return;
15:     }
16:     if (k === 'e' || k === 'у') { e.preventDefault(); lobbySelectClass(); }
17:     return;
18:   }
19: 
20:   if (k === 'escape') {
21:     e.preventDefault();
22:     if (settingsOpen) { toggleSettings(); }
23:     else if (skillMenuOpen) { toggleSkillMenu(); }
24:     else if (pendingPickup) { skipPickup(); }
25:     else if (gameRunning) { togglePause(); }
26:     return;
27:   }
28: 
29:   const kb = (typeof gameSettings !== 'undefined' && gameSettings.keybinds) ? gameSettings.keybinds : {};
30: 
31:   if (k === (kb.dash || 'shift')) tryDash();
32:   if (k === (kb.ability1 || '1')) tryAbility1();
33:   if (k === (kb.ability2 || '2')) tryAbility2();
34:   if (k === (kb.ability3 || '3')) tryUlt();
35:   if (k === (kb.upgrade || 'p')) { e.preventDefault(); toggleSkillMenu(); }
36:   if (k === 'f' || k === 'а') { if (pendingPickup) takePickup(); }
37:   if (e.code === 'Space') { e.preventDefault(); if (!player.charging) tryAttack(); }
38: });
39: document.addEventListener('keyup', e => {
40:   const k = e.key.toLowerCase();
41:   keys[k] = false;
42: });
43: cv.addEventListener('mousemove', e => {
44:   const r = cv.getBoundingClientRect();
45:   mouse.x = (e.clientX - r.left) * (W / r.width) + camera.x;
46:   mouse.y = (e.clientY - r.top) * (H / r.height) + camera.y;
47: });
48: cv.addEventListener('mousedown', e => {
49:   if (e.button === 0) {
50:     mouse.down = true;
51:   }
52:   if (e.button === 2) {
53:     e.preventDefault();
54:     if (playerClass === 'melee') {
55:       throwKnife();
56:     } else if (playerClass === 'tech') {
57:       techieShield.active = true;
58:       techieShield.broken = false;
59:     }
60:   }
61: });
62: cv.addEventListener('mouseup', e => {
63:   if (e.button === 0) {
64:     mouse.down = false;
65:   }
66:   if (e.button === 2) {
67:     if (playerClass === 'tech') {
68:       techieShield.active = false;
69:       if (techieShield.hp <= 0) {
70:         techieShield.broken = true;
71:         techieShield.cooldown = 180;
72:       }
73:     }
74:   }
75: });
76: cv.addEventListener('contextmenu', e => e.preventDefault());