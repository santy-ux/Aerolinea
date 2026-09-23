import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  currentRadius: number;
  targetRadius: number;
  intensity: number;
  colorIdx: number;
}

const PALETTE: [number, number, number][] = [
  [59, 74, 159],
  [110, 86, 207],
  [14, 165, 233],
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, active: false };
    const maxDist = 135;
    let isRunning = false;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      particles = [];
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const count = Math.min(Math.max(Math.floor((w * h) / 1600), 360), 820);

      for (let i = 0; i < count; i++) {
        const baseR = 0.65 + Math.random() * 0.7;
        const speed = reduced ? 0 : 0.12 + Math.random() * 0.22;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseRadius: baseR,
          currentRadius: baseR,
          targetRadius: baseR,
          intensity: 0,
          colorIdx: Math.floor(Math.random() * 3),
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      if (!isRunning) start();
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const start = () => {
      if (isRunning) return;
      isRunning = true;
      loop();
    };

    const stop = () => {
      isRunning = false;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const loop = () => {
      if (!isRunning) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const restR = isDark ? 155 : 17;
      const restG = isDark ? 160 : 17;
      const restB = isDark ? 175 : 17;
      const restA = isDark ? 0.32 : 0.35;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -6) p.x = w + 6;
        else if (p.x > w + 6) p.x = -6;
        if (p.y < -6) p.y = h + 6;
        else if (p.y > h + 6) p.y = -6;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist && mouse.active) {
          const factor = 1 - dist / maxDist;
          p.targetRadius = p.baseRadius + factor * 1.6;
          p.intensity += (factor - p.intensity) * 0.16;
        } else {
          p.targetRadius = p.baseRadius;
          p.intensity += (0 - p.intensity) * 0.07;
        }

        p.currentRadius += (p.targetRadius - p.currentRadius) * 0.14;

        const pal = PALETTE[p.colorIdx];
        const r = Math.round(restR + (pal[0] - restR) * p.intensity);
        const g = Math.round(restG + (pal[1] - restG) * p.intensity);
        const b = Math.round(restB + (pal[2] - restB) * p.intensity);
        const alpha = restA + (0.95 - restA) * p.intensity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.currentRadius, 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    handleResize();
    start();

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} id="interactiveBg" className="interactive-bg-canvas" aria-hidden="true" />;
}
