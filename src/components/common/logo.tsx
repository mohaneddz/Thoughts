import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/cn';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href='/' className='inline-flex items-center gap-2'>
      <Image
        src='/images/brand/happy-healthy-human-logo.png'
        alt='Happy Healthy Human logo'
        width={28}
        height={28}
        className='h-7 w-7 rounded-sm object-contain'
        priority
      />
      <span className={cn('font-heading text-2xl leading-none text-[var(--color-text-strong)]', compact && 'text-xl')}>
        Happy Healthy Human
      </span>
    </Link>
  );
}

