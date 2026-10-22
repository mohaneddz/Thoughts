'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { LineChart } from '@/components/charts/lineChart';
import { routes } from '@/config/routes';
import { formatShortDate } from '@/utils/formatting';
import type { TestResultSummary } from '@/types/result';

/** Shows how the same test's score moved across attempts. Needs at least two attempts with a raw score. */
export function ScoreHistoryCard({ attempts, currentId }: { attempts: TestResultSummary[]; currentId: string }) {
  const chronological = attempts
    .filter((attempt) => typeof attempt.rawScore === 'number')
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));

  if (chronological.length < 2) return null;

  const first = chronological[0];
  const latest = chronological[chronological.length - 1];
  const delta = latest.rawScore! - first.rawScore!;
  const direction = latest.higherIs ?? 'neutral';
  const improving = direction === 'neutral' || delta === 0 ? undefined : direction === 'better' ? delta > 0 : delta < 0;

  return (
    <Card className='space-y-4 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
      <div className='flex flex-wrap items-baseline justify-between gap-2'>
        <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>
          Across {chronological.length} attempts
        </p>
        <p className='text-sm text-[var(--color-muted)]'>
          {delta === 0 ? 'No change' : `${delta > 0 ? '+' : ''}${delta} since ${formatShortDate(first.createdAt)}`}
          {improving === true ? ' · moving in a good direction' : improving === false ? ' · worth keeping an eye on' : ''}
        </p>
      </div>
      <LineChart
        labels={chronological.map((attempt) => formatShortDate(attempt.createdAt))}
        series={[{ id: 'score', label: 'Score', color: 'var(--color-primary)', values: chronological.map((attempt) => attempt.rawScore!) }]}
        yMin={latest.minScore ?? 0}
        yMax={latest.maxScore ?? Math.max(...chronological.map((attempt) => attempt.rawScore!))}
      />
      <div className='flex flex-wrap gap-2 text-xs'>
        {chronological.map((attempt) => (
          <Link
            key={attempt.id}
            href={routes.result(attempt.id)}
            aria-current={attempt.id === currentId}
            className='rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[var(--color-muted)] transition hover:border-[var(--color-primary)] aria-[current=true]:border-[var(--color-primary)] aria-[current=true]:text-[var(--color-text-strong)]'
          >
            {formatShortDate(attempt.createdAt)} · {attempt.rawScore}
          </Link>
        ))}
      </div>
    </Card>
  );
}
