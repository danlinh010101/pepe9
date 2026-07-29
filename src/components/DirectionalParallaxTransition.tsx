import { useEffect, useRef, ReactNode } from 'react';

interface DirectionalParallaxTransitionProps {
  children: ReactNode;
}

const DEPTH_FACTOR: Record<string, number> = {
  background: 0.15,
  decorative: 0.35,
  content: 0.6,
};

export function DirectionalParallaxTransition({ children }: DirectionalParallaxTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const layers = Array.from(
      container.querySelectorAll<HTMLElement>('[data-depth]')
    );

    const update = () => {
      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // Progress: 0 when container top is at viewport bottom, 1 when bottom is at viewport top
      const total = rect.height + viewportH;
      const scrolled = viewportH - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      for (const layer of layers) {
        const depth = layer.dataset.depth;
        const factor = DEPTH_FACTOR[depth ?? 'content'] ?? 0.5;
        const offset = (progress - 0.5) * 2 * factor * 100;
        layer.style.translate = `0 ${offset.toFixed(2)}px`;
      }

      tickingRef.current = false;
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
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
