'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SaveToThoughtsButton } from '@/components/tools/saveToThoughtsButton';
import { cn } from '@/utils/cn';

interface Criterion {
  id: number;
  name: string;
  weight: number;
}

const maxOptions = 4;
const maxCriteria = 6;

const nameInputClass =
  'h-10 w-full min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm outline-none focus:border-[var(--color-primary)]';

export function DecisionHelperTool() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<Array<{ id: number; name: string }>>([
    { id: 1, name: '' },
    { id: 2, name: '' },
  ]);
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 1, name: 'Fits my values', weight: 5 },
    { id: 2, name: 'Energy it costs (higher = cheaper)', weight: 3 },
    { id: 3, name: 'Long-term upside', weight: 4 },
  ]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [nextId, setNextId] = useState(10);

  const rating = (optionId: number, criterionId: number) => ratings[`${optionId}:${criterionId}`] ?? 3;
  const totalWeight = criteria.reduce((total, criterion) => total + criterion.weight, 0) || 1;

  const scored = options.map((option) => {
    const weighted = criteria.reduce((total, criterion) => total + rating(option.id, criterion.id) * criterion.weight, 0);
    return { ...option, percent: Math.round(((weighted / totalWeight - 1) / 4) * 100) };
  });
  const best = Math.max(...scored.map((option) => option.percent));
  const leaders = scored.filter((option) => option.percent === best);
  const namedOptions = scored.filter((option) => option.name.trim());
  const ready = namedOptions.length >= 2 && criteria.every((criterion) => criterion.name.trim());

  const label = (option: { id: number; name: string }) => option.name.trim() || `Option ${options.findIndex((item) => item.id === option.id) + 1}`;

  const summary = [
    question.trim() ? `Decision: ${question.trim()}` : '',
    `Criteria: ${criteria.map((criterion) => `${criterion.name} (weight ${criterion.weight})`).join('; ')}`,
    ...scored.map((option) => `${label(option)}: ${option.percent}%`),
    leaders.length === 1 ? `Leaning: ${label(leaders[0])}` : 'Tie between the leading options',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className='space-y-4'>
      <Card className='space-y-3 p-5'>
        <label htmlFor='decision-question' className='text-sm font-semibold text-[var(--color-text)]'>What are you deciding?</label>
        <input id='decision-question' value={question} onChange={(event) => setQuestion(event.target.value)} placeholder='Take the new job offer, move cities, …' className={nameInputClass} />
      </Card>

      <Card className='space-y-4 overflow-x-auto p-5'>
        <table className='w-full min-w-[34rem] border-separate border-spacing-y-2 text-sm'>
          <thead>
            <tr>
              <th className='w-[38%] pb-1 text-start text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]'>Criteria · weight</th>
              {options.map((option, index) => (
                <th key={option.id} className='px-1 pb-1 align-bottom'>
                  <div className='flex items-center gap-1'>
                    <input aria-label={`Option ${index + 1} name`} value={option.name} onChange={(event) => setOptions((prev) => prev.map((item) => (item.id === option.id ? { ...item, name: event.target.value } : item)))} placeholder={`Option ${index + 1}`} className={nameInputClass} />
                    {options.length > 2 ? (
                      <button type='button' aria-label={`Remove ${label(option)}`} onClick={() => setOptions((prev) => prev.filter((item) => item.id !== option.id))} className='text-[var(--color-muted)] hover:text-[var(--color-text)]'>
                        <X size={14} />
                      </button>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion) => (
              <tr key={criterion.id}>
                <td className='pe-2'>
                  <div className='flex items-center gap-2'>
                    <input aria-label='Criterion name' value={criterion.name} onChange={(event) => setCriteria((prev) => prev.map((item) => (item.id === criterion.id ? { ...item, name: event.target.value } : item)))} className={nameInputClass} />
                    <select
                      aria-label={`Weight for ${criterion.name}`}
                      value={criterion.weight}
                      onChange={(event) => setCriteria((prev) => prev.map((item) => (item.id === criterion.id ? { ...item, weight: Number(event.target.value) } : item)))}
                      className='h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2 text-sm'
                    >
                      {[1, 2, 3, 4, 5].map((weight) => <option key={weight} value={weight}>×{weight}</option>)}
                    </select>
                    {criteria.length > 1 ? (
                      <button type='button' aria-label={`Remove ${criterion.name}`} onClick={() => setCriteria((prev) => prev.filter((item) => item.id !== criterion.id))} className='text-[var(--color-muted)] hover:text-[var(--color-text)]'>
                        <X size={14} />
                      </button>
                    ) : null}
                  </div>
                </td>
                {options.map((option) => (
                  <td key={option.id} className='px-1'>
                    <div className='flex justify-center gap-1' role='radiogroup' aria-label={`${label(option)} on ${criterion.name}`}>
                      {[1, 2, 3, 4, 5].map((value) => {
                        const active = rating(option.id, criterion.id) >= value;
                        return (
                          <button
                            key={value}
                            type='button'
                            role='radio'
                            aria-checked={rating(option.id, criterion.id) === value}
                            aria-label={`${value} of 5`}
                            onClick={() => setRatings((prev) => ({ ...prev, [`${option.id}:${criterion.id}`]: value }))}
                            className={cn('h-6 w-6 rounded-md border transition', active ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50')}
                          />
                        );
                      })}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex flex-wrap gap-2'>
          <Button size='sm' variant='secondary' disabled={options.length >= maxOptions} onClick={() => { setOptions((prev) => [...prev, { id: nextId, name: '' }]); setNextId((id) => id + 1); }}>
            <Plus size={14} />
            Option
          </Button>
          <Button size='sm' variant='secondary' disabled={criteria.length >= maxCriteria} onClick={() => { setCriteria((prev) => [...prev, { id: nextId, name: '', weight: 3 }]); setNextId((id) => id + 1); }}>
            <Plus size={14} />
            Criterion
          </Button>
        </div>
      </Card>

      <Card className='space-y-4 p-5'>
        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Weighted fit</p>
        <div className='space-y-3'>
          {scored.map((option) => (
            <div key={option.id} className='space-y-1'>
              <div className='flex justify-between text-sm'>
                <span className={cn('font-medium', option.percent === best ? 'text-[var(--color-text-strong)]' : 'text-[var(--color-muted)]')}>{label(option)}</span>
                <span className='tabular-nums text-[var(--color-muted)]'>{option.percent}%</span>
              </div>
              <div className='h-2.5 rounded-full bg-[var(--color-surface-soft)]'>
                <div className='h-2.5 rounded-full transition-[width] duration-500' style={{ width: `${Math.max(option.percent, 2)}%`, backgroundColor: option.percent === best ? 'var(--color-primary)' : 'var(--color-muted)' }} />
              </div>
            </div>
          ))}
        </div>
        <p className='rounded-xl bg-[var(--color-surface-soft)] p-3 text-sm text-[var(--color-muted)]'>
          Gut check: if the top option won, would you feel relieved or disappointed? Disappointment usually means a criterion is missing or under-weighted.
        </p>
        <SaveToThoughtsButton
          toolId='decision-helper'
          title={question.trim() ? `Decision: ${question.trim()}` : 'Decision matrix'}
          content={summary}
          tags={['decision']}
          disabled={!ready}
        />
      </Card>
    </div>
  );
}
