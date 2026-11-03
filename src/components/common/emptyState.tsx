import { Card } from '@/components/ui/card';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className='p-6 text-center'>
      <h3 className='font-heading text-2xl text-[var(--color-text-strong)]'>{title}</h3>
      <p className='mt-2 text-sm text-[var(--color-muted)]'>{description}</p>
    </Card>
  );
}

