'use client';

import { cn } from '@/utils/cn';

export function CategoryFilter({
  categories,
  active,
  onSelect,
  label,
}: {
  categories: string[];
  active: string;
  onSelect: (value: string) => void;
  label?: string;
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      {label && <span className='text-xs font-medium text-[var(--color-muted)]'>{label}</span>}
      <select
        value={active}
        onChange={(e) => onSelect(e.target.value)}
        className={cn(
          'h-11 w-full min-w-[120px] rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-sm transition focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]',
        )}
      >
        {categories.map((category) => (
          <option key={category} value={category} className='bg-[var(--color-background)] text-[var(--color-text)]'>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
