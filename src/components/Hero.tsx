import { useEffect, useRef, useState } from 'react';
import { Copy, TrendingUp, Users, Zap } from 'lucide-react';
import { RevealLayer } from '@/components/RevealLayer';

const BG_IMAGE_1 = 'https://ik.imagekit.io/zznoau6lx/3.png';
const CONTRACT = '0x6982508145454ce325ddbe47a25d4ec3d2311933';

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridPatternRef = useRef<SVGPatternElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
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

    const loop = () => {
      const section = sectionRef.current;
      if (!section) { tickingRef.current = false; return; }

      const rect = section.getBoundingClientRect();

      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;

      const cx = (smoothRef.current.x - rect.left) / rect.width - 0.5;
      const cy = (smoothRef.current.y - rect.top) / rect.height - 0.5;

      gridOffsetRef.current.x += (cx * 16 - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (cy * 16 - gridOffsetRef.current.y) * 0.06;

      // Imperative DOM updates — no React re-render per frame
      if (gridPatternRef.current) {
        gridPatternRef.current.setAttribute('x', String(gridOffsetRef.current.x));
        gridPatternRef.current.setAttribute('y', String(gridOffsetRef.current.y));
      }
      if (revealRef.current) {
        revealRef.current.style.setProperty('--spot-x', `${smoothRef.current.x}px`);
        revealRef.current.style.setProperty('--spot-y', `${smoothRef.current.y}px`);
      }

      // Continue the loop while values are still settling
      const dx = Math.abs(mouseRef.current.x - smoothRef.current.x);
      const dy = Math.abs(mouseRef.current.y - smoothRef.current.y);
      if (dx > 0.5 || dy > 0.5) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        tickingRef.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
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
      style={{
        backgroundImage: `url(${BG_IMAGE_1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Grid background */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
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

      {/* Spotlight reveal layer — ref driven imperatively by the rAF loop */}
      <RevealLayer ref={revealRef} />

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.8) 100%)' }}
      />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-green-400" style={{ fontFamily: 'monospace' }}>$PEPE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#about" className="hover:text-green-400 transition-colors">About</a>
          <a href="#tokenomics" className="hover:text-green-400 transition-colors">Tokenomics</a>
          <a href="#roadmap" className="hover:text-green-400 transition-colors">Roadmap</a>
          <a href="#community" className="hover:text-green-400 transition-colors">Community</a>
        </div>
        <a
          href="#how-to-buy"
          className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold text-black bg-green-400 hover:bg-green-300 transition-all duration-200 hover:scale-105"
        >
          Buy $PEPE
        </a>
      </nav>

      {/* Hero content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20 pt-4 sm:pb-24 sm:pt-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-green-500/40 bg-green-500/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">Live on Ethereum</span>
        </div>

        {/* Title */}
        <h1
          className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[13rem] font-black leading-none tracking-tighter text-white mb-2 select-none"
          style={{
            textShadow: '0 0 80px rgba(74,222,128,0.4), 0 0 160px rgba(74,222,128,0.15)',
            fontFamily: '"Impact", "Arial Black", sans-serif',
            letterSpacing: '-0.03em',
          }}
        >
          PEPE
        </h1>

        {/* Subtitle */}
        <p
          className="text-green-400 text-sm sm:text-xl md:text-2xl font-bold mb-4 tracking-widest uppercase"
          style={{ fontFamily: 'monospace' }}
        >
          The Most Memeable Memecoin
        </p>

        <p className="text-gray-300 text-sm md:text-lg max-w-xl mb-8 leading-relaxed">
          No taxes. No bullshit. Just vibes and green candles.<br />
          Pepe is here to make memecoins great again.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <a
            href="#how-to-buy"
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-black text-black bg-green-400 hover:bg-green-300 text-base sm:text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/25"
          >
            <TrendingUp className="w-5 h-5" />
            Buy on Uniswap
          </a>
          <a
            href="#how-to-buy"
            className="inline-flex items-center gap-2.5 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-green-400 border border-green-500/50 bg-white/5 backdrop-blur-sm hover:bg-green-500/10 text-base sm:text-lg transition-all duration-200 hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            How to Buy
          </a>
        </div>

        {/* Contract address */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md mb-8 max-w-xs sm:max-w-none w-full sm:w-auto">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider hidden sm:block">CA</span>
          <span className="text-gray-300 text-xs font-mono truncate flex-1 sm:flex-none sm:max-w-none">
            {CONTRACT}
          </span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-green-400"
          >
            <Copy className="w-4 h-4" />
          </button>
          {copied && (
            <span className="text-green-400 text-xs font-semibold animate-pulse">Copied!</span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-12">
          {[
            { label: 'Market Cap', value: '$1.2B', icon: TrendingUp },
            { label: 'Holders',    value: '300K+', icon: Users },
            { label: 'Total Supply', value: '420.69T', icon: Zap },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mb-1" />
              <span className="text-white text-lg sm:text-2xl font-black">{value}</span>
              <span className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))' }}
      />
    </section>
  );
}
