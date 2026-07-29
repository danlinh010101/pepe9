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
  'https://ik.imagekit.io/zznoau6lx/Cybercoin%20webp/2/wp14146052-cyberpunk-edgerunners-desktop-wallpapers.webp?updatedAt=1785235625688',
];

// ─── Constants ───────────────────────────────────────────────────────────────
const START_COUNT = 779_711_289;

// z travels from Z_FAR → Z_NEAR; object is recycled when z >= Z_NEAR
const Z_FAR = 0.0;
const Z_NEAR = 1.0;

// vz per frame at 60fps — tuned for 8–12s journey
const VZ_MIN = 0.00115;
const VZ_MAX = 0.00165;

// Base card size at z=0.5 in px (true pixel size controlled by scale)
const BASE_CARD_PX = 90;

// Pool sizes — small, spacious scene
const POOL_DESKTOP = 8;
const POOL_TABLET  = 6;
const POOL_MOBILE  = 5;

// Sectors around the counter for balanced distribution
const NUM_SECTORS = 8;

// Counter: realistic internet activity increments
const INCREMENT_TABLE = [
  { value: 15,     weight: 38 },
  { value: 80,     weight: 26 },
  { value: 350,    weight: 18 },
  { value: 2500,   weight: 12 },
  { value: 12000,  weight: 6 },
];
const INCREMENT_INTERVAL_MS = 1400; // avg time between target bumps

function poolSize() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
  if (w < 768) return POOL_MOBILE;
  if (w < 1280) return POOL_TABLET;
  return POOL_DESKTOP;
}

// Pick a weighted random increment from the table
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
  // World coords  —  x/y in px relative to field center, z in [0,1]
  x0: number;    // spawn x offset from center
  y0: number;    // spawn y offset from center
  x: number;     // current x
  y: number;     // current y
  z: number;
  vz: number;
  // Subtle horizontal drift
  driftAmp: number;
  driftPhase: number;
  // Fixed tilt baked in at spawn (max ±8°)
  tilt: number;
  active: boolean;
  lastImgIdx: number;
};

// ─── Gaussian-ish center-weighted random (±1 sigma mapped to [-1,1]) ─────────
function centeredRand(): number {
  // Sum of 3 uniforms → roughly normal, clamped to [-1,1]
  const s = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  return Math.max(-1, Math.min(1, s));
}

// ─── Depth curves ─────────────────────────────────────────────────────────────
// z in [0,1] → [0,1]
function depthOpacity(z: number): number {
  // invisible at z=0, ramps up by z=0.15, full at z=0.30, full until z=0.75,
  // fades to 0 at z=1.0
  if (z < 0.15) return z / 0.15;
  if (z < 0.75) return 1.0;
  return Math.max(0, (1.0 - z) / 0.25);
}

function depthBlur(z: number): number {
  // far: up to 3px, mid: 0, near: up to 2px
  if (z < 0.30) return (1 - z / 0.30) * 3.0;
  if (z > 0.78) return ((z - 0.78) / 0.22) * 2.0;
  return 0;
}

// scale: card should be ~50px at z=0.1, ~90px at z=0.55, ~145px at z=0.95
function depthScale(z: number): number {
  // exponential-ish: small exponent makes it feel like real perspective
  return 0.28 + Math.pow(z, 1.55) * 1.18;
}

// Subtle brightness curve: far ~0.87, mid 1.0, near ~1.08 before fade
function depthBrightness(z: number): number {
  if (z < 0.30) return 0.87 + (z / 0.30) * 0.13;       // 0.87 → 1.0
  if (z < 0.78) return 1.0;                             // full
  return 1.0 + Math.min(1, (z - 0.78) / 0.22) * 0.08;  // 1.0 → 1.08
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Impressions() {
  const { ref, visible } = useReveal();
  const fieldRef    = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLDivElement>(null);
  const poolRef     = useRef<Card[]>([]);
  const rafObjRef   = useRef<number>(0);
  const rafCntRef   = useRef<number>(0);
  const lastObjTime = useRef(0);
  const fieldW      = useRef(0);
  const fieldH      = useRef(0);

  // Counter — live, smooth
  const [shake, setShake] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const shakeTO = useRef<number | undefined>(undefined);

  // Counter internal state (no React state for the hot path)
  const displayRef = useRef(START_COUNT);
  const targetRef  = useRef(START_COUNT + 120); // small head start
  const lastBumpRef = useRef(0); // timestamp of last target bump

  // Odometer: per-digit displayed values and previous values for rolling
  const [odoDigits, setOdoDigits] = useState<string[]>(START_COUNT.toLocaleString('en-US').split(''));
  const odoPrevRef = useRef<string[]>(START_COUNT.toLocaleString('en-US').split(''));

  // ── Spawn card ──────────────────────────────────────────────────────────────
  // sectorHint: when recycling, caller picks a sector with fewest active cards
  const spawnCard = (card: Card, spreadZ = false, sectorHint = -1) => {
    const w = fieldW.current;
    const h = fieldH.current;

    // Forbidden zone: invisible ring around the counter
    const minR = Math.min(w, h) * 0.26; // generous padding around counter
    const maxR = Math.min(w, h) * 0.52;

    // Pick an angle — either from sector hint or random
    let angle: number;
    if (sectorHint >= 0) {
      angle = (sectorHint / NUM_SECTORS) * Math.PI * 2 + (Math.random() - 0.5) * (Math.PI * 2 / NUM_SECTORS) * 0.7;
    } else {
      angle = Math.random() * Math.PI * 2;
    }

    // Radius: outside the forbidden ring, weighted toward outer edge
    const t = 0.45 + Math.random() * 0.55; // 0.45–1.0 of [minR,maxR]
    const radius = minR + (maxR - minR) * t;

    card.x0 = Math.cos(angle) * radius;
    card.y0 = Math.sin(angle) * radius;
    card.x  = card.x0;
    card.y  = card.y0;

    // Stagger z on initial fill so screen isn't empty
    card.z  = spreadZ ? Math.random() : Z_FAR + Math.random() * 0.04;
    card.vz = VZ_MIN + Math.random() * (VZ_MAX - VZ_MIN);

    // Tiny horizontal drift — max ±12px total displacement over journey
    card.driftAmp   = Math.random() * 10;
    card.driftPhase = Math.random() * Math.PI * 2;

    // Tilt baked at spawn: stays constant per card, ±8°
    card.tilt = (Math.random() - 0.5) * 16;

    // Avoid same image twice consecutively
    let imgIdx: number;
    do { imgIdx = Math.floor(Math.random() * CARD_IMAGES.length); }
    while (imgIdx === card.lastImgIdx && CARD_IMAGES.length > 1);
    card.lastImgIdx = imgIdx;
    if (card.img.src !== CARD_IMAGES[imgIdx]) card.img.src = CARD_IMAGES[imgIdx];

    card.active = true;
    card.el.style.opacity = '0';
  };

  // Pick the sector with the fewest active cards (for balanced distribution)
  const pickBalancedSector = (): number => {
    const pool = poolRef.current;
    const counts = new Array(NUM_SECTORS).fill(0);
    for (const c of pool) {
      if (!c.active) continue;
      const ang = Math.atan2(c.y0, c.x0);
      let s = Math.floor(((ang + Math.PI) / (Math.PI * 2)) * NUM_SECTORS);
      if (s < 0) s = 0;
      if (s >= NUM_SECTORS) s = NUM_SECTORS - 1;
      counts[s]++;
    }
    // Find min count sectors, pick randomly among ties
    let min = Infinity;
    for (const c of counts) if (c < min) min = c;
    const candidates: number[] = [];
    for (let i = 0; i < NUM_SECTORS; i++) if (counts[i] === min) candidates.push(i);
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  // ── Build pool ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const n = poolSize();
    const pool: Card[] = [];

    for (let i = 0; i < n; i++) {
      const el  = document.createElement('div');
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

      const card: Card = {
        el, img,
        x0: 0, y0: 0, x: 0, y: 0,
        z: 0, vz: 0,
        driftAmp: 0, driftPhase: 0,
        tilt: 0, active: false, lastImgIdx: -1,
      };
      pool.push(card);
    }

    poolRef.current = pool;

    const measure = () => {
      fieldW.current = field.clientWidth;
      fieldH.current = field.clientHeight;
    };
    measure();
    window.addEventListener('resize', measure);

    // Fill pool with staggered z so the field is populated immediately
    for (let i = 0; i < n; i++) spawnCard(pool[i], true);

    return () => {
      window.removeEventListener('resize', measure);
      pool.forEach((c) => c.el.remove());
      poolRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Object animation loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const counter = counterRef.current;
    const w = () => fieldW.current;
    const h = () => fieldH.current;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3.0);
      last = now;

      const pool = poolRef.current;
      const cx = w() / 2;
      const cy = h() / 2;

      let nearCounter = false;

      for (let i = 0; i < pool.length; i++) {
        const c = pool[i];
        if (!c.active) continue;

        c.z += c.vz * dt;
        c.driftPhase += 0.006 * dt; // very slow drift cycle

        if (c.z >= Z_NEAR) {
          // Recycle — invisible reset, balanced sector
          c.el.style.opacity = '0';
          c.active = false;
          spawnCard(c, false, pickBalancedSector());
          continue;
        }

        const scale    = depthScale(c.z);
        const opacity  = depthOpacity(c.z);
        const blur     = depthBlur(c.z);
        const bright   = depthBrightness(c.z);
        const cardPx   = BASE_CARD_PX * scale;

        // Drift — 90% forward (z), 10% lateral
        const drift = Math.sin(c.driftPhase) * c.driftAmp;

        // Screen position: aggressive radial expansion as z → 1
        // perspFactor grows non-linearly so near cards fly outward
        const perspFactor = 0.25 + Math.pow(c.z, 1.8) * 1.55;
        const sx = cx + (c.x0 + drift) * perspFactor - cardPx / 2;
        const sy = cy + c.y0 * perspFactor - cardPx / 2;

        c.el.style.transform = `translate3d(${sx}px,${sy}px,0) scale(${scale}) rotate(${c.tilt * (1 - c.z * 0.6)}deg)`;
        c.el.style.opacity = String(opacity.toFixed(3));
        // Combine blur + brightness via filter
        const filters: string[] = [];
        if (blur > 0.05) filters.push(`blur(${blur.toFixed(2)}px)`);
        if (Math.abs(bright - 1) > 0.005) filters.push(`brightness(${bright.toFixed(3)})`);
        c.el.style.filter = filters.join(' ');

        // Proximity detection for counter reaction
        if (counter && opacity > 0.6 && scale > 0.65) {
          const cx2 = sx + cardPx / 2;
          const cy2 = sy + cardPx / 2;
          const dx = cx2 - cx;
          const dy = cy2 - (h() / 2);
          if (Math.sqrt(dx * dx + dy * dy) < 180) nearCounter = true;
        }
      }

      // Counter reaction
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
  }, [visible]);

  // ── Counter animation loop ───────────────────────────────────────────────────
  // Realistic internet activity:
  //  - target bumps by weighted random increments at intervals
  //  - display chases target with spring interpolation → smooth odometer
  useEffect(() => {
    if (!visible) return;
    let last = performance.now();
    lastBumpRef.current = last;
    let lastRounded = START_COUNT;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1); // seconds, capped
      last = now;

      // Bump the target with realistic increments at intervals
      const sinceBump = now - lastBumpRef.current;
      const interval = INCREMENT_INTERVAL_MS * (0.6 + Math.random() * 0.8);
      if (sinceBump > interval) {
        targetRef.current += pickIncrement();
        lastBumpRef.current = now;
      }

      // Spring-interpolate display toward target
      // Use a higher factor for large gaps so big bumps are absorbed smoothly
      const gap = targetRef.current - displayRef.current;
      const factor = Math.min(1, (3.2 + Math.min(2, Math.log10(Math.abs(gap) + 1) * 1.5)) * dt);
      displayRef.current += gap * factor;

      const rounded = Math.floor(displayRef.current);
      if (rounded !== lastRounded) {
        lastRounded = rounded;
        const newDigits = rounded.toLocaleString('en-US').split('');
        odoPrevRef.current = odoDigits;
        setOdoDigits(newDigits);
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
            <Odometer digits={odoDigits} prevDigits={odoPrevRef.current} />
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

// ─── Rolling odometer ─────────────────────────────────────────────────────────
// Each digit slot slides upward independently. When a digit changes, the reel
// transitions from the old digit to the new digit with a cubic-bezier ease.
// Commas are rendered as static (non-rolling) slots.
function Odometer({ digits, prevDigits }: { digits: string[]; prevDigits: string[] }) {
  return (
    <span className="imp-odo">
      {digits.map((d, i) => {
        const isDigit = d >= '0' && d <= '9';
        const prev = prevDigits[i] ?? d;

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

        const from = parseInt(prev, 10);
        const to = parseInt(d, 10);
        // Build a reel: [from, from+1 ... to] wrapping 0-9. If from===to, still
        // render a single cell (no movement) — but to keep it alive we render
        // the full 0-9 strip and translate to the target index.
        const reel: number[] = [];
        if (from === to) {
          reel.push(from);
        } else {
          let cur = from;
          reel.push(cur);
          while (cur !== to) {
            cur = (cur + 1) % 10;
            reel.push(cur);
          }
        }

        return (
          <span
            key={i}
            className="imp-odo-slot"
            style={{ width: '0.58em', height: '1em', textAlign: 'center' }}
          >
            <span
              className="imp-odo-reel"
              style={{
                transform: `translateY(-${(reel.length - 1) * 100}%)`,
              }}
            >
              {reel.map((v, j) => (
                <span key={j} className="imp-odo-cell" style={{ height: '1em' }}>
                  {v}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}