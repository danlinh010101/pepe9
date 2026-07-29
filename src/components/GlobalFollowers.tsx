import { Instagram, Youtube, Send, MessageCircle, Twitter } from 'lucide-react';
import CircularGallery from '@/components/CircularGallery';

const GALLERY_ITEMS: { image: string; text: string }[] = [
  {
    image: 'https://images.pexels.com/photos/37164032/pexels-photo-37164032.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    text: 'Instagram @pepe.official 2.1M',
  },
  {
    image: 'https://images.pexels.com/photos/17578755/pexels-photo-17578755.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    text: 'TikTok @pepe.dance 1.8M',
  },
  {
    image: 'https://images.pexels.com/photos/26588739/pexels-photo-26588739.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    text: 'YouTube Pepe Channel 940K',
  },
  {
    image: 'https://images.pexels.com/photos/38194675/pexels-photo-38194675.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    text: 'X @pepe 1.2M',
  },
  {
    image: 'https://images.pexels.com/photos/18170271/pexels-photo-18170271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    text: 'Telegram Pepe Army 560K',
  },
  {
    image: 'https://images.pexels.com/photos/12569715/pexels-photo-12569715.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    text: 'Discord Pepe Lounge 780K',
  },
];

export function GlobalFollowers() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 pb-32 pt-0 imp-section"
    >
      {/* Background — identical layers to Impressions, no extra overlays */}
      <div className="absolute inset-0 imp-bg-base" />
      <div className="absolute inset-0 imp-bg-radial" />
      <div className="absolute inset-0 imp-bg-vignette" />
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Soft green glow behind gallery */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(86,242,123,0.12) 0%, transparent 65%)',
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
            {[
              { icon: Instagram, accent: '#E1306C' },
              { icon: Twitter, accent: '#56F27B' },
              { icon: Youtube, accent: '#FF0000' },
            ].map((s, i) => (
              <div
                key={i}
                className="group relative w-14 h-14 rounded-2xl border border-green-500/30 bg-green-500/5 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-green-400/60"
                style={{ boxShadow: '0 0 20px rgba(86,242,123,0.1)' }}
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle, ${s.accent}33 0%, transparent 70%)` }}
                />
                <s.icon
                  className="relative w-6 h-6 text-white group-hover:text-green-300 transition-colors duration-300"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(86,242,123,0.4))' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Interactive circular gallery (OGL) */}
        <div className="w-full" style={{ height: '60vh', minHeight: '400px' }}>
          <CircularGallery
            items={GALLERY_ITEMS}
            bend={3}
            textColor="#56F27B"
            borderRadius={0.04}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </div>
      </div>
    </section>
  );
}
