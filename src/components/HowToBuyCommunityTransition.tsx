import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HowToBuy } from '@/components/HowToBuy';
import { Community } from '@/components/Community';

/**
 * HowToBuyCommunityTransition — upward panel reveal.
 *
 * Sibling to HeroRevealTransition, sharing the same scroll-progress
 * architecture: a 200vh container reserves scroll space, a sticky 100vh
 * viewport pins the scene, and a single MotionValue drives one GPU-only
 * transform. No clipping hacks, no layout animation — just translate3d.
 *
 * Architecture:
 *
 *   TransitionContainer (200vh)         ← reserves scroll space
 *    └── StickyViewport (sticky, 100vh)  ← browser-managed pinning
 *         ├── HowToBuyLayer (relative)  ← static, sits beneath
 *         │    └── HowToBuy            ← untouched, fully alive
 *         └── CommunityLayer (motion)   ← translateY: 100vh → 0
 *              └── Community          ← lifts upward, covers HowToBuy
 *
 * HowToBuy behaves normally while scrolling in, then stays visually fixed
 * once pinned. Community starts one viewport below (clipped by overflow)
 * and rises as one rigid object until it fully replaces HowToBuy.
 * Linear interpolation — Lenis provides the cinematic smoothing.
 */
export function HowToBuyCommunityTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Community lifts from below the viewport up to 0. No easing — Lenis smooths.
  const y = useTransform(scrollYProgress, [0, 1], ['100vh', '0vh']);

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
        {/* HowToBuyLayer — static, in flow, sits beneath. */}
        <div
          style={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          <HowToBuy />
        </div>

        {/* CommunityLayer — the only animated element. Rigid panel rising. */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            overflow: 'hidden',
            y,
            willChange: 'transform',
            zIndex: 20,
          }}
        >
          <Community />
        </motion.div>
      </div>
    </div>
  );
}
