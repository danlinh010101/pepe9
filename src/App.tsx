import { Hero } from '@/components/Hero';
import { Ticker } from '@/components/Ticker';
import { About } from '@/components/About';
import { Tokenomics } from '@/components/Tokenomics';
import { HowToBuy } from '@/components/HowToBuy';
import { Roadmap } from '@/components/Roadmap';
import { MemeGallery } from '@/components/MemeGallery';
import { FAQ } from '@/components/FAQ';
import { Community, Footer } from '@/components/Community';

function App() {
  return (
    <div className="bg-black min-h-screen">
      <Hero />
      <Ticker />
      <About />
      <Tokenomics />
      <HowToBuy />
      <Roadmap />
      <MemeGallery />
      <FAQ />
      <Community />
      <Footer />
    </div>
  );
}

export default App;
