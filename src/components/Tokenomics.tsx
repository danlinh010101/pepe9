import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useTilt } from '@/hooks/useTilt';

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
    <section id="tokenomics" ref={ref} className={`relative py-32 px-6 overflow-hidden section-reveal ${visible ? 'is-visible' : ''}`}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://ik.imagekit.io/zznoau6lx/fd38eafe-25f9-4089-8490-8044107a3373.png)' }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-20 reveal ${visible ? 'is-visible' : ''}`}>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">Tokenomics</span>
          <h2 className="text-5xl md:text-8xl font-black text-white mt-4 tracking-tighter leading-none">
            NUMBERS THAT <span className="text-stroke">MATTER</span>
          </h2>
        </div>

        {/* Stat counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} active={visible} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 3D tilt donut */}
          <div className="flex justify-center perspective-1000">
            <div
              ref={tilt.ref}
              onMouseMove={tilt.onMove}
              onMouseLeave={tilt.onLeave}
              className="tilt-card relative w-72 h-72"
            >
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
                <span className="text-gray-500 text-xs uppercase tracking-widest">Total Supply</span>
                <span className="text-white text-3xl font-black font-mono">420.69T</span>
                <span className="text-green-400 text-sm font-bold mt-1">$PEPE</span>
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
                <span className="text-gray-200 font-semibold flex-1">{seg.label}</span>
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
    </section>
  );
}

function StatCard({ stat, active, index }: { stat: typeof STATS[number]; active: boolean; index: number }) {
  const val = useCountUp(stat.value, active);
  const formatted = stat.value >= 100 ? Math.round(val) : val.toFixed(stat.value < 10 ? 1 : 0);

  return (
    <div
      className={`p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-green-500/40 transition-all duration-300 reveal ${active ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-3xl md:text-4xl font-black text-white font-mono">
        {stat.prefix}{formatted}{stat.suffix}
      </div>
      <div className="text-gray-500 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
    </div>
  );
}
