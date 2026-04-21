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
    
    // Cierra el menú en móvil cuando se hace clic en un enlace
    const navLinks = document.getElementById('nav-links');
    if (navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
    }
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

document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── MENÚ MÓVIL (NUEVO) ────────────────── */
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

/* ══════════════════════════════════════════
   CAROUSEL — SKILLS TÉCNICAS
   Añadir al final de main.js
   ══════════════════════════════════════════ */

(function() {
  const track    = document.getElementById('skillsTrack');
  const prevBtn  = document.getElementById('skillsPrev');
  const nextBtn  = document.getElementById('skillsNext');
  const dotsWrap = document.getElementById('skillsDots');

  if (!track) return;

  const cards        = track.querySelectorAll('.sk-card');
  const VISIBLE      = window.innerWidth <= 820 ? 1 : 3;
  const total        = cards.length;
  const pageCount    = Math.ceil(total / VISIBLE);
  let   currentPage  = 0;

  /* Crear dots */
  for (let i = 0; i < pageCount; i++) {
    const d = document.createElement('span');
    d.className = 'c-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }

  function goTo(page) {
    currentPage = Math.max(0, Math.min(page, pageCount - 1));
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24; // 1.5rem
    const offset = currentPage * VISIBLE * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    /* Update dots */
    dotsWrap.querySelectorAll('.c-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentPage);
    });

    /* Update buttons */
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === pageCount - 1;

    /* Animar skill bars de las cards visibles */
    const start = currentPage * VISIBLE;
    cards.forEach((card, i) => {
      const bar = card.querySelector('.sk-bar');
      if (!bar) return;
      if (i >= start && i < start + VISIBLE) {
        setTimeout(() => bar.classList.add('animate'), 300);
      }
    });
  }

  prevBtn.addEventListener('click', () => goTo(currentPage - 1));
  nextBtn.addEventListener('click', () => goTo(currentPage + 1));

  /* Touch/swipe */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(currentPage + (diff > 0 ? 1 : -1));
  });

  goTo(0);
})();


/* ══════════════════════════════════════════
   CAROUSEL — SOFT SKILLS (COVERFLOW)
   ══════════════════════════════════════════ */

(function() {
  const track    = document.getElementById('softTrack');
  const prevBtn  = document.getElementById('softPrev');
  const nextBtn  = document.getElementById('softNext');
  const dotsWrap = document.getElementById('softDots');

  if (!track) return;

  const cards     = Array.from(track.querySelectorAll('.soft-card'));
  const total     = cards.length;
  let   current   = 1; /* Empieza en el del medio */

  /* Crear dots */
  for (let i = 0; i < total; i++) {
    const d = document.createElement('span');
    d.className = 'c-dot';
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));

    cards.forEach((card, i) => {
      card.classList.toggle('active', i === current);
    });

    /* Desplazar track para que la activa quede centrada */
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 22.4; /* 1.4rem */
    const trackWidth = track.parentElement.getBoundingClientRect().width;
    const offset = current * (cardWidth + gap) - (trackWidth / 2) + (cardWidth / 2);
    track.style.transform = `translateX(-${Math.max(0, offset)}px)`;

    dotsWrap.querySelectorAll('.c-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  /* Touch/swipe */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });

  /* Click en cualquier card para centrarla */
  cards.forEach((card, i) => {
    card.addEventListener('click', () => goTo(i));
  });

  goTo(1);
})();


/* ══════════════════════════════════════════
   STACKING CARDS — highlight al hacer scroll
   ══════════════════════════════════════════ */

(function() {
  const wraps = document.querySelectorAll('.stack-card-wrap');
  if (!wraps.length) return;

  const stackIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.classList.toggle('is-active', e.isIntersecting);
    });
  }, { threshold: 0.6, rootMargin: '-60px 0px -60px 0px' });

  wraps.forEach(w => stackIO.observe(w));
})();


/* ══════════════════════════════════════════
   PEGA ESTO AL FINAL DE main.js
   (borra cualquier bloque anterior de carousel)
   ══════════════════════════════════════════ */


/* ── CARRUSEL SKILLS TÉCNICAS ──────────── */
(function () {
  const track    = document.getElementById('skillsTrack');
  const prevBtn  = document.getElementById('skillsPrev');
  const nextBtn  = document.getElementById('skillsNext');
  const dotsWrap = document.getElementById('skillsDots');
  if (!track) return;

  const cards      = Array.from(track.querySelectorAll('.sk-card'));
  const isMobile   = () => window.innerWidth <= 820;
  const visible    = () => isMobile() ? 1 : 3;
  const pageCount  = () => Math.ceil(cards.length / visible());
  let   page       = 0;

  /* Genera dots */
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pageCount(); i++) {
      const d = document.createElement('span');
      d.className = 'c-dot' + (i === page ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(p) {
    page = Math.max(0, Math.min(p, pageCount() - 1));
    const cardW = cards[0].getBoundingClientRect().width;
    const gap   = 24;
    track.style.transform = `translateX(-${page * visible() * (cardW + gap)}px)`;

    dotsWrap.querySelectorAll('.c-dot').forEach((d, i) =>
      d.classList.toggle('active', i === page));

    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === pageCount() - 1;

    /* Anima barras de las cards visibles */
    const start = page * visible();
    cards.forEach((c, i) => {
      const bar = c.querySelector('.sk-bar');
      if (!bar) return;
      if (i >= start && i < start + visible()) setTimeout(() => bar.classList.add('animate'), 300);
    });
  }

  prevBtn.addEventListener('click', () => goTo(page - 1));
  nextBtn.addEventListener('click', () => goTo(page + 1));

  /* Swipe táctil */
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const d = sx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) goTo(page + (d > 0 ? 1 : -1));
  });

  window.addEventListener('resize', () => { buildDots(); goTo(0); });
  buildDots();
  goTo(0);
})();


/* ── SOFT SKILLS — CARRUSEL ANIMADO ────── */
(function () {
  const tabs     = document.querySelectorAll('.soft-tab');
  const panel    = document.getElementById('softPanel');
  const numEl    = document.getElementById('softNum');
  const progress = document.getElementById('softProgress');
  if (!tabs.length || !panel) return;

  const DURATION = 5000; /* ms por skill */

  const data = [
    {
      img:  'img/APRENDER.png',
      name: 'Aprendizaje continuo',
      desc: 'Me gusta aprender constantemente y seguir desarrollando mis habilidades. Disfruto investigando, probando nuevas herramientas y adquiriendo conocimientos que me ayuden a crecer como desarrolladora.'
    },
    {
      img:  'img/resolutiva.png',
      name: 'Resolutiva e independiente',
      desc: 'Cuando me enfrento a un problema, lo analizo y busco soluciones por mi cuenta antes de rendirme. Me gusta investigar, probar diferentes enfoques y aprender durante el proceso.'
    },
    {
      img:  'img/teamwork.png',
      name: 'Trabajo en equipo',
      desc: 'Disfruto colaborando con otras personas e intercambiando ideas. Creo que cuando hay buena comunicación y confianza en el equipo, el resultado final siempre es mejor.'
    },
    {
      img:  'img/organizacion.png',
      name: 'Organización',
      desc: 'Antes de empezar cualquier proyecto, me gusta definir una estructura clara. Trabajar con una base bien organizada me permite avanzar con más seguridad y mantener el foco.'
    },
    {
      img:  'img/perseverancia.png',
      name: 'Perseverancia',
      desc: 'Cuando algo no sale como esperaba, aprendo del error y sigo intentándolo. No me rindo fácilmente, y esa constancia marca la diferencia tanto en el desarrollo como en el aprendizaje.'
    },
    {
      img:  'img/creativa.png',
      name: 'Creatividad',
      desc: 'Me gusta aportar ideas y explorar nuevas formas de enfocar los proyectos. Aplico la creatividad tanto en el desarrollo de funcionalidades como en el diseño visual.'
    }
  ];

  let current   = 0;
  let timer     = null;
  let progTimer = null;
  let paused    = false;

  function setContent(idx) {
    const d = data[idx];
    panel.querySelector('.s-ico img').src = d.img;
    panel.querySelector('.s-name').textContent = d.name;
    panel.querySelector('.s-desc').textContent = d.desc;
    numEl.textContent = String(idx + 1).padStart(2, '0');
  }

  function activateTab(idx) {
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
  }

  function animateIn(idx) {
    /* 1. Salida hacia arriba */
    panel.classList.remove('visible');
    panel.classList.add('leaving');

    setTimeout(() => {
      /* 2. Cambia contenido sin transición */
      setContent(idx);
      panel.classList.remove('leaving');

      /* 3. Pequeño frame para que el navegador pinte el estado inicial */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          panel.classList.add('visible');
        });
      });
    }, 300); /* coincide con transition-delay máx de "leaving" */
  }

  function goTo(idx, manual = false) {
    current = (idx + data.length) % data.length;
    activateTab(current);
    animateIn(current);
    resetProgress(manual);
  }

  /* Barra de progreso */
  function resetProgress(manual) {
    clearInterval(progTimer);
    progress.style.transition = 'none';
    progress.style.width = '0%';

    if (paused && manual) { paused = false; }

    if (!paused) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progress.style.transition = `width ${DURATION}ms linear`;
          progress.style.width = '100%';
        });
      });
    }
  }

  /* Avance automático */
  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!paused) goTo(current + 1);
    }, DURATION);
  }

  /* Clicks en tabs */
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => goTo(i, true));
  });

  /* Pausa al hacer hover en el panel */
  const scene = document.querySelector('.soft-carousel-scene');
  if (scene) {
    scene.addEventListener('mouseenter', () => {
      paused = true;
      progress.style.transition = 'none';
      clearInterval(timer);
    });
    scene.addEventListener('mouseleave', () => {
      paused = false;
      resetProgress(false);
      startAuto();
    });
  }

  /* Arranque */
  setContent(0);
  activateTab(0);
  panel.classList.add('visible');
  resetProgress(false);
  startAuto();
})();


/* ══════════════════════════════════════════
   SOFT SKILLS — CARRUSEL 3D
   Añadir al final de main.js
   ══════════════════════════════════════════ */

(function () {
  const ring     = document.getElementById('softRing3d');
  const scene    = document.getElementById('softCarousel3d');
  const prevBtn  = document.getElementById('soft3dPrev');
  const nextBtn  = document.getElementById('soft3dNext');
  const dotsWrap = document.getElementById('soft3dDots');

  if (!ring) return;

  const cards   = Array.from(ring.querySelectorAll('.sk3d-card'));
  const N       = cards.length;
  const RADIUS  = 260;
  let   current = 0;
  let   autoTimer;

  /* Posicionar cada carta en su ángulo del círculo */
  cards.forEach((card, i) => {
    const angle = (360 / N) * i;
    const rad   = angle * (Math.PI / 180);
    const x     = Math.sin(rad) * RADIUS;
    const z     = Math.cos(rad) * RADIUS;
    card.style.transform = `translateX(${x}px) translateZ(${z}px)`;
    card.addEventListener('click', () => goTo(i));
  });

  /* Dots */
  cards.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'c-dot';
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function render() {
    const angle = -(360 / N) * current;
    ring.style.transform = `translateX(-50%) translateY(-50%) rotateY(${angle}deg)`;

    cards.forEach((c, i) => c.classList.toggle('active', i === current));

    dotsWrap.querySelectorAll('.c-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );

    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }

  function goTo(idx) {
    current = ((idx % N) + N) % N;
    render();
  }

  /* Botones */
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  /* Drag con ratón */
  let dragActive = false;
  let dragStartX = 0;
  let dragStart  = 0;

  scene.addEventListener('mousedown', e => {
    dragActive = true;
    dragStartX = e.clientX;
    dragStart  = current;
    scene.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', e => {
    if (!dragActive) return;
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 45) {
      goTo(dragStart + (diff < 0 ? 1 : -1));
      dragActive = false;
      scene.style.cursor = 'grab';
    }
  });
  window.addEventListener('mouseup', () => {
    dragActive = false;
    scene.style.cursor = 'grab';
  });

  /* Touch */
  let touchStartX = 0;
  let touchStart  = 0;
  scene.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStart  = current;
  }, { passive: true });
  scene.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(touchStart + (diff > 0 ? 1 : -1));
  }, { passive: true });

  /* Autoplay */
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 3500);
  }
  scene.addEventListener('mouseenter', () => clearInterval(autoTimer));
  scene.addEventListener('mouseleave', startAuto);

  /* Teclado (cuando el carrusel tiene foco) */
  scene.setAttribute('tabindex', '0');
  scene.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  goTo(0);
  startAuto();
})();


/* ── SKILLS SLIDER MODERNO ────────────────────── */
(function () {
  const track = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsWrap = document.getElementById('sliderDots');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.slider-card'));
  const N = cards.length;
  let current = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragOffset = 0;

  // Crear dots
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'c-dot';
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function getVisibleCards() {
    return window.innerWidth > 768 ? 2 : 1;
  }

  function updatePosition() {
    const visible = getVisibleCards();
    const cardWidth = 100 / visible;
    const offset = -(current * cardWidth);
    track.style.transform = `translateX(${offset}%)`;

    // Actualizar dots
    dotsWrap.querySelectorAll('.c-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    // Actualizar botones
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= N - visible;
  }

  function goTo(idx) {
    const visible = getVisibleCards();
    const maxIdx = N - visible;
    current = Math.min(Math.max(idx, 0), maxIdx);
    updatePosition();
  }

  // Botones
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Drag
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragOffset = 0;
    track.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragOffset = e.clientX - dragStartX;
    const offset = -(current * (100 / getVisibleCards())) + (dragOffset / track.offsetWidth) * 100;
    track.style.transform = `translateX(${offset}%)`;
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
    
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      goTo(dragOffset > 0 ? current - 1 : current + 1);
    } else {
      updatePosition();
    }
  });

  // Touch
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    const offset = e.touches[0].clientX - touchStartX;
    const currentOffset = -(current * (100 / getVisibleCards())) + (offset / track.offsetWidth) * 100;
    track.style.transform = `translateX(${currentOffset}%)`;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
    const diff = touchStartX - e.changedTouches[0].clientX;
    
    if (Math.abs(diff) > 40) {
      goTo(current + (diff > 0 ? 1 : -1));
    } else {
      updatePosition();
    }
  }, { passive: true });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Resize
  window.addEventListener('resize', updatePosition);

  // Init
  updatePosition();
})();