(function () {
  function spawnEnemy() {
    const availableTypes = enemyTypes.slice(0, Math.min(enemyTypes.length, 1 + Math.floor(survivalTime / 120)));
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 300 + Math.random() * 400;
    const totalImplants = Object.values(player.implants).reduce((a, b) => a + b, 0);
    const hpMult = 1 + (survivalTime / 180) * 0.5 + totalImplants * 0.12;
    const dmgMult = 1 + totalImplants * 0.10;
    const xpMult = 1 + totalImplants * 0.04;

    const enemy = {
      x: player.x + Math.cos(angle) * dist,
      y: player.y + Math.sin(angle) * dist,
      type: { ...type, dmg: Math.floor(type.dmg * dmgMult), xp: Math.floor(type.xp * xpMult) },
      hp: type.hp * hpMult,
      maxHp: type.hp * hpMult,
      size: type.size,
      attackCd: 0,
      hitFlash: 0
    };

    enemies.push(enemy);
  }

  function spawnBoss() {
    const angle = Math.random() * Math.PI * 2;
    const totalImplants = Object.values(player.implants).reduce((a, b) => a + b, 0);
    const hpMult = 1 + (survivalTime / 180) * 0.5 + totalImplants * 0.12;
    const dmgMult = 1 + totalImplants * 0.10;

    enemies.push({
      x: player.x + Math.cos(angle) * 400,
      y: player.y + Math.sin(angle) * 400,
      type: {
        name: 'НЕКРО-БОСС',
        color: '#f0f',
        hp: 400 * hpMult,
        speed: 1.0,
        size: 35,
        dmg: Math.floor(25 * dmgMult),
        attack: 'both',
        boss: true
      },
      hp: 400 * hpMult,
      maxHp: 400 * hpMult,
      size: 35,
      attackCd: 0,
      hitFlash: 0
    });
  }

  function spawnTower() {
    const totalImplants = Object.values(player.implants).reduce((a, b) => a + b, 0);
    enemies.push({
      x: 200 + Math.random() * (WORLD_W - 400),
      y: 200 + Math.random() * (WORLD_H - 400),
      type: { ...TOWER_TYPE, dmg: 0 },
      hp: TOWER_TYPE.hp * (1 + totalImplants * 0.12),
      maxHp: TOWER_TYPE.hp * (1 + totalImplants * 0.12),
      size: TOWER_TYPE.size,
      attackCd: 0,
      hitFlash: 0,
      towerSpawnTimer: 0
    });
    showMsg('БАШНЯ!', '#f80');
  }

  function spawnTowerMinion(tower) {
    const angle = Math.random() * Math.PI * 2;
    const totalImplants = Object.values(player.implants).reduce((a, b) => a + b, 0);
    const baseType = enemyTypes[Math.floor(Math.random() * 3)];

    enemies.push({
      x: tower.x + Math.cos(angle) * 30,
      y: tower.y + Math.sin(angle) * 30,
      type: {
        ...baseType,
        dmg: Math.floor(baseType.dmg * (1 + totalImplants * 0.10) * 0.6),
        towerMob: true
      },
      hp: baseType.hp * 0.5,
      maxHp: baseType.hp * 0.5,
      size: baseType.size,
      attackCd: 0,
      hitFlash: 0
    });
  }

  window.spawnEnemy = spawnEnemy;
  window.spawnBoss = spawnBoss;
  window.spawnTower = spawnTower;
  window.spawnTowerMinion = spawnTowerMinion;
})();
