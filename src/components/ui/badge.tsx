import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-muted)]',
        className,
      )}
      {...props}
    />
  );
}

