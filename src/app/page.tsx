import { AppShell } from '@/components/common/app-shell';
import { HomeHero } from '@/sections/home/hero';
import { FeaturedTests } from '@/sections/home/featured-tests';
import { HowItWorks } from '@/sections/home/how-it-works';

export default function HomePage() {
  return (
    <AppShell className='space-y-8'>
      <HomeHero />
      <FeaturedTests />
      <HowItWorks />
    </AppShell>
  );
}

