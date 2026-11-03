'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

export function SearchInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <Search size={18} className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]' />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder='Search by test name, topic, or mood...'
        className='h-12 rounded-full border-[var(--color-panel-border)] bg-[var(--color-surface)] pl-11 pr-11 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]'
      />
      {value ? (
        <button
          type='button'
          onClick={() => onChange('')}
          className='absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-muted)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-strong)]'
          aria-label='Clear search'
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}

