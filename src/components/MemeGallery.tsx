import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { useTilt } from '@/hooks/useTilt';

const MEMES = [
  { src: 'https://ik.imagekit.io/zznoau6lx/bee56bec-991e-4e14-9f93-dbd941924657.png', title: 'Genesis Pepe',  rarity: 'Legendary' },
  { src: 'https://ik.imagekit.io/zznoau6lx/603878db-f2b1-489a-904b-0cf60136067d.png', title: 'Smug Pepe',     rarity: 'Epic' },
  { src: 'https://ik.imagekit.io/zznoau6lx/b4084e0f-7c91-4aa7-8a87-cba98fa11496.png', title: 'Sad Pepe',      rarity: 'Rare' },
  { src: 'https://ik.imagekit.io/zznoau6lx/c72a7c09-7dbe-4306-bbb9-aa493129b7c8.png', title: 'Angry Pepe',    rarity: 'Epic' },
  { src: 'https://ik.imagekit.io/zznoau6lx/867e7beb-1941-4ade-8b43-890f105c7c2b.png', title: 'Chad Pepe',     rarity: 'Legendary' },
  { src: 'https://ik.imagekit.io/zznoau6lx/ba586cbf-9111-4337-a242-adf42ef3ed08.png', title: 'Royal Pepe',    rarity: 'Mythic' },
];

const RARITY_COLORS: Record<string, string> = {
  Legendary: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  Epic:      'text-purple-400 border-purple-400/40 bg-purple-400/10',
  Rare:      'text-blue-400 border-blue-400/40 bg-blue-400/10',
  Mythic:    'text-green-400 border-green-400/40 bg-green-400/10',
};

export function MemeGallery() {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="gallery" ref={ref} className={`relative py-32 px-6 overflow-hidden bg-grid-fine noise section-reveal ${visible ? 'is-visible' : ''}`}>
      <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-20 reveal ${visible ? 'is-visible' : ''}`}>
          <span className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase">The Archives</span>
          <h2 className="text-5xl md:text-8xl font-black text-white mt-4 tracking-tighter leading-none">
            PEPE <span className="text-stroke">GALLERY</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-6 text-lg">
            A tribute to the most memeable amphibian in human history. Hover to inspect.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {MEMES.map((meme, i) => (
            <GalleryCard
              key={i}
              meme={meme}
              index={i}
              visible={visible}
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({
  meme,
  index,
  visible,
  hovered,
  setHovered,
}: {
  meme: typeof MEMES[number];
  index: number;
  visible: boolean;
  hovered: number | null;
  setHovered: (n: number | null) => void;
}) {
  const { ref, onMove, onLeave } = useTilt<HTMLDivElement>(18);
  const isHovered = hovered === index;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => { onLeave(); setHovered(null); }}
      className={`tilt-card perspective-1000 group relative aspect-square overflow-hidden rounded-3xl border border-white/10 hover:border-green-500/50 reveal-scale ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(74,222,128,0.15), transparent 70%)' }} />

      <img
        src={meme.src}
        alt={meme.title}
        loading="lazy"
        className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* rarity badge */}
      <div className="absolute top-4 right-4">
        <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm ${RARITY_COLORS[meme.rarity]}`}>
          {meme.rarity}
        </span>
      </div>

      {/* info overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-400 text-xs font-bold tracking-widest uppercase">Rare Pepe</span>
            <p className="text-white font-black text-xl">{meme.title}</p>
          </div>
          <ExternalLink className="w-5 h-5 text-green-400" />
        </div>
      </div>

      {/* shine sweep */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100">
        <div className="absolute inset-0 aurora" />
      </div>
    </div>
  );
}
