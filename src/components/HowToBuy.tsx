import { Wallet, Coins, ArrowLeftRight, PartyPopper } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const STEPS = [
  {
    icon: Wallet,
    title: 'Get a Wallet',
    body: 'Download MetaMask or your favorite self-custody wallet. Fund it with ETH on the Ethereum network.',
  },
  {
    icon: Coins,
    title: 'Get Some ETH',
    body: 'Buy ETH on any exchange and transfer it to your wallet. You\'ll need it to swap for $PEPE and pay gas.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Swap on Uniswap',
    body: 'Head to Uniswap, paste the $PEPE contract address, and swap your ETH for PEPE. Confirm and done.',
  },
  {
    icon: PartyPopper,
    title: 'Welcome Home',
    body: 'You\'re now a Pepe holder. Join the community, share your memes, and watch the green candles.',
  },
];

export function HowToBuy() {
  const { ref, visible } = useReveal();

  return (
    <section id="how-to-buy" ref={ref} className="relative py-28 px-6 overflow-hidden bg-grid-green">
      <div className="absolute -top-10 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-16 reveal ${visible ? 'is-visible' : ''}`}>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">How to Buy</span>
          <h2 className="text-5xl md:text-7xl font-black text-white mt-4 tracking-tighter">
            Four Steps to <span className="text-green-400 text-glow-green">Gains</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-6 text-lg">
            Buying $PEPE is easier than explaining crypto to your grandma. Follow along.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`relative group reveal ${visible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="relative p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-green-500/40 hover:-translate-y-2 transition-all duration-500 h-full">
                <div className="absolute -top-4 -left-2 text-7xl font-black text-green-500/10 select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-5 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                    <step.icon className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
