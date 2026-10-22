'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookmarkCheck, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { usePersonalData } from '@/hooks/usePersonalData';

/** Saves a tool's output as a private note; resets when the content changes so a new version can be saved. */
export function SaveToThoughtsButton({
  toolId,
  title,
  content,
  tags,
  disabled = false,
}: {
  toolId: string;
  title: string;
  content: string;
  tags: string[];
  disabled?: boolean;
}) {
  const { saveThought } = usePersonalData();
  const [savedContent, setSavedContent] = useState<string | null>(null);
  const saved = savedContent === content;

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Button
        disabled={disabled || saved}
        onClick={() => {
          saveThought({
            id: `thought-${Date.now()}`,
            userId: 'local-user',
            title,
            content,
            sourceType: 'tool',
            sourceId: toolId,
            tags,
            createdAt: new Date().toISOString(),
          });
          setSavedContent(content);
        }}
      >
        {saved ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
        {saved ? 'Saved' : 'Save to my thoughts'}
      </Button>
      {saved ? (
        <Link href={routes.savedThoughts} className='text-sm font-semibold text-[var(--color-primary)] underline'>
          Open saved thoughts
        </Link>
      ) : null}
    </div>
  );
}
