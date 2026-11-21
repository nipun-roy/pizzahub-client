import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <FeaturedSection />
      <CategoriesSection />
      <WhyChooseUs />
      <HowItWorks />
    </main>
  );
}
