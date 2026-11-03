'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/tools/chipGroup';
import { SaveToThoughtsButton } from '@/components/tools/saveToThoughtsButton';

const kinds = ['Person', 'Task', 'Place', 'Habit'];

interface EnergyItem {
  id: number;
  name: string;
  kind: string;
  /** -3 drains a lot, +3 charges a lot. */
  effect: number;
}

const effectWords: Record<number, string> = { [-3]: 'drains a lot', [-2]: 'drains', [-1]: 'drains a little', 0: 'neutral', 1: 'charges a little', 2: 'charges', 3: 'charges a lot' };

export function EnergyDrainFinderTool() {
  const [items, setItems] = useState<EnergyItem[]>([]);
  const [name, setName] = useState('');
  const [kind, setKind] = useState('Task');
  const [effect, setEffect] = useState(-1);

  const add = () => {
    if (!name.trim()) return;
    setItems((prev) => [...prev, { id: Date.now(), name: name.trim(), kind, effect }]);
    setName('');
  };

  const drains = items.filter((item) => item.effect < 0).sort((a, b) => a.effect - b.effect);
  const chargers = items.filter((item) => item.effect > 0).sort((a, b) => b.effect - a.effect);
  const balance = items.reduce((total, item) => total + item.effect, 0);

  const summary = [
    `Balance: ${balance > 0 ? '+' : ''}${balance} across ${items.length} items`,
    drains.length ? `Biggest drains: ${drains.slice(0, 3).map((item) => `${item.name} (${item.kind.toLowerCase()})`).join(', ')}` : '',
    chargers.length ? `Best chargers: ${chargers.slice(0, 3).map((item) => `${item.name} (${item.kind.toLowerCase()})`).join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
      <Card className='space-y-4 p-5'>
        <h2 className='font-heading text-3xl text-[var(--color-text-strong)]'>Add what fills your week</h2>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault();
            add();
          }}
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder='Weekly team meeting, gym, my sister, the commute…'
            maxLength={60}
            className='h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm outline-none focus:border-[var(--color-primary)]'
            aria-label='What drains or charges you'
          />
          <ChipGroup label='Kind' multiple={false} options={kinds} selected={[kind]} onToggle={setKind} />
          <div className='space-y-2'>
            <label htmlFor='energy-effect' className='text-sm font-semibold text-[var(--color-text)]'>
              Effect on your energy: <span className='font-normal text-[var(--color-muted)]'>{effectWords[effect]}</span>
            </label>
            <input id='energy-effect' type='range' min={-3} max={3} value={effect} onChange={(event) => setEffect(Number(event.target.value))} className='w-full accent-[var(--color-primary)]' />
            <div className='flex justify-between text-xs text-[var(--color-muted)]'>
              <span>Drains</span>
              <span>Charges</span>
            </div>
          </div>
          <Button type='submit' disabled={!name.trim()}>
            <Plus size={14} />
            Add to map
          </Button>
        </form>
      </Card>

      <Card className='space-y-4 p-5'>
        <div className='flex items-baseline justify-between'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Your energy map</p>
          {items.length ? (
            <p className='text-sm text-[var(--color-muted)]'>
              Net <span className='font-semibold tabular-nums text-[var(--color-text-strong)]'>{balance > 0 ? '+' : ''}{balance}</span>
            </p>
          ) : null}
        </div>

        {items.length ? (
          <ul className='space-y-2'>
            {[...drains, ...items.filter((item) => item.effect === 0), ...chargers.slice().reverse()].map((item) => (
              <li key={item.id} className='grid grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)_auto] items-center gap-2 text-sm'>
                <span className='flex justify-end'>
                  {item.effect < 0 ? <span className='h-3 rounded-s-full bg-[var(--color-scale-5)]' style={{ width: `${(-item.effect / 3) * 100}%` }} /> : null}
                </span>
                <span className='truncate text-center text-[var(--color-text)]' title={`${item.name} · ${item.kind}`}>{item.name}</span>
                <span className='flex'>
                  {item.effect > 0 ? <span className='h-3 rounded-e-full bg-[var(--color-scale-1)]' style={{ width: `${(item.effect / 3) * 100}%` }} /> : null}
                </span>
                <button type='button' aria-label={`Remove ${item.name}`} onClick={() => setItems((prev) => prev.filter((entry) => entry.id !== item.id))} className='text-[var(--color-muted)] hover:text-[var(--color-text)]'>
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-[var(--color-muted)]'>Add five to ten things to see the shape of your week. Aim for a mix of people, tasks, places and habits.</p>
        )}

        {items.length >= 3 ? (
          <div className='space-y-3 rounded-xl bg-[var(--color-surface-soft)] p-3 text-sm text-[var(--color-muted)]'>
            {drains[0] ? <p>Biggest drain: <strong className='text-[var(--color-text)]'>{drains[0].name}</strong>. Can it be shortened, batched, delegated, or followed by a charger?</p> : null}
            {chargers[0] ? <p>Best charger: <strong className='text-[var(--color-text)]'>{chargers[0].name}</strong>. Protect it in your calendar before the week fills up.</p> : null}
          </div>
        ) : null}

        <SaveToThoughtsButton toolId='energy-drain-finder' title='My energy map' content={summary} tags={['energy']} disabled={items.length < 2} />
      </Card>
    </div>
  );
}
