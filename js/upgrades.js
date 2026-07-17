// === СИСТЕМА УЛУЧШЕНИЙ ===
let currentUpgradePage = 1;
const totalUpgradePages = 4;

const upgradeData = {
  abilities: [
    { id:'dash', name:'РЫВОК', desc:'Дистанция рывка +20% за уровень', maxLevel:5, cost:2, effect:(lv)=>{ player.stats.qCdPct += 8; }},
    { id:'shockwave', name:'УДАРНАЯ ВОЛНА', desc:'Урон от волны +20% за уровень', maxLevel:10, cost:3, effect:(lv)=>{ player.stats.dmgPct += 4; }},
    { id:'slow', name:'ЗАМЕДЛЕНИЕ', desc:'Длительность замедления +15%', maxLevel:8, cost:2, effect:(lv)=>{ player.stats.rangePct += 2; }},
    { id:'ult', name:'УЛЬТИМАЦИЯ', desc:'Урон ульты +25%, КД -10%', maxLevel:5, cost:5, effect:(lv)=>{ player.stats.dmgPct += 5; player.stats.abilityCdPct += 2; }}
  ],
  clicks: [
    { id:'damage', name:'УРОН АТАКИ', desc:'Базовый урон +15% за уровень', maxLevel:20, cost:1, effect:(lv)=>{ player.stats.dmgPct += 3; }},
    { id:'crit', name:'КРИТИЧЕСКИЙ УРОН', desc:'Шанс крита +5%, урон +10%', maxLevel:10, cost:3, effect:(lv)=>{ player.stats.dmgPct += 3; }},
    { id:'multiclick', name:'МУЛЬТИ-УДАР', desc:'Шанс двойной атаки +3%', maxLevel:5, cost:4, effect:(lv)=>{ player.stats.atkSpeedPct += 3; }},
    { id:'speed', name:'СКОРОСТЬ АТАКИ', desc:'Скорость атаки +10%', maxLevel:10, cost:2, effect:(lv)=>{ player.stats.atkSpeedPct += 2; }}
  ],
  implants: [
    { id:'hp', name:'БИО-УСИЛЕНИЕ', desc:'Макс. здоровье +20 за уровень', maxLevel:15, cost:2, effect:(lv)=>{ player.stats.maxHpPct += 4; }},
    { id:'regen', name:'НАНО-РЕГЕНЕРАЦИЯ', desc:'Регенерация HP +0.5/сек', maxLevel:10, cost:3, effect:(lv)=>{ player.stats.hpRegenPct += 2; }},
    { id:'speed', name:'НЕРВНЫЙ ИМПЛАНТ', desc:'Скорость передвижения +5%', maxLevel:5, cost:4, effect:(lv)=>{ player.speed += 0.15; }},
    { id:'xp', name:'КОГНИТИВНЫЙ БУСТ', desc:'Получение опыта +10%', maxLevel:8, cost:5, effect:(lv)=>{ player.stats.luckPct += 2; }}
  ],
  weapon: [
    { id:'damage', name:'УСИЛЕНИЕ СТВОЛА', desc:'Урон оружия +20%', maxLevel:15, cost:2, effect:(lv)=>{ player.stats.dmgPct += 3; }},
    { id:'firespeed', name:'СЕРВОПРИВОД', desc:'Скорострельность +15%', maxLevel:10, cost:3, effect:(lv)=>{ player.stats.atkSpeedPct += 2; }},
    { id:'range', name:'ДАЛЬНОСТЬ', desc:'Радиус атаки +10%', maxLevel:8, cost:2, effect:(lv)=>{ player.stats.rangePct += 3; }},
    { id:'lifesteal', name:'ВАМПИРИЗМ', desc:'Восстановление HP при попадании +2%', maxLevel:6, cost:4, effect:(lv)=>{ player.stats.hpRegenPct += 1; }}
  ]
};

let playerUpgrades = {
  abilities: {}, clicks: {}, implants: {}, weapon: {}
};

function changeUpgradePage(dir) {
  const newPage = currentUpgradePage + dir;
  if (newPage < 1 || newPage > totalUpgradePages) return;
  const cur = document.querySelector('.upgrade-page.active');
  if (cur) cur.style.animation = 'fadeOut 0.3s ease-out';
  setTimeout(() => {
    currentUpgradePage = newPage;
    renderUpgradePage(currentUpgradePage);
  }, 280);
}

function renderUpgradePage(num) {
  document.querySelectorAll('.upgrade-page').forEach(p => { p.classList.remove('active'); p.style.animation = ''; });
  const target = document.querySelector('.upgrade-page[data-page="' + num + '"]');
  if (target) { target.classList.add('active'); target.style.animation = 'fadeIn 0.4s ease-out'; }

  let gridId, category;
  switch(num) {
    case 1: gridId = 'abilitiesUpgrades'; category = 'abilities'; break;
    case 2: gridId = 'clicksUpgrades'; category = 'clicks'; break;
    case 3: gridId = 'implantsUpgrades'; category = 'implants'; break;
    case 4: gridId = 'weaponUpgrades'; category = 'weapon'; break;
  }

  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';

  upgradeData[category].forEach(u => {
    const lv = playerUpgrades[category][u.id] || 0;
    const maxed = lv >= u.maxLevel;
    const canBuy = !maxed && player.skillPoints >= u.cost;

    const card = document.createElement('div');
    card.className = 'upgrade-card' + (maxed ? ' maxed' : '');
    card.innerHTML =
      '<div class="upgrade-name">' + u.name + '</div>' +
      '<div class="upgrade-desc">' + u.desc + '</div>' +
      '<div class="upgrade-level">УРОВЕНЬ: ' + lv + ' / ' + u.maxLevel + '</div>' +
      '<button class="upgrade-btn" ' + (canBuy ? '' : 'disabled') + ' onclick="buyUpgrade(\'' + category + '\',\'' + u.id + '\')">' +
      (maxed ? 'МАКС' : 'УЛУЧШИТЬ (' + u.cost + ' оч.)') +
      '</button>';
    grid.appendChild(card);
  });

  document.getElementById('menuSkillPoints').textContent = player.skillPoints;
}

function buyUpgrade(category, upgradeId) {
  const u = upgradeData[category].find(x => x.id === upgradeId);
  if (!u) return;
  const lv = playerUpgrades[category][upgradeId] || 0;
  if (lv >= u.maxLevel || player.skillPoints < u.cost) return;

  player.skillPoints -= u.cost;
  playerUpgrades[category][upgradeId] = lv + 1;
  u.effect(lv + 1);
  applyImplantStats();
  renderUpgradePage(currentUpgradePage);
  updateUI();
  if (typeof playSound === 'function') playSound('upgrade');
}

function initUpgradeMenu() {
  currentUpgradePage = 1;
  document.getElementById('currentPage').textContent = '1';
  renderUpgradePage(1);
}
