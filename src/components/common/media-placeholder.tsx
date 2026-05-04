import { cn } from '@/utils/cn';

export function MediaPlaceholder({
  className,
  variant = 'orb',
}: {
  className?: string;
  variant?: 'orb' | 'hero' | 'wave' | 'ring';
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-soft)] to-transparent',
        className,
      )}
    >
      <div className='absolute inset-0 opacity-70'>
        <div className='absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,rgba(99,102,241,0.55))]' />
        {(variant === 'hero' || variant === 'ring') && (
          <>
            <div className='absolute left-1/2 top-[62%] h-24 w-72 -translate-x-1/2 rounded-full border border-[var(--color-primary)]/30' />
            <div className='absolute left-1/2 top-[66%] h-20 w-64 -translate-x-1/2 rounded-full border border-[var(--color-primary)]/20' />
            <div className='absolute left-1/2 top-[70%] h-16 w-52 -translate-x-1/2 rounded-full border border-[var(--color-primary)]/15' />
          </>
        )}
        {variant === 'wave' && (
          <div className='absolute bottom-0 right-0 h-24 w-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.55),transparent_70%)]' />
        )}
      </div>
    </div>
  );
}

