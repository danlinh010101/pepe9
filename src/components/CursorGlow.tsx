import { useEffect, useRef, useState } from 'react';

const PEPE_CURSOR = 'https://ik.imagekit.io/zznoau6lx/bee56bec-991e-4e14-9f93-dbd941924657.png';

export function CursorGlow() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    const onLeave = () => setVisible(false);

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.1);
      current.current.y = lerp(current.current.y, pos.current.y, 0.1);
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
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
