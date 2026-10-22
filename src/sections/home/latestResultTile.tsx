'use client';

import Link from 'next/link';
import { routes } from '@/config/routes';
import { usePersonalData } from '@/hooks/usePersonalData';
import { formatShortDate } from '@/utils/formatting';

export function LatestResultTile() {
  const { results, checkIns, isReady } = usePersonalData();
  const latest = results[0];

  if (!isReady) {
    return <div className='h-full min-h-36 animate-pulse rounded-[1.5rem] bg-[var(--color-surface-soft)]' />;
  }

  if (!latest) {
    return (
      <div className='rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5'>
        <p className='text-sm text-[var(--color-muted)]'>Your latest result</p>
        <h2 className='mt-2 font-heading text-3xl text-[var(--color-text-strong)]'>Nothing yet</h2>
        <p className='mt-2 text-sm leading-6 text-[var(--color-muted)]'>
          Your first finished test shows up here. The WHO-5 takes about three minutes.
        </p>
        <Link href={routes.test('who-5-well-being-index')} className='mt-3 inline-block text-sm font-semibold text-[var(--color-primary)] underline'>
          Start the WHO-5
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={routes.result(latest.id)}
      className='block rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-primary)]/50'
    >
      <p className='text-sm text-[var(--color-muted)]'>
        Your latest result · {formatShortDate(latest.createdAt)}
      </p>
      <h2 className='mt-2 font-heading text-3xl leading-tight text-[var(--color-text-strong)]'>{latest.pattern}</h2>
      <p className='mt-2 text-sm leading-6 text-[var(--color-muted)]'>
        {latest.testTitle}
        {checkIns.length ? ` · ${checkIns.length} check-in${checkIns.length === 1 ? '' : 's'} logged` : ''}
      </p>
    </Link>
  );
}
