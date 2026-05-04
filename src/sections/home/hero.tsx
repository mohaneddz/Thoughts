import { Section } from '@/components/common/section';
import { MediaPlaceholder } from '@/components/common/media-placeholder';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { DisclaimerBox } from '@/components/common/disclaimer-box';

export function HomeHero() {
  return (
    <Section className='grid gap-5 lg:grid-cols-[1.1fr_1fr]'>
      <div className='space-y-4'>
        <h1 className='font-heading text-5xl leading-tight text-[var(--color-text-strong)]'>
          Understand <span className='text-[var(--color-primary)]'>yourself.</span>
          <br />
          Live more <span className='text-[var(--color-accent)]'>intentionally.</span>
        </h1>
        <p className='max-w-xl text-[var(--color-muted)]'>
          Science-backed reflections to help you know yourself better, build emotional awareness, and grow with clarity.
        </p>
        <DisclaimerBox compact />
        <div className='flex flex-wrap gap-2'>
          <Link href={routes.tests}><Button>Take a test</Button></Link>
          <Link href={routes.checkIn}><Button variant='secondary'>Quick check-in</Button></Link>
          <Link href={routes.reflectionTools}><Button variant='secondary'>Explore a feeling</Button></Link>
        </div>
      </div>
      <MediaPlaceholder className='h-64 lg:h-full' variant='hero' />
    </Section>
  );
}

