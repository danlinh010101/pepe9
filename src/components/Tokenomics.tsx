import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useTilt } from '@/hooks/useTilt';
import RotatingText from '@/components/RotatingText';

const SEGMENTS = [
  { label: 'Liquidity Pool',     value: 63.1, color: '#4ade80' },
  { label: 'Burned',             value: 20.0, color: '#16a34a' },
  { label: 'CEX Reserves',       value: 10.0, color: '#22c55e' },
  { label: 'Community Rewards',  value: 5.0,  color: '#86efac' },
  { label: 'Team (locked 2y)',   value: 1.9,  color: '#15803d' },
];

const STATS = [
  { label: 'Total Supply',  value: 420.69, suffix: 'T', prefix: '' },
  { label: 'Holders',       value: 300,    suffix: 'K+', prefix: '' },
  { label: 'Market Cap',    value: 1.2,    suffix: 'B',  prefix: '$' },
  { label: 'Liquidity',     value: 8.4,    suffix: 'M',  prefix: '$' },
];

const ROTATING_WORDS = ['MATTER','WINS', 'PUMPS', 'MOONS', 'PRINTS'];

function useCountUp(target: number, active: boolean, dur = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, dur]);
  return val;
}

export function Tokenomics() {
  const { ref, visible } = useReveal();
  const [progress, setProgress] = useState(0);
  const tilt = useTilt<HTMLDivElement>(20);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <section id="tokenomics" ref={ref} className={`section-full relative py-13 px-6 overflow-hidden section-reveal ${visible ? 'is-visible' : ''}`}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://ik.imagekit.io/zznoau6lx/fd38eafe-25f9-4089-8490-8044107a3373.png)' }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/5 rounded-full blur-[160px] pointer-events-none" />
      {/* Subtle vignette + ambient lighting for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 45%, transparent 35%, rgba(0,0,0,0.55) 100%),' +
            'radial-gradient(circle at 30% 20%, rgba(74,222,128,0.06) 0%, transparent 45%),' +
            'radial-gradient(circle at 70% 80%, rgba(34,197,94,0.05) 0%, transparent 45%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-20 reveal ${visible ? 'is-visible' : ''}`}>
          <span
            className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Tokenomics
          </span>
          <h2
            className="leading-none mt-4"
            style={{
              fontFamily: '"Luckiest Guy", cursive',
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              letterSpacing: '0.01em',
              color: '#fafff4',
              textShadow:
                '0 2px 0 #166534,' +
                '0 4px 0 #14532d,' +
                '0 6px 8px rgba(0,0,0,0.6),' +
                '0 0 40px rgba(86,242,123,0.45)',
            }}
          >
            <span style={{ display: 'inline' }}>NUMBERS THAT </span>
            <RotatingText
              texts={ROTATING_WORDS}
              rotationInterval={2200}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              mainClassName="inline-flex align-baseline"
              elementLevelClassName="text-stroke"
              style={{
                fontFamily: '"Luckiest Guy", cursive',
                WebkitTextStroke: '1.5px rgba(74,222,128,0.5)',
                color: 'transparent',
                textShadow:
                  '0 2px 0 #166534,' +
                  '0 4px 0 #14532d,' +
                  '0 6px 8px rgba(0,0,0,0.6)',
                letterSpacing: '0.01em',
              }}
            />
          </h2>
        </div>

        {/* Stat counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} active={visible} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 3D tilt donut — stationary, glow pulse only */}
          <div className="flex justify-center perspective-1000">
            <div
              ref={tilt.ref}
              onMouseMove={tilt.onMove}
              onMouseLeave={tilt.onLeave}
              className="relative w-72 h-72"
            >
              {/* Outer glow pulse — lighting only, no rotation */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ animation: 'tokenGlowPulse 4s ease-in-out infinite' }}
              />
              <div className="absolute inset-0 rounded-full bg-green-500/5 blur-2xl" />
              <svg viewBox="0 0 220 220" className="relative w-full h-full -rotate-90">
                <circle cx="110" cy="110" r={radius} fill="none" stroke="#1f2937" strokeWidth="28" />
                {SEGMENTS.map((seg, i) => {
                  const len = (seg.value / 100) * circumference * progress;
                  const el = (
                    <circle
                      key={i}
                      cx="110"
                      cy="110"
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="28"
                      strokeDasharray={`${len} ${circumference}`}
                      strokeDashoffset={-offsetAcc}
                    />
                  );
                  offsetAcc += (seg.value / 100) * circumference * progress;
                  return el;
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center tilt-inner">
                <span className="text-gray-500 text-xs uppercase tracking-widest" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Total Supply</span>
                <span className="text-white text-3xl font-black font-mono">420.69T</span>
                <span className="text-green-400 text-sm font-bold mt-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>$PEPE</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {SEGMENTS.map((seg, i) => (
              <div
                key={seg.label}
                className={`group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-green-500/30 hover:translate-x-2 transition-all duration-300 reveal ${visible ? 'is-visible' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-150 transition-transform" style={{ background: seg.color, boxShadow: `0 0 12px ${seg.color}` }} />
                <span className="text-gray-200 font-semibold flex-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{seg.label}</span>
                <span className="text-white font-black font-mono text-lg">{seg.value.toFixed(1)}%</span>
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-white/10 text-gray-500 text-sm font-mono">
              Network: <span className="text-green-400 font-semibold">Ethereum (ERC-20)</span> ·
              Decimals: <span className="text-green-400 font-semibold">18</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tokenGlowPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(74,222,128,0.15), 0 0 80px rgba(74,222,128,0.06); }
          50%      { box-shadow: 0 0 70px rgba(74,222,128,0.3),  0 0 130px rgba(74,222,128,0.12); }
        }
      `}</style>
    </section>
  );
}

function StatCard({ stat, active, index }: { stat: typeof STATS[number]; active: boolean; index: number }) {
  const val = useCountUp(stat.value, active);
  const formatted = stat.value >= 100 ? Math.round(val) : val.toFixed(stat.value < 10 ? 1 : 0);

  return (
    <div
      className={`group relative p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 reveal ${active ? 'is-visible' : ''}`}
      style={{
        transitionDelay: `${index * 100}ms`,
        transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.4s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(74,222,128,0.5)';
        e.currentTarget.style.boxShadow = '0 0 24px rgba(74,222,128,0.2), inset 0 1px 0 rgba(255,255,255,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Glass reflection sweep on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(74,222,128,0.05) 100%)',
        }}
      />
      <div className="relative text-3xl md:text-4xl font-black text-white font-mono">
        {stat.prefix}{formatted}{stat.suffix}
      </div>
      <div className="relative text-gray-500 text-xs uppercase tracking-widest mt-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{stat.label}</div>
    </div>
  );
}
