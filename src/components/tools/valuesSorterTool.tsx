'use client';

import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/tools/chipGroup';
import { SaveToThoughtsButton } from '@/components/tools/saveToThoughtsButton';
import { valueOptions } from '@/data/reflectionTools';
import { cn } from '@/utils/cn';

const maxPicks = 10;

export function ValuesSorterTool() {
  const [stage, setStage] = useState<'pick' | 'rank'>('pick');
  const [custom, setCustom] = useState('');
  const [options, setOptions] = useState(valueOptions);
  const [ranked, setRanked] = useState<string[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const toggle = (value: string) => {
    setRanked((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : prev.length < maxPicks ? [...prev, value] : prev));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= ranked.length || from === to) return;
    setRanked((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const addCustom = () => {
    const value = custom.trim();
    if (!value || options.some((item) => item.toLowerCase() === value.toLowerCase())) return;
    setOptions((prev) => [...prev, value]);
    if (ranked.length < maxPicks) setRanked((prev) => [...prev, value]);
    setCustom('');
  };

  const summary = ranked.map((value, index) => `${index + 1}. ${value}`).join('\n');

  if (stage === 'pick') {
    return (
      <Card className='space-y-5 p-5 sm:p-6'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div className='space-y-1'>
            <h2 className='font-heading text-3xl text-[var(--color-text-strong)]'>Pick up to {maxPicks} values</h2>
            <p className='text-sm text-[var(--color-muted)]'>Choose what you actually live by, or want to — not what sounds good.</p>
          </div>
          <p className='font-heading text-3xl tabular-nums text-[var(--color-text-strong)]'>
            {ranked.length}<span className='text-base text-[var(--color-muted)]'>/{maxPicks}</span>
          </p>
        </div>
        <ChipGroup label='Values' options={options} selected={ranked} onToggle={toggle} />
        <form
          className='flex max-w-sm gap-2'
          onSubmit={(event) => {
            event.preventDefault();
            addCustom();
          }}
        >
          <input
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            maxLength={30}
            placeholder='Add your own value'
            className='h-10 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm outline-none focus:border-[var(--color-primary)]'
          />
          <Button type='submit' variant='secondary' disabled={!custom.trim()}>
            <Plus size={14} />
            Add
          </Button>
        </form>
        <div className='flex justify-end'>
          <Button onClick={() => setStage('rank')} disabled={ranked.length < 3}>
            Rank them
            <ArrowRight size={14} />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className='grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'>
      <Card className='space-y-4 p-5 sm:p-6'>
        <div className='space-y-1'>
          <h2 className='font-heading text-3xl text-[var(--color-text-strong)]'>Put them in order</h2>
          <p className='text-sm text-[var(--color-muted)]'>Drag, or use the arrows. If two clash, which one would you protect?</p>
        </div>
        <ol className='space-y-2'>
          {ranked.map((value, index) => (
            <li
              key={value}
              draggable
              onDragStart={() => setDraggingIndex(index)}
              onDragEnd={() => setDraggingIndex(null)}
              onDragOver={(event) => {
                event.preventDefault();
                if (draggingIndex !== null && draggingIndex !== index) {
                  move(draggingIndex, index);
                  setDraggingIndex(index);
                }
              }}
              className={cn(
                'flex cursor-grab items-center gap-3 rounded-xl border bg-[var(--color-surface)] px-3 py-2 transition active:cursor-grabbing',
                index < 3 ? 'border-[var(--color-primary)]/50' : 'border-[var(--color-border)]',
                draggingIndex === index && 'opacity-50',
              )}
            >
              <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold', index < 3 ? 'bg-[var(--color-primary)] text-[var(--color-surface)]' : 'bg-[var(--color-surface-soft)] text-[var(--color-muted)]')}>
                {index + 1}
              </span>
              <span className='flex-1 text-sm font-medium text-[var(--color-text)]'>{value}</span>
              <Button size='sm' variant='ghost' aria-label={`Move ${value} up`} disabled={index === 0} onClick={() => move(index, index - 1)}>
                <ArrowUp size={14} />
              </Button>
              <Button size='sm' variant='ghost' aria-label={`Move ${value} down`} disabled={index === ranked.length - 1} onClick={() => move(index, index + 1)}>
                <ArrowDown size={14} />
              </Button>
            </li>
          ))}
        </ol>
        <Button variant='ghost' onClick={() => setStage('pick')}>
          <ArrowLeft size={14} />
          Change picks
        </Button>
      </Card>

      <Card className='space-y-4 p-5 sm:p-6'>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Your core three</p>
        <div className='space-y-2'>
          {ranked.slice(0, 3).map((value) => (
            <p key={value} className='font-heading text-3xl text-[var(--color-text-strong)]'>{value}</p>
          ))}
        </div>
        <p className='text-sm leading-6 text-[var(--color-muted)]'>
          Try this week: when a choice feels hard, ask which option honours {ranked[0]?.toLowerCase()} more. Notice where your calendar and your top three disagree.
        </p>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <SaveToThoughtsButton toolId='values-sorter' title={`My values: ${ranked.slice(0, 3).join(', ')}`} content={summary} tags={['values']} />
          <Button
            variant='ghost'
            onClick={() => {
              setRanked([]);
              setStage('pick');
            }}
          >
            <RotateCcw size={14} />
            Start over
          </Button>
        </div>
      </Card>
    </div>
  );
}
