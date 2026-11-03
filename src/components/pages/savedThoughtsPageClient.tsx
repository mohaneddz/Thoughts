'use client';

import { useState } from 'react';
import { PenLine, Search, X } from 'lucide-react';
import { SavedThoughtCard } from '@/components/common/savedThoughtCard';
import { EmptyState } from '@/components/common/emptyState';
import { ChipGroup } from '@/components/tools/chipGroup';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePersonalData } from '@/hooks/usePersonalData';
import type { SavedThought } from '@/types/user';

const filters: Array<{ label: string; source?: SavedThought['sourceType'] }> = [
  { label: 'All' },
  { label: 'Notes', source: 'note' },
  { label: 'Results', source: 'result' },
  { label: 'AI', source: 'ai' },
  { label: 'Tools', source: 'tool' },
  { label: 'Check-ins', source: 'check-in' },
];

function NoteComposer({ onSave, onCancel }: { onSave: (title: string, content: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <Card className='space-y-3 p-5'>
      <input
        autoFocus
        value={title}
        maxLength={80}
        onChange={(event) => setTitle(event.target.value)}
        placeholder='Title (optional)'
        className='h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 font-heading text-xl outline-none focus:border-[var(--color-primary)]'
      />
      <textarea
        value={content}
        maxLength={4000}
        onChange={(event) => setContent(event.target.value)}
        placeholder='What is on your mind?'
        className='min-h-36 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm leading-7 outline-none focus:border-[var(--color-primary)]'
      />
      <div className='flex justify-end gap-2'>
        <Button variant='ghost' onClick={onCancel}>Cancel</Button>
        <Button disabled={!content.trim()} onClick={() => onSave(title.trim() || content.trim().split('\n')[0].slice(0, 60), content.trim())}>
          Save note
        </Button>
      </div>
    </Card>
  );
}

export function SavedThoughtsPageClient() {
  const { savedThoughts, saveThought, deleteThought, isReady } = usePersonalData();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [composing, setComposing] = useState(false);

  const source = filters.find((item) => item.label === filter)?.source;
  const needle = query.trim().toLowerCase();
  const visible = savedThoughts.filter(
    (thought) =>
      (!source || thought.sourceType === source) &&
      (!needle || `${thought.title} ${thought.content} ${thought.tags.join(' ')}`.toLowerCase().includes(needle)),
  );

  if (!isReady) {
    return <div className='h-64 animate-pulse rounded-[1.6rem] bg-[var(--color-surface-soft)]' aria-busy />;
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='relative min-w-56 flex-1'>
          <Search size={16} className='pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]' />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search your thoughts'
            aria-label='Search saved thoughts'
            className='h-11 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] ps-9 pe-9 text-sm outline-none focus:border-[var(--color-primary)]'
          />
          {query ? (
            <button type='button' aria-label='Clear search' onClick={() => setQuery('')} className='absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]'>
              <X size={14} />
            </button>
          ) : null}
        </div>
        {!composing ? (
          <Button onClick={() => setComposing(true)}>
            <PenLine size={14} />
            New note
          </Button>
        ) : null}
      </div>

      <ChipGroup label='Filter by source' multiple={false} options={filters.map((item) => item.label)} selected={[filter]} onToggle={setFilter} />

      {composing ? (
        <NoteComposer
          onCancel={() => setComposing(false)}
          onSave={(title, content) => {
            saveThought({
              id: `thought-${Date.now()}`,
              userId: 'local-user',
              title,
              content,
              sourceType: 'note',
              tags: [],
              createdAt: new Date().toISOString(),
            });
            setComposing(false);
          }}
        />
      ) : null}

      {visible.length ? (
        <div className='grid gap-4 md:grid-cols-2'>
          {visible.map((thought) => (
            <SavedThoughtCard key={thought.id} thought={thought} onDelete={deleteThought} />
          ))}
        </div>
      ) : savedThoughts.length ? (
        <EmptyState title='Nothing matches' description='Try a different word or switch the filter back to All.' />
      ) : (
        <EmptyState title='No saved thoughts yet' description='Write a note, or save a takeaway from a result, a tool, or an AI interpretation.' />
      )}
    </div>
  );
}
