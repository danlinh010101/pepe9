import { CursorGlow } from '@/components/CursorGlow';
import { Hero } from '@/components/Hero';
import { Impressions } from '@/components/Impressions';
import { GlobalFollowers } from '@/components/GlobalFollowers';
import { Tokenomics } from '@/components/Tokenomics';
import { HowToBuy } from '@/components/HowToBuy';
import { Roadmap } from '@/components/Roadmap';
import { MemeGallery } from '@/components/MemeGallery';
import { FAQ } from '@/components/FAQ';
import { Community, Footer } from '@/components/Community';

function App() {
  return (
    <div className="bg-black min-h-screen">
      <CursorGlow />
      <Hero />
      <Impressions />
      <GlobalFollowers />
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
