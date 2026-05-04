import { AppShell } from '@/components/common/app-shell';
import { AboutIntro } from '@/sections/about/intro';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <AppShell className='space-y-5'>
      <AboutIntro />
      <Card>
        <h2 className='font-heading text-3xl'>Why the name thoughts</h2>
        <p className='mt-2 text-sm text-[var(--color-muted)]'>The name points to the space between thinking and awareness. The goal is reflection that clarifies, not labels that limit.</p>
      </Card>
      <Card>
        <h2 className='font-heading text-3xl'>How to use tests and AI</h2>
        <p className='mt-2 text-sm text-[var(--color-muted)]'>Use results as prompts for journaling and better choices. If something feels heavy, involve trusted people and professional support.</p>
      </Card>
    </AppShell>
  );
}

