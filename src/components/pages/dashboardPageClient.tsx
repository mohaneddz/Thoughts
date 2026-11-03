'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/common/emptyState';
import { TrendCard } from '@/components/dashboard/trendCard';
import { CheckInTrendsCard } from '@/components/checkIns/checkInTrendsCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { usePersonalData } from '@/hooks/usePersonalData';
import { DashboardIntro } from '@/sections/dashboard/intro';
import { average, checkInStreak, entriesSince } from '@/utils/checkIns';
import { formatShortDate } from '@/utils/formatting';
import type { TestResultSummary } from '@/types/result';

function latestPerTest(results: TestResultSummary[]) {
  const seen = new Map<string, { latest: TestResultSummary; previous?: TestResultSummary; count: number }>();
  for (const result of results) {
    const entry = seen.get(result.testId);
    if (!entry) seen.set(result.testId, { latest: result, count: 1 });
    else {
      entry.count += 1;
      entry.previous ??= result;
    }
  }
  return [...seen.values()];
}

export function DashboardPageClient() {
  const { checkIns, results, savedThoughts, isReady } = usePersonalData();

  if (!isReady) {
    return <div className='h-96 animate-pulse rounded-[1.6rem] bg-[var(--color-surface-soft)]' aria-busy />;
  }

  if (!checkIns.length && !results.length && !savedThoughts.length) {
    return (
      <div className='space-y-5'>
        <DashboardIntro />
        <EmptyState title='Nothing to analyze yet' description='Take one test or save one check-in and this dashboard will start showing real patterns.' />
        <div className='flex flex-wrap justify-center gap-2'>
          <Link href={routes.checkIn} className={buttonVariants()}>Do a check-in</Link>
          <Link href={routes.tests} className={buttonVariants({ variant: 'secondary' })}>Browse tests</Link>
        </div>
      </div>
    );
  }

  const lastWeek = entriesSince(checkIns, 7);
  const moodAvg = average(lastWeek, 'mood');
  const stressAvg = average(lastWeek, 'stress');
  const streak = checkInStreak(checkIns);
  const perTest = latestPerTest(results);

  return (
    <div className='space-y-5'>
      <DashboardIntro />

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <TrendCard title='Check-in streak' value={streak ? `${streak} day${streak === 1 ? '' : 's'}` : '—'} hint={`${lastWeek.length} check-in${lastWeek.length === 1 ? '' : 's'} this week`} />
        <TrendCard title='Mood, last 7 days' value={moodAvg == null ? '—' : `${moodAvg}/10`} hint='Average of this week' />
        <TrendCard title='Stress, last 7 days' value={stressAvg == null ? '—' : `${stressAvg}/10`} hint='Lower is calmer' />
        <TrendCard title='Saved thoughts' value={`${savedThoughts.length}`} hint={`${results.length} test result${results.length === 1 ? '' : 's'}`} />
      </div>

      {checkIns.length ? <CheckInTrendsCard entries={checkIns} title='How your days have felt' /> : null}

      <div className='grid gap-4 lg:grid-cols-[1.3fr_1fr]'>
        <Card className='space-y-3 p-5'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Latest per test</p>
            <Link href={routes.results} className='text-sm font-semibold text-[var(--color-primary)]'>All results</Link>
          </div>
          {perTest.length ? (
            <ul className='divide-y divide-[var(--color-border)]'>
              {perTest.slice(0, 6).map(({ latest, previous, count }) => {
                const delta = previous && typeof latest.rawScore === 'number' && typeof previous.rawScore === 'number' ? latest.rawScore - previous.rawScore : null;
                return (
                  <li key={latest.testId}>
                    <Link href={routes.result(latest.id)} className='group flex items-center justify-between gap-3 py-2.5'>
                      <span className='min-w-0'>
                        <span className='block truncate text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]'>{latest.testTitle}</span>
                        <span className='block truncate text-xs text-[var(--color-muted)]'>{latest.pattern} · {formatShortDate(latest.createdAt)}</span>
                      </span>
                      <span className='flex shrink-0 items-center gap-2'>
                        {delta !== null && delta !== 0 ? <Badge>{delta > 0 ? '+' : ''}{delta} vs last</Badge> : null}
                        {count > 1 ? <span className='text-xs text-[var(--color-muted)]'>×{count}</span> : null}
                        <ArrowRight size={14} className='text-[var(--color-muted)]' />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className='text-sm text-[var(--color-muted)]'>No tests finished yet.</p>
          )}
        </Card>

        <Card className='space-y-3 p-5'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Recent thoughts</p>
            <Link href={routes.savedThoughts} className='text-sm font-semibold text-[var(--color-primary)]'>All thoughts</Link>
          </div>
          {savedThoughts.length ? (
            <ul className='space-y-3'>
              {savedThoughts.slice(0, 4).map((thought) => (
                <li key={thought.id} className='space-y-0.5'>
                  <p className='truncate text-sm font-semibold text-[var(--color-text)]'>{thought.title}</p>
                  <p className='line-clamp-2 text-xs text-[var(--color-muted)]'>{thought.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-[var(--color-muted)]'>Save a takeaway from a result or a tool and it lands here.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
