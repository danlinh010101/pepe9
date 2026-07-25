import { useEffect, useRef, useState } from 'react';

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      setVisible(true);
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseout', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseout', leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="w-8 h-8 rounded-full bg-green-400 mix-blend-screen" style={{ filter: 'blur(2px)' }} />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.18) 0%, transparent 70%)' }}
      />
    </div>
  );
}
