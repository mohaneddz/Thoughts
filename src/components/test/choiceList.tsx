'use client';

import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ChoiceOption } from '@/types/test';

/**
 * One list for single-choice, likert, yes/no and multi-select questions.
 * Single mode behaves as a radio group (arrow keys move and select), multi mode as checkboxes.
 */
export function ChoiceList({
  options,
  selected,
  onSelect,
  multiple = false,
  label,
}: {
  options: ChoiceOption[];
  selected: string[];
  onSelect: (value: string) => void;
  multiple?: boolean;
  label?: string;
}) {
  const focusIndex = Math.max(0, options.findIndex((option) => selected.includes(option.value)));

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (multiple) return;
    const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const nextIndex = (index + delta + options.length) % options.length;
    onSelect(options[nextIndex].value);
    const group = event.currentTarget.parentElement;
    (group?.children[nextIndex] as HTMLElement | undefined)?.focus();
  };

  return (
    <div className='space-y-2' role={multiple ? 'group' : 'radiogroup'} aria-label={label}>
      {options.map((option, index) => {
        const active = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type='button'
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={active}
            tabIndex={multiple || index === focusIndex ? 0 : -1}
            onClick={() => onSelect(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              'flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-start text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
              active
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-text-strong)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40',
            )}
          >
            <span>
              <span>{option.label}</span>
              {option.helperText ? <span className='block text-xs text-[var(--color-muted)]'>{option.helperText}</span> : null}
            </span>
            <span
              aria-hidden
              className={cn(
                'grid h-4 w-4 shrink-0 place-items-center border transition',
                multiple ? 'rounded' : 'rounded-full',
                active ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-surface)]' : 'border-[var(--color-border)]',
              )}
            >
              {active ? multiple ? <Check size={11} strokeWidth={3} /> : <span className='h-1.5 w-1.5 rounded-full bg-[var(--color-surface)]' /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
