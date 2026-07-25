import { Flame, ShieldCheck, Infinity as InfinityIcon, Rocket } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const FEATURES = [
  {
    icon: Flame,
    title: 'Pure Memetic Energy',
    body: 'Born from the dankest corners of the internet. Pepe powers the most relentless community in crypto.',
  },
  {
    icon: ShieldCheck,
    title: 'Liquidity Locked',
    body: '100% of liquidity is locked forever. Contract renounced. No rugs, no honeypots — just green candles.',
  },
  {
    icon: InfinityIcon,
    title: 'Zero Tax',
    body: 'Buy, sell, send, burn. No transaction tax, ever. What you trade is what you keep.',
  },
  {
    icon: Rocket,
    title: 'Community First',
    body: 'No team allocation, no VC unlocks. Every single token was fair-launched to the public.',
  },
];

export function About() {
  const { ref, visible } = useReveal();

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 px-6 bg-grid-green overflow-hidden"
    >
      {/* glow blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-16 reveal ${visible ? 'is-visible' : ''}`}>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">Why Pepe</span>
          <h2 className="text-5xl md:text-7xl font-black text-white mt-4 tracking-tighter">
            The Frog That <span className="text-green-400 text-glow-green">Conquered</span> Crypto
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
            Pepe isn't just a token. It's a movement. A culture. A middle finger to the suits
            who said memes couldn't moon. We proved them wrong — and we're just getting started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:border-green-500/40 hover:bg-green-500/[0.04] transition-all duration-500 reveal ${visible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
                  <f.icon className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{f.body}</p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
