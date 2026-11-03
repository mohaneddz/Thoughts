'use client';

import { crisisRegions } from '@/data/crisisResources';
import { useCrisisRegion } from '@/hooks/useCrisisRegion';
import { cn } from '@/utils/cn';

export function CrisisResourceList({ className }: { className?: string }) {
  const { region, setRegion } = useCrisisRegion();

  return (
    <div className={cn('space-y-3 rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text)]', className)}>
      <label className='flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]'>
        Showing help for
        <select
          value={region.code}
          onChange={(event) => setRegion(event.target.value)}
          className='rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs font-semibold text-[var(--color-text)]'
        >
          {crisisRegions.map((option) => (
            <option key={option.code} value={option.code}>{option.label}</option>
          ))}
        </select>
      </label>
      <ul className='space-y-2'>
        {region.resources.map((resource) => (
          <li key={resource.label}>
            {resource.href ? (
              <a href={resource.href} className='font-semibold text-[var(--color-primary)] underline'>{resource.label}</a>
            ) : (
              <span className='font-semibold text-[var(--color-text-strong)]'>{resource.label}</span>
            )}
            : {resource.detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One-line version for tight spots. */
export function CrisisShortLine() {
  const { region } = useCrisisRegion();
  return <>If you are feeling unsafe now: {region.short}</>;
}
