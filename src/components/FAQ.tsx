import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const FAQS = [
  { q: 'What is $PEPE?', a: '$PEPE is a deflationary memecoin on the Ethereum network paying homage to the most recognizable meme in the world. It has no intrinsic value and is purely for entertainment.' },
  { q: 'Is there a buy or sell tax?', a: 'No. $PEPE has zero tax on buys, sells, and transfers. The contract is renounced, so this can never be changed.' },
  { q: 'Is the liquidity locked?', a: 'Yes. 100% of the liquidity pool is locked permanently. The contract ownership has been renounced, making $PEPE fully decentralized.' },
  { q: 'How do I buy $PEPE?', a: 'You can buy $PEPE on Uniswap by swapping ETH for $PEPE using our contract address. Check the "How to Buy" section above for a step-by-step guide.' },
  { q: 'Is this financial advice?', a: 'Absolutely not. $PEPE is a meme token with no intrinsic value or expectation of financial return. Always do your own research and never invest more than you can afford to lose.' },
  { q: 'Where can I store my $PEPE?', a: 'Any ERC-20 compatible wallet works. MetaMask, Trust Wallet, Rabby, or a hardware wallet like Ledger are all great options.' },
];

export function FAQ() {
  const { ref, visible } = useReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className={`section-full relative py-11 px-6 overflow-hidden section-reveal ${visible ? 'is-visible' : ''}`}>
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <div className={`text-center mb-20 reveal ${visible ? 'is-visible' : ''}`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">FAQ</span>
          </div>
          <h2 className="glitch text-5xl md:text-8xl font-black text-white tracking-tighter leading-none" data-text="GOT QUESTIONS?">
            GOT QUESTIONS?
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden reveal ${visible ? 'is-visible' : ''} ${
                  isOpen ? 'border-green-500/40 bg-green-500/[0.04] shadow-lg shadow-green-500/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <span className="flex items-center gap-4">
                    <span className={`text-sm font-mono font-bold transition-colors ${isOpen ? 'text-green-400' : 'text-gray-600'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-white font-bold text-lg">{faq.q}</span>
                  </span>
                  <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-green-400 text-black rotate-180' : 'bg-white/10 text-green-400 group-hover:bg-green-500/20'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pl-16 text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
