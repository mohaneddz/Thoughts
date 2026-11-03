'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import type { ScoreDirection, SeverityBand } from '@/types/test';

const scaleColors = ['var(--color-scale-1)', 'var(--color-scale-2)', 'var(--color-scale-3)', 'var(--color-scale-4)', 'var(--color-scale-5)'];

/** Spreads the five-step palette across however many bands a test has, calm end first. */
function bandColor(index: number, count: number, direction: ScoreDirection) {
  const position = count <= 1 ? 0 : index / (count - 1);
  const oriented = direction === 'better' ? 1 - position : position;
  return scaleColors[Math.round(oriented * (scaleColors.length - 1))];
}

const directionCopy: Record<ScoreDirection, string> = {
  worse: 'Higher scores mean more strain or symptoms.',
  better: 'Higher scores mean more well-being.',
  neutral: 'Neither end of this scale is better — it describes a tendency.',
};

export function ScoreScaleCard({
  rawScore,
  minScore,
  maxScore,
  band,
  bands,
  direction,
}: {
  rawScore: number;
  minScore: number;
  maxScore: number;
  band?: SeverityBand;
  bands?: SeverityBand[];
  direction: ScoreDirection;
}) {
  const usableBands = (bands ?? []).filter((item) => item.max > item.min || item.max === item.min);
  const span = Math.max(maxScore - minScore, 1);
  const markerPercent = ((Math.min(Math.max(rawScore, minScore), maxScore) - minScore) / span) * 100;
  const [focusedLabel, setFocusedLabel] = useState(band?.label);
  const focused = usableBands.find((item) => item.label === focusedLabel) ?? band;

  return (
    <Card className='space-y-5 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h3 className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Where your score sits</h3>
          <p className='mt-1 text-sm text-[var(--color-muted)]'>{directionCopy[direction]}</p>
        </div>
        <p className='shrink-0 text-end'>
          <span className='font-heading text-4xl text-[var(--color-text-strong)]'>{rawScore}</span>
          <span className='text-sm text-[var(--color-muted)]'> / {maxScore}</span>
        </p>
      </div>

      <div className='relative pt-6' dir='ltr'>
        <div
          className='absolute top-0 -translate-x-1/2 text-[var(--color-text-strong)] transition-[left] duration-500'
          style={{ left: `${markerPercent}%` }}
          aria-hidden
        >
          <span className='block h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-current' />
        </div>

        {usableBands.length ? (
          <div className='flex h-4 overflow-hidden rounded-full' role='list' aria-label='Score ranges'>
            {usableBands.map((item, index) => {
              const width = ((item.max - item.min + 1) / (span + 1)) * 100;
              return (
                <button
                  key={item.label}
                  type='button'
                  role='listitem'
                  aria-label={`${item.label}: ${item.min} to ${item.max}`}
                  aria-current={item.label === band?.label}
                  onClick={() => setFocusedLabel(item.label)}
                  onMouseEnter={() => setFocusedLabel(item.label)}
                  onFocus={() => setFocusedLabel(item.label)}
                  className={cn(
                    'h-full border-e border-[var(--color-panel)] transition-opacity last:border-e-0',
                    focused && item.label !== focused.label && 'opacity-45',
                  )}
                  style={{ width: `${width}%`, backgroundColor: bandColor(index, usableBands.length, direction) }}
                />
              );
            })}
          </div>
        ) : (
          <div
            className='h-4 rounded-full'
            style={{
              background:
                direction === 'neutral'
                  ? 'linear-gradient(90deg, var(--color-surface-soft), var(--color-primary))'
                  : `linear-gradient(90deg, ${direction === 'worse' ? 'var(--color-scale-1), var(--color-scale-3), var(--color-scale-5)' : 'var(--color-scale-5), var(--color-scale-3), var(--color-scale-1)'})`,
            }}
          />
        )}

        <div className='mt-1.5 flex justify-between text-xs text-[var(--color-muted)]'>
          <span>{minScore}</span>
          <span>{maxScore}</span>
        </div>
      </div>

      {focused ? (
        <div className='rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm'>
          <p className='font-semibold text-[var(--color-text-strong)]'>
            {focused.label}
            {focused.max > focused.min ? <span className='font-normal text-[var(--color-muted)]'> · {focused.min}–{focused.max}</span> : null}
            {focused.label === band?.label ? <span className='ms-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]'>you</span> : null}
          </p>
          {focused.description ? <p className='mt-1 text-[var(--color-muted)]'>Scores here suggest {focused.description}.</p> : null}
        </div>
      ) : null}
    </Card>
  );
}
