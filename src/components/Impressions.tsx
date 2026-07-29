import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

/**
 * "Total Pepe Meme Impressions" — a live, never-stopping counter with a
 * pooled 3D floating-object system behind it.
 *
 * - Counter animates via requestAnimationFrame (organic random increments).
 * - Floating objects are pooled (30–50), reused forever, simulated in fake 3D
 *   (depth → scale, blur, opacity) with organic drift + rotation.
 * - Rare Golden Pepe spawns every 20–30s with stronger glow.
 * - When a large sticker passes close to the counter, the counter reacts
 *   subtly (tiny shake / glow) and returns to normal.
 */

const START_COUNT = 779711289;

const OBJECT_ASSETS: { src: string; type: string }[] = [
  { src: 'https://ik.imagekit.io/zznoau6lx/327fc132-f7cb-4027-a2fe-9b5f5ff42f9e.png', type: 'pepe' },
  { src: 'https://ik.imagekit.io/zznoau6lx/4efe7296-c637-47af-92da-4be859f4bb17.png', type: 'pepe' },
  { src: 'https://ik.imagekit.io/zznoau6lx/ab6607fb-6001-461c-97d7-ae4f1011db73.png', type: 'pepe' },
  { src: 'https://ik.imagekit.io/zznoau6lx/bee56bec-991e-4e14-9f93-dbd941924657.png', type: 'rarepepe' },
  { src: 'https://ik.imagekit.io/zznoau6lx/603878db-f2b1-489a-904b-0cf60136067d.png', type: 'rarepepe' },
  { src: 'https://ik.imagekit.io/zznoau6lx/b4084e0f-7c91-4aa7-8a87-cba98fa11496.png', type: 'rarepepe' },
  { src: 'https://ik.imagekit.io/zznoau6lx/c72a7c09-7dbe-4306-bbb9-aa493129b7c8.png', type: 'rarepepe' },
  { src: 'https://ik.imagekit.io/zznoau6lx/867e7beb-1941-4ade-8b43-890f105c7c2b.png', type: 'rarepepe' },
  { src: 'https://ik.imagekit.io/zznoau6lx/ba586cbf-9111-4337-a242-adf42ef3ed08.png', type: 'rarepepe' },
];

const GOLD_PEPE_SRC = 'https://ik.imagekit.io/zznoau6lx/ba586cbf-9111-4337-a242-adf42ef3ed08.png';

const SVG_OBJECTS = ['dollarbag', 'dollarbill', 'rocket', 'candle', 'diamond', 'coin', 'sticker', 'sunglasses'] as const;
type SvgType = (typeof SVG_OBJECTS)[number];

type ObjType = 'image' | 'svg' | 'gold';

type PooledObj = {
  el: HTMLDivElement;
  inner: HTMLDivElement;
  type: ObjType;
  // state
  x: number; y: number;
  vx: number; vy: number;
  z: number; vz: number;
  scale: number;
  rotation: number; rotSpeed: number;
  baseOpacity: number;
  driftPhase: number; driftAmp: number;
  oscPhase: number; oscAmp: number;
  active: boolean;
  isGold: boolean;
};

const POOL_SIZE_DESKTOP = 42;
const POOL_SIZE_TABLET = 28;
const POOL_SIZE_MOBILE = 16;

function getPoolSize() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
  if (w < 768) return POOL_SIZE_MOBILE;
  if (w < 1280) return POOL_SIZE_TABLET;
  return POOL_SIZE_DESKTOP;
}

export function Impressions() {
  const { ref, visible } = useReveal();
  const counterRef = useRef<HTMLDivElement>(null);
  const counterWrapRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<PooledObj[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const nextGoldRef = useRef<number>(0);
  const goldActiveRef = useRef<boolean>(false);
  const fieldWRef = useRef<number>(0);
  const fieldHRef = useRef<number>(0);
  const dprRef = useRef<number>(1);

  // Live counter state
  const [count, setCount] = useState(START_COUNT);
  const [shake, setShake] = useState(false);
  const [glow, setGlow] = useState(false);
  const countRef = useRef(START_COUNT);
  const shakeTimeoutRef = useRef<number | undefined>(undefined);

  // Spawn a pooled object (reset its state)
  const spawn = (obj: PooledObj, isGold = false) => {
    const w = fieldWRef.current;
    const h = fieldHRef.current;
    obj.x = Math.random() * w;
    obj.y = h * 0.35 + Math.random() * h * 0.4;
    obj.z = 0.04 + Math.random() * 0.06;
    obj.vz = 0.0018 + Math.random() * 0.0028;
    obj.vx = (Math.random() - 0.5) * 0.25;
    obj.vy = -(Math.random() * 0.18 + 0.04);
    obj.scale = 0.12;
    obj.rotation = Math.random() * 360;
    obj.rotSpeed = (Math.random() - 0.5) * 1.6;
    obj.baseOpacity = 0.55 + Math.random() * 0.4;
    obj.driftPhase = Math.random() * Math.PI * 2;
    obj.driftAmp = 0.3 + Math.random() * 0.6;
    obj.oscPhase = Math.random() * Math.PI * 2;
    obj.oscAmp = 0.15 + Math.random() * 0.3;
    obj.active = true;
    obj.isGold = isGold;

    const inner = obj.inner;
    if (isGold) {
      inner.style.filter = 'drop-shadow(0 0 14px rgba(251,191,36,0.9)) drop-shadow(0 0 28px rgba(251,191,36,0.5))';
    } else {
      inner.style.filter = '';
    }
  };

  // Build the pool once
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const poolSize = getPoolSize();
    const pool: PooledObj[] = [];

    for (let i = 0; i < poolSize; i++) {
      const el = document.createElement('div');
      el.className = 'imp-obj';
      const inner = document.createElement('div');
      inner.className = 'imp-obj-inner';
      el.appendChild(inner);

      // Decide type
      const r = Math.random();
      let type: ObjType;
      if (r < 0.55) type = 'image';
      else type = 'svg';

      if (type === 'image') {
        const asset = OBJECT_ASSETS[Math.floor(Math.random() * OBJECT_ASSETS.length)];
        const img = document.createElement('img');
        img.src = asset.src;
        img.alt = '';
        img.draggable = false;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.mixBlendMode = 'screen';
        inner.appendChild(img);
      } else {
        const svgType = SVG_OBJECTS[Math.floor(Math.random() * SVG_OBJECTS.length)];
        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        // Render SVG via innerHTML using a data approach — simpler: use React portal? No, just build markup.
        wrapper.innerHTML = svgMarkup(svgType);
        inner.appendChild(wrapper);
      }

      field.appendChild(el);
      const obj: PooledObj = {
        el, inner, type,
        x: 0, y: 0, vx: 0, vy: 0, z: 0, vz: 0, scale: 0,
        rotation: 0, rotSpeed: 0, baseOpacity: 0,
        driftPhase: 0, driftAmp: 0, oscPhase: 0, oscAmp: 0,
        active: false, isGold: false,
      };
      pool.push(obj);
    }

    poolRef.current = pool;
    nextGoldRef.current = performance.now() + 20000 + Math.random() * 10000;

    const measure = () => {
      fieldWRef.current = field.clientWidth;
      fieldHRef.current = field.clientHeight;
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
    };
    measure();
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
      pool.forEach((o) => o.el.remove());
      poolRef.current = [];
    };
  }, []);

  // Animation loop (objects + counter)
  useEffect(() => {
    if (!visible) return;
    const field = fieldRef.current;
    const counter = counterRef.current;
    if (!field || !counter) return;

    lastTimeRef.current = performance.now();
    lastSpawnRef.current = lastTimeRef.current;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = now;
      const w = fieldWRef.current;
      const h = fieldHRef.current;
      const pool = poolRef.current;

      // Counter rect for proximity reaction
      const cRect = counter.getBoundingClientRect();
      const fRect = field.getBoundingClientRect();
      const cx = cRect.left + cRect.width / 2 - fRect.left;
      const cy = cRect.top + cRect.height / 2 - fRect.top;

      let nearCounter = false;

      // Update objects
      for (let i = 0; i < pool.length; i++) {
        const o = pool[i];
        if (!o.active) continue;

        o.z += o.vz * dt;
        o.x += o.vx * dt;
        o.y += o.vy * dt;
        o.rotation += o.rotSpeed * dt;
        o.driftPhase += 0.018 * dt;
        o.oscPhase += 0.04 * dt;

        const depth = Math.min(o.z, 1);
        const scale = 0.12 + depth * (o.isGold ? 1.7 : 1.4);
        const blur = Math.max(0, (1 - depth) * 7);
        let opacity = depth < 0.12 ? (depth / 0.12) * o.baseOpacity : o.baseOpacity;
        if (depth > 0.82) opacity = Math.max(0, (1 - depth) / 0.18 * o.baseOpacity);

        const drift = Math.sin(o.driftPhase) * o.driftAmp * 8;
        const osc = Math.sin(o.oscPhase) * o.oscAmp * 5;

        const px = o.x + drift;
        const py = o.y + osc;

        o.el.style.transform = `translate3d(${px - scale * 50}px, ${py - scale * 50}px, 0) scale(${scale})`;
        o.el.style.opacity = String(opacity);
        o.inner.style.transform = `rotate(${o.rotation}deg)`;
        o.inner.style.filter = blur > 0.1 ? `blur(${blur}px)` : '';
        if (o.isGold && blur <= 0.1) {
          o.inner.style.filter = 'drop-shadow(0 0 14px rgba(251,191,36,0.9)) drop-shadow(0 0 28px rgba(251,191,36,0.5))';
        }

        // Proximity to counter
        if (depth > 0.5 && depth < 0.85) {
          const dx = px - cx;
          const dy = py - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && scale > 0.7) nearCounter = true;
        }

        if (depth >= 1 || py > h + 100 || py < -200 || px < -200 || px > w + 200) {
          o.active = false;
          o.el.style.opacity = '0';
        }
      }

      // Spawn from inactive pool
      const spawnInterval = 180;
      if (now - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = now;
        for (let i = 0; i < pool.length; i++) {
          if (!pool[i].active) {
            spawn(pool[i], false);
            break;
          }
        }
      }

      // Rare gold event
      if (!goldActiveRef.current && now > nextGoldRef.current) {
        goldActiveRef.current = true;
        for (let i = 0; i < pool.length; i++) {
          if (!pool[i].active) {
            spawn(pool[i], true);
            break;
          }
        }
        nextGoldRef.current = now + 20000 + Math.random() * 10000;
        setTimeout(() => { goldActiveRef.current = false; }, 3000);
      }

      // Counter reaction
      if (nearCounter) {
        setGlow(true);
        if (!shake) {
          setShake(true);
          window.clearTimeout(shakeTimeoutRef.current);
          shakeTimeoutRef.current = window.setTimeout(() => setShake(false), 400);
        }
      } else {
        setGlow(false);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(shakeTimeoutRef.current);
    };
  }, [visible]);

  // Live counter animation (organic random increments)
  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let nextIncr = 0.06 + Math.random() * 0.12;

    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      acc += dt;

      if (acc >= nextIncr) {
        acc = 0;
        nextIncr = 0.05 + Math.random() * 0.13;
        const incr = Math.floor(2 + Math.random() * 18);
        countRef.current += incr;
        setCount(countRef.current);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const display = count.toLocaleString('en-US');
  const digits = display.split('');

  return (
    <section
      ref={ref}
      className={`relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-32 imp-section section-reveal ${visible ? 'is-visible' : ''}`}
    >
      {/* Background layers */}
      <div className="absolute inset-0 imp-bg-base" />
      <div className="absolute inset-0 imp-bg-radial" />
      <div className="absolute inset-0 imp-bg-vignette" />
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Floating object field */}
      <div ref={fieldRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }} />

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
        <div
          ref={counterWrapRef}
          className="relative mb-6"
          style={{ perspective: '600px' }}
        >
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
              textShadow: glow
                ? '0 0 40px rgba(74,222,128,0.7), 0 0 80px rgba(74,222,128,0.4), 0 4px 12px rgba(0,0,0,0.6)'
                : '0 0 24px rgba(74,222,128,0.35), 0 4px 12px rgba(0,0,0,0.5)',
              transition: 'text-shadow 0.3s ease',
            }}
          >
            {digits.map((d, i) => {
              const isDigit = d >= '0' && d <= '9';
              return (
                <span
                  key={i}
                  className="imp-digit"
                  style={{
                    display: 'inline-block',
                    minWidth: isDigit ? '0.6em' : '0.3em',
                    textAlign: 'center',
                  }}
                >
                  {d}
                </span>
              );
            })}
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

// Helper to produce SVG markup string for pooled objects
function svgMarkup(type: SvgType): string {
  const common = 'width="100%" height="100%" style="display:block"';
  switch (type) {
    case 'dollarbag':
      return `<svg viewBox="0 0 100 100" ${common}><ellipse cx="50" cy="55" rx="34" ry="30" fill="#15803d"/><ellipse cx="50" cy="55" rx="28" ry="24" fill="#16a34a"/><ellipse cx="50" cy="50" rx="30" ry="26" fill="#22c55e"/><path d="M 38 25 Q 50 14 62 25" fill="none" stroke="#15803d" stroke-width="4" stroke-linecap="round"/><text x="50" y="62" text-anchor="middle" font-size="26" font-weight="900" fill="#052e16" font-family="monospace">$</text></svg>`;
    case 'dollarbill':
      return `<svg viewBox="0 0 100 60" ${common}><rect x="4" y="8" width="92" height="44" rx="4" fill="#86efac" stroke="#16a34a" stroke-width="2"/><rect x="8" y="12" width="84" height="36" rx="2" fill="#a7f3d0"/><circle cx="50" cy="30" r="13" fill="none" stroke="#15803d" stroke-width="2"/><text x="50" y="36" text-anchor="middle" font-size="16" font-weight="900" fill="#052e16" font-family="monospace">$</text></svg>`;
    case 'rocket':
      return `<svg viewBox="0 0 100 100" ${common}><path d="M 50 10 L 68 45 L 68 78 L 32 78 L 32 45 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="50" cy="40" r="7" fill="#052e16"/><path d="M 32 70 L 20 90 L 40 78 Z" fill="#16a34a"/><path d="M 68 70 L 80 90 L 60 78 Z" fill="#16a34a"/><path d="M 42 78 Q 50 95 58 78" fill="#fbbf24"/><path d="M 45 80 Q 50 92 55 80" fill="#f59e0b"/></svg>`;
    case 'candle':
      return `<svg viewBox="0 0 100 100" ${common}><rect x="38" y="18" width="24" height="64" rx="2" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><rect x="38" y="18" width="24" height="8" fill="#22c55e"/><rect x="38" y="74" width="24" height="8" fill="#15803d"/><line x1="50" y1="6" x2="50" y2="18" stroke="#fbbf24" stroke-width="3"/><path d="M 46 6 Q 50 -2 54 6 Q 50 4 46 6" fill="#fbbf24"/></svg>`;
    case 'diamond':
      return `<svg viewBox="0 0 100 100" ${common}><path d="M 50 15 L 82 40 L 50 88 L 18 40 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><path d="M 18 40 L 82 40 L 50 88 Z" fill="#22c55e" opacity="0.6"/><path d="M 50 15 L 18 40 L 50 30 Z" fill="#86efac" opacity="0.5"/><path d="M 50 15 L 82 40 L 50 30 Z" fill="#86efac" opacity="0.3"/></svg>`;
    case 'coin':
      return `<svg viewBox="0 0 100 100" ${common}><circle cx="50" cy="50" r="40" fill="#fbbf24" stroke="#d97706" stroke-width="3"/><circle cx="50" cy="50" r="32" fill="#f59e0b"/><text x="50" y="62" text-anchor="middle" font-size="32" font-weight="900" fill="#78350f" font-family="monospace">P</text></svg>`;
    case 'sticker':
      return `<svg viewBox="0 0 100 100" ${common}><circle cx="50" cy="50" r="42" fill="#4ade80" stroke="#052e16" stroke-width="3"/><circle cx="50" cy="50" r="42" fill="none" stroke="#fff" stroke-width="2" opacity="0.4" stroke-dasharray="4 4"/><text x="50" y="58" text-anchor="middle" font-size="20" font-weight="900" fill="#052e16" font-family="monospace">PEPE</text></svg>`;
    case 'sunglasses':
      return `<svg viewBox="0 0 100 50" ${common}><ellipse cx="28" cy="25" rx="20" ry="16" fill="#052e16"/><ellipse cx="72" cy="25" rx="20" ry="16" fill="#052e16"/><ellipse cx="28" cy="25" rx="20" ry="16" fill="none" stroke="#4ade80" stroke-width="2.5"/><ellipse cx="72" cy="25" rx="20" ry="16" fill="none" stroke="#4ade80" stroke-width="2.5"/><line x1="48" y1="25" x2="52" y2="25" stroke="#4ade80" stroke-width="3"/><ellipse cx="22" cy="20" rx="6" ry="4" fill="#4ade80" opacity="0.4"/><ellipse cx="66" cy="20" rx="6" ry="4" fill="#4ade80" opacity="0.4"/></svg>`;
  }
}
