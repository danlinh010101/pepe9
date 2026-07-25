import { useReveal } from '@/hooks/useReveal';

// Pexels stock images (frog / green / meme-vibe themed)
const MEMES = [
  'https://images.pexels.com/photos/4775610/pexels-photo-4775610.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/7210276/pexels-photo-7210276.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/33545/pexels-photo-33545.jpg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3987025/pexels-photo-3987025.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/247637/pexels-photo-247637.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export function MemeGallery() {
  const { ref, visible } = useReveal();

  return (
    <section id="gallery" ref={ref} className="relative py-28 px-6 overflow-hidden bg-grid-green">
      <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-16 reveal ${visible ? 'is-visible' : ''}`}>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">The Archives</span>
          <h2 className="text-5xl md:text-7xl font-black text-white mt-4 tracking-tighter">
            Pepe <span className="text-green-400 text-glow-green">Gallery</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-6 text-lg">
            A tribute to the most memeable amphibian in human history.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {MEMES.map((src, i) => (
            <div
              key={i}
              className={`group relative aspect-square overflow-hidden rounded-2xl border border-white/10 hover:border-green-500/50 reveal ${visible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img
                src={src}
                alt={`Pepe meme ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-green-400 text-xs font-bold tracking-widest uppercase">Rare Pepe</span>
                <p className="text-white font-black text-lg">#{String(i + 1).padStart(3, '0')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
