import { Card } from '@/components/ui/card';
import type { CollectionGuide } from '@/data/collections';

export function CollectionCard({ collection }: { collection: CollectionGuide }) {
  return (
    <Card className='space-y-3'>
      <h3 className='font-heading text-3xl text-[var(--color-text-strong)]'>{collection.title}</h3>
      <p className='text-sm text-[var(--color-muted)]'>{collection.intro}</p>
      <p className='text-xs text-[var(--color-muted)]'>Suggested order: {collection.order.join(' -> ')}</p>
    </Card>
  );
}

