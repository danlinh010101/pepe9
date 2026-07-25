import { useEffect, useRef, useState } from 'react';
import { Flame, ShieldCheck, Infinity as InfinityIcon, Rocket, Sparkles } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useTilt } from '@/hooks/useTilt';

const PEPE_IMG = 'https://ik.imagekit.io/zznoau6lx/327fc132-f7cb-4027-a2fe-9b5f5ff42f9e.png';

const FEATURES = [
  { icon: Flame,         title: 'Pure Memetic Energy', body: 'Born from the dankest corners of the internet. Pepe powers the most relentless community in crypto.', span: 'md:col-span-2' },
  { icon: ShieldCheck,   title: 'Liquidity Locked',    body: '100% of liquidity locked forever. Contract renounced. No rugs, no honeypots — just green candles.' },
  { icon: InfinityIcon,   title: 'Zero Tax',           body: 'Buy, sell, send, burn. No transaction tax, ever.' },
  { icon: Rocket,        title: 'Fair Launched',       body: 'No team allocation, no VC unlocks. Every token fair-launched to the public.', span: 'md:col-span-2' },
];

export function About() {
  const { ref, visible } = useReveal();
  const heroRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = window.innerHeight / 2;
      setParallax((rect.top + rect.height / 2 - center) * -0.08);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="about" ref={ref} className={`relative py-32 px-6 mesh-bg noise overflow-hidden section-reveal ${visible ? 'is-visible' : ''}`}>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Floating pepe + headline */}
        <div ref={heroRef} className="flex flex-col items-center text-center mb-20">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-spin-slower rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent, rgba(74,222,128,0.3), transparent)' }} />
            <img
              src={PEPE_IMG}
              alt="Pepe"
              className="relative w-44 h-44 md:w-56 md:h-56 object-contain animate-float drop-shadow-[0_0_40px_rgba(74,222,128,0.5)]"
              style={{ transform: `translateY(${parallax}px)`, mixBlendMode: 'screen' }}
            />
          </div>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Why Pepe
          </span>
          <h2
            className="glitch text-5xl md:text-8xl font-black text-white mt-4 tracking-tighter leading-none"
            data-text="THE FROG KING"
          >
            THE FROG KING
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
            Pepe isn't just a token. It's a movement. A culture. A middle finger to the suits
            who said memes couldn't moon. We proved them wrong — and we're just getting started.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <BentoCard key={f.title} feature={f} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ feature, index, visible }: { feature: typeof FEATURES[number]; index: number; visible: boolean }) {
  const { ref, onMove, onLeave } = useTilt<HTMLDivElement>();
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card perspective-1000 group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:border-green-500/40 transition-colors duration-500 reveal ${visible ? 'is-visible' : ''} ${feature.span ?? ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 rounded-3xl aurora opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="tilt-inner relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
            <feature.icon className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-black text-white">{feature.title}</h3>
        </div>
        <p className="text-gray-400 leading-relaxed">{feature.body}</p>
      </div>
    </div>
  );
}
