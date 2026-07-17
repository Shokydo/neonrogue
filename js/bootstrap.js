// Minimal bootstrap to ensure globals exist before other modules run
// This file is loaded first (no defer) via index.html.
(function () {
  // Make player/global containers safe even if init.js runs before data.js (or data.js is partially blocked)
  if (typeof window === 'undefined') return;

  if (typeof window.W === 'undefined') window.W = 800;
  if (typeof window.H === 'undefined') window.H = 600;

  // World dimensions used in init.js
  window.WORLD_W = window.WORLD_W ?? 4000;
  window.WORLD_H = window.WORLD_H ?? 4000;

  if (typeof window.player === 'undefined') {
    window.player = { x: 0, y: 0, hp: 100, maxHp: 100, implants: {}, stats: {} };
  }

  // Common globals referenced across files
  window.camera = window.camera ?? { x: 0, y: 0 };
  window.currentAbility = window.currentAbility ?? 0;
  window.gameRunning = window.gameRunning ?? false;
  window.gamePaused = window.gamePaused ?? false;
  window.keys = window.keys ?? {};

  // Input mouse is required by input.js (mouse.down / mouse.x,y)
  window.mouse = window.mouse ?? { x: window.W / 2, y: window.H / 2, down: false };
})();

