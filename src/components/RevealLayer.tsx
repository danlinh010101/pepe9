import { useEffect, useRef } from 'react';

const BG_IMAGE_2 = 'https://ik.imagekit.io/zznoau6lx/4.png';
const SPOTLIGHT_R = 260;

interface RevealLayerProps {
  cursorX: number;
  cursorY: number;
}

export function RevealLayer({ cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Resize canvas to viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Runs on every render — redraws spotlight and updates mask
  useEffect(() => {
    const canvas = canvasRef.current;
    const div = divRef.current;
    if (!canvas || !div) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createRadialGradient(
      cursorX, cursorY, 0,
      cursorX, cursorY, SPOTLIGHT_R,
    );
    grad.addColorStop(0,    'rgba(255,255,255,1)');
    grad.addColorStop(0.4,  'rgba(255,255,255,1)');
    grad.addColorStop(0.6,  'rgba(255,255,255,0.75)');
    grad.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    grad.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    grad.addColorStop(1,    'rgba(255,255,255,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const dataURL = canvas.toDataURL();
    const maskValue = `url(${dataURL})`;
    div.style.maskImage = maskValue;
    (div.style as CSSStyleDeclaration & { webkitMaskImage: string }).webkitMaskImage = maskValue;
    div.style.maskSize = '100% 100%';
    (div.style as CSSStyleDeclaration & { webkitMaskSize: string }).webkitMaskSize = '100% 100%';
  });

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div
        ref={divRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${BG_IMAGE_2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </>
  );
}
