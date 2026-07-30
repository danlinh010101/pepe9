import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { label: 'Stats',      href: '#stats' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'How to Buy', href: '#how-to-buy' },
  { label: 'Community',  href: '#community' },
  { label: 'FAQ',        href: '#faq' },
] as const;

const SECTION_IDS = ['stats', 'tokenomics', 'how-to-buy', 'community', 'faq'];

// Smooth-scroll with a small offset so the floating navbar never covers the heading.
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: 'smooth' });
}

export function Navbar() {
  // -1 = no active item (Hero / between sections)
  const [activeIndex, setActiveIndex] = useState(-1);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement>(null);

  // Hide on scroll-down, reveal on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastScrollY.current;
      if (Math.abs(y - lastScrollY.current) > 4) {
        setVisible(!goingDown || y < 80);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section via IntersectionObserver.
  // A section is "active" only when it occupies a meaningful portion of the
  // viewport; otherwise we clear the active item (e.g. while in Hero).
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ratios: number[] = new Array(SECTION_IDS.length).fill(0);

    SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios[i] = entry.intersectionRatio;
          const best = ratios.indexOf(Math.max(...ratios));
          // Require a real presence in the viewport before activating.
          if (ratios[best] > 0.25) {
            setActiveIndex(best);
          } else {
            setActiveIndex(-1);
          }
        },
        { threshold: Array.from({ length: 21 }, (_, k) => k / 20) },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Pill geometry: match the active item's position/size
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    if (activeIndex < 0) {
      setPillStyle(null);
      return;
    }
    const el = itemRefs.current[activeIndex];
    const nav = navRef.current;
    if (!el || !nav) return;
    const elRect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - navRect.left,
      width: elRect.width,
    });
  }, [activeIndex]);

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key="navbar"
          className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav
            ref={navRef}
            className="pointer-events-auto relative flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-full"
            style={{
              background: 'rgba(4, 12, 6, 0.75)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(74,222,128,0.22)',
              boxShadow: '0 0 0 1px rgba(74,222,128,0.06), 0 8px 32px rgba(0,0,0,0.45), 0 0 40px rgba(74,222,128,0.07)',
            }}
          >
            {/* Logo (left) — scrolls to Hero */}
            <button
              onClick={() => scrollToId('hero')}
              className="relative z-10 flex items-center gap-2 pr-3 mr-1 border-r border-white/10"
              aria-label="Back to top"
            >
              <span
                className="text-xl font-black tracking-tight text-green-400"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                $PEPE
              </span>
            </button>

            {/* Sliding active pill */}
            {pillStyle && (
              <motion.span
                className="absolute top-[6px] bottom-[6px] rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.22) 0%, rgba(22,163,74,0.18) 100%)',
                  border: '1px solid rgba(74,222,128,0.35)',
                  boxShadow: '0 0 12px rgba(74,222,128,0.18)',
                }}
                animate={{ left: pillStyle.left, width: pillStyle.width }}
                transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.8 }}
              />
            )}

            {NAV_ITEMS.map((item, i) => (
              <a
                key={item.label}
                ref={el => { itemRefs.current[i] = el; }}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(item.href.slice(1));
                }}
                className="relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: i === activeIndex ? '#4ade80' : 'rgba(156,163,175,0.9)',
                  letterSpacing: '0.03em',
                }}
              >
                {item.label}
              </a>
            ))}

            {/* Buy button (right) — scrolls to How to Buy */}
            <button
              onClick={() => scrollToId('how-to-buy')}
              className="relative z-10 ml-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold text-black bg-green-400 hover:bg-green-300 transition-all duration-200 hover:scale-105"
              style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 }}
            >
              Buy $PEPE
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
