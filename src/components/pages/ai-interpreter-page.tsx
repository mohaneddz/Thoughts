'use client';

import { useState } from 'react';
import { useAIInterpretation } from '@/hooks/use-ai-interpretation';
import type { AIInterpretationMode } from '@/types/result';
import { ModeSelector } from '@/components/ai/mode-selector';
import { AIChatBox } from '@/components/ai/ai-chat-box';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useResults } from '@/hooks/use-results';
import { usePersonalData } from '@/hooks/use-personal-data';

const modes: Array<{ id: AIInterpretationMode; title: string; description: string }> = [
  { id: 'gentle-explanation', title: 'Gentle explanation', description: 'A soft, clear breakdown of your results.' },
  { id: 'honest-mirror', title: 'Honest mirror', description: 'Thoughtful reflection that challenges blind spots.' },
  { id: 'practical-advice', title: 'Practical advice', description: 'Actionable steps tailored to your habits.' },
  { id: 'ask-me-questions', title: 'Ask me questions', description: 'Explore your patterns through guided prompts.' },
];

export function AIInterpreterPage({ resultId }: { resultId: string }) {
  const [mode, setMode] = useState<AIInterpretationMode>('gentle-explanation');
  const ai = useAIInterpretation();
  const result = useResults(resultId);
  const { saveThought } = usePersonalData();

  return (
    <div className='space-y-4'>
      <Card className='space-y-2 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
        <h1 className='font-heading text-5xl text-[var(--color-text-strong)]'>
          AI <span className='text-[var(--color-primary)]'>Interpreter</span>
        </h1>
        <p className='text-[var(--color-muted)]'>Your result for {result.testTitle}, translated into next steps.</p>
      </Card>

      <ModeSelector modes={modes} active={mode} onChange={setMode} />

      <Card className='space-y-3 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
        <p className='text-sm text-[var(--color-muted)]'>Selected mode: {mode}</p>
        <Button onClick={() => ai.mutate({ mode, result })} disabled={ai.isPending}>
          {ai.isPending ? 'Interpreting...' : 'Generate interpretation'}
        </Button>
        {ai.data ? <div className='rounded-[1.2rem] bg-[var(--color-surface-soft)] p-4 text-sm'>{ai.data}</div> : null}
        {ai.isError ? <div className='text-sm text-red-500'>Unable to generate interpretation now.</div> : null}
        {ai.data ? (
          <Button
            variant='secondary'
            onClick={() =>
              saveThought({
                id: `thought-${Date.now()}`,
                userId: 'local-user',
                title: `${result.testTitle} (${mode})`,
                content: ai.data,
                sourceType: 'ai',
                sourceId: result.id,
                tags: [mode, result.pattern.toLowerCase()],
                createdAt: new Date().toISOString(),
              })
            }
          >
            Save interpretation
          </Button>
        ) : null}
      </Card>

      <AIChatBox seed='What should I pay attention to this week based on my results?' />
    </div>
  );
}
