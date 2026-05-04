import Link from 'next/link';
import { cn } from '@/utils/cn';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href='/' className='inline-flex items-center gap-2'>
      <span className='relative inline-flex h-7 w-7 items-center justify-center'>
        <span className='absolute h-6 w-6 rounded-full border border-[var(--color-primary)]/50' />
        <span className='absolute bottom-0 h-1.5 w-4 rounded-full border border-[var(--color-primary)]/35' />
        <span className='h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]' />
      </span>
      <span className={cn('font-heading text-3xl leading-none text-[var(--color-text-strong)]', compact && 'text-2xl')}>
        thoughts
      </span>
    </Link>
  );
}

