'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { AppShell } from '@/components/common/appShell';
import { CheckInForm, type CheckInValues } from '@/components/forms/checkInForm';
import { CheckInTrendsCard } from '@/components/checkIns/checkInTrendsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePersonalData } from '@/hooks/usePersonalData';
import { checkInDimensions, checkInStreak, reflectOnCheckIn } from '@/utils/checkIns';
import { formatDateTime } from '@/utils/formatting';

export function CheckInPageClient() {
  const { checkIns, saveCheckIn, deleteCheckIn, saveThought, isReady } = usePersonalData();
  const [reflection, setReflection] = useState<ReturnType<typeof reflectOnCheckIn> | null>(null);
  const [showAll, setShowAll] = useState(false);
  const streak = checkInStreak(checkIns);

  const onSubmit = ({ note, ...scores }: CheckInValues) => {
    const id = `check-in-${Date.now()}`;
    const createdAt = new Date().toISOString();
    saveCheckIn({ id, ...scores, note: note.trim() || undefined, createdAt });
    const next = reflectOnCheckIn(scores);
    setReflection(next);
    if (note.trim()) {
      saveThought({
        id: `thought-${Date.now()}`,
        userId: 'local-user',
        title: `Check-in note · ${formatDateTime(createdAt)}`,
        content: note.trim(),
        sourceType: 'check-in',
        sourceId: id,
        tags: ['check-in'],
        createdAt,
      });
    }
  };

  const visible = showAll ? checkIns : checkIns.slice(0, 6);

  return (
    <AppShell className='space-y-5'>
      <section className='flex flex-wrap items-end justify-between gap-3'>
        <div className='space-y-2'>
          <h1 className='font-heading text-5xl text-[var(--color-text-strong)]'>Check-in</h1>
          <p className='max-w-2xl text-[var(--color-muted)]'>A thirty-second snapshot. Do it daily and the trends start to say something.</p>
        </div>
        {isReady && streak > 0 ? (
          <p className='rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-muted)]'>
            <span className='font-semibold text-[var(--color-text-strong)]'>{streak}-day</span> streak
          </p>
        ) : null}
      </section>

      <CheckInForm onSubmit={onSubmit} />

      {reflection ? (
        <Card className='space-y-2 border-[var(--color-primary)]/30 p-5' aria-live='polite'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]'>Saved · your read</p>
          <h2 className='font-heading text-2xl text-[var(--color-text-strong)]'>{reflection.headline}</h2>
          <p className='text-sm text-[var(--color-muted)]'>{reflection.detail}</p>
          <p className='text-sm text-[var(--color-text)]'>
            <span className='font-semibold'>Tiny action:</span> {reflection.action}
          </p>
        </Card>
      ) : null}

      {isReady && checkIns.length ? (
        <>
          <CheckInTrendsCard entries={checkIns} />
          <Card className='space-y-3 p-5'>
            <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>History</p>
            <ul className='divide-y divide-[var(--color-border)]'>
              {visible.map((entry) => (
                <li key={entry.id} className='flex flex-wrap items-center gap-x-4 gap-y-2 py-3'>
                  <span className='w-32 shrink-0 text-sm text-[var(--color-muted)]'>{formatDateTime(entry.createdAt)}</span>
                  <span className='flex flex-1 flex-wrap gap-1.5'>
                    {checkInDimensions.map((dimension) => (
                      <span key={dimension.key} className='rounded-full bg-[var(--color-surface-soft)] px-2 py-0.5 text-xs text-[var(--color-muted)]' title={dimension.label}>
                        {dimension.label} <span className='font-semibold text-[var(--color-text)]'>{entry[dimension.key]}</span>
                      </span>
                    ))}
                    {entry.note ? <span className='basis-full text-sm text-[var(--color-text)]'>{entry.note}</span> : null}
                  </span>
                  <Button size='sm' variant='ghost' aria-label={`Delete check-in from ${formatDateTime(entry.createdAt)}`} onClick={() => deleteCheckIn(entry.id)}>
                    <Trash2 size={14} />
                  </Button>
                </li>
              ))}
            </ul>
            {checkIns.length > 6 ? (
              <Button variant='ghost' size='sm' onClick={() => setShowAll((value) => !value)}>
                {showAll ? 'Show fewer' : `Show all ${checkIns.length}`}
              </Button>
            ) : null}
          </Card>
        </>
      ) : null}
    </AppShell>
  );
}
