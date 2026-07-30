import { useEffect, useRef } from 'react';
import { HeroScene } from '@/components/HeroScene';

// Peel distance = 100vh so Impressions fully covers the viewport
// by the time the Hero is fully clipped — no content jump on release.
const PEEL_VH = 100;

/**
 * HeroCurtain — scroll-driven curtain reveal.
 *
 * Architecture:
 *   Pin container (100vh)          ← reserves Hero's space in document flow
 *    └── HeroWrapper (100vh)       ← the ONLY element that receives clip-path
 *         └── HeroScene           ← untouched, all internal animations preserved
 *
 * The pin container is exactly 100vh so Impressions follows immediately
 * in normal document flow.  When the user scrolls, Impressions scrolls up
 * *behind* the fixed Hero.  The Hero is clipped from the bottom upward via
 * clip-path: inset(), gradually revealing the Impressions content underneath
 * — like lifting a heavy curtain.
 *
 * No transform on the sticky container.  No individual layer animation.
 * Just one clip-path on one wrapper, driven by scroll progress.
 *
 * At progress 0 the Hero is in normal flow (relative).  Once scrolling
 * begins it switches to fixed + clip.  At progress 1 the Hero is fully
 * clipped (invisible) and Impressions fully covers the viewport.  The
 * Hero stays fixed-but-invisible until the user scrolls back up, making
 * the transition perfectly reversible with zero content jump.
 */
export function HeroCurtain() {
  const pinRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);
  const peelRef = useRef<number>(0);
  const pinnedRef = useRef(false);

  useEffect(() => {
    const pin = pinRef.current;
    const wrapper = wrapperRef.current;
    if (!pin || !wrapper) return;

    // ── Cache layout: read once per measure, not per frame ──
    const measure = () => {
      peelRef.current = Math.max(1, (PEEL_VH / 100) * window.innerHeight);
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });

    // ── Single rAF loop — reads layout once, writes styles once ──
    const update = () => {
      const rect = pin.getBoundingClientRect();
      const peel = peelRef.current;

      // Normalized scroll progress through the peel distance.
      // Linear — stays 1:1 attached to scroll.  Lenis provides inertia.
      const progress = Math.max(0, Math.min(1, -rect.top / peel));

      if (progress <= 0) {
        // ── Flow: Hero in normal document flow, fully visible ──
        if (pinnedRef.current) {
          wrapper.style.position = '';
          wrapper.style.top = '';
          wrapper.style.left = '';
          wrapper.style.right = '';
          wrapper.style.width = '';
          wrapper.style.zIndex = '';
          wrapper.style.clipPath = '';
          wrapper.style.pointerEvents = '';
          pinnedRef.current = false;
        }
      } else {
        // ── Pinned: Hero fixed at top, clipped from bottom upward ──
        if (!pinnedRef.current) {
          wrapper.style.position = 'fixed';
          wrapper.style.top = '0';
          wrapper.style.left = '0';
          wrapper.style.right = '0';
          wrapper.style.width = 'auto';
          wrapper.style.zIndex = '30';
          pinnedRef.current = true;
        }
        // Clip from bottom: 0% at progress=0 → 100% at progress=1.
        // This reveals Impressions underneath as the curtain lifts.
        const clipPct = progress * 100;
        wrapper.style.clipPath = `inset(0 0 ${clipPct.toFixed(2)}% 0)`;
        // At full clip the Hero is invisible — let pointer events pass through.
        wrapper.style.pointerEvents = progress >= 1 ? 'none' : '';
      }

      // Keep looping only while inside the peel range.
      if (progress > 0 && progress < 1) {
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
    // Pin container — exactly 100vh so Impressions follows immediately.
    // Transparent background so clipped areas reveal Impressions beneath.
    <div
      ref={pinRef}
      className="relative"
      style={{ height: '100vh' }}
    >
      {/* HeroWrapper — the ONLY element that receives clip-path.
          position switches between relative (flow) and fixed (pinned)
          via direct DOM writes in the rAF loop.  No CSS transitions. */}
      <div
        ref={wrapperRef}
        className="h-screen"
        style={{ willChange: 'clip-path', position: 'relative' }}
      >
        <HeroScene />
      </div>
    </div>
  );
}
