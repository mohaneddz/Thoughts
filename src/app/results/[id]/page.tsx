import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/common/app-shell';
import { sampleResult } from '@/data/tests';
import { ResultsIntro } from '@/sections/results/intro';
import { ResultSummaryCard } from '@/components/results/result-summary-card';
import { ScoreChart } from '@/components/results/score-chart';
import { InsightCard } from '@/components/results/insight-card';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = { ...sampleResult, id };

  return (
    <AppShell className='space-y-5'>
      <ResultsIntro />
      <div className='grid gap-4 lg:grid-cols-[1.1fr_1fr]'>
        <ResultSummaryCard result={result} />
        <ScoreChart score={result.score} patterns={result.keyPatterns} />
      </div>

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <InsightCard title='Top strengths'>
          <ul className='space-y-1'>{result.strengths.map((item) => <li key={item}>� {item}</li>)}</ul>
        </InsightCard>
        <InsightCard title='Growth areas'>
          <ul className='space-y-1'>{result.growthAreas.map((item) => <li key={item}>� {item}</li>)}</ul>
        </InsightCard>
        <InsightCard title='What this might mean'>{result.meaning}</InsightCard>
        <InsightCard title='What this does not mean'>
          <ul className='space-y-1'>{result.nonMeaning.map((item) => <li key={item}>� {item}</li>)}</ul>
        </InsightCard>
      </section>

      <section className='grid gap-3 md:grid-cols-3'>
        <Link href={`${routes.aiInterpreter}?resultId=${result.id}`}><Button className='w-full justify-between'>Ask AI to interpret this <ArrowRight size={14} /></Button></Link>
        <Button variant='secondary' className='w-full'>Save to Thoughts</Button>
        <Link href={routes.test('emotional-awareness-test')}><Button variant='secondary' className='w-full'>Retake later</Button></Link>
      </section>

      <p className='text-center text-xs text-[var(--color-muted)]'>Results are for personal insight, not diagnosis.</p>
    </AppShell>
  );
}
