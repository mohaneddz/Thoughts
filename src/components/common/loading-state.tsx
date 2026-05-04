import { Card } from '@/components/ui/card';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <Card className='animate-pulse p-6'>
      <div className='h-4 w-32 rounded bg-[var(--color-surface-soft)]' />
      <div className='mt-3 h-3 w-full rounded bg-[var(--color-surface-soft)]' />
      <div className='mt-2 h-3 w-4/5 rounded bg-[var(--color-surface-soft)]' />
      <p className='mt-4 text-xs text-[var(--color-muted)]'>{label}</p>
    </Card>
  );
}

