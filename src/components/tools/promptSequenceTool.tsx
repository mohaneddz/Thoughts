'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChipGroup } from '@/components/tools/chipGroup';
import { SaveToThoughtsButton } from '@/components/tools/saveToThoughtsButton';
import { cn } from '@/utils/cn';
import type { PromptSequence, PromptStep } from '@/data/reflectionTools';

type Answer = string | string[] | number;

function isAnswered(step: PromptStep, answer: Answer | undefined) {
  if (step.optional) return true;
  if (Array.isArray(answer)) return answer.length > 0;
  if (typeof answer === 'number') return true;
  return Boolean(answer?.trim());
}

function formatAnswer(answer: Answer | undefined) {
  if (answer === undefined) return '';
  if (Array.isArray(answer)) return answer.join(', ');
  if (typeof answer === 'number') return `${answer}/10`;
  return answer.trim();
}

function StepInput({ step, answer, onChange }: { step: PromptStep; answer: Answer | undefined; onChange: (value: Answer) => void }) {
  const inputClass =
    'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]';

  if (step.kind === 'text') {
    return <input autoFocus className={cn(inputClass, 'h-11')} value={typeof answer === 'string' ? answer : ''} placeholder={step.placeholder} onChange={(event) => onChange(event.target.value)} />;
  }

  if (step.kind === 'longText') {
    return <textarea autoFocus className={cn(inputClass, 'min-h-32')} value={typeof answer === 'string' ? answer : ''} placeholder={step.placeholder} onChange={(event) => onChange(event.target.value)} />;
  }

  if (step.kind === 'scale') {
    const value = typeof answer === 'number' ? answer : 5;
    return (
      <div className='space-y-2'>
        <input type='range' min={1} max={10} value={value} onChange={(event) => onChange(Number(event.target.value))} className='w-full accent-[var(--color-primary)]' aria-label={step.label} />
        <div className='flex justify-between text-xs text-[var(--color-muted)]'>
          <span>Barely there</span>
          <span className='font-heading text-2xl text-[var(--color-text-strong)]'>{value}</span>
          <span>Overwhelming</span>
        </div>
      </div>
    );
  }

  const selected = Array.isArray(answer) ? answer : typeof answer === 'string' && answer ? [answer] : [];
  return (
    <ChipGroup
      label={step.label}
      options={step.options ?? []}
      selected={selected}
      multiple={step.kind === 'multi'}
      onToggle={(option) => {
        if (step.kind === 'choice') {
          onChange(option);
          return;
        }
        onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);
      }}
    />
  );
}

export function PromptSequenceTool({ sequence, toolTitle }: { sequence: PromptSequence; toolTitle: string }) {
  const [variantId, setVariantId] = useState(sequence.variants?.[0]?.id);
  const variant = sequence.variants?.find((item) => item.id === variantId);
  const steps = variant?.steps ?? sequence.steps ?? [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const finished = index >= steps.length;
  const step = steps[index];

  // A scale starts at its midpoint, so it counts as answered without being touched.
  const currentAnswer = step ? answers[step.id] ?? (step.kind === 'scale' ? 5 : undefined) : undefined;

  const reset = () => {
    setAnswers({});
    setIndex(0);
  };

  const valueOf = (item: PromptStep) => formatAnswer(answers[item.id] ?? (item.kind === 'scale' ? 5 : undefined));

  const summary = steps
    .filter((item) => valueOf(item))
    .map((item) => `${item.label}\n${valueOf(item)}`)
    .join('\n\n');

  return (
    <div className='space-y-4'>
      {sequence.variants ? (
        <div className='flex flex-wrap gap-2'>
          {sequence.variants.map((item) => (
            <Button
              key={item.id}
              size='sm'
              variant={item.id === variantId ? 'primary' : 'secondary'}
              onClick={() => {
                setVariantId(item.id);
                reset();
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      ) : null}

      {!finished && step ? (
        <Card className='space-y-5 p-5 sm:p-6'>
          <div className='space-y-2'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>
              Step {index + 1} of {steps.length}
              {step.optional ? ' · optional' : ''}
            </p>
            <Progress value={((index + 1) / steps.length) * 100} />
          </div>
          <div className='space-y-1'>
            <h2 className='font-heading text-3xl leading-tight text-[var(--color-text-strong)]'>{step.label}</h2>
            {step.helper ? <p className='text-sm text-[var(--color-muted)]'>{step.helper}</p> : null}
          </div>
          <StepInput key={step.id} step={step} answer={currentAnswer} onChange={(value) => setAnswers((prev) => ({ ...prev, [step.id]: value }))} />
          <div className='flex justify-between gap-2'>
            <Button variant='secondary' onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>
              <ArrowLeft size={14} />
              Back
            </Button>
            <Button onClick={() => setIndex((value) => value + 1)} disabled={!isAnswered(step, currentAnswer)}>
              {index === steps.length - 1 ? 'See summary' : 'Next'}
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className='space-y-5 p-5 sm:p-6'>
          <h2 className='font-heading text-3xl text-[var(--color-text-strong)]'>Your {toolTitle.toLowerCase()}</h2>
          <dl className='space-y-4'>
            {steps.map((item) => {
              const value = valueOf(item);
              if (!value) return null;
              return (
                <div key={item.id} className='space-y-1'>
                  <dt className='text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]'>{item.label}</dt>
                  <dd className='whitespace-pre-wrap text-sm leading-6 text-[var(--color-text)]'>{value}</dd>
                </div>
              );
            })}
          </dl>
          <p className='rounded-xl bg-[var(--color-surface-soft)] p-3 text-sm text-[var(--color-muted)]'>{sequence.closing}</p>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <SaveToThoughtsButton
              toolId={sequence.toolId}
              title={`${toolTitle}${variant ? ` — ${variant.label.toLowerCase()}` : ''}`}
              content={summary}
              tags={[toolTitle.toLowerCase()]}
            />
            <div className='flex gap-2'>
              <Button variant='ghost' onClick={() => setIndex(steps.length - 1)}>
                <ArrowLeft size={14} />
                Edit
              </Button>
              <Button variant='ghost' onClick={reset}>
                <RotateCcw size={14} />
                Start over
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
