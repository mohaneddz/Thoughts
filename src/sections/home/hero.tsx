import { Section } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';

export function HomeHero() {
  return (
    <Section className='grid gap-6 rounded-[2rem] border border-[var(--color-panel-border)] bg-[var(--color-panel)] p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8'>
      <div className='space-y-5'>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]'>Private reflection studio</p>
        <h1 className='font-heading text-5xl leading-[0.95] text-[var(--color-text-strong)] md:text-6xl'>
          See the pattern,
          <br />
          not just the moment.
        </h1>
        <p className='max-w-xl text-base leading-7 text-[var(--color-muted)]'>
          Move from scattered self-analysis to one clear flow: take a reflection, understand the result, save what matters, and come back to the patterns that keep repeating.
        </p>
        <div className='flex flex-wrap gap-2'>
          <Link href={routes.tests}><Button size='lg'>Start with a reflection</Button></Link>
          <Link href={routes.checkIn}><Button size='lg' variant='secondary'>Quick check-in</Button></Link>
        </div>
        <div className='grid gap-3 pt-3 sm:grid-cols-3'>
          <div className='rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4'>
            <p className='text-sm font-semibold text-[var(--color-text-strong)]'>One question at a time</p>
            <p className='mt-1 text-sm text-[var(--color-muted)]'>Less overwhelm, more honest answers.</p>
          </div>
          <div className='rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4'>
            <p className='text-sm font-semibold text-[var(--color-text-strong)]'>Real takeaways</p>
            <p className='mt-1 text-sm text-[var(--color-muted)]'>Results turn into next steps you can keep.</p>
          </div>
          <div className='rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4'>
            <p className='text-sm font-semibold text-[var(--color-text-strong)]'>Private by default</p>
            <p className='mt-1 text-sm text-[var(--color-muted)]'>Progress can stay on your device.</p>
          </div>
        </div>
      </div>

      <div className='grid gap-4'>
        <div className='relative h-64 overflow-hidden rounded-[1.8rem] border border-[var(--color-border)] lg:h-[22rem]'>
          <Image src='/images/hero/home-hero.jpg' alt='Reflective abstract artwork' fill className='object-cover' priority />
          <div className='absolute inset-0 bg-[linear-gradient(140deg,rgba(245,248,251,0.14),rgba(8,15,24,0.38)_65%)]' />
        </div>
        <div className='grid gap-3 sm:grid-cols-[1fr_0.9fr]'>
          <div className='rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5'>
            <p className='text-sm text-[var(--color-muted)]'>Latest result</p>
            <h2 className='mt-2 font-heading text-3xl text-[var(--color-text-strong)]'>Mostly steady</h2>
            <p className='mt-2 text-sm leading-6 text-[var(--color-muted)]'>
              You are not starting from zero. The stronger signal is consistency under pressure, not more intensity.
            </p>
          </div>
          <div className='rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5'>
            <p className='text-sm text-[var(--color-muted)]'>Next useful move</p>
            <p className='mt-3 text-lg font-semibold text-[var(--color-text-strong)]'>Save one insight, not ten.</p>
            <p className='mt-2 text-sm leading-6 text-[var(--color-muted)]'>Keep the sentence you want to remember when the week gets noisy again.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

