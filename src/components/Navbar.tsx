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

export function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
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

  // Track active section via IntersectionObserver
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
          if (ratios[best] > 0) setActiveIndex(best);
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
          className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav
            ref={navRef}
            className="pointer-events-auto relative flex items-center gap-1 px-3 py-2.5 rounded-full"
            style={{
              background: 'rgba(4, 12, 6, 0.75)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(74,222,128,0.22)',
              boxShadow: '0 0 0 1px rgba(74,222,128,0.06), 0 8px 32px rgba(0,0,0,0.45), 0 0 40px rgba(74,222,128,0.07)',
            }}
          >
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
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
