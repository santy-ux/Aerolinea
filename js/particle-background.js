window.ArisParticleBackground = {
  canvas: null,
  ctx: null,
  particles: [],
  mouse: { x: -1000, y: -1000, active: false },
  animId: null,
  maxDistance: 135,
  isRunning: false,
  palette: [[59, 74, 159], [110, 86, 207], [14, 165, 233]],

  init: function() {
    this.canvas = document.getElementById('interactiveBg');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', this.handleMouseLeave);
    document.addEventListener('visibilitychange', this.handleVisibility);

    this.handleResize();
    this.start();
  },

  handleResize: function() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.scale(dpr, dpr);
    this.initParticles(w, h);
  },

  initParticles: function(w, h) {
    this.particles = [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = Math.min(Math.max(Math.floor((w * h) / 1600), 360), 820);

    for (let i = 0; i < count; i++) {
      const baseR = 0.65 + Math.random() * 0.7;
      const speed = reduced ? 0 : 0.12 + Math.random() * 0.22;
      const angle = Math.random() * Math.PI * 2;
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseRadius: baseR,
        currentRadius: baseR,
        targetRadius: baseR,
        intensity: 0,
        colorIdx: Math.floor(Math.random() * 3)
      });
    }
  },

  handleMouseMove: function(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.active = true;
    if (!this.isRunning) this.start();
  },

  handleMouseLeave: function() {
    this.mouse.active = false;
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  },

  handleVisibility: function() {
    if (document.hidden) { this.stop(); } else { this.start(); }
  },

  start: function() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  },

  stop: function() {
    this.isRunning = false;
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
  },

  loop: function() {
    if (!this.isRunning) return;
    const ctx = this.ctx;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const restR = isDark ? 155 : 17;
    const restG = isDark ? 160 : 17;
    const restB = isDark ? 175 : 17;
    const restA = isDark ? 0.32 : 0.35;

    const mx = this.mouse.x;
    const my = this.mouse.y;
    const maxD = this.maxDistance;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -6) p.x = w + 6; else if (p.x > w + 6) p.x = -6;
      if (p.y < -6) p.y = h + 6; else if (p.y > h + 6) p.y = -6;

      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxD && this.mouse.active) {
        const factor = 1 - (dist / maxD);
        p.targetRadius = p.baseRadius + factor * 1.6;
        p.intensity += (factor - p.intensity) * 0.16;
      } else {
        p.targetRadius = p.baseRadius;
        p.intensity += (0 - p.intensity) * 0.07;
      }

      p.currentRadius += (p.targetRadius - p.currentRadius) * 0.14;

      const pal = this.palette[p.colorIdx];
      const r = Math.round(restR + (pal[0] - restR) * p.intensity);
      const g = Math.round(restG + (pal[1] - restG) * p.intensity);
      const b = Math.round(restB + (pal[2] - restB) * p.intensity);
      const alpha = restA + (0.95 - restA) * p.intensity;

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(p.currentRadius, 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
      ctx.fill();
    }

    this.animId = requestAnimationFrame(this.loop);
  }
};
