'use client';

import { EmptyState } from '@/components/common/empty-state';
import { TrendCard } from '@/components/dashboard/trend-card';
import { usePersonalData } from '@/hooks/use-personal-data';
import { DashboardIntro } from '@/sections/dashboard/intro';
import { Card } from '@/components/ui/card';

export function DashboardPageClient() {
  const { checkIns, results, savedThoughts } = usePersonalData();

  const moodAvg = checkIns.length
    ? Math.round((checkIns.reduce((sum, item) => sum + item.mood, 0) / checkIns.length) * 10) / 10
    : null;
  const stressAvg = checkIns.length
    ? Math.round((checkIns.reduce((sum, item) => sum + item.stress, 0) / checkIns.length) * 10) / 10
    : null;
  const latestResult = results[0];

  return (
    <div className='space-y-5'>
      <DashboardIntro />
      <div className='grid gap-4 md:grid-cols-3'>
        <TrendCard title='Average mood' value={moodAvg == null ? 'No data' : `${moodAvg}/10`} />
        <TrendCard title='Average stress' value={stressAvg == null ? 'No data' : `${stressAvg}/10`} />
        <TrendCard title='Saved insights' value={`${savedThoughts.length}`} />
      </div>

      {latestResult ? (
        <Card className='space-y-3 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
          <h2 className='font-heading text-3xl'>Latest pattern</h2>
          <p className='text-sm text-[var(--color-muted)]'>
            {latestResult.testTitle}: {latestResult.pattern}
          </p>
          <p className='text-sm text-[var(--color-muted)]'>{latestResult.meaning}</p>
        </Card>
      ) : (
        <EmptyState
          title='Nothing to analyze yet'
          description='Take one reflection or save one check-in and this dashboard will start showing real patterns.'
        />
      )}
    </div>
  );
}
