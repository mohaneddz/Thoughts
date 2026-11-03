'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import type { DomainResult } from '@/types/result';
import type { ScoreDirection } from '@/types/test';

function domainPercent(domain: DomainResult) {
  if (typeof domain.percent === 'number') return domain.percent;
  return domain.maxScore > 0 ? Math.round((domain.score / domain.maxScore) * 100) : 0;
}

function levelLabel(percent: number) {
  if (percent < 34) return 'Lower';
  if (percent < 67) return 'Moderate';
  return 'Higher';
}

function DomainBar({ domain, direction, compact = false }: { domain: DomainResult; direction: ScoreDirection; compact?: boolean }) {
  const percent = domainPercent(domain);
  const barColor =
    direction === 'neutral'
      ? 'var(--color-primary)'
      : (direction === 'worse' ? percent : 100 - percent) >= 67
        ? 'var(--color-scale-5)'
        : (direction === 'worse' ? percent : 100 - percent) >= 34
          ? 'var(--color-scale-3)'
          : 'var(--color-scale-1)';

  return (
    <div className='space-y-1.5'>
      <div className='flex items-baseline justify-between gap-3'>
        <p className={cn('text-[var(--color-text-strong)]', compact ? 'text-sm' : 'text-sm font-semibold')}>{domain.label}</p>
        <div className='flex shrink-0 items-center gap-2'>
          {domain.band ? <Badge>{domain.band.label}</Badge> : direction === 'neutral' ? <span className='text-xs text-[var(--color-muted)]'>{levelLabel(percent)}</span> : null}
          <span className='w-16 text-right text-xs tabular-nums text-[var(--color-muted)]'>
            {domain.score} / {domain.maxScore}
          </span>
        </div>
      </div>
      <div className={cn('rounded-full bg-[var(--color-surface-soft)]', compact ? 'h-1.5' : 'h-2.5')}>
        <div
          className={cn('rounded-full transition-[width] duration-700', compact ? 'h-1.5' : 'h-2.5')}
          style={{ width: `${Math.max(percent, 2)}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

export function DomainBreakdownCard({ domains, direction = 'worse' }: { domains: DomainResult[]; direction?: ScoreDirection }) {
  const topLevel = domains.filter((domain) => !domain.parentId);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Card className='space-y-4 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
      <div className='flex flex-wrap items-baseline justify-between gap-2'>
        <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>
          {direction === 'neutral' ? 'Trait profile' : 'Subscale breakdown'}
        </p>
        {direction === 'neutral' ? (
          <p className='text-xs text-[var(--color-muted)]'>Bars show your position within each scale&apos;s own range, not a comparison with others.</p>
        ) : null}
      </div>

      <div className='space-y-4'>
        {topLevel.map((domain) => {
          const facets = domains.filter((item) => item.parentId === domain.id);
          const isOpen = openId === domain.id;

          return (
            <div key={domain.id} className='space-y-3'>
              <DomainBar domain={domain} direction={direction} />
              {facets.length ? (
                <>
                  <button
                    type='button'
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : domain.id)}
                    className='inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)]'
                  >
                    {isOpen ? 'Hide' : 'Show'} {facets.length} facets
                    <ChevronDown size={14} className={cn('transition-transform', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen ? (
                    <div className='grid gap-3 border-l-2 border-[var(--color-border)] pl-4 sm:grid-cols-2'>
                      {facets.map((facet) => (
                        <DomainBar key={facet.id} domain={facet} direction={direction} compact />
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
