import { CursorGlow } from '@/components/CursorGlow';
import { Hero } from '@/components/Hero';
import { Impressions } from '@/components/Impressions';
import { GlobalFollowers } from '@/components/GlobalFollowers';
import { Tokenomics } from '@/components/Tokenomics';
import { HowToBuy } from '@/components/HowToBuy';
import { Community, Footer } from '@/components/Community';
import { FAQ } from '@/components/FAQ';
import { DirectionalParallaxTransition } from '@/components/DirectionalParallaxTransition';

function App() {
  return (
    <div className="bg-black min-h-screen">
      <CursorGlow />
      <DirectionalParallaxTransition>
        <Hero />
        <Impressions />
      </DirectionalParallaxTransition>
      <GlobalFollowers />
      <Tokenomics />
      <HowToBuy />
      <Community />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
