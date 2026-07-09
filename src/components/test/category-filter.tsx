'use client';

import { cn } from '@/utils/cn';

export function CategoryFilter({
  categories,
  active,
  onSelect,
  label,
  mode = 'select',
}: {
  categories: string[];
  active: string;
  onSelect: (value: string) => void;
  label?: string;
  mode?: 'select' | 'chips';
}) {
  const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

  return (
    <div className='flex flex-col gap-1.5'>
      {label && <span className='text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>{label}</span>}
      {mode === 'chips' ? (
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => {
            const isActive = category === active;

            return (
              <button
                key={category}
                type='button'
                onClick={() => onSelect(category)}
                className={cn(
                  'rounded-full border px-3.5 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30',
                  isActive
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[0_12px_28px_rgba(27,94,107,0.18)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]/35 hover:bg-[var(--color-surface-soft)]',
                )}
                aria-pressed={isActive}
              >
                {formatLabel(category)}
              </button>
            );
          })}
        </div>
      ) : (
        <select
          value={active}
          onChange={(e) => onSelect(e.target.value)}
          className={cn(
            'h-11 w-full min-w-[120px] rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-sm text-[var(--color-text)] transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30',
          )}
        >
          {categories.map((category) => (
            <option key={category} value={category} className='bg-[var(--color-background)] text-[var(--color-text)]'>
              {formatLabel(category)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
