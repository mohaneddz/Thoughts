'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/common/emptyState';
import { routes } from '@/config/routes';
import { usePersonalData } from '@/hooks/usePersonalData';
import { formatDateTime } from '@/utils/formatting';
import type { TestResultSummary } from '@/types/result';

function groupByTest(results: TestResultSummary[]) {
  const groups = new Map<string, TestResultSummary[]>();
  for (const result of results) {
    groups.set(result.testId, [...(groups.get(result.testId) ?? []), result]);
  }
  return [...groups.values()];
}

export function ResultsHistoryPageClient() {
  const { results, isReady, deleteResult } = usePersonalData();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  if (!isReady) {
    return <div className='h-64 animate-pulse rounded-[1.6rem] bg-[var(--color-surface-soft)]' aria-busy />;
  }

  if (!results.length) {
    return (
      <div className='space-y-4'>
        <EmptyState title='No results yet' description='Finish any test and it will show up here, along with how your score changes if you retake it.' />
        <div className='flex justify-center'>
          <Link href={routes.tests} className={buttonVariants()}>Browse tests</Link>
        </div>
      </div>
    );
  }

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {groupByTest(results).map((attempts) => (
        <Card key={attempts[0].testId} className='space-y-3'>
          <div className='flex items-baseline justify-between gap-3'>
            <h2 className='font-heading text-2xl text-[var(--color-text-strong)]'>{attempts[0].testTitle}</h2>
            <Badge>{attempts.length} {attempts.length === 1 ? 'attempt' : 'attempts'}</Badge>
          </div>
          <ul className='divide-y divide-[var(--color-border)]'>
            {attempts.map((attempt) => (
              <li key={attempt.id} className='flex items-center gap-2 py-2'>
                <Link href={routes.result(attempt.id)} className='group flex min-w-0 flex-1 items-center justify-between gap-3'>
                  <span className='min-w-0'>
                    <span className='block truncate text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]'>{attempt.pattern}</span>
                    <span className='text-xs text-[var(--color-muted)]'>{formatDateTime(attempt.createdAt)}</span>
                  </span>
                  <span className='flex shrink-0 items-center gap-1 text-sm tabular-nums text-[var(--color-muted)]'>
                    {typeof attempt.rawScore === 'number' ? `${attempt.rawScore}/${attempt.maxScore}` : null}
                    <ChevronRight size={14} />
                  </span>
                </Link>
                {pendingDelete === attempt.id ? (
                  <span className='flex shrink-0 gap-1'>
                    <Button size='sm' variant='secondary' onClick={() => { deleteResult(attempt.id); setPendingDelete(null); }}>
                      Delete
                    </Button>
                    <Button size='sm' variant='ghost' onClick={() => setPendingDelete(null)}>Keep</Button>
                  </span>
                ) : (
                  <Button size='sm' variant='ghost' aria-label={`Delete result from ${formatDateTime(attempt.createdAt)}`} onClick={() => setPendingDelete(attempt.id)}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
