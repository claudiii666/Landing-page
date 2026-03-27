/* ═══════════════════════════════════════════
   CLAUDIA ORTEGA — main.js
   Particles · Cursor · Counters · Scroll FX
   ═══════════════════════════════════════════ */

/* ── CUSTOM CURSOR ─────────────────────── */
const ring = document.getElementById('cursor-ring');
const dot  = document.getElementById('cursor-dot');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function lerp() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  requestAnimationFrame(lerp);
})();

const hoverEls = document.querySelectorAll('a, button, .sk-card, .proj-card, .value-item, .stat-card');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});


/* ── PARTICLE CANVAS ───────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');

let W, H, particles = [];
const COLORS = ['#818cf8','#f472b6','#22d3ee','#fbbf24','#c4b5fd'];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); spawnAll(); });

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : H + 10;
    this.r  = Math.random() * 2.5 + 0.8;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(Math.random() * 0.5 + 0.2);
    this.alpha = 0;
    this.maxAlpha = Math.random() * 0.35 + 0.1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
  }
  update() {
    this.life++;
    const t = this.life / this.maxLife;
    this.alpha = t < 0.1 ? this.maxAlpha * (t / 0.1)
               : t > 0.8 ? this.maxAlpha * (1 - (t - 0.8) / 0.2)
               : this.maxAlpha;
    this.x += this.vx;
    this.y += this.vy;
    if (this.life >= this.maxLife) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function spawnAll() {
  particles = Array.from({ length: 70 }, () => new Particle());
}
spawnAll();

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animParticles);
}
animParticles();


/* ── SCROLL PROGRESS BAR ───────────────── */
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  bar.style.width = pct + '%';
});


/* ── SCROLL REVEAL ─────────────────────── */
const reveals = document.querySelectorAll('.reveal');
const revIO = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 80);
      revIO.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revIO.observe(el));


/* ── SKILL BARS ────────────────────────── */
const bars = document.querySelectorAll('.sk-bar');
const barIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('animate'), 200);
      barIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
bars.forEach(b => barIO.observe(b));


/* ── COUNTER ANIMATION ─────────────────── */
function animCount(el, target, suffix) {
  const dur = 2000;
  const start = performance.now();
  const run = now => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
const cntIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animCount(el, +el.dataset.target, el.dataset.suffix || '');
      cntIO.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => { el.textContent = '0'; cntIO.observe(el); });


/* ── ACTIVE NAV ────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const navIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => navIO.observe(s));


/* ── SMOOTH NAV ────────────────────────── */
navAs.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ── BACK TO TOP ───────────────────────── */
const btt = document.getElementById('back-top');
window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 400));
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ── TILT ON CARDS (subtle) ────────────── */
document.querySelectorAll('.sk-card, .proj-card, .stat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
