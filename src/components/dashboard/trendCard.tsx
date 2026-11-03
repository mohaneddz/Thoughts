import { Card } from '@/components/ui/card';

export function TrendCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <Card className='space-y-1'>
      <p className='text-sm text-[var(--color-muted)]'>{title}</p>
      <p className='font-heading text-3xl text-[var(--color-text-strong)]'>{value}</p>
      {hint ? <p className='text-xs text-[var(--color-muted)]'>{hint}</p> : null}
    </Card>
  );
}
