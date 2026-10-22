'use client';

import { cn } from '@/utils/cn';
import type { AIInterpretationMode } from '@/types/result';

export function ModeSelector({
  modes,
  active,
  onChange,
}: {
  modes: Array<{ id: AIInterpretationMode; title: string; description: string }>;
  active: AIInterpretationMode;
  onChange: (mode: AIInterpretationMode) => void;
}) {
  return (
    <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-4'>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={cn(
            'rounded-2xl border p-4 text-left transition',
            active === mode.id
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
              : 'border-[var(--color-border)] bg-[var(--color-surface)]',
          )}
        >
          <p className='font-semibold text-[var(--color-text)]'>{mode.title}</p>
          <p className='mt-2 text-sm text-[var(--color-muted)]'>{mode.description}</p>
        </button>
      ))}
    </div>
  );
}

