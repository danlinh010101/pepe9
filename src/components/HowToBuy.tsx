import { useEffect, useRef, useState } from 'react';
import { Wallet, Coins, ArrowLeftRight, PartyPopper, ArrowRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const STEPS = [
  { icon: Wallet,            title: 'Get a Wallet',     body: 'Download MetaMask or your favorite self-custody wallet. Fund it with ETH on the Ethereum network.' },
  { icon: Coins,             title: 'Get Some ETH',     body: "Buy ETH on any exchange and transfer it to your wallet. You'll need it to swap for $PEPE and pay gas." },
  { icon: ArrowLeftRight,    title: 'Swap on Uniswap',  body: 'Head to Uniswap, paste the $PEPE contract address, and swap your ETH for PEPE. Confirm and done.' },
  { icon: PartyPopper,       title: 'Welcome Home',     body: "You're now a Pepe holder. Join the community, share your memes, and watch the green candles." },
];

export function HowToBuy() {
  const { ref, visible } = useReveal();
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 3000);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <section id="how-to-buy" ref={ref} className={`relative py-32 px-6 overflow-hidden mesh-bg noise section-reveal ${visible ? 'is-visible' : ''}`}>
      <div className="absolute -top-10 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-20 reveal ${visible ? 'is-visible' : ''}`}>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">How to Buy</span>
          <h2 className="text-5xl md:text-8xl font-black text-white mt-4 tracking-tighter leading-none">
            FOUR STEPS TO <span className="text-glow-green text-green-400">GAINS</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-6 text-lg">
            Buying $PEPE is easier than explaining crypto to your grandma. Follow along.
          </p>
        </div>

        {/* Interactive vertical timeline */}
        <div className="relative max-w-3xl mx-auto" ref={trackRef}>
          {/* progress line */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-white/10" />
          <div
            className="absolute left-7 top-0 w-0.5 bg-gradient-to-b from-green-400 to-green-600 transition-all duration-700"
            style={{ height: `${((active + 1) / STEPS.length) * 100}%` }}
          />

          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const isActive = i === active;
              const isDone = i < active;
              return (
                <div
                  key={step.title}
                  onMouseEnter={() => setActive(i)}
                  className={`relative flex items-start gap-6 cursor-pointer pl-0 reveal ${visible ? 'is-visible' : ''}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* node */}
                  <div className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isActive ? 'bg-green-400 text-black scale-110 shadow-lg shadow-green-500/50' :
                    isDone ? 'bg-green-500/30 text-green-400' :
                    'bg-white/5 text-gray-500 border border-white/10'
                  }`}>
                    <step.icon className="w-6 h-6" />
                    {isActive && <span className="absolute inset-0 rounded-2xl animate-ping bg-green-400/40" />}
                  </div>

                  {/* content */}
                  <div className={`flex-1 pb-2 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-0'}`}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xs font-mono font-bold ${isActive ? 'text-green-400' : 'text-gray-600'}`}>
                        STEP {String(i + 1).padStart(2, '0')}
                      </span>
                      {isActive && <ArrowRight className="w-4 h-4 text-green-400 animate-pulse" />}
                    </div>
                    <h3 className={`text-2xl font-black mb-1 transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm leading-relaxed transition-all ${isActive ? 'text-gray-300 max-h-40 opacity-100' : 'text-gray-600 max-h-40 opacity-70'}`}>
                      {step.body}
                    </p>
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
