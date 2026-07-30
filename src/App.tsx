  import { CursorGlow } from '@/components/CursorGlow';
  import { Navbar } from '@/components/Navbar';
  import { HeroRevealTransition } from '@/components/HeroRevealTransition';
  import { GlobalFollowers } from '@/components/GlobalFollowers';
  import { Tokenomics } from '@/components/Tokenomics';
  import { Community, Footer } from '@/components/Community';
  import { HowToBuyCommunityTransition } from '@/components/HowToBuyCommunityTransition';
  import { FAQ } from '@/components/FAQ';
  import { useLenis } from '@/hooks/useLenis';
  
  function App() {
    useLenis();
  
    return (
      <div className="bg-black min-h-screen">
        <CursorGlow />
        <Navbar />
        <HeroRevealTransition />
        <GlobalFollowers />
        <Tokenomics />
        <HowToBuyCommunityTransition />
        <FAQ />
        <Footer />
      </div>
    );
  }
  
  export default App;
