import { useEffect, useRef, ReactNode } from 'react';

interface DirectionalParallaxTransitionProps {
  children: ReactNode;
}

const DEPTH_FACTOR: Record<string, number> = {
  background: 0.4,
  decorative: 0.7,
  content: 1.0,
};

const MAX_TRANSLATE = 150;
const MAX_SCALE_LOSS = 0.3;
const MAX_OPACITY_LOSS = 0.95;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

interface LayerEntry {
  el: HTMLElement;
  section: 'hero' | 'impressions';
  factor: number;
}

export function DirectionalParallaxTransition({ children }: DirectionalParallaxTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(false);
  const layersRef = useRef<LayerEntry[]>([]);
  const heroSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(container.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );
    if (sections.length < 2) return;

    const heroSection = sections[0];
    const impressionsSection = sections[1];
    heroSectionRef.current = heroSection;

    const layers: LayerEntry[] = [];
    for (const [section, tag] of [
      [heroSection, 'hero'] as const,
      [impressionsSection, 'impressions'] as const,
    ]) {
      const tagged = section.querySelectorAll<HTMLElement>('[data-depth]');
      tagged.forEach((el) => {
        const depth = el.dataset.depth ?? 'content';
        layers.push({ el, section: tag, factor: DEPTH_FACTOR[depth] ?? 0.5 });
      });
    }
    layersRef.current = layers;
    if (layers.length === 0) return;

    const update = () => {
      const hero = heroSectionRef.current;
      if (!hero) { runningRef.current = false; return; }

      const rect = hero.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Boundary-based progress:
      // 0 when Hero bottom is at viewport bottom (Hero fully visible)
      // 1 when Hero bottom is at viewport top (Hero fully scrolled away)
      const raw = 1 - rect.bottom / viewportH;
      const progress = smoothstep(0, 1, Math.max(0, Math.min(1, raw)));

      for (const { el, section, factor } of layersRef.current) {
        if (section === 'hero') {
          // Recede: sink down, scale down, fade out
          const ty = progress * factor * MAX_TRANSLATE;
          const scale = 1 - progress * factor * MAX_SCALE_LOSS;
          const opacity = 1 - progress * factor * MAX_OPACITY_LOSS;
          el.style.translate = `0 ${ty.toFixed(2)}px`;
          el.style.scale = scale.toFixed(4);
          el.style.opacity = opacity.toFixed(3);
        } else {
          // Rise forward: start translated/scaled/faded, settle to rest
          const inv = 1 - progress;
          const ty = inv * factor * MAX_TRANSLATE;
          const scale = 1 - inv * factor * MAX_SCALE_LOSS;
          const opacity = 1 - inv * factor * MAX_OPACITY_LOSS;
          el.style.translate = `0 ${ty.toFixed(2)}px`;
          el.style.scale = scale.toFixed(4);
          el.style.opacity = opacity.toFixed(3);
        }
      }

      runningRef.current = false;
    };

    const onScroll = () => {
      if (!runningRef.current) {
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    // IntersectionObserver: only run the RAF loop while the container is near the viewport
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true });
          window.addEventListener('resize', onScroll, { passive: true });
          if (!runningRef.current) {
            runningRef.current = true;
            rafRef.current = requestAnimationFrame(update);
          }
        } else {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onScroll);
          runningRef.current = false;
        }
      },
      { rootMargin: '300px 0px 300px 0px' }
    );

    io.observe(container);
    update();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {children}
    </div>
  );
}
