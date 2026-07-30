import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HeroScene } from '@/components/HeroScene';

/**
 * Scroll distance reserved for the curtain reveal (vh).
 * The Hero stays pinned for this many viewport heights before releasing.
 */
const REVEAL_VH = 100;

/**
 * HeroRevealTransition — premium curtain reveal between Hero and Impressions.
 *
 * Architecture:
 *
 *   Pin container  (100vh + REVEAL_VH)      ← reserves scroll space
 *    └── Sticky  (position: sticky, 100vh)  ← browser-managed pinning
 *         └── motion.div  (clip-path)       ← the ONLY animated element
 *              └── HeroScene               ← untouched, fully alive
 *
 * The pin container is taller than the viewport by REVEAL_VH.  CSS
 * `position: sticky` pins the Hero at the top for that extra distance.
 * A negative bottom-margin pulls the next section (Impressions) up so it
 * sits behind the pinned Hero in normal document flow.  As the user
 * scrolls, a single `clip-path: inset(0 0 X% 0)` on the motion.div
 * clips the Hero from the bottom upward, revealing Impressions beneath
 * — like lifting a heavy curtain.
 *
 * No transforms on the sticky.  No individual layer animation.
 * No requestAnimationFrame loop.  No React state updates on scroll.
 * Framer Motion MotionValues drive the clip directly from scroll progress.
 */
export function HeroRevealTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 0 → 100 : clips the Hero from the bottom upward.
  const clipPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const clipPath = useTransform(
    clipPercent,
    (v) => `inset(0 0 ${v.toFixed(2)}% 0)`,
  );

  return (
    <div
      ref={containerRef}
      style={{
        height: `calc(100vh + ${REVEAL_VH}vh)`,
        marginBottom: '-100vh',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          zIndex: 30,
        }}
      >
        <motion.div
          style={{
            height: '100vh',
            clipPath,
            willChange: 'clip-path',
          }}
        >
          <HeroScene />
        </motion.div>
      </div>
    </div>
  );
}
