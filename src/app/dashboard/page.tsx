import { AppShell } from '@/components/common/app-shell';
import { TrendCard } from '@/components/dashboard/trend-card';
import { sampleCheckIns } from '@/data/tests';
import { DashboardIntro } from '@/sections/dashboard/intro';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const moodAvg = Math.round((sampleCheckIns.reduce((sum, item) => sum + item.mood, 0) / sampleCheckIns.length) * 10) / 10;
  const stressAvg = Math.round((sampleCheckIns.reduce((sum, item) => sum + item.stress, 0) / sampleCheckIns.length) * 10) / 10;

  return (
    <AppShell className='space-y-5'>
      <DashboardIntro />
      <div className='grid gap-4 md:grid-cols-3'>
        <TrendCard title='Average mood' value={`${moodAvg}/10`} />
        <TrendCard title='Average stress' value={`${stressAvg}/10`} />
        <TrendCard title='Recent results' value='3' />
      </div>
      <Card>
        <h2 className='font-heading text-3xl'>AI weekly reflection</h2>
        <p className='mt-2 text-sm text-[var(--color-muted)]'>When enough data is available, this area will summarize your recurring patterns and useful next steps.</p>
      </Card>
    </AppShell>
  );
}

