'use client';

import { cn } from '@/utils/cn';

export function ChipGroup({
  options,
  selected,
  onToggle,
  label,
  multiple = true,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  label: string;
  multiple?: boolean;
}) {
  return (
    <div role={multiple ? 'group' : 'radiogroup'} aria-label={label} className='flex flex-wrap gap-2'>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type='button'
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={active}
            onClick={() => onToggle(option)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm transition',
              active
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-surface)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]/50',
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
