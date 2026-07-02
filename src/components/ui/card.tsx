import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[1.6rem] border border-[var(--color-panel-border)] bg-[var(--color-panel)] p-4 shadow-[var(--shadow-card)]',
        className,
      )}
      {...props}
    />
  );
}

