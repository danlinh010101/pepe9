import { forwardRef } from 'react';

const BG_IMAGE_2 = 'https://ik.imagekit.io/zznoau6lx/4.png';
const SPOTLIGHT_R = 280;

/**
 * Spotlight reveal layer — the "rich Pepe" that appears under the cursor.
 * The parent drives `--spot-x` / `--spot-y` CSS variables imperatively
 * via the forwarded ref (no React re-renders per frame).
 *
 * Enhanced with a green energy ring, soft bloom, and gold particle glints
 * baked into the mask so the reveal feels like "Pepe going to the moon".
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
        WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_R}px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.4) 76%, rgba(0,0,0,0) 100%)`,
        maskImage: `radial-gradient(circle ${SPOTLIGHT_R}px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.4) 76%, rgba(0,0,0,0) 100%)`,
        filter: 'saturate(1.25) brightness(1.08) contrast(1.05)',
        mixBlendMode: 'screen',
      }}
    >
      {/* Green energy glow ring hugging the spotlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle ${SPOTLIGHT_R * 0.55}px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(74,222,128,0.22) 0%, rgba(74,222,128,0.08) 40%, transparent 70%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* Gold particle glints scattered across the reveal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle 1px at 18% 30%, rgba(250,204,21,0.7), transparent 60%),' +
            'radial-gradient(circle 1.5px at 72% 22%, rgba(250,204,21,0.6), transparent 60%),' +
            'radial-gradient(circle 1px at 45% 68%, rgba(250,204,21,0.5), transparent 60%),' +
            'radial-gradient(circle 1.2px at 88% 58%, rgba(250,204,21,0.55), transparent 60%),' +
            'radial-gradient(circle 1px at 30% 82%, rgba(250,204,21,0.45), transparent 60%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          animation: 'shimmer 6s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
});
