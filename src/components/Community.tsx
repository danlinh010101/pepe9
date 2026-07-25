import { Twitter, Send, MessageCircle, Globe, ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useTilt } from '@/hooks/useTilt';

const SOCIALS = [
  { icon: Twitter,       label: 'Twitter / X',  href: '#', handle: '@pepe',     stat: '420K' },
  { icon: Send,          label: 'Telegram',     href: '#', handle: 't.me/pepe',  stat: '180K' },
  { icon: MessageCircle, label: 'Discord',      href: '#', handle: 'discord.gg', stat: '95K' },
  { icon: Globe,         label: 'Website',       href: '#', handle: 'pepe.lol',   stat: '24/7' },
];

const PEPE_IMG = 'https://ik.imagekit.io/zznoau6lx/bee56bec-991e-4e14-9f93-dbd941924657.png';

export function Community() {
  const { ref, visible } = useReveal();
  const tilt = useTilt<HTMLDivElement>(16);

  return (
    <section id="community" ref={ref} className="relative py-32 px-6 overflow-hidden mesh-bg noise">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Floating pepe */}
        <div className="flex justify-center mb-8 perspective-1000">
          <div ref={tilt.ref} onMouseMove={tilt.onMove} onMouseLeave={tilt.onLeave} className="tilt-card relative w-40 h-40">
            <div className="absolute inset-0 animate-spin-slow rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent, rgba(74,222,128,0.4), transparent)' }} />
            <img src={PEPE_IMG} alt="Pepe" className="relative w-full h-full object-contain animate-float drop-shadow-[0_0_40px_rgba(74,222,128,0.6)] tilt-inner" />
          </div>
        </div>

        <div className={`reveal ${visible ? 'is-visible' : ''}`}>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">Join the Cult</span>
          <h2 className="text-6xl md:text-9xl font-black text-white mt-4 tracking-tighter leading-none">
            RIBBIT <span className="text-glow-green text-green-400">TOGETHER</span>
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
              className={`group relative p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:border-green-500/40 hover:bg-green-500/[0.06] hover:-translate-y-1 transition-all duration-300 reveal ${visible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <s.icon className="w-7 h-7 text-green-400 group-hover:scale-125 transition-transform duration-300" />
                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-green-400 group-hover:rotate-45 transition-all duration-300" />
              </div>
              <div className="text-white font-bold text-sm">{s.label}</div>
              <div className="text-gray-500 text-xs mt-1 font-mono">{s.handle}</div>
              <div className="text-green-400 text-lg font-black mt-2">{s.stat}</div>
            </a>
          ))}
        </div>

        <a
          href="#how-to-buy"
          className={`group relative inline-flex items-center gap-3 mt-14 px-12 py-5 rounded-full font-black text-black bg-green-400 hover:bg-green-300 text-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/30 overflow-hidden reveal ${visible ? 'is-visible' : ''}`}
        >
          <span className="relative z-10">Buy $PEPE Now</span>
          <span className="absolute inset-0 aurora opacity-0 group-hover:opacity-100" />
        </a>
      </div>
    </section>
  );
}

const CONTRACT = '0x6982508145454ce325ddbe47a25d4ec3d2311933';

export function Footer() {
  return (
    <footer className="relative border-t border-green-500/20 bg-black px-6 py-14 noise">
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
