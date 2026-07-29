import { useEffect, useRef } from 'react';
import { HeroScene } from '@/components/HeroScene';

// Extra scroll distance while Hero is pinned (vh).
const PEEL_VH = 55;

export function HeroCurtain() {
  const pinRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const peelRef = useRef<number>(0);

  useEffect(() => {
    const pin = pinRef.current;
    const wrapper = wrapperRef.current;
    if (!pin || !wrapper) return;

    // ── Cache layout: read once per measure, not per frame ──
    const measure = () => {
      peelRef.current = Math.max(1, pin.offsetHeight - window.innerHeight);
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });

    // ── Single rAF loop — reads layout once, writes styles once ──
    const update = () => {
      const rect = pin.getBoundingClientRect();
      const peel = peelRef.current;
      const progress = Math.max(0, Math.min(1, -rect.top / peel));

      // Linear interpolation — Hero stays 1:1 attached to scroll.
      // Lenis provides the inertial smoothing; the curtain itself does not ease.
      const ty = -progress * peel;
      const scale = 1 - progress * 0.015;   // 1 → 0.985
      const opacity = 1 - progress * 0.07;   // 1 → 0.93
      const blur = progress * 3;             // 0 → 3px

      // Write all styles in one batch — GPU-only compositor properties.
      wrapper.style.transform =
        `translate3d(0, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      wrapper.style.opacity = opacity.toFixed(4);
      wrapper.style.filter = `blur(${blur.toFixed(2)}px)`;

      if (progress > 0.001 && progress < 0.999) {
        rafRef.current = requestAnimationFrame(update);
      } else {
        activeRef.current = false;
      }
    };

    const kick = () => {
      if (!activeRef.current) {
        activeRef.current = true;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', kick, { passive: true });
    kick(); // set initial state

    return () => {
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={pinRef}
      className="relative"
      style={{ height: `calc(100vh + ${PEEL_VH}vh)`, backgroundColor: '#032312' }}
    >
      {/* Sticky — never transformed, never animated */}
      <div className="sticky top-0 h-screen overflow-hidden z-30">
        {/* HeroWrapper — the ONLY element that receives transform/opacity/filter */}
        <div
          ref={wrapperRef}
          className="h-screen"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          <HeroScene />
        </div>
      </div>
    </div>
  );
}
