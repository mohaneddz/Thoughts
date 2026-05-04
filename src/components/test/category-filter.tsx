'use client';

import { cn } from '@/utils/cn';

export function CategoryFilter({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs transition',
            active === category
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
              : 'border-[var(--color-border)] text-[var(--color-muted)]',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

