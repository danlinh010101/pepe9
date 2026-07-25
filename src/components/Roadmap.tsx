import { Check } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const PHASES = [
  { phase: 'Phase 01', title: 'The Awakening', status: 'done', items: ['Stealth launch on Ethereum', 'Initial liquidity locked', 'First 10,000 holders', 'CoinGecko & CMC listing'] },
  { phase: 'Phase 02', title: 'The Takeoff',    status: 'done', items: ['100,000 holders milestone', 'Tier-1 CEX listings', 'First Pepe meme contest', 'Treasury established'] },
  { phase: 'Phase 03', title: 'The Expansion',  status: 'active', items: ['Pepe NFT collection', 'Cross-chain bridge', 'Developer grants program', 'Major brand collabs'] },
  { phase: 'Phase 04', title: 'The Forever War', status: 'upcoming', items: ['Pepe DAO launch', 'Gaming ecosystem', 'Global Pepe convention', '1M+ holders'] },
];

export function Roadmap() {
  const { ref, visible } = useReveal();

  return (
    <section id="roadmap" ref={ref} className="relative py-28 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-20 reveal ${visible ? 'is-visible' : ''}`}>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">Roadmap</span>
          <h2 className="text-5xl md:text-7xl font-black text-white mt-4 tracking-tighter">
            The Path to <span className="text-green-400 text-glow-green">Valhalla</span>
          </h2>
        </div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500/40 via-green-500/20 to-transparent -translate-x-1/2" />

          <div className="space-y-12">
            {PHASES.map((p, i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={p.phase}
                  className={`relative flex ${left ? 'md:justify-start' : 'md:justify-end'} reveal ${visible ? 'is-visible' : ''}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* node */}
                  <div className={`absolute left-4 md:left-1/2 top-2 w-4 h-4 rounded-full -translate-x-1/2 z-10 ${
                    p.status === 'done' ? 'bg-green-400' : p.status === 'active' ? 'bg-green-400 animate-pulse-glow' : 'bg-gray-700 border border-gray-600'
                  }`} />

                  <div className={`ml-12 md:ml-0 w-full md:w-[44%] p-7 rounded-3xl border ${
                    p.status === 'active' ? 'border-green-500/50 bg-green-500/[0.06]' : 'border-white/10 bg-white/[0.02]'
                  } hover:border-green-500/40 transition-all duration-500`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-green-400 text-xs font-bold tracking-[0.2em] uppercase">{p.phase}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        p.status === 'done' ? 'bg-green-500/20 text-green-400' :
                        p.status === 'active' ? 'bg-green-400 text-black animate-pulse' :
                        'bg-gray-800 text-gray-500'
                      }`}>
                        {p.status === 'done' ? 'Complete' : p.status === 'active' ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4">{p.title}</h3>
                    <ul className="space-y-2">
                      {p.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-gray-400 text-sm">
                          <Check className={`w-4 h-4 flex-shrink-0 ${p.status === 'done' ? 'text-green-400' : 'text-gray-600'}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
