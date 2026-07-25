import { useRef } from 'react';

export function useTilt<T extends HTMLElement = HTMLDivElement>(max = 14) {
  const ref = useRef<T>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -2 * max;
    const ry = (px - 0.5) * 2 * max;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  };

  return { ref, onMove, onLeave };
}
