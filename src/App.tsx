import { CursorGlow } from '@/components/CursorGlow';
import { HeroCurtain } from '@/components/HeroCurtain';
import { GlobalFollowers } from '@/components/GlobalFollowers';
import { Impressions } from '@/components/Impressions';
import { Tokenomics } from '@/components/Tokenomics';
import { HowToBuy } from '@/components/HowToBuy';
import { Community, Footer } from '@/components/Community';
import { FAQ } from '@/components/FAQ';
import { useLenis } from '@/hooks/useLenis';

function App() {
  useLenis();

  return (
    <div className="bg-black min-h-screen">
      <CursorGlow />
      <HeroCurtain />
      <GlobalFollowers />
      <Impressions />
      <Tokenomics />
      <HowToBuy />
      <Community />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
