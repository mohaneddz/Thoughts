'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { formatDateTime } from '@/utils/formatting';
import type { SavedThought } from '@/types/user';

const sourceLabels: Record<SavedThought['sourceType'], string> = {
  result: 'Test result',
  ai: 'AI interpretation',
  note: 'Note',
  'check-in': 'Check-in',
  tool: 'Tool',
};

function sourceHref(thought: SavedThought) {
  if (!thought.sourceId) return undefined;
  if (thought.sourceType === 'result' || thought.sourceType === 'ai') return routes.result(thought.sourceId);
  if (thought.sourceType === 'tool') return routes.tool(thought.sourceId);
  return undefined;
}

export function SavedThoughtCard({ thought, onDelete }: { thought: SavedThought; onDelete?: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const href = sourceHref(thought);
  const isLong = thought.content.length > 320;

  return (
    <Card className='flex flex-col gap-3 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]'>{sourceLabels[thought.sourceType]}</span>
        {thought.tags.map((tag) => (
          <span key={tag} className='rounded-full bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-muted)]'>
            {tag}
          </span>
        ))}
      </div>
      <h3 className='font-heading text-2xl text-[var(--color-text-strong)]'>{thought.title}</h3>
      <p className={`whitespace-pre-wrap text-sm leading-7 text-[var(--color-muted)] ${isLong && !expanded ? 'line-clamp-6' : ''}`}>{thought.content}</p>
      {isLong ? (
        <button type='button' onClick={() => setExpanded((value) => !value)} className='self-start text-xs font-semibold text-[var(--color-primary)]'>
          {expanded ? 'Show less' : 'Show all'}
        </button>
      ) : null}
      <div className='mt-auto flex flex-wrap items-center justify-between gap-2 pt-1'>
        <p className='text-xs text-[var(--color-muted)]'>
          {formatDateTime(thought.createdAt)}
          {href ? (
            <>
              {' · '}
              <Link href={href} className='font-semibold text-[var(--color-primary)]'>Open source</Link>
            </>
          ) : null}
        </p>
        {onDelete ? (
          confirming ? (
            <span className='flex gap-1'>
              <Button size='sm' variant='secondary' onClick={() => onDelete(thought.id)}>Delete</Button>
              <Button size='sm' variant='ghost' onClick={() => setConfirming(false)}>Keep</Button>
            </span>
          ) : (
            <Button size='sm' variant='ghost' aria-label={`Delete ${thought.title}`} onClick={() => setConfirming(true)}>
              <Trash2 size={14} />
            </Button>
          )
        ) : null}
      </div>
    </Card>
  );
}
