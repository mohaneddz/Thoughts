'use client';

import Link from 'next/link';
import { ArrowRight, BookmarkCheck, BookmarkPlus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { testsData } from '@/data/tests';
import { ResultsIntro } from '@/sections/results/intro';
import { ResultSummaryCard } from '@/components/results/resultSummaryCard';
import { ScoreScaleCard } from '@/components/results/scoreScaleCard';
import { ScoreHistoryCard } from '@/components/results/scoreHistoryCard';
import { InsightCard } from '@/components/results/insightCard';
import { CrisisResourceCard } from '@/components/results/crisisResourceCard';
import { DomainBreakdownCard } from '@/components/results/domainBreakdownCard';
import { EmptyState } from '@/components/common/emptyState';
import { Button, buttonVariants } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { useResult } from '@/hooks/useResults';
import { usePersonalData } from '@/hooks/usePersonalData';
import { cn } from '@/utils/cn';

export function ResultPageClient({ resultId }: { resultId: string }) {
  const { result, isReady } = useResult(resultId);
  const { results, saveThought } = usePersonalData();
  const [saved, setSaved] = useState(false);

  if (!isReady) {
    return <div className='h-96 animate-pulse rounded-[1.6rem] bg-[var(--color-surface-soft)]' aria-busy />;
  }

  if (!result) {
    return (
      <div className='space-y-4'>
        <EmptyState
          title='This result is not on this device'
          description='Results live only in the browser that created them. It may have been erased, or the link came from another device.'
        />
        <div className='flex justify-center'>
          <Link href={routes.results} className={buttonVariants({ variant: 'secondary' })}>
            See your saved results
          </Link>
        </div>
      </div>
    );
  }

  const test = testsData.find((item) => item.id === result.testId);
  const direction = result.higherIs ?? test?.scoring.higherIs ?? 'neutral';
  const isTraitProfile = direction === 'neutral' && Boolean(result.domains?.length);
  const showScale = typeof result.rawScore === 'number' && !isTraitProfile && test?.slug !== 'mdq';
  const attempts = results.filter((item) => item.testId === result.testId);

  const saveTakeaway = () => {
    saveThought({
      id: `thought-${Date.now()}`,
      userId: 'local-user',
      title: `${result.testTitle}: ${result.pattern}`,
      content: result.meaning,
      sourceType: 'result',
      sourceId: result.id,
      tags: [test?.category.toLowerCase() ?? 'result'],
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
  };

  return (
    <div className='space-y-5'>
      <ResultsIntro />
      {result.crisisSignal ? <CrisisResourceCard signal={result.crisisSignal} /> : null}

      <div className={cn('grid gap-4', showScale && 'lg:grid-cols-[1.1fr_1fr]')}>
        <ResultSummaryCard result={result} />
        {showScale ? (
          <ScoreScaleCard
            rawScore={result.rawScore!}
            minScore={result.minScore ?? 0}
            maxScore={result.maxScore ?? 0}
            band={result.band}
            bands={test?.scoring.cutoffBands}
            direction={direction}
          />
        ) : null}
      </div>

      {result.domains?.length ? <DomainBreakdownCard domains={result.domains} direction={direction} /> : null}

      <ScoreHistoryCard attempts={attempts} currentId={result.id} />

      <section className='grid gap-4 md:grid-cols-3'>
        <InsightCard title={isTraitProfile ? 'Most pronounced' : 'What stands out'}>
          <ul className='space-y-2 text-sm'>{result.strengths.map((item) => <li key={item}>• {item}</li>)}</ul>
        </InsightCard>
        <InsightCard title={isTraitProfile ? 'Least pronounced' : 'Worth trying next'}>
          <ul className='space-y-2 text-sm'>{result.growthAreas.map((item) => <li key={item}>• {item}</li>)}</ul>
        </InsightCard>
        <InsightCard title='What this does not mean'>
          <ul className='space-y-2 text-sm'>{result.nonMeaning.map((item) => <li key={item}>• {item}</li>)}</ul>
        </InsightCard>
      </section>

      <section className='grid gap-3 md:grid-cols-3'>
        <Link href={`${routes.aiInterpreter}?resultId=${result.id}`} className={cn(buttonVariants(), 'w-full justify-between')}>
          Ask AI to interpret this
          <ArrowRight size={14} />
        </Link>
        <Button variant='secondary' className='w-full justify-between' onClick={saveTakeaway} disabled={saved}>
          {saved ? 'Saved to your thoughts' : 'Save takeaway to your thoughts'}
          {saved ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
        </Button>
        {test ? (
          <Link href={routes.test(test.slug)} className={cn(buttonVariants({ variant: 'secondary' }), 'w-full justify-between')}>
            Take it again
            <RotateCcw size={14} />
          </Link>
        ) : null}
      </section>

      <p className='text-center text-xs text-[var(--color-muted)]'>Results are for personal insight, not diagnosis.</p>
    </div>
  );
}
