'use client';

import { cn } from '@/utils/cn';
import type { ChoiceOption } from '@/types/test';

export function MultiSelectQuestion({
  options,
  selected,
  onToggle,
}: {
  options: ChoiceOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className='space-y-2'>
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => onToggle(option.value)}
            className={cn(
              'click flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition',
              active
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40',
            )}
          >
            <span>{option.label}</span>
            <span className={cn('h-4 w-4 rounded border', active ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-border)]')} />
          </button>
        );
      })}
    </div>
  );
}
