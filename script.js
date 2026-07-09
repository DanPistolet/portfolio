/* ============================================================
   DANIEL MOOR-YOUNG — GAME INTERFACE
   ============================================================ */

/* ─── CURSOR ─────────────────────────────────────────────── */
const cDot  = document.getElementById('cDot');
const cRing = document.getElementById('cRing');

let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;

const isPointer = window.matchMedia('(pointer: fine)').matches;

if (isPointer) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cDot.style.left = mx + 'px';
    cDot.style.top  = my + 'px';
  });

  (function tickRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cRing.style.left = rx + 'px';
    cRing.style.top  = ry + 'px';
    requestAnimationFrame(tickRing);
  })();

  const hoverEls = () => document.querySelectorAll(
    'a, button, [tabindex], .work-card, .motion-row, .contact-row, .tool-chip, .nav-item'
  );
  function bindCursor() {
    hoverEls().forEach(el => {
      el.addEventListener('mouseenter', () => { cDot.classList.add('on-link'); cRing.classList.add('on-link'); });
      el.addEventListener('mouseleave', () => { cDot.classList.remove('on-link'); cRing.classList.remove('on-link'); });
    });
  }
} else {
  cDot.style.display  = 'none';
  cRing.style.display = 'none';
}

/* ─── BOOT SEQUENCE ──────────────────────────────────────── */
const boot   = document.getElementById('boot');
const app    = document.getElementById('app');
const status = document.getElementById('bootStatus');

const bootLines = [
  'LOADING ASSETS...',
  'INITIALIZING HUD...',
  'CONNECTING SYSTEMS...',
  'BUILDING INTERFACE...',
  'SYSTEM READY ✓',
];
let lineIdx = 0;
const bootInterval = setInterval(() => {
  lineIdx++;
  if (lineIdx < bootLines.length) {
    status.textContent = bootLines[lineIdx];
  } else {
    clearInterval(bootInterval);
  }
}, 360);

setTimeout(() => {
  boot.classList.add('fade-out');
  app.removeAttribute('aria-hidden');
  setTimeout(() => {
    app.classList.add('visible');
    boot.style.display = 'none';
    if (isPointer) bindCursor();
    animateToolBars();
  }, 600);
}, 1900);

/* ─── PANEL NAVIGATION ───────────────────────────────────── */
function switchPanel(id) {
  // Deactivate all
  document.querySelectorAll('.panel-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.mob-nav-item').forEach(n => n.classList.remove('active'));

  // Activate target
  const target = document.getElementById('panel-' + id);
  if (!target) return;

  target.classList.add('active');
  target.scrollTop = 0;

  document.querySelectorAll(`[data-panel="${id}"]`).forEach(n => n.classList.add('active'));

  // Trigger tool bars if switching to tools
  if (id === 'tools') animateToolBars();
}

// Nav items
document.querySelectorAll('.nav-item[data-panel]').forEach(btn => {
  btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
});
document.querySelectorAll('.mob-nav-item[data-panel]').forEach(btn => {
  btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
});

// Inline nav CTAs (View Case Files, Contact)
document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    switchPanel(el.dataset.nav);
  });
});

// Keyboard nav
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
  });
});

/* ─── TOOL BAR ANIMATION ─────────────────────────────────── */
function animateToolBars() {
  const fills = document.querySelectorAll('.tool-chip-fill');
  fills.forEach((f, i) => {
    setTimeout(() => f.classList.add('animate'), i * 60);
  });
}

/* ─── WORK CARD / MOTION ROW KEYBOARD ───────────────────── */
document.querySelectorAll('.work-card[tabindex], .motion-row[tabindex]').forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cta = el.querySelector('a, button');
      if (cta) cta.click();
    }
  });
});

/* ─── GLITCH TICK ON IDLE ────────────────────────────────── */
function glitchEffect(el) {
  el.style.transform = `translate(${(Math.random()-0.5)*4}px, ${(Math.random()-0.5)*2}px)`;
  setTimeout(() => { el.style.transform = ''; }, 80);
}

setInterval(() => {
  if (Math.random() > 0.6) {
    const titles = document.querySelectorAll('.panel-view.active .panel-title');
    titles.forEach(t => glitchEffect(t));
  }
}, 3500);

/* ─── ACTIVE NAV HIGHLIGHT ON KEYBOARD NAV ───────────────── */
document.addEventListener('keydown', e => {
  const items = [...document.querySelectorAll('.nav-item')];
  const active = document.querySelector('.nav-item.active');
  const idx = items.indexOf(active);
  if (e.key === 'ArrowDown' && idx < items.length - 1) {
    e.preventDefault();
    items[idx + 1].click();
    items[idx + 1].focus();
  }
  if (e.key === 'ArrowUp' && idx > 0) {
    e.preventDefault();
    items[idx - 1].click();
    items[idx - 1].focus();
  }
});

/* ─── CONSOLE EASTER EGG ─────────────────────────────────── */
console.log('%c DMY ', 'background:#C8FF00;color:#000;font-family:monospace;font-size:16px;font-weight:bold;padding:4px 16px;');
console.log('%c Daniel Moor-Young — Motion Designer ', 'color:#C8FF00;font-family:monospace;font-size:11px;');
console.log('%c mooryoungyadanix@gmail.com ', 'color:#5a5650;font-family:monospace;font-size:10px;');
