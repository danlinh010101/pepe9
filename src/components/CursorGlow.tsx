import { useEffect, useRef, useState } from 'react';

const PEPE_CURSOR = 'https://ik.imagekit.io/zznoau6lx/ab6607fb-6001-461c-97d7-ae4f1011db73.png';

/**
 * Custom cursor with a lagging ambient glow + Pepe face.
 * - Disabled on touch/coarse-pointer devices (mobile).
 * - rAF loop only runs while the mouse is actively moving or the
 *   glow is still settling, then stops to save CPU/GPU.
 */
export function CursorGlow() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    // Skip on touch devices — no cursor, and the rAF loop would waste battery.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    const onLeave = () => setVisible(false);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.12);
      current.current.y = lerp(current.current.y, pos.current.y, 0.12);
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
      }
      const dx = Math.abs(pos.current.x - current.current.x);
      const dy = Math.abs(pos.current.y - current.current.y);
      if (dx > 0.5 || dy > 0.5) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        tickingRef.current = false;
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Lagging ambient glow blob */}
      <div
        ref={outerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9997] transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className="w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)' }}
        />
      </div>

      {/* Pepe face cursor — snaps directly to mouse */}
      <div
        ref={innerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <img
          src={PEPE_CURSOR}
          alt=""
          className="w-10 h-10 object-contain"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(74,222,128,0.7))',
            mixBlendMode: 'normal',
          }}
        />
      </div>
    </>
  );
}
