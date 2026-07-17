const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;

function resizeCanvas() {
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  window.W = cv.width;
  window.H = cv.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const mini = document.getElementById('minimap');
const mctx = mini.getContext('2d');
mctx.imageSmoothingEnabled = false;

let audioCtx = null;
function initAudio() { 
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSoftPlasma(startFreq, endFreq, duration, volume) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const f1 = Math.max(60, Math.min(1600, startFreq));
  const f2 = Math.max(60, Math.min(1600, endFreq));

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';

  osc1.frequency.setValueAtTime(f1, now);
  osc1.frequency.exponentialRampToValueAtTime(Math.max(100, f2), now + duration);

  const detuneMul = 1.015;
  osc2.frequency.setValueAtTime(f1 * detuneMul, now);
  osc2.frequency.exponentialRampToValueAtTime(Math.max(100, f2 * detuneMul), now + duration);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(Math.min(0.06, volume), now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration + 0.05);
  osc2.stop(now + duration + 0.05);
}

function playSound(type) {
  if (!audioCtx) return;
  const v = (x) => Math.min(0.06, Math.max(0.01, x));

  switch(type) {
    case 'shoot': {
      playSoftPlasma(120, 70, 0.06, v(0.018));
      setTimeout(() => playSoftPlasma(900, 420, 0.085, v(0.03)), 8);
      break;
    }
    case 'hit':
      playSoftPlasma(420, 160, 0.07, v(0.032));
      break;
    case 'melee': {
      playSoftPlasma(520, 240, 0.08, v(0.028));
      setTimeout(() => playSoftPlasma(780, 360, 0.12, v(0.03)), 20);
      break;
    }
    case 'ability1':
      playSoftPlasma(400, 1000, 0.15, v(0.05));
      setTimeout(() => playSoftPlasma(1000, 300, 0.2, v(0.05)), 100);
      break;
    case 'ability2':
      playSoftPlasma(800, 500, 0.1, v(0.04));
      setTimeout(() => playSoftPlasma(900, 600, 0.1, v(0.04)), 80);
      setTimeout(() => playSoftPlasma(1000, 700, 0.12, v(0.04)), 160);
      break;
    case 'ult':
      playSoftPlasma(300, 80, 0.5, v(0.06));
      playSoftPlasma(600, 200, 0.4, v(0.05));
      break;
    case 'explosion':
      playSoftPlasma(250, 60, 0.3, v(0.05));
      break;
    case 'death':
      playSoftPlasma(600, 150, 0.3, v(0.04));
      break;
    case 'pickup':
      playSoftPlasma(1200, 1600, 0.15, v(0.03));
      break;
    case 'levelup':
      playSoftPlasma(523, 523, 0.2, v(0.04));
      setTimeout(() => playSoftPlasma(659, 659, 0.2, v(0.04)), 100);
      setTimeout(() => playSoftPlasma(784, 784, 0.3, v(0.04)), 200);
      break;
    case 'hurt':
      playSoftPlasma(200, 100, 0.15, v(0.05));
      break;
    case 'laser':
      playSoftPlasma(800, 400, 0.2, v(0.04));
      break;
    case 'crit':
      playSoftPlasma(1200, 600, 0.08, v(0.06));
      setTimeout(() => playSoftPlasma(900, 300, 0.10, v(0.04)), 15);
      break;
    case 'charge':
      playSoftPlasma(300, 900, 0.4, v(0.04));
      break;
    case 'turret':
      playSoftPlasma(1000, 500, 0.08, v(0.03));
      break;
    case 'lightning':
      playSoftPlasma(1200, 300, 0.1, v(0.04));
      break;
    case 'tech_smart_cast': {
      playSoftPlasma(950, 420, 0.06, v(0.03));
      setTimeout(() => playSoftPlasma(1400, 900, 0.08, v(0.035)), 15);
      break;
    }
    case 'tech_smart_shot': {
      playSoftPlasma(1100, 650, 0.045, v(0.022));
      setTimeout(() => playSoftPlasma(1600, 900, 0.03, v(0.018)), 10);
      break;
    }
    case 'tech_nano_cast': {
      playSoftPlasma(900, 1400, 0.12, v(0.03));
      setTimeout(() => playSoftPlasma(1200, 900, 0.10, v(0.028)), 70);
      break;
    }
    case 'tech_nano_tick': {
      playSoftPlasma(1500, 800, 0.03, v(0.02));
      break;
    }
    case 'tech_overload_notice': {
      playSoftPlasma(800, 1200, 0.05, v(0.02));
      break;
    }
    case 'ui_hover':
      playSoftPlasma(1500, 1600, 0.05, v(0.02));
      break;
    case 'ui_click':
      playSoftPlasma(1200, 800, 0.08, v(0.03));
      break;
    case 'ui_menu_open':
      playSoftPlasma(600, 1000, 0.15, v(0.03));
      break;
    case 'ui_menu_close':
      playSoftPlasma(1000, 600, 0.15, v(0.03));
      break;
    case 'ui_skill_buy':
      playSoftPlasma(800, 1200, 0.12, v(0.04));
      break;
    case 'ui_error':
      playSoftPlasma(300, 200, 0.15, v(0.04));
      break;
  }
}