import { useEffect, useRef } from 'react';

const BG_IMAGE_2 = 'https://ik.imagekit.io/zznoau6lx/4.png';
const SPOTLIGHT_R = 260;

interface RevealLayerProps {
  cursorX: number;
  cursorY: number;
}

/**
 * Spotlight reveal layer. Uses a CSS radial-gradient mask driven by CSS
 * variables instead of redrawing a canvas + toDataURL every frame.
 * This avoids creating a base64 string on every mouse move, which was
 * the single biggest performance bottleneck on the page.
 */
export function RevealLayer({ cursorX, cursorY }: RevealLayerProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;
    div.style.setProperty('--spot-x', `${cursorX}px`);
    div.style.setProperty('--spot-y', `${cursorY}px`);
  }, [cursorX, cursorY]);

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${BG_IMAGE_2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // Mask: a soft radial spotlight following the cursor.
        // CSS variables are updated imperatively in the effect above.
        WebkitMaskImage: `radial-gradient(circle var(--spot-r, ${SPOTLIGHT_R}px) at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0) 100%)`,
        maskImage: `radial-gradient(circle var(--spot-r, ${SPOTLIGHT_R}px) at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0) 100%)`,
      }}
    />
  );
}
