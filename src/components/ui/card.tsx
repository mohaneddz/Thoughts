import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-4 shadow-[var(--shadow-card)]',
        className,
      )}
      {...props}
    />
  );
}

