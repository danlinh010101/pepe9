/**
 * Persistent fixed navbar — visible across every section.
 * Extracted from HeroScene so it survives the Hero→Impressions transition
 * and remains pinned to the top of the viewport throughout the page.
 */
export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full"
      style={{
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(74,222,128,0.12)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black tracking-tight text-green-400" style={{ fontFamily: '"JetBrains Mono", monospace' }}>$PEPE</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
        <a href="#stats" className="hover:text-green-400 transition-colors">Stats</a>
        <a href="#tokenomics" className="hover:text-green-400 transition-colors">Tokenomics</a>
        <a href="#how-to-buy" className="hover:text-green-400 transition-colors">How to Buy</a>
        <a href="#community" className="hover:text-green-400 transition-colors">Community</a>
        <a href="#faq" className="hover:text-green-400 transition-colors">FAQ</a>
      </div>
      <a
        href="#how-to-buy"
        className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold text-black bg-green-400 hover:bg-green-300 transition-all duration-200 hover:scale-105"
        style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 }}
      >
        Buy $PEPE
      </a>
    </nav>
  );
}
