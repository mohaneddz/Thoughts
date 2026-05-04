import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]',
        className,
      )}
      {...props}
    />
  );
}

