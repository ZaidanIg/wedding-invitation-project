import HeroSection from '@/components/home/HeroSection';
import FeatureCards from '@/components/home/FeatureCards';
import ShowcaseSection from '@/components/home/ShowcaseSection';
import HowItWorks from '@/components/home/HowItWorks';
import HomeFooterCTA from '@/components/home/HomeFooterCTA';
import ComingSoonBanner from '@/components/shared/ComingSoonBanner';
import { headers } from 'next/headers';
import Image from 'next/image';

export default async function HomePage() {
  const headersList = await headers();
  const isComingSoon = headersList.get('x-is-coming-soon') === 'true';

  return (
    <div className="bg-[#f7f4ed]">
      {isComingSoon && <ComingSoonBanner />}
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
