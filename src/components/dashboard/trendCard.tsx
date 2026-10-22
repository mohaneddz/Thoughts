import { Card } from '@/components/ui/card';

export function TrendCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className='space-y-1'>
      <p className='text-sm text-[var(--color-muted)]'>{title}</p>
      <p className='font-heading text-3xl text-[var(--color-text-strong)]'>{value}</p>
    </Card>
  );
}

