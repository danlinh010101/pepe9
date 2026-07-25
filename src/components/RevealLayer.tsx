import { forwardRef } from 'react';

const BG_IMAGE_2 = 'https://ik.imagekit.io/zznoau6lx/4.png';
const SPOTLIGHT_R = 260;

/**
 * Spotlight reveal layer. The parent drives `--spot-x` / `--spot-y`
 * CSS variables imperatively via the forwarded ref — no React re-renders.
 */
export const RevealLayer = forwardRef<HTMLDivElement>(function RevealLayer(_, ref) {
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${BG_IMAGE_2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_R}px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0) 100%)`,
        maskImage: `radial-gradient(circle ${SPOTLIGHT_R}px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0) 100%)`,
      }}
    />
  );
});
