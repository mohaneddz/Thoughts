'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookmarkCheck, BookmarkPlus, Sparkles } from 'lucide-react';
import { useAIInterpretation } from '@/hooks/useAIInterpretation';
import type { AIInterpretationMode } from '@/types/result';
import { ModeSelector } from '@/components/ai/modeSelector';
import { AIChatBox } from '@/components/ai/aiChatBox';
import { CrisisResourceCard } from '@/components/results/crisisResourceCard';
import { EmptyState } from '@/components/common/emptyState';
import { Card } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { useResult } from '@/hooks/useResults';
import { usePersonalData } from '@/hooks/usePersonalData';
import { toResultContext } from '@/utils/ai/context';

const modes: Array<{ id: AIInterpretationMode; title: string; description: string }> = [
  { id: 'gentle-explanation', title: 'Gentle explanation', description: 'A soft, clear breakdown of your result.' },
  { id: 'honest-mirror', title: 'Honest mirror', description: 'A direct reflection that names a likely blind spot.' },
  { id: 'practical-advice', title: 'Practical advice', description: 'Three realistic actions for the next week.' },
  { id: 'ask-me-questions', title: 'Ask me questions', description: 'Open questions so you can interpret it yourself.' },
  { id: 'explain-simply', title: 'Explain simply', description: 'Plain language, no psychology terms.' },
  { id: 'journal-prompts', title: 'Journal prompts', description: 'Five prompts to write about.' },
];

export function AIInterpreterPage({ resultId }: { resultId?: string }) {
  const [mode, setMode] = useState<AIInterpretationMode>('gentle-explanation');
  const [savedFor, setSavedFor] = useState<string | null>(null);
  const ai = useAIInterpretation();
  const { result, isReady } = useResult(resultId);
  const { saveThought } = usePersonalData();

  if (!isReady) {
    return <div className='h-96 animate-pulse rounded-[1.6rem] bg-[var(--color-surface-soft)]' aria-busy />;
  }

  if (!result) {
    return (
      <div className='space-y-4'>
        <EmptyState title='Nothing to interpret yet' description='Finish a test first. The interpreter only works on your own results, never on sample data.' />
        <div className='flex justify-center'>
          <Link href={routes.tests} className={buttonVariants()}>Browse tests</Link>
        </div>
      </div>
    );
  }

  const context = toResultContext(result);
  const modeTitle = modes.find((item) => item.id === mode)?.title ?? mode;

  return (
    <div className='space-y-4'>
      <Card className='space-y-2 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
        <h1 className='font-heading text-5xl text-[var(--color-text-strong)]'>
          AI <span className='text-[var(--color-primary)]'>Interpreter</span>
        </h1>
        <p className='text-[var(--color-muted)]'>
          Interpreting <Link href={routes.result(result.id)} className='font-semibold text-[var(--color-text)] underline'>{result.testTitle}</Link>: {result.pattern}.
        </p>
        <p className='text-xs text-[var(--color-muted)]'>
          Only the result summary is sent to Groq — test name, score, range and subscales. Your individual answers, name and notes never leave this device.
        </p>
      </Card>

      {result.crisisSignal ? <CrisisResourceCard signal={result.crisisSignal} /> : null}

      <ModeSelector modes={modes} active={mode} onChange={setMode} />

      <Card className='space-y-4 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
        <Button onClick={() => ai.mutate({ mode, context })} disabled={ai.isPending}>
          <Sparkles size={14} />
          {ai.isPending ? 'Interpreting…' : `Generate: ${modeTitle.toLowerCase()}`}
        </Button>
        {ai.isError ? <p className='text-sm text-[var(--color-danger-text)]'>{ai.error.message}</p> : null}
        {ai.data ? (
          <>
            <div className='whitespace-pre-wrap rounded-[1.2rem] bg-[var(--color-surface-soft)] p-4 text-sm leading-7 text-[var(--color-text)]'>{ai.data}</div>
            <Button
              variant='secondary'
              disabled={savedFor === ai.data}
              onClick={() => {
                saveThought({
                  id: `thought-${Date.now()}`,
                  userId: 'local-user',
                  title: `${result.testTitle} · ${modeTitle}`,
                  content: ai.data,
                  sourceType: 'ai',
                  sourceId: result.id,
                  tags: [modeTitle.toLowerCase()],
                  createdAt: new Date().toISOString(),
                });
                setSavedFor(ai.data);
              }}
            >
              {savedFor === ai.data ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
              {savedFor === ai.data ? 'Saved to your thoughts' : 'Save interpretation'}
            </Button>
          </>
        ) : null}
      </Card>

      <AIChatBox key={result.id} context={context} />
    </div>
  );
}
