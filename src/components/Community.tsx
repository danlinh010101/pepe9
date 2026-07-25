import { Twitter, Send, MessageCircle, Globe } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const SOCIALS = [
  { icon: Twitter,      label: 'Twitter / X',  href: '#', handle: '@pepe' },
  { icon: Send,         label: 'Telegram',     href: '#', handle: 't.me/pepe' },
  { icon: MessageCircle,label: 'Discord',      href: '#', handle: 'discord.gg/pepe' },
  { icon: Globe,        label: 'Website',      href: '#', handle: 'pepe.lol' },
];

export function Community() {
  const { ref, visible } = useReveal();

  return (
    <section id="community" ref={ref} className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid-green opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className={`reveal ${visible ? 'is-visible' : ''}`}>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">Join the Cult</span>
          <h2 className="text-5xl md:text-8xl font-black text-white mt-4 tracking-tighter leading-none">
            RIBBIT <span className="text-green-400 text-glow-green">TOGETHER</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-6 text-lg">
            The strongest community in crypto. Hundreds of thousands of frogs, one mission:
            make memecoins great again.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {SOCIALS.map((s, i) => (
            <a
              key={s.label}
              href={s.href}
              className={`group p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:border-green-500/40 hover:bg-green-500/[0.06] hover:-translate-y-1 transition-all duration-300 reveal ${visible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <s.icon className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-125 transition-transform duration-300" />
              <div className="text-white font-bold text-sm">{s.label}</div>
              <div className="text-gray-500 text-xs mt-1 font-mono">{s.handle}</div>
            </a>
          ))}
        </div>

        <a
          href="#"
          className={`inline-flex items-center gap-2.5 mt-12 px-10 py-4 rounded-full font-black text-black bg-green-400 hover:bg-green-300 text-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/30 reveal ${visible ? 'is-visible' : ''}`}
        >
          Buy $PEPE Now
        </a>
      </div>
    </section>
  );
}

const CONTRACT = '0x6982508145454ce325ddbe47a25d4ec3d2311933';

export function Footer() {
  return (
    <footer className="relative border-t border-green-500/20 bg-black px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-black text-green-400" style={{ fontFamily: 'monospace' }}>$PEPE</span>
            <span className="text-gray-500 text-sm">The most memeable memecoin in existence.</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Contract Address</span>
            <span className="text-gray-300 text-xs font-mono break-all max-w-[280px] text-center">{CONTRACT}</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#about" className="hover:text-green-400 transition-colors">About</a>
            <a href="#tokenomics" className="hover:text-green-400 transition-colors">Tokenomics</a>
            <a href="#roadmap" className="hover:text-green-400 transition-colors">Roadmap</a>
            <a href="#faq" className="hover:text-green-400 transition-colors">FAQ</a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} $PEPE. All memes reserved. No rights reserved.</p>
          <p className="text-gray-700">$PEPE is a meme coin with no intrinsic value. Not financial advice. DYOR.</p>
        </div>
      </div>
    </footer>
  );
}
