function loop() {
  update(); draw();
  if (gameRunning) requestAnimationFrame(loop); else draw();
}

function showMsg(text, color) {
  const m = document.getElementById('msg');
  m.textContent = text; m.style.color = color || '#ff0';
  m.style.textShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
  m.classList.add('show');
  setTimeout(() => m.classList.remove('show'), 1800);
}

function dist(x1,y1,x2,y2) { return Math.hypot(x1-x2,y1-y2); }
function pointLineDist(px, py, x1, y1, x2, y2) {
  const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
  const dot = A*C + B*D;
  const lenSq = C*C + D*D;
  let t = lenSq !== 0 ? dot / lenSq : -1;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t*C), py - (y1 + t*D));
}

window.loop = loop;
window.startGame = startGame;
window.throwKnife = throwKnife;
window.tryAbility1 = tryAbility1;
window.tryAbility2 = tryAbility2;
window.tryUlt = tryUlt;
window.toggleSkillMenu = toggleSkillMenu;
window.takePickup = takePickup;
window.skipPickup = skipPickup;
window.playSound = playSound;

// Bootstrapping functions to resolve async definition issues
window.onerror = function(msg, url, line) {
  if (msg.includes('window\\.fullScreen') || msg.includes('Window\\.fullScreen') ||
      msg.includes('InstallTrigger') || msg.includes('onmozfullscreenchange')) {
    console.log('Ignoring deprecated browser API error:', msg);
    return true;
  }
  return false;
};

window.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, ensuring global functions are available...');
  
  // Ensure all required functions are available globally
  if (typeof window.startGame !== 'function' || typeof window.playSound !== 'function') {
    console.log('Functions not yet available, initializing...');
    // This will trigger when the main script loads
  }
});