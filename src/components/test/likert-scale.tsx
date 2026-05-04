'use client';

import { cn } from '@/utils/cn';

export function LikertScale({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className='space-y-2'>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={cn(
            'flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition',
            selected === option
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40',
          )}
        >
          <span>{option}</span>
          <span className='h-4 w-4 rounded-full border border-[var(--color-border)]' />
        </button>
      ))}
    </div>
  );
}

