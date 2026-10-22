'use client';

import { SavedThoughtCard } from '@/components/common/savedThoughtCard';
import { EmptyState } from '@/components/common/emptyState';
import { usePersonalData } from '@/hooks/usePersonalData';

export function SavedThoughtsPageClient() {
  const { savedThoughts } = usePersonalData();

  return savedThoughts.length ? (
    <div className='grid gap-4 md:grid-cols-2'>
      {savedThoughts.map((thought) => (
        <SavedThoughtCard key={thought.id} thought={thought} />
      ))}
    </div>
  ) : (
    <EmptyState
      title='No saved thoughts yet'
      description='Save a result takeaway or AI interpretation to build your private reflection trail.'
    />
  );
}
