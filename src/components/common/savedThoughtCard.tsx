import { Card } from '@/components/ui/card';
import type { SavedThought } from '@/types/user';

export function SavedThoughtCard({ thought }: { thought: SavedThought }) {
  return (
    <Card className='space-y-3 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
      <div className='flex flex-wrap gap-2'>
        {thought.tags.map((tag) => (
          <span key={tag} className='rounded-full bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-muted)]'>
            {tag}
          </span>
        ))}
      </div>
      <h3 className='font-heading text-2xl text-[var(--color-text-strong)]'>{thought.title}</h3>
      <p className='text-sm leading-7 text-[var(--color-muted)]'>{thought.content}</p>
      <p className='text-xs text-[var(--color-muted)]'>{new Date(thought.createdAt).toLocaleString()}</p>
    </Card>
  );
}

