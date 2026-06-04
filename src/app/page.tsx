import HeroSection from '@/components/home/HeroSection';
import FeatureCards from '@/components/home/FeatureCards';
import ShowcaseSection from '@/components/home/ShowcaseSection';
import HowItWorks from '@/components/home/HowItWorks';
import HomeFooterCTA from '@/components/home/HomeFooterCTA';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="bg-[#f7f4ed]">
      <HeroSection />
      {/* <TestimonialsSection /> */}
      <HowItWorks />
      <ShowcaseSection />
      <FeatureCards />
      
      {/* Footer CTA */}
      <HomeFooterCTA />
    </div>
  );
}
