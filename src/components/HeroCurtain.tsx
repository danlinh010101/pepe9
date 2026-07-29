import { useEffect, useRef } from 'react';
import { HeroScene } from '@/components/HeroScene';

// Extra scroll distance while Hero is pinned (vh).
const PEEL_VH = 55;

/**
 * HeroCurtain owns ONLY the scroll transition.
 * It pins HeroScene for ~55vh, then translates the entire wrapper upward
 * as one physical sheet — revealing Impressions underneath.
 * It never touches HeroScene's internal transforms.
 */
export function HeroCurtain() {
  const pinRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    const update = () => {
      const pin = pinRef.current;
      const curtain = curtainRef.current;
      if (!pin || !curtain) { tickingRef.current = false; return; }

      const pinRect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const peel = Math.max(1, pinRect.height - vh);
      const progress = Math.max(0, Math.min(1, -pinRect.top / peel));

      // Translate the entire Hero wrapper upward as one unit.
      const ty = -progress * peel;
      curtain.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;

      // Keep updating while inside the pinned range.
      if (progress > 0.001 && progress < 0.999) {
        rafRef.current = requestAnimationFrame(update);
      } else {
        tickingRef.current = false;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    tickingRef.current = true;
    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={pinRef}
      className="relative"
      style={{ height: `calc(100vh + ${PEEL_VH}vh)`, backgroundColor: '#032312' }}
    >
      <div
        ref={curtainRef}
        className="sticky top-0 h-screen will-change-transform z-30"
      >
        <HeroScene />
      </div>
    </div>
  );
}
