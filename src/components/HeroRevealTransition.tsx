import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HeroScene } from '@/components/HeroScene';
import { Impressions } from '@/components/Impressions';

/**
 * HeroRevealTransition — rigid-panel curtain lift.
 *
 * Architecture:
 *
 *   TransitionContainer (200vh)        ← reserves scroll space
 *    └── StickyViewport (sticky, 100vh) ← browser-managed pinning
 *         ├── HeroLayer (motion.div)    ← translateY: 0 → -100vh
 *         │    └── HeroScene           ← untouched, fully alive
 *         └── ImpressionsLayer         ← static, sits beneath the Hero
 *              └── Impressions
 *
 * The viewport is sticky for 100vh of scroll.  The Hero translates upward
 * as one rigid object from 0 to -100vh, physically vacating the viewport
 * and exposing Impressions underneath.  No clipping, no masking, no layout
 * hacks — just one translateY on one wrapper, driven by a MotionValue.
 */
export function HeroRevealTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Linear 0 → -100vh.  No easing — Lenis provides smoothing.
  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '-100vh']);

  return (
    <div ref={containerRef} style={{ height: '200vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* HeroLayer — the only animated element. Rigid panel. */}
        <motion.div
          style={{
            height: '100vh',
            y,
            willChange: 'transform',
            zIndex: 20,
            position: 'relative',
          }}
        >
          <HeroScene />
        </motion.div>

        {/* ImpressionsLayer — static, revealed as the Hero lifts away. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          <Impressions />
        </div>
      </div>
    </div>
  );
}
