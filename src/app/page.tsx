import { AppShell } from '@/components/common/appShell';
import { HomeHero } from '@/sections/home/hero';
import { FeaturedTests } from '@/sections/home/featuredTests';
import { HowItWorks } from '@/sections/home/howItWorks';

export default function HomePage() {
  return (
    <AppShell className='space-y-8'>
      <HomeHero />
      <FeaturedTests />
      <HowItWorks />
    </AppShell>
  );
}

