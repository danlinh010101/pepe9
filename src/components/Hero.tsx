import { useEffect, useRef, useState } from 'react';
import { Copy, TrendingUp, Users, Zap, Check } from 'lucide-react';
import { RevealLayer } from '@/components/RevealLayer';
import { Particles } from '@/components/Particles';

const BG_IMAGE_1 = 'https://ik.imagekit.io/zznoau6lx/3.png';
const CONTRACT = '0x6982508145454ce325ddbe47a25d4ec3d2311933';

const STATS = [
  { label: 'Market Cap',  value: '$1.2B',   icon: TrendingUp },
  { label: 'Holders',     value: '300K+',   icon: Users },
  { label: 'Total Supply', value: '420.69T', icon: Zap },
];

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridPatternRef = useRef<SVGPatternElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Layer refs for parallax (scroll + mouse)
  const skyRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const pepeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const tickingRef = useRef(false);

  const [copied, setCopied] = useState(false);

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

    const apply = (el: HTMLElement | null, mx: number, my: number, depth: number) => {
      if (!el) return;
      el.style.transform = `translate3d(${(mx * depth).toFixed(2)}px, ${(my * depth).toFixed(2)}px, 0)`;
    };

    const loop = () => {
      const section = sectionRef.current;
      if (!section) { tickingRef.current = false; return; }

      const rect = section.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / rect.height));

      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.08;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.08;

      const cx = (smoothRef.current.x - rect.left) / rect.width - 0.5;
      const cy = (smoothRef.current.y - rect.top) / rect.height - 0.5;

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

      // Mouse parallax (subtle)
      apply(skyRef.current, cx, cy, 8);
      apply(cityRef.current, cx, cy, 16);
      apply(fogRef.current, cx, cy, -10);
      apply(waterRef.current, cx, cy, 22);
      apply(pepeRef.current, cx, cy, 34);
      apply(contentRef.current, cx, cy, 6);

      // Scroll parallax — each layer drifts at its own rate
      if (skyRef.current) skyRef.current.style.translate = `0 ${(scrollProgress * 40).toFixed(1)}px`;
      if (cityRef.current) cityRef.current.style.translate = `0 ${(scrollProgress * 90).toFixed(1)}px`;
      if (fogRef.current) fogRef.current.style.translate = `0 ${(scrollProgress * -30).toFixed(1)}px`;
      if (waterRef.current) fogRef.current && (fogRef.current.style.translate = `0 ${(scrollProgress * -30).toFixed(1)}px`);
      if (waterRef.current) waterRef.current.style.translate = `0 ${(scrollProgress * 130).toFixed(1)}px`;
      if (pepeRef.current) pepeRef.current.style.translate = `0 ${(scrollProgress * 60).toFixed(1)}px`;

      const dx = Math.abs(mouseRef.current.x - smoothRef.current.x);
      const dy = Math.abs(mouseRef.current.y - smoothRef.current.y);
      if (dx > 0.5 || dy > 0.5 || scrollProgress > 0) {
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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex flex-col"
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
        aria-hidden="true"
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
      <RevealLayer ref={revealRef} />

      {/* ───────── Layer 7: Floating particles ───────── */}
      <Particles className="absolute inset-0 pointer-events-none z-[15]" />

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-[16]"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.78) 100%)' }}
      />

      {/* Breathing green glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-[14]"
        style={{
          background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
          animation: 'breathe 7s ease-in-out infinite',
        }}
      />

      {/* ───────── Layer 6: Typography & content ───────── */}
      <div ref={contentRef} className="relative z-20 flex flex-col min-h-screen will-change-transform">
        {/* Nav */}
        <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-green-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>$PEPE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            <a href="#about" className="hover:text-green-400 transition-colors">About</a>
            <a href="#tokenomics" className="hover:text-green-400 transition-colors">Tokenomics</a>
            <a href="#roadmap" className="hover:text-green-400 transition-colors">Roadmap</a>
            <a href="#community" className="hover:text-green-400 transition-colors">Community</a>
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
            PEPE
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

          {/* Contract Address — terminal/wallet style */}
          <div
            className="contract-box group flex items-center gap-2 px-4 py-2.5 rounded-xl mb-12 max-w-md w-full sm:w-auto transition-all duration-300"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              background: 'rgba(5, 46, 22, 0.55)',
              border: '1px solid rgba(74,222,128,0.25)',
              boxShadow: '0 0 0 1px rgba(74,222,128,0.08), 0 8px 24px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-green-400"
              style={{ boxShadow: '0 0 8px rgba(74,222,128,0.8)' }}
            />
            <span className="text-green-500/70 text-[9px] font-bold uppercase tracking-[0.2em] hidden sm:block">CA</span>
            <span className="text-gray-300 text-[11px] sm:text-xs truncate flex-1 sm:flex-none">
              {CONTRACT}
            </span>
            <button
              onClick={handleCopy}
              className="contract-copy flex-shrink-0 relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.2)',
              }}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400 animate-[pop_0.3s_ease]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-green-400/80 group-hover:text-green-300 transition-colors" />
              )}
            </button>
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
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[18]"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))' }}
      />
    </section>
  );
}
