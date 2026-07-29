import { useEffect, useRef, useState, useCallback } from 'react';
import { Instagram, Youtube, Send, MessageCircle, Twitter } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

type Platform = {
  name: string;
  handle: string;
  followers: string;
  icon: typeof Instagram;
  image: string;
  accent: string;
};

const PLATFORMS: Platform[] = [
  {
    name: 'Instagram',
    handle: '@pepe.official',
    followers: '2.1M',
    icon: Instagram,
    image: 'https://images.pexels.com/photos/37164032/pexels-photo-37164032.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#E1306C',
  },
  {
    name: 'TikTok',
    handle: '@pepe.dance',
    followers: '1.8M',
    icon: Twitter,
    image: 'https://images.pexels.com/photos/17578755/pexels-photo-17578755.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#56F27B',
  },
  {
    name: 'YouTube',
    handle: 'Pepe Channel',
    followers: '940K',
    icon: Youtube,
    image: 'https://images.pexels.com/photos/26588739/pexels-photo-26588739.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#FF0000',
  },
  {
    name: 'X',
    handle: '@pepe',
    followers: '1.2M',
    icon: Twitter,
    image: 'https://images.pexels.com/photos/38194675/pexels-photo-38194675.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#56F27B',
  },
  {
    name: 'Telegram',
    handle: 'Pepe Army',
    followers: '560K',
    icon: Send,
    image: 'https://images.pexels.com/photos/18170271/pexels-photo-18170271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#229ED9',
  },
  {
    name: 'Discord',
    handle: 'Pepe Lounge',
    followers: '780K',
    icon: MessageCircle,
    image: 'https://images.pexels.com/photos/12569715/pexels-photo-12569715.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: '#5865F2',
  },
];

export function GlobalFollowers() {
  const { ref, visible } = useReveal();

  return (
    <section
      id="about"
      ref={ref}
      className={`relative overflow-hidden px-6 pb-32 pt-0 imp-section section-reveal ${visible ? 'is-visible' : ''}`}
    >
      {/* Background — identical to Impressions */}
      <div className="absolute inset-0 imp-bg-base" />
      <div className="absolute inset-0 imp-bg-radial" />
      <div className="absolute inset-0 imp-bg-vignette" />
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Soft green glow behind gallery */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(86,242,123,0.15) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Hero heading */}
        <div className="flex flex-col items-center mb-10">
          <span
            className="text-green-400 mb-2"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              letterSpacing: '0.05em',
              textShadow: '0 0 24px rgba(86,242,123,0.5)',
            }}
          >
            5,000,000+
          </span>
          <h2
            className="leading-[0.9]"
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
            GLOBAL FOLLOWERS
          </h2>

          {/* Social icons row */}
          <div className="flex items-center gap-6 mt-8">
            {PLATFORMS.slice(0, 3).map((p) => (
              <div
                key={p.name}
                className="group relative w-14 h-14 rounded-2xl border border-green-500/30 bg-green-500/5 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-green-400/60"
                style={{ boxShadow: '0 0 20px rgba(86,242,123,0.1)' }}
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle, ${p.accent}33 0%, transparent 70%)` }}
                />
                <p.icon
                  className="relative w-6 h-6 text-white group-hover:text-green-300 transition-colors duration-300"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(86,242,123,0.4))' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Interactive circular gallery */}
        <CircularGallery platforms={PLATFORMS} />
      </div>
    </section>
  );
}

// ─── Circular Gallery ──────────────────────────────────────────────────────────
// Pure React + CSS transforms — no external OGL dependency.
// Supports: mouse drag, touch swipe, wheel scroll, arrow keys, infinite loop.

function CircularGallery({ platforms }: { platforms: Platform[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const rafRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [cardScale, setCardScale] = useState(1);

  const DOUBLED = [...platforms, ...platforms];
  const N = DOUBLED.length;

  // Responsive radius & card size
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setCardScale(w < 640 ? 0.7 : w < 1024 ? 0.85 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const radius = isMobile ? 160 : 320;
  const cardW = 200 * cardScale;
  const cardH = 260 * cardScale;

  const step = (2 * Math.PI) / N;

  // Smooth easing animation loop
  useEffect(() => {
    const animate = () => {
      const diff = targetRotationRef.current - rotationRef.current;
      velocityRef.current = diff * 0.08;
      rotationRef.current += velocityRef.current;

      if (Math.abs(diff) < 0.001 && Math.abs(velocityRef.current) < 0.001) {
        rotationRef.current = targetRotationRef.current;
      }

      const container = containerRef.current;
      if (container) {
        const children = container.children;
        for (let i = 0; i < children.length; i++) {
          const el = children[i] as HTMLDivElement;
          const angle = i * step + rotationRef.current;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          const nz = (z + radius) / (2 * radius); // 0 (back) → 1 (front)
          const scale = 0.55 + nz * 0.55;
          const opacity = 0.25 + nz * 0.75;
          const blur = (1 - nz) * 3;

          el.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${scale})`;
          el.style.opacity = String(opacity);
          el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : 'none';
          el.style.zIndex = String(Math.round(z + radius + 100));
        }

        // Track active card (front-most)
        const normalized = ((rotationRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const idx = Math.round(normalized / step) % platforms.length;
        setActiveIndex((idx + platforms.length) % platforms.length);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [radius, step, platforms.length]);

  // Mouse drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    targetRotationRef.current -= dx * 0.008;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Wheel scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRotationRef.current += e.deltaY * 0.003;
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // Arrow key support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') targetRotationRef.current += step;
      if (e.key === 'ArrowRight') targetRotationRef.current -= step;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{
        height: `${cardH + 80}px`,
        perspective: '1200px',
        touchAction: 'pan-y',
      }}
    >
      {/* Inner 3D stage */}
      <div
        className="relative"
        style={{
          width: '0',
          height: '0',
          transformStyle: 'preserve-3d',
        }}
      >
        {DOUBLED.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={i}
              className="absolute rounded-3xl overflow-hidden border border-green-500/20 backdrop-blur-md group hover:border-green-400/50 transition-colors duration-300"
              style={{
                width: `${cardW}px`,
                height: `${cardH}px`,
                marginLeft: `-${cardW / 2}px`,
                marginTop: `-${cardH / 2}px`,
                background: 'rgba(2, 26, 10, 0.65)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(86,242,123,0.1)',
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity, filter',
              }}
            >
              {/* Image */}
              <div className="relative w-full h-3/5 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(2,26,10,0.9) 100%)' }}
                />
                {/* Platform icon badge */}
                <div
                  className="absolute top-3 right-3 w-10 h-10 rounded-xl border flex items-center justify-center backdrop-blur-md"
                  style={{
                    borderColor: `${p.accent}66`,
                    background: `${p.accent}1a`,
                    boxShadow: `0 0 16px ${p.accent}33`,
                  }}
                >
                  <Icon className="w-5 h-5 text-white" style={{ filter: `drop-shadow(0 0 4px ${p.accent})` }} />
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col items-center justify-center h-2/5 px-4 gap-1">
                <span
                  className="text-white font-bold"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: `${1.1 * cardScale}rem`,
                  }}
                >
                  {p.name}
                </span>
                <span
                  className="text-gray-400"
                  style={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: `${0.8 * cardScale}rem`,
                  }}
                >
                  {p.handle}
                </span>
                <span
                  className="font-black"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: `${1.3 * cardScale}rem`,
                    color: '#56F27B',
                    textShadow: '0 0 12px rgba(86,242,123,0.4)',
                  }}
                >
                  {p.followers}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active platform indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {platforms.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: activeIndex === i ? '24px' : '8px',
              height: '4px',
              background: activeIndex === i ? '#56F27B' : 'rgba(86,242,123,0.3)',
              boxShadow: activeIndex === i ? '0 0 8px rgba(86,242,123,0.6)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
