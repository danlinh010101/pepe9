import { useRef } from 'react';
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const PHASES = [
  { phase: '01', title: 'The Awakening',  status: 'done',     items: ['Stealth launch on Ethereum', 'Initial liquidity locked', 'First 10,000 holders', 'CoinGecko & CMC listing'] },
  { phase: '02', title: 'The Takeoff',    status: 'done',     items: ['100,000 holders milestone', 'Tier-1 CEX listings', 'First Pepe meme contest', 'Treasury established'] },
  { phase: '03', title: 'The Expansion',  status: 'active',   items: ['Pepe NFT collection', 'Cross-chain bridge', 'Developer grants program', 'Major brand collabs'] },
  { phase: '04', title: 'The Forever War',status: 'upcoming', items: ['Pepe DAO launch', 'Gaming ecosystem', 'Global Pepe convention', '1M+ holders'] },
];

const STATUS_META = {
  done:     { label: 'Complete',    badge: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  active:   { label: 'In Progress', badge: 'bg-green-400 text-black border border-green-300 animate-pulse' },
  upcoming: { label: 'Upcoming',    badge: 'bg-white/5 text-gray-500 border border-white/10' },
} as const;

export function Roadmap() {
  const { ref, visible } = useReveal();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 380, behavior: 'smooth' });
  };

  return (
    <section
      id="roadmap"
      ref={ref}
      className={`relative py-32 overflow-hidden section-reveal ${visible ? 'is-visible' : ''}`}
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.88) 100%), url(https://ik.imagekit.io/zznoau6lx/ee5bb410-87fb-426d-acaa-f7fc13ed80b7.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Ambient green orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-600/6 rounded-full blur-[140px] pointer-events-none" />

      {/* Top + bottom fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className={`flex items-end justify-between mb-16 reveal ${visible ? 'is-visible' : ''}`}>
          <div>
            <span className="inline-flex items-center gap-2 text-green-400 text-sm font-bold tracking-[0.3em] uppercase">
              <Sparkles className="w-4 h-4" /> Roadmap
            </span>
            <h2 className="text-5xl md:text-8xl font-black text-white mt-4 tracking-tighter leading-none">
              PATH TO <span className="text-glow-green text-green-400">VALHALLA</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-12 h-12 rounded-full border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 flex items-center justify-center text-gray-400 hover:text-green-400 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-12 h-12 rounded-full border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 flex items-center justify-center text-gray-400 hover:text-green-400 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="relative flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 max-w-6xl mx-auto pb-4"
      >
        {PHASES.map((p, i) => {
          const meta = STATUS_META[p.status as keyof typeof STATUS_META];
          const isActive = p.status === 'active';
          const isDone = p.status === 'done';

          return (
            <div
              key={p.phase}
              className={`flex-shrink-0 w-[320px] md:w-[360px] snap-center reveal-scale ${visible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Card */}
              <div
                className={`relative h-full rounded-3xl p-7 flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 group ${
                  isActive
                    ? 'border border-green-400/50 shadow-xl shadow-green-500/20'
                    : isDone
                    ? 'border border-green-500/25 shadow-lg shadow-green-500/5'
                    : 'border border-white/8'
                }`}
                style={{
                  background: isActive
                    ? 'linear-gradient(145deg, rgba(74,222,128,0.10) 0%, rgba(22,163,74,0.06) 50%, rgba(0,0,0,0.85) 100%)'
                    : isDone
                    ? 'linear-gradient(145deg, rgba(74,222,128,0.05) 0%, rgba(0,0,0,0.80) 100%)'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.75) 100%)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                }}
              >
                {/* Active glow ring */}
                {isActive && (
                  <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(74,222,128,0.08)' }} />
                )}

                {/* Aurora sweep on hover */}
                <div className="absolute inset-0 rounded-3xl aurora opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Header row */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-7xl font-black leading-none select-none"
                    style={{
                      color: isActive ? 'rgba(74,222,128,0.18)' : 'rgba(255,255,255,0.06)',
                    }}
                  >
                    {p.phase}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-black mb-5 leading-tight ${isActive ? 'text-white' : isDone ? 'text-gray-200' : 'text-gray-400'}`}>
                  {p.title}
                </h3>

                {/* Items */}
                <ul className="space-y-2.5 flex-1">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? 'bg-green-500/25 border border-green-500/30'
                            : isActive
                            ? 'bg-green-500/15 border border-green-500/30'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <Check className={`w-3 h-3 ${isDone || isActive ? 'text-green-400' : 'text-gray-600'}`} />
                      </span>
                      <span className={isDone ? 'text-gray-300' : isActive ? 'text-gray-300' : 'text-gray-500'}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Bottom phase indicator line */}
                <div className="mt-6 h-0.5 rounded-full overflow-hidden bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: isDone ? '100%' : isActive ? '55%' : '0%',
                      background: isDone
                        ? 'linear-gradient(90deg, #16a34a, #4ade80)'
                        : 'linear-gradient(90deg, #4ade80, #86efac)',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
