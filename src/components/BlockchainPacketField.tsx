import { useEffect, useRef, type CSSProperties } from 'react';

type Packet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  twinkle: number;
  hue: number;
};

/**
 * BlockchainPacketField — green-glowing "packets" drifting through a network.
 *
 * Slow upward drift with occasional diagonal movement, varying opacity/size,
 * and a soft green glow. Rendered on a single canvas, GPU-friendly, and
 * pauses when the tab is hidden. Kept behind the card (z-index handled by
 * the parent) so it never passes in front of foreground content.
 */
export function BlockchainPacketField({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let packets: Packet[] = [];
    let raf = 0;
    let running = true;

    const COUNT = window.innerWidth < 768 ? 28 : 52;

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
      packets = Array.from({ length: COUNT }, () => {
        const diagonal = Math.random() < 0.3;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: diagonal ? (Math.random() - 0.5) * 0.18 : (Math.random() - 0.5) * 0.05,
          vy: -(Math.random() * 0.28 + 0.06),
          r: Math.random() * 2.6 + 0.8,
          alpha: Math.random() * 0.45 + 0.15,
          twinkle: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.85 ? 140 : 90,
        };
      });
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of packets) {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.018;

        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
        }
        if (p.x < -12) p.x = w + 12;
        if (p.x > w + 12) p.x = -12;

        const tw = Math.sin(p.twinkle) * 0.5 + 0.5;
        const a = p.alpha * (0.45 + tw * 0.55);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 140 ? `rgba(134, 239, 172, ${a})` : `rgba(190, 242, 100, ${a})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(74,222,128,0.85)';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    resize();
    seed();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={style} aria-hidden="true" />;
}
