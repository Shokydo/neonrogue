function toggleSkillMenu() {
  if (!gameRunning) return;
  skillMenuOpen = !skillMenuOpen;
  const menu = document.getElementById('skillMenu');
  if (skillMenuOpen) {
    playSound('ui_menu_open');
    gamePaused = true;
    menu.classList.add('show');
    renderSkillTree();
  } else {
    playSound('ui_menu_close');
    gamePaused = false;
    menu.classList.remove('show');
  }
}

function getSkillLevel(id) { return player.skills[id] || 0; }

let currentSkillTab = 'abilities';

function getSkillBonus(key) {
  let total = 0;
  const tree = skillTrees[playerClass];
  if (!tree) return 0;
  tree.forEach(branch => {
    branch.skills.forEach(skill => {
      if (skill.bonus && skill.bonus[key]) {
        total += skill.bonus[key] * getSkillLevel(skill.id);
      }
    });
  });
  return total;
}

function getAttackBonus(key) {
  let total = 0;
  const tree = attackTrees[playerClass];
  if (!tree) return 0;
  tree.forEach(branch => {
    branch.skills.forEach(skill => {
      if (skill.bonus && skill.bonus[key]) {
        total += skill.bonus[key] * getSkillLevel(skill.id);
      }
    });
  });
  return total;
}

function upgradeSkill(skill) {
  if (player.skillPoints < skill.cost) {
    playSound('ui_error');
    return;
  }
  const lvl = getSkillLevel(skill.id);
  if (lvl >= skill.max) {
    playSound('ui_skill_maxed');
    return;
  }
  player.skillPoints -= skill.cost;
  player.skills[skill.id] = lvl + 1;
  playSound('ui_skill_buy');
  renderSkillTree();
}

function renderSkillTree() {
  document.getElementById('skillPoints').textContent = player.skillPoints;

  const tabAbilities = document.getElementById('tabAbilities');
  const tabAttack = document.getElementById('tabAttack');
  if (tabAbilities) tabAbilities.classList.toggle('active', currentSkillTab === 'abilities');
  if (tabAttack) tabAttack.classList.toggle('active', currentSkillTab === 'attack');

  const skillMenu = document.getElementById('skillMenu');
  if (skillMenu) skillMenu.classList.toggle('attackMode', currentSkillTab === 'attack');

  const container = document.getElementById('skillColumns');
  container.innerHTML = '';

  const tree = currentSkillTab === 'abilities' ? skillTrees[playerClass] : attackTrees[playerClass];
  if (!tree) return;

  if (currentSkillTab === 'attack') {
    const branch = tree[0];
    if (!branch || !branch.skills) return;

    const allSkills = branch.skills;
    const topCount = Math.min(3, allSkills.length);
    const bottomCount = Math.min(6 - topCount, Math.max(0, allSkills.length - topCount));

    const topSkills = allSkills.slice(0, topCount);
    const bottomSkills = allSkills.slice(topCount, topCount + bottomCount).slice().reverse();

    function createSkillNodeElementForSnake(skill) {
      const lvl = getSkillLevel(skill.id);
      const isMaxed = lvl >= skill.max;
      const idxInAll = allSkills.findIndex(s => s.id === skill.id);
      const prevId = idxInAll > 0 ? allSkills[idxInAll - 1].id : null;
      const prevUnlocked = idxInAll === 0 || (prevId && getSkillLevel(prevId) > 0);
      const canAfford = player.skillPoints >= skill.cost;

      const node = document.createElement('div');
      node.className = 'skill-node' + (isMaxed ? ' maxed' : (!prevUnlocked ? ' locked' : (lvl > 0 ? ' unlocked' : '')));
      node.innerHTML = `<div class="sn-name">${skill.name}</div><div class="sn-desc">${skill.desc}</div><div class="sn-level">Ур. ${lvl}/${skill.max}</div><div class="sn-cost">${isMaxed ? 'МАКС' : 'ЦЕНА: ' + skill.cost + ' ОЧ.'}</div>`;

      if (!isMaxed && prevUnlocked && canAfford) {
        node.onmouseover = () => playSound('ui_hover');
        node.onclick = () => upgradeSkill(skill);
      }
      return node;
    }

    const topRow = document.createElement('div');
    topRow.className = 'skill-row top';
    topSkills.forEach((skill, idx) => {
      const col = document.createElement('div');
      col.className = 'skill-col';
      const title = document.createElement('div');
      title.className = 'skill-col-title';
      title.textContent = idx === 0 ? branch.title : '';
      col.appendChild(title);
      const nodeWrap = document.createElement('div');
      nodeWrap.style.position = 'relative';
      nodeWrap.style.zIndex = '1';
      nodeWrap.appendChild(createSkillNodeElementForSnake(skill));
      col.appendChild(nodeWrap);
      if (idx < topSkills.length - 1) {
        const line = document.createElement('div');
        line.className = 'skill-connector-line h-line right' + (getSkillLevel(topSkills[idx].id) > 0 ? ' unlocked' : '');
        col.appendChild(line);
      }
      topRow.appendChild(col);
    });
    container.appendChild(topRow);

    const bottomRow = document.createElement('div');
    bottomRow.className = 'skill-row bottom';
    bottomSkills.forEach((skill, idx) => {
      const col = document.createElement('div');
      col.className = 'skill-col';
      const title = document.createElement('div');
      title.className = 'skill-col-title';
      title.textContent = '';
      col.appendChild(title);
      const nodeWrap = document.createElement('div');
      nodeWrap.style.position = 'relative';
      nodeWrap.style.zIndex = '1';
      nodeWrap.appendChild(createSkillNodeElementForSnake(skill));
      col.appendChild(nodeWrap);
      if (idx < bottomSkills.length - 1) {
        const line = document.createElement('div');
        line.className = 'skill-connector-line h-line right' + (getSkillLevel(bottomSkills[idx].id) > 0 ? ' unlocked' : '');
        col.appendChild(line);
      }
      bottomRow.appendChild(col);
    });
    container.appendChild(bottomRow);

    if (topSkills.length > 0 && bottomSkills.length > 0) {
      const rightTop = topSkills[topSkills.length - 1];
      const rightBottom = bottomSkills[0];
      const isUnlocked = getSkillLevel(rightTop.id) > 0;
      const lastTopCol = topRow.children[topRow.children.length - 1];
      if (lastTopCol) {
        const corner = document.createElement('div');
        corner.className = 'corner-line top-right' + (isUnlocked ? ' unlocked' : '');
        lastTopCol.appendChild(corner);
      }
    }
    return;
  }

  tree.forEach(branch => {
    const col = document.createElement('div');
    col.className = 'skill-col';
    const title = document.createElement('div');
    title.className = 'skill-col-title';
    title.textContent = branch.title;
    col.appendChild(title);
    branch.skills.forEach((skill, idx) => {
      if (idx > 0) {
        const conn = document.createElement('div');
        conn.className = 'skill-connector' + (getSkillLevel(branch.skills[idx-1].id) > 0 ? ' unlocked' : '');
        col.appendChild(conn);
      }
      const lvl = getSkillLevel(skill.id);
      const isMaxed = lvl >= skill.max;
      const prevUnlocked = idx === 0 || getSkillLevel(branch.skills[idx-1].id) > 0;
      const canAfford = player.skillPoints >= skill.cost;
      const node = document.createElement('div');
      node.className = 'skill-node' + (isMaxed ? ' maxed' : (!prevUnlocked ? ' locked' : (lvl > 0 ? ' unlocked' : '')));
      node.innerHTML = `<div class="sn-name">${skill.name}</div><div class="sn-desc">${skill.desc}</div><div class="sn-level">Ур. ${lvl}/${skill.max}</div><div class="sn-cost">${isMaxed ? 'МАКС' : 'ЦЕНА: ' + skill.cost + ' ОЧ.'}</div>`;
      if (!isMaxed && prevUnlocked && canAfford) {
        node.onmouseover = () => playSound('ui_hover');
        node.onclick = () => upgradeSkill(skill);
      }
      col.appendChild(node);
    });
    container.appendChild(col);
  });
}

function switchSkillTab(tab) {
  if (currentSkillTab === tab) return;
  currentSkillTab = tab;
  playSound('ui_click');
  renderSkillTree();
}