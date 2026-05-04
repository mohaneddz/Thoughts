import { AppShell } from '@/components/common/app-shell';
import { SavedThoughtCard } from '@/components/common/saved-thought-card';
import { EmptyState } from '@/components/common/empty-state';
import type { SavedThought } from '@/types/user';

const thoughts: SavedThought[] = [
  {
    id: 's1',
    userId: 'u1',
    title: 'Pattern after stress test',
    content: 'I react fastest when sleep is low. Pausing for 2 minutes helped.',
    sourceType: 'result',
    sourceId: 'r1',
    tags: ['stress', 'sleep'],
    createdAt: new Date().toISOString(),
  },
];

export default function SavedThoughtsPage() {
  return (
    <AppShell className='space-y-5'>
      <h1 className='font-heading text-5xl'>Saved Thoughts</h1>
      <p className='text-[var(--color-muted)]'>Private saved insights, notes, and AI interpretations.</p>
      {thoughts.length ? (
        <div className='grid gap-4 md:grid-cols-2'>
          {thoughts.map((thought) => (
            <SavedThoughtCard key={thought.id} thought={thought} />
          ))}
        </div>
      ) : (
        <EmptyState title='No saved thoughts yet' description='Save reflections from results or check-ins to build your pattern map over time.' />
      )}
    </AppShell>
  );
}

