'use client';

import { cn } from '@/utils/cn';
import type { ChoiceOption } from '@/types/test';

export function SingleChoiceQuestion({
  options,
  selected,
  onSelect,
}: {
  options: ChoiceOption[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className='space-y-2'>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={cn(
            'flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition',
            selected === option.value
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40',
          )}
        >
          <span>
            <span>{option.label}</span>
            {option.helperText ? <span className='block text-xs text-[var(--color-muted)]'>{option.helperText}</span> : null}
          </span>
          <span className='h-4 w-4 rounded-full border border-[var(--color-border)]' />
        </button>
      ))}
    </div>
  );
}
