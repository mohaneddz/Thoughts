import { Card } from '@/components/ui/card';
import type { SavedThought } from '@/types/user';

export function SavedThoughtCard({ thought }: { thought: SavedThought }) {
  return (
    <Card className='space-y-2'>
      <h3 className='font-semibold text-[var(--color-text)]'>{thought.title}</h3>
      <p className='text-sm text-[var(--color-muted)]'>{thought.content}</p>
      <p className='text-xs text-[var(--color-muted)]'>Tags: {thought.tags.join(', ')}</p>
    </Card>
  );
}

