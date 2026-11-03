import { Section } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { LatestResultTile } from '@/sections/home/latestResultTile';
import { T } from '@/i18n/translated';

export function HomeHero() {
  return (
    <Section className='grid gap-6 rounded-[2rem] border border-[var(--color-panel-border)] bg-[var(--color-panel)] p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8'>
      <div className='space-y-5'>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]'><T k='home.eyebrow' /></p>
        <h1 className='font-heading text-5xl leading-[0.95] text-[var(--color-text-strong)] md:text-6xl'>
          <T k='home.titleLine1' />
          <br />
          <T k='home.titleLine2' />
        </h1>
        <p className='max-w-xl text-base leading-7 text-[var(--color-muted)]'>
          <T k='home.intro' />
        </p>
        <div className='flex flex-wrap gap-2'>
          <Link href={routes.tests}><Button size='lg'><T k='home.startReflection' /></Button></Link>
          <Link href={routes.checkIn}><Button size='lg' variant='secondary'><T k='home.quickCheckIn' /></Button></Link>
        </div>
        <div className='grid gap-3 pt-3 sm:grid-cols-3'>
          <div className='rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4'>
            <p className='text-sm font-semibold text-[var(--color-text-strong)]'><T k='home.featureOneTitle' /></p>
            <p className='mt-1 text-sm text-[var(--color-muted)]'><T k='home.featureOneBody' /></p>
          </div>
          <div className='rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4'>
            <p className='text-sm font-semibold text-[var(--color-text-strong)]'><T k='home.featureTwoTitle' /></p>
            <p className='mt-1 text-sm text-[var(--color-muted)]'><T k='home.featureTwoBody' /></p>
          </div>
          <div className='rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4'>
            <p className='text-sm font-semibold text-[var(--color-text-strong)]'><T k='home.featureThreeTitle' /></p>
            <p className='mt-1 text-sm text-[var(--color-muted)]'><T k='home.featureThreeBody' /></p>
          </div>
        </div>
      </div>

      <div className='grid gap-4'>
        <div className='relative h-64 overflow-hidden rounded-[1.8rem] border border-[var(--color-border)] lg:h-[22rem]'>
          <Image src='/images/hero/home-hero.jpg' alt='Reflective abstract artwork' fill className='object-cover' priority />
          <div className='absolute inset-0 bg-[linear-gradient(140deg,rgba(245,248,251,0.14),rgba(8,15,24,0.38)_65%)]' />
        </div>
        <div className='grid gap-3 sm:grid-cols-[1fr_0.9fr]'>
          <LatestResultTile />
          <div className='rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5'>
            <p className='text-sm text-[var(--color-muted)]'><T k='home.nextMove' /></p>
            <p className='mt-3 text-lg font-semibold text-[var(--color-text-strong)]'><T k='home.nextMoveTitle' /></p>
            <p className='mt-2 text-sm leading-6 text-[var(--color-muted)]'><T k='home.nextMoveBody' /></p>
          </div>
        </div>
      </div>
    </Section>
  );
}

