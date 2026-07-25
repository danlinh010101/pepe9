import { useRef } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const PHASES = [
  { phase: '01', title: 'The Awakening',   status: 'done',     items: ['Stealth launch on Ethereum', 'Initial liquidity locked', 'First 10,000 holders', 'CoinGecko & CMC listing'] },
  { phase: '02', title: 'The Takeoff',      status: 'done',     items: ['100,000 holders milestone', 'Tier-1 CEX listings', 'First Pepe meme contest', 'Treasury established'] },
  { phase: '03', title: 'The Expansion',    status: 'active',   items: ['Pepe NFT collection', 'Cross-chain bridge', 'Developer grants program', 'Major brand collabs'] },
  { phase: '04', title: 'The Forever War',  status: 'upcoming',  items: ['Pepe DAO launch', 'Gaming ecosystem', 'Global Pepe convention', '1M+ holders'] },
];

export function Roadmap() {
  const { ref, visible } = useReveal();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 380, behavior: 'smooth' });
  };

  return (
    <section id="roadmap" ref={ref} className={`relative py-32 overflow-hidden section-reveal ${visible ? 'is-visible' : ''}`}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://ik.imagekit.io/zznoau6lx/7fcf6e7d-32fe-4db9-b32f-ac0eb2b6b703.png)' }}
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className={`flex items-end justify-between mb-16 reveal ${visible ? 'is-visible' : ''}`}>
          <div>
            <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">Roadmap</span>
            <h2 className="text-5xl md:text-8xl font-black text-white mt-4 tracking-tighter leading-none">
              PATH TO <span className="text-glow-green text-green-400">VALHALLA</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)} className="w-12 h-12 rounded-full border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 flex items-center justify-center text-gray-400 hover:text-green-400 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll(1)} className="w-12 h-12 rounded-full border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 flex items-center justify-center text-gray-400 hover:text-green-400 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="relative flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 max-w-6xl mx-auto pb-4"
      >
        {PHASES.map((p, i) => (
          <div
            key={p.phase}
            className={`flex-shrink-0 w-[340px] md:w-[380px] snap-center p-8 rounded-3xl border transition-all duration-500 reveal-scale ${visible ? 'is-visible' : ''} ${
              p.status === 'active' ? 'border-green-500/50 bg-green-500/[0.06]' : 'border-white/10 bg-white/[0.02]'
            } hover:border-green-500/40 hover:-translate-y-2`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-6xl font-black text-green-500/10">{p.phase}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                p.status === 'done' ? 'bg-green-500/20 text-green-400' :
                p.status === 'active' ? 'bg-green-400 text-black animate-pulse' :
                'bg-gray-800 text-gray-500'
              }`}>
                {p.status === 'done' ? 'Complete' : p.status === 'active' ? 'In Progress' : 'Upcoming'}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-5">{p.title}</h3>
            <ul className="space-y-3">
              {p.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-gray-400 text-sm">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${p.status === 'done' ? 'bg-green-500/20' : 'bg-white/5'}`}>
                    <Check className={`w-3 h-3 ${p.status === 'done' ? 'text-green-400' : 'text-gray-600'}`} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
