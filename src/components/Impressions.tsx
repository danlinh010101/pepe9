import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

// ─── Image assets ────────────────────────────────────────────────────────────
const CARD_IMAGES = [
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/loadingBackground.jpg?updatedAt=1785302424340',
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/MV5BODU3NTA3ZWQtNDkyZi00NjM2LWI1NDUtNjBlNGVmZmQ0NGZjXkEyXkFqcGc@._V1_.webp?updatedAt=1785252491298',
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/rebecca.webp?updatedAt=1785252491273',
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/wp11496855_mPEmctV-P.webp?updatedAt=1785252491248',
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/david2.webp?updatedAt=1785251906096',
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/loadingBackground%20(1).webp?updatedAt=1785238535218',
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/wp11496855.webp?updatedAt=1785236346465',
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/wp11501455-lucy-cyberpunk-wallpapers.webp?updatedAt=1785236345822',
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/wp14146132-cyberpunk-edgerunners-desktop-wallpapers.webp?updatedAt=1785235621697',
];

// Fallback for broken images — Pepe-green gradient square
const FALLBACK_IMG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#22c55e"/>' +
    '<stop offset="1" stop-color="#14532d"/>' +
    '</linearGradient></defs>' +
    '<rect width="90" height="90" rx="14" fill="#166534"/>' +
    '<rect width="90" height="90" rx="14" fill="url(#g)" opacity="0.6"/>' +
    '</svg>'
  );

// ─── Constants ───────────────────────────────────────────────────────────────
const START_COUNT = 779_711_289;

const Z_FAR = 0.2;
const Z_NEAR = 0.6;

const VZ_MIN = 0.00130;
const VZ_MAX = 0.00190;

const BASE_CARD_PX = 180;

const COMPASS_ANGLES = [
  -Math.PI / 2,        // N
  -Math.PI / 4,        // NE
  0,                   // E
  Math.PI / 4,         // SE
  Math.PI / 2,         // S
  (3 * Math.PI) / 4,   // SW
  Math.PI,             // W
  -(3 * Math.PI) / 4,  // NW
];

// One card per lane on every device — 8 permanent lanes
const POOL_DESKTOP = COMPASS_ANGLES.length;
const POOL_TABLET  = COMPASS_ANGLES.length;
const POOL_MOBILE  = COMPASS_ANGLES.length;

// 8 compass directions (screen coords: +x right, +y down)

const INCREMENT_TABLE = [
  { value: 15,     weight: 38 },
  { value: 80,     weight: 26 },
  { value: 350,    weight: 18 },
  { value: 2500,   weight: 12 },
  { value: 12000,  weight: 6 },
];
const INCREMENT_INTERVAL_MS = 1400;

function poolSize() {
  // Pool size always equals the number of lanes — one card per lane on every device
  return COMPASS_ANGLES.length;
}

function pickIncrement(): number {
  const total = INCREMENT_TABLE.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of INCREMENT_TABLE) {
    r -= e.weight;
    if (r <= 0) return e.value;
  }
  return INCREMENT_TABLE[0].value;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Card = {
  el: HTMLDivElement;
  img: HTMLImageElement;
  laneIndex: number; // permanent lane assignment — never changes
  x0: number;
  y0: number;
  x: number;
  y: number;
  z: number;
  vz: number;
  driftAmp: number;
  driftPhase: number;
  tilt: number;
  active: boolean;
  lastImgIdx: number;
};

// ─── Depth curves ─────────────────────────────────────────────────────────────
function depthOpacity(z: number): number {
  const fadeStart = Z_NEAR * 0.65;

  if (z < 0.15) return z / 0.15;

  if (z < fadeStart) return 1;

  return Math.max(0, (Z_NEAR - z) / (Z_NEAR - fadeStart));
}

function depthBlur(z: number): number {
  if (z < 0.30)
    return (1 - z / 0.30) * 3;

  const blurStart = Z_NEAR * 0.75;

  if (z > blurStart)
    return ((z - blurStart) / (Z_NEAR - blurStart)) * 2;

  return 0;
}

function depthScale(z: number): number {
  const nz = z / Z_NEAR;
  return 0.28 + Math.pow(nz, 1.55) * 1.18;
}

function depthBrightness(z: number): number {
  const brightStart = Z_NEAR * 0.75;

  if (z < brightStart) return 1;

  return (
    1 +
    Math.min(
      1,
      (z - brightStart) / (Z_NEAR - brightStart)
    ) * 0.08
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Impressions() {
  const { ref, visible } = useReveal();
  const fieldRef    = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLDivElement>(null);
  const poolRef     = useRef<Card[]>([]);
  const rafObjRef   = useRef<number>(0);
  const rafCntRef   = useRef<number>(0);
  const fieldW      = useRef(0);
  const fieldH      = useRef(0);

  const [shake, setShake] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const shakeTO = useRef<number | undefined>(undefined);

  const displayRef = useRef(START_COUNT);
  const targetRef  = useRef(START_COUNT + 120);
  const lastBumpRef = useRef(0);

  const [odoDigits, setOdoDigits] = useState<string[]>(
    START_COUNT.toLocaleString('en-US').split('')
  );

  // ── Spawn card (lane-locked) ────────────────────────────────────────────────
  // Direction is NEVER chosen here — it is fixed by card.laneIndex.
  // Only radius, z, speed, tilt, drift, and image are regenerated on respawn.
  const spawnCard = (card: Card, spreadZ = false) => {
    const w = fieldW.current;
    const h = fieldH.current;

    const minR = Math.min(w, h) * 0.26;
    const maxR = Math.min(w, h) * 0.52;

    // Fixed lane angle with very small jitter (±7°) — never enough to cross lanes
    const baseAngle = COMPASS_ANGLES[card.laneIndex];
    const jitter = (Math.random() - 0.5) * (7 * Math.PI / 180);
    const angle = baseAngle + jitter;

    const t = 0.45 + Math.random() * 0.55;
    const radius = minR + (maxR - minR) * t;

    card.x0 = Math.cos(angle) * radius;
    card.y0 = Math.sin(angle) * radius;
    card.x  = card.x0;
    card.y  = card.y0;

    card.z  = spreadZ ? Math.random() : Z_FAR + Math.random() * 0.04;
    card.vz = VZ_MIN + Math.random() * (VZ_MAX - VZ_MIN);

    card.driftAmp   = Math.random() * 10;
    card.driftPhase = Math.random() * Math.PI * 2;
    card.tilt = (Math.random() - 0.5) * 16;

    // Avoid same image twice consecutively in this lane
    let imgIdx: number;
    do { imgIdx = Math.floor(Math.random() * CARD_IMAGES.length); }
    while (imgIdx === card.lastImgIdx && CARD_IMAGES.length > 1);
    card.lastImgIdx = imgIdx;

    // One-shot error fallback — replaced on every src assignment
    card.img.onerror = () => {
      card.img.onerror = null;
      card.img.src = FALLBACK_IMG;
    };
    if (card.img.src !== CARD_IMAGES[imgIdx]) card.img.src = CARD_IMAGES[imgIdx];

    card.active = true;
    card.el.style.opacity = '0';
  };

  // ── Build pool ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const n = poolSize();
    const pool: Card[] = [];

    // One card per lane — lane i owns card i permanently
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:absolute',
        'top:0',
        'left:0',
        `width:${BASE_CARD_PX}px`,
        `height:${BASE_CARD_PX}px`,
        'will-change:transform,opacity',
        'pointer-events:none',
        'border-radius:14px',
        'overflow:hidden',
        'box-shadow:0 4px 24px rgba(0,0,0,0.55)',
        'opacity:0',
        'backface-visibility:hidden',
      ].join(';');

      const img = document.createElement('img');
      img.draggable = false;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;pointer-events:none';
      el.appendChild(img);
      field.appendChild(el);

      pool.push({
        el, img,
        laneIndex: i, // permanent lane assignment — never changes
        x0: 0, y0: 0, x: 0, y: 0,
        z: 0, vz: 0,
        driftAmp: 0, driftPhase: 0,
        tilt: 0, active: false, lastImgIdx: -1,
      });
    }

    poolRef.current = pool;

    const measure = () => {
      fieldW.current = field.clientWidth;
      fieldH.current = field.clientHeight;
    };
    measure();
    window.addEventListener('resize', measure);

    // Preload all card images before starting the animation
    let cancelled = false;
    const preload = CARD_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    );

    Promise.all(preload).then(() => {
      if (cancelled) return;
      for (let i = 0; i < n; i++) spawnCard(pool[i], true);
      setImagesReady(true);
    });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', measure);
      pool.forEach((c) => c.el.remove());
      poolRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Object animation loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || !imagesReady) return;
    const counter = counterRef.current;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3.0);
      last = now;

      const pool = poolRef.current;
      const cx = fieldW.current / 2;
      const cy = fieldH.current / 2;

      let nearCounter = false;

      for (let i = 0; i < pool.length; i++) {
        const c = pool[i];
        if (!c.active) continue;

        c.z += c.vz * dt;
        c.driftPhase += 0.006 * dt;

        if (c.z >= Z_NEAR) {
          c.el.style.opacity = '0';
          c.active = false;
          spawnCard(c, false);
          continue;
        }

        const scale   = depthScale(c.z);
        const opacity = depthOpacity(c.z);
        const blur    = depthBlur(c.z);
        const bright  = depthBrightness(c.z);
        const cardPx  = BASE_CARD_PX * scale;

        const drift = Math.sin(c.driftPhase) * c.driftAmp;

        // Perspective: preserve spawn radius at z=0, expand outward as z→1
        const nz = c.z / Z_NEAR;

const perspFactor =
    1 + Math.pow(nz,1.8)*1.5;
        const sx = cx + (c.x0 + drift) * perspFactor - cardPx / 2;
        const sy = cy + c.y0 * perspFactor - cardPx / 2;
c.el.style.transform =
  `translate3d(${sx}px,${sy}px,0)
   scale(${scale})
   rotate(${c.tilt * (1 - nz * 0.6)}deg)`;
        c.el.style.opacity = String(opacity.toFixed(3));

        const filters: string[] = [];
        if (blur > 0.05) filters.push(`blur(${blur.toFixed(2)}px)`);
        if (Math.abs(bright - 1) > 0.005) filters.push(`brightness(${bright.toFixed(3)})`);
        c.el.style.filter = filters.join(' ');

        if (counter && opacity > 0.6 && scale > 0.65) {
          const dx = sx + cardPx / 2 - cx;
          const dy = sy + cardPx / 2 - cy;
          if (Math.sqrt(dx * dx + dy * dy) < 180) nearCounter = true;
        }
      }

      if (nearCounter && !shake) {
        setGlowPulse(true);
        setShake(true);
        window.clearTimeout(shakeTO.current);
        shakeTO.current = window.setTimeout(() => {
          setShake(false);
          setGlowPulse(false);
        }, 420);
      }

      rafObjRef.current = requestAnimationFrame(loop);
    };

    rafObjRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafObjRef.current);
      window.clearTimeout(shakeTO.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, imagesReady]);

  // ── Counter animation loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    let last = performance.now();
    lastBumpRef.current = last;
    let lastRounded = START_COUNT;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const sinceBump = now - lastBumpRef.current;
      const interval = INCREMENT_INTERVAL_MS * (0.6 + Math.random() * 0.8);
      if (sinceBump > interval) {
        targetRef.current += pickIncrement();
        lastBumpRef.current = now;
      }

      const gap = targetRef.current - displayRef.current;
      const factor = Math.min(1, (3.2 + Math.min(2, Math.log10(Math.abs(gap) + 1) * 1.5)) * dt);
      displayRef.current += gap * factor;

      const rounded = Math.floor(displayRef.current);
      if (rounded !== lastRounded) {
        lastRounded = rounded;
        setOdoDigits(rounded.toLocaleString('en-US').split(''));
      }

      rafCntRef.current = requestAnimationFrame(loop);
    };

    rafCntRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafCntRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <section
      ref={ref}
      className={`relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-32 imp-section section-reveal ${visible ? 'is-visible' : ''}`}
    >
      {/* Background */}
      <div className="absolute inset-0 imp-bg-base" />
      <div className="absolute inset-0 imp-bg-radial" />
      <div className="absolute inset-0 imp-bg-vignette" />
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Card field */}
      <div
        ref={fieldRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 rounded-full border border-green-500/40 bg-green-500/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 imp-badge-dot" />
          <span
            className="text-green-400 text-[0.65rem] sm:text-xs font-bold tracking-[0.3em] uppercase"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Live Meme Activity
          </span>
        </div>

        {/* Heading */}
        <h2
          className="mb-10 leading-[0.95]"
          style={{
            fontFamily: '"Luckiest Guy", cursive',
            fontSize: 'clamp(1.8rem, 4.2vw, 3.4rem)',
            letterSpacing: '0.01em',
            color: '#fafff4',
            textShadow:
              '0 2px 0 #166534,' +
              '0 4px 0 #14532d,' +
              '0 6px 8px rgba(0,0,0,0.6),' +
              '0 0 30px rgba(74,222,128,0.4)',
          }}
        >
          TOTAL PEPE MEME IMPRESSIONS
        </h2>

        {/* Counter */}
        <div className="relative mb-6">
          <div
            ref={counterRef}
            className={`imp-counter select-none ${shake ? 'imp-shake' : ''}`}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2.8rem, 9vw, 7rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              textShadow: glowPulse
                ? '0 0 40px rgba(74,222,128,0.75), 0 0 80px rgba(74,222,128,0.4), 0 4px 12px rgba(0,0,0,0.6)'
                : '0 0 24px rgba(74,222,128,0.35), 0 4px 12px rgba(0,0,0,0.5)',
              transition: 'text-shadow 0.35s ease',
            }}
          >
            <Odometer digits={odoDigits} />
          </div>
        </div>

        {/* Subtitle */}
        <p
          className="mb-8"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(0.6rem, 1.6vw, 0.95rem)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#4ade80',
            textShadow: '0 0 18px rgba(74,222,128,0.5)',
          }}
        >
          Collective Views
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 imp-badge-dot" />
          <span
            className="text-gray-400"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(0.65rem, 1.3vw, 0.85rem)',
              letterSpacing: '0.1em',
            }}
          >
            Live Internet Activity
          </span>
        </div>

      </div>
    </section>
  );
}

// ─── Stable rolling odometer ───────────────────────────────────────────────────
// Each digit slot has a fixed reel of 0–9 (duplicated for wrap-around) and
// only animates translateY. Commas are static.
function Odometer({ digits }: { digits: string[] }) {
  return (
    <span className="imp-odo">
      {digits.map((d, i) => {
        const isDigit = d >= '0' && d <= '9';
        if (!isDigit) {
          return (
            <span
              key={i}
              className="imp-odo-slot"
              style={{ width: '0.28em', textAlign: 'center' }}
            >
              {d}
            </span>
          );
        }
        return <OdometerSlot key={i} digit={d} />;
      })}
    </span>
  );
}

function OdometerSlot({ digit }: { digit: string }) {
  const reelRef = useRef<HTMLSpanElement>(null);
  const posRef  = useRef(parseInt(digit, 10));
  const prevRef = useRef(digit);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;

    const oldVal = parseInt(prevRef.current, 10);
    const newVal = parseInt(digit, 10);
    prevRef.current = digit;
    const delta = (newVal - oldVal + 10) % 10;
    if (delta === 0) return;

    posRef.current += delta;
    reel.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
    reel.style.transform = `translateY(-${posRef.current * 100}%)`;

    // After transition, snap back to modulo position if wrapped past 9
    if (posRef.current >= 10) {
      const snapPos = posRef.current % 10;
      const t = window.setTimeout(() => {
        reel.style.transition = 'none';
        reel.style.transform = `translateY(-${snapPos * 100}%)`;
        posRef.current = snapPos;
        void reel.offsetHeight;
        reel.style.transition = '';
      }, 600);
      return () => window.clearTimeout(t);
    }
  }, [digit]);

  // Reel: 0–9 duplicated so wrap-around scrolls forward past 9 into the second copy
  const reel = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <span
      className="imp-odo-slot"
      style={{ width: '0.58em', height: '1em', textAlign: 'center' }}
    >
      <span
        ref={reelRef}
        className="imp-odo-reel"
        style={{ transform: `translateY(-${posRef.current * 100}%)` }}
      >
        {reel.map((v, j) => (
          <span key={j} className="imp-odo-cell" style={{ height: '1em' }}>
            {v}
          </span>
        ))}
      </span>
    </span>
  );
}
