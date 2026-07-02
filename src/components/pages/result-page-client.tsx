'use client';

import Link from 'next/link';
import { ArrowRight, BookmarkPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { testsData } from '@/data/tests';
import { ResultsIntro } from '@/sections/results/intro';
import { ResultSummaryCard } from '@/components/results/result-summary-card';
import { ScoreChart } from '@/components/results/score-chart';
import { InsightCard } from '@/components/results/insight-card';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { useResults } from '@/hooks/use-results';
import { usePersonalData } from '@/hooks/use-personal-data';

export function ResultPageClient({ resultId }: { resultId: string }) {
  const result = useResults(resultId);
  const { saveThought } = usePersonalData();
  const [saved, setSaved] = useState(false);

  const retakeSlug = useMemo(() => {
    return testsData.find((item) => item.id === result.testId)?.slug ?? 'emotional-awareness-test';
  }, [result.testId]);

  return (
    <div className='space-y-5'>
      <ResultsIntro />
      <div className='grid gap-4 lg:grid-cols-[1.1fr_1fr]'>
        <ResultSummaryCard result={result} />
        <ScoreChart score={result.score} patterns={result.keyPatterns} />
      </div>

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <InsightCard title='Top strengths'>
          <ul className='space-y-2 text-sm'>{result.strengths.map((item) => <li key={item}>• {item}</li>)}</ul>
        </InsightCard>
        <InsightCard title='Growth areas'>
          <ul className='space-y-2 text-sm'>{result.growthAreas.map((item) => <li key={item}>• {item}</li>)}</ul>
        </InsightCard>
        <InsightCard title='What this might mean'>{result.meaning}</InsightCard>
        <InsightCard title='What this does not mean'>
          <ul className='space-y-2 text-sm'>{result.nonMeaning.map((item) => <li key={item}>• {item}</li>)}</ul>
        </InsightCard>
      </section>

      <section className='grid gap-3 md:grid-cols-3'>
        <Link href={`${routes.aiInterpreter}?resultId=${result.id}`}>
          <Button className='w-full justify-between'>
            Ask AI to interpret this
            <ArrowRight size={14} />
          </Button>
        </Link>
        <Button
          variant='secondary'
          className='w-full justify-between'
          onClick={() => {
            saveThought({
              id: `thought-${Date.now()}`,
              userId: 'local-user',
              title: `${result.testTitle} takeaway`,
              content: result.meaning,
              sourceType: 'result',
              sourceId: result.id,
              tags: result.growthAreas.slice(0, 2).map((item) => item.toLowerCase()),
              createdAt: new Date().toISOString(),
            });
            setSaved(true);
          }}
        >
          {saved ? 'Saved to thoughts' : 'Save to thoughts'}
          <BookmarkPlus size={14} />
        </Button>
        <Link href={routes.test(retakeSlug)}>
          <Button variant='secondary' className='w-full'>Retake later</Button>
        </Link>
      </section>

      <p className='text-center text-xs text-[var(--color-muted)]'>Results are for personal insight, not diagnosis.</p>
    </div>
  );
}
