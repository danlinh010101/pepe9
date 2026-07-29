import { useEffect, useRef } from 'react';
import { TrendingUp, Users, Zap } from 'lucide-react';
import { RevealLayer } from '@/components/RevealLayer';
import { Particles } from '@/components/Particles';

const BG_IMAGE_1 = 'https://ik.imagekit.io/zznoau6lx/3.png';

const LETTERS = ['P', 'E', 'P', 'E'];

const STATS = [
  { label: 'Market Cap',  value: '$1.2B',   icon: TrendingUp },
  { label: 'Holders',     value: '300K+',   icon: Users },
  { label: 'Total Supply', value: '420.69T', icon: Zap },
];

// Curtain peel distance (extra scroll while Hero is pinned).
const PEEL_VH = 60;

// Per-layer scroll speeds (fraction of peel distance).
// Slowest = deepest background; fastest = foreground content.
// Order matches the spec: sky -> fog -> particles -> reveal -> water -> pepe -> content.
const SPEED = {
  sky:        0.45,
  city:       0.55,
  grid:       0.50,
  fog:        0.62,
  particles:  0.70,
  reveal:     0.80,
  water:      0.75,
  glow:       0.85,
  overlay:    0.72,
  bottomFade: 0.60,
  pepe:       0.00, // rides inside content
  content:    1.15,
};

export function Hero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridPatternRef = useRef<SVGPatternElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Layer refs for parallax (scroll + mouse)
  const skyRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const revealWrapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef = useRef<HTMLDivElement>(null);
  const pepeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letterStateRef = useRef(
    LETTERS.map(() => ({ sx: 1, sy: 1, tx: 0, ty: 0, glow: 0 }))
  );

  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    smoothRef.current = { x: w / 2, y: h / 2 };
    mouseRef.current = { x: w / 2, y: h / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    // Combined transform: mouse parallax + curtain scroll offset (GPU-only translate3d).
    const applyLayer = (
      el: HTMLElement | SVGSVGElement | null,
      depth: number,
      speed: number,
      cx: number,
      cy: number,
      scrollPx: number,
    ) => {
      if (!el) return;
      const ty = -scrollPx * speed;
      const mx = cx * depth;
      const my = cy * depth + ty;
      el.style.transform = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`;
    };

    const loop = () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      if (!section || !pin) { tickingRef.current = false; return; }

      const pinRect = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const peel = Math.max(1, pinRect.height - vh);
      // Curtain progress: 0 when pin enters, 1 when pin leaves.
      const progress = Math.max(0, Math.min(1, -pinRect.top / peel));

      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.08;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.08;

      const sRect = section.getBoundingClientRect();
      const cx = (smoothRef.current.x - sRect.left) / sRect.width - 0.5;
      const cy = (smoothRef.current.y - sRect.top) / sRect.height - 0.5;

      gridOffsetRef.current.x += (cx * 16 - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (cy * 16 - gridOffsetRef.current.y) * 0.06;

      if (gridPatternRef.current) {
        gridPatternRef.current.setAttribute('x', String(gridOffsetRef.current.x));
        gridPatternRef.current.setAttribute('y', String(gridOffsetRef.current.y));
      }
      if (revealRef.current) {
        revealRef.current.style.setProperty('--spot-x', `${smoothRef.current.x}px`);
        revealRef.current.style.setProperty('--spot-y', `${smoothRef.current.y}px`);
      }

      const scrollPx = progress * peel;

      // Curtain: each layer rolls upward at its own speed, separating depth.
      applyLayer(skyRef.current,        8,  SPEED.sky,        cx, cy, scrollPx);
      applyLayer(cityRef.current,      16,  SPEED.city,       cx, cy, scrollPx);
      applyLayer(gridRef.current,       0,  SPEED.grid,       cx, cy, scrollPx);
      applyLayer(fogRef.current,       -10,  SPEED.fog,        cx, cy, scrollPx);
      applyLayer(particlesRef.current,  0,  SPEED.particles,  cx, cy, scrollPx);
      applyLayer(revealWrapRef.current, 0,  SPEED.reveal,     cx, cy, scrollPx);
      applyLayer(waterRef.current,     22,  SPEED.water,      cx, cy, scrollPx);
      applyLayer(glowRef.current,       0,  SPEED.glow,       cx, cy, scrollPx);
      applyLayer(overlayRef.current,    0,  SPEED.overlay,    cx, cy, scrollPx);
      applyLayer(bottomFadeRef.current, 0,  SPEED.bottomFade, cx, cy, scrollPx);
      applyLayer(pepeRef.current,      34,  SPEED.pepe,       cx, cy, scrollPx);
      applyLayer(contentRef.current,    6,  SPEED.content,   cx, cy, scrollPx);

      // ───────── Text Pressure on PEPE letters ─────────
      let lettersSettled = true;
      const h1Rect = pepeRef.current?.getBoundingClientRect();
      if (h1Rect) {
        const lRefs = letterRefs.current;
        const lState = letterStateRef.current;
        for (let i = 0; i < lRefs.length; i++) {
          const el = lRefs[i];
          if (!el) continue;
          const lx = h1Rect.left + el.offsetLeft + el.offsetWidth / 2;
          const ly = h1Rect.top + el.offsetTop + el.offsetHeight / 2;
          const ddx = smoothRef.current.x - lx;
          const ddy = smoothRef.current.y - ly;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          const maxDist = 300;
          const force = Math.max(0, 1 - dist / maxDist);
          const pushDir = dist > 0.5 ? ddx / dist : 0;

          const s = lState[i];
          s.sx += ((1 + force * 0.18) - s.sx) * 0.15;
          s.sy += ((1 - force * 0.10) - s.sy) * 0.15;
          s.tx += ((pushDir * force * 5) - s.tx) * 0.15;
          s.ty += ((-force * 7) - s.ty) * 0.15;
          s.glow += (force - s.glow) * 0.15;

          el.style.transform =
            `translate3d(${s.tx.toFixed(2)}px, ${s.ty.toFixed(2)}px, 0) scaleX(${s.sx.toFixed(3)}) scaleY(${s.sy.toFixed(3)})`;

          if (s.glow > 0.01) {
            el.style.filter =
              `drop-shadow(0 0 ${(20 + s.glow * 30).toFixed(0)}px rgba(74,222,128,${(0.45 + s.glow * 0.4).toFixed(2)}))` +
              ` drop-shadow(0 ${(4 + s.glow * 4).toFixed(0)}px ${(8 + s.glow * 8).toFixed(0)}px rgba(0,0,0,0.6))`;
          } else if (el.style.filter) {
            el.style.filter = '';
          }

          if (Math.abs(s.sx - 1) > 0.01 || Math.abs(s.sy - 1) > 0.01 || Math.abs(s.tx) > 0.05 || Math.abs(s.ty) > 0.05 || s.glow > 0.01) {
            lettersSettled = false;
          }
        }
      }

      const dx = Math.abs(mouseRef.current.x - smoothRef.current.x);
      const dy = Math.abs(mouseRef.current.y - smoothRef.current.y);
      if (dx > 0.5 || dy > 0.5 || (progress > 0.001 && progress < 0.999) || !lettersSettled) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        tickingRef.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
      }
    }, { passive: true });

    // Kick off once so initial state is correct.
    tickingRef.current = true;
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={pinRef}
      className="relative"
      style={{ height: `calc(100vh + ${PEEL_VH}vh)`, backgroundColor: '#032312' }}
    >
      <section
        ref={sectionRef}
        className="sticky top-0 h-screen overflow-hidden flex flex-col z-30"
      >
        {/* ───────── Layer 1: Sky (base background) ───────── */}
        <div
          ref={skyRef}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${BG_IMAGE_1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* ───────── Layer 2: Destroyed city (subtle overlay tint) ───────── */}
        <div
          ref={cityRef}
          className="absolute inset-0 will-change-transform pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Grid background */}
        <svg
          ref={gridRef}
          aria-hidden="true"
          className="will-change-transform"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <pattern
              ref={gridPatternRef}
              id="grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* ───────── Layer 3: Fog (CSS-only, no image asset) ───────── */}
        <div
          ref={fogRef}
          className="absolute inset-0 will-change-transform pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 30% 35%, rgba(74,222,128,0.10) 0%, transparent 70%),' +
              'radial-gradient(ellipse 50% 35% at 75% 55%, rgba(34,197,94,0.08) 0%, transparent 70%),' +
              'radial-gradient(ellipse 70% 45% at 50% 75%, rgba(132,204,22,0.06) 0%, transparent 70%)',
            mixBlendMode: 'screen',
            animation: 'fogDrift 24s ease-in-out infinite alternate',
          }}
        />

        {/* ───────── Layer 4: Water (shimmer gradient) ───────── */}
        <div
          ref={waterRef}
          className="absolute bottom-0 left-0 right-0 h-1/3 will-change-transform pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(74,222,128,0.04) 40%, rgba(34,197,94,0.08) 100%)',
            animation: 'waterShimmer 8s ease-in-out infinite alternate',
          }}
        />

        {/* ───────── Layer 5: Poor Pepe (reveal spotlight) ───────── */}
        <div ref={revealWrapRef} className="absolute inset-0 will-change-transform">
          <RevealLayer ref={revealRef} />
        </div>

        {/* ───────── Layer 7: Floating particles ───────── */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-[15] will-change-transform">
          <Particles className="absolute inset-0 pointer-events-none" />
        </div>

        {/* Dark overlay for text readability */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none z-[16] will-change-transform"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.78) 100%)' }}
        />

        {/* Breathing green glow */}
        <div
          ref={glowRef}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-[14] will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
            animation: 'breathe 7s ease-in-out infinite',
          }}
        />

        {/* ───────── Layer 6: Typography & content ───────── */}
        <div ref={contentRef} className="relative z-20 flex flex-col h-screen will-change-transform">
          {/* Nav */}
          <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-green-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>$PEPE</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              <a href="#community" className="hover:text-green-400 transition-colors">Community</a>
              <a href="#tokenomics" className="hover:text-green-400 transition-colors">Tokenomics</a>
              <a href="#how-to-buy" className="hover:text-green-400 transition-colors">How to Buy</a>
              <a href="#faq" className="hover:text-green-400 transition-colors">FAQ</a>
            </div>
            <a
              href="#how-to-buy"
              className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold text-black bg-green-400 hover:bg-green-300 transition-all duration-200 hover:scale-105"
              style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 }}
            >
              Buy $PEPE
            </a>
          </nav>

          {/* Hero content */}
          <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 pb-24 pt-4 sm:pt-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-green-500/40 bg-green-500/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Live on Ethereum</span>
            </div>

            {/* Title — Luckiest Guy, ~30% smaller, comic depth + green glow */}
            <h1
              ref={pepeRef}
              className="hero-title select-none mb-6 will-change-transform"
              style={{
                fontFamily: '"Luckiest Guy", cursive',
                fontSize: 'clamp(4rem, 11vw, 9rem)',
                lineHeight: 0.95,
                letterSpacing: '0.01em',
                color: '#fafff4',
                textShadow:
                  '0 2px 0 #166534,' +
                  '0 4px 0 #14532d,' +
                  '0 6px 8px rgba(0,0,0,0.6),' +
                  '0 0 30px rgba(74,222,128,0.45),' +
                  '0 0 80px rgba(74,222,128,0.2)',
              }}
            >
              {LETTERS.map((ch, i) => (
                <span
                  key={i}
                  ref={(el) => { letterRefs.current[i] = el; }}
                  className="inline-block will-change-transform"
                >
                  {ch}
                </span>
              ))}
            </h1>

            {/* Subtitle — Space Grotesk 900, uppercase, wide tracking, neon green */}
            <p
              className="mb-6"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(0.56rem, 1.76vw, 1rem)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#4ade80',
                textShadow: '0 0 18px rgba(74,222,128,0.5)',
              }}
            >
              The Most Memeable Memecoin
            </p>

            {/* Description — Plus Jakarta Sans 600, better line height */}
            <p
              className="max-w-xl mb-12"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                fontSize: 'clamp(0.76rem, 1.44vw, 0.96rem)',
                lineHeight: 1.7,
                color: '#d1d5db',
              }}
            >
              No taxes. No bullshit. Just vibes and green candles.<br />
              Pepe is here to make memecoins great again.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <a
                href="#how-to-buy"
                className="hero-btn-primary group relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base transition-all duration-300"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 800,
                  color: '#052e16',
                  background: 'linear-gradient(180deg, #86efac 0%, #4ade80 100%)',
                  border: '2px solid #4ade80',
                  boxShadow: '0 0 24px rgba(74,222,128,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
                }}
              >
                <TrendingUp className="w-4 h-4" />
                Buy on Uniswap
              </a>
              <a
                href="#how-to-buy"
                className="hero-btn-secondary group relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base transition-all duration-300"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 800,
                  color: '#4ade80',
                  background: 'rgba(74,222,128,0.06)',
                  border: '2px solid rgba(74,222,128,0.5)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Zap className="w-4 h-4" />
                How to Buy
              </a>
            </div>

            {/* Stats — bigger numbers, smaller labels, hover lift */}
            <div className="grid grid-cols-3 gap-6 sm:gap-14">
              {STATS.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="stat-card group flex flex-col items-center gap-1.5 transition-all duration-300"
                  style={{ cursor: 'default' }}
                >
                  <Icon className="w-3.5 h-3.5 text-green-500 mb-1 transition-all duration-300 group-hover:scale-125 group-hover:text-green-300" />
                  <span
                    className="stat-value transition-all duration-300 group-hover:text-green-300"
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 700,
                      fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                      color: '#ffffff',
                      textShadow: '0 0 20px rgba(74,222,128,0.25)',
                    }}
                  >
                    {value}
                  </span>
                  <span
                    className="stat-label transition-colors duration-300 group-hover:text-green-400/80"
                    style={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 500,
                      fontSize: '0.52rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: '#6b7280',
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          ref={bottomFadeRef}
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[18] will-change-transform"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))' }}
        />
      </section>
    </div>
  );
}
