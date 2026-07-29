import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  hue: number;
  alpha: number;
  twinkle: number;
};

/**
 * Lightweight floating-dust particle field rendered on a canvas.
 * Particles drift slowly upward, twinkle, and parallax with scroll.
 * Pauses when the tab is hidden to save CPU/GPU.
 */
export function Particles({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let scrollY = 0;

    const COUNT = window.innerWidth < 768 ? 36 : 64;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.22 + 0.05),
        hue: Math.random() < 0.82 ? 140 : 48,
        alpha: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() * 0.001;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy * p.z;
        p.twinkle += 0.02;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const drift = Math.sin(t * 0.3 + p.twinkle) * 0.5;
        const parallaxY = scrollY * p.z * 0.04;
        const px = p.x + drift;
        const py = p.y - parallaxY;
        const tw = (Math.sin(p.twinkle) * 0.5 + 0.5);
        const a = p.alpha * (0.5 + tw * 0.5);

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        if (p.hue === 140) {
          ctx.fillStyle = `rgba(134, 239, 172, ${a})`;
        } else {
          ctx.fillStyle = `rgba(250, 204, 21, ${a})`;
        }
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.hue === 140 ? 'rgba(74,222,128,0.8)' : 'rgba(250,204,21,0.8)';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    const onScroll = () => { scrollY = window.scrollY; };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    resize();
    seed();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
