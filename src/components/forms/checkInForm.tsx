'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { checkInDimensions, type CheckInDimension } from '@/utils/checkIns';

export type CheckInValues = Record<CheckInDimension, number> & { note: string };

const initialValues: CheckInValues = {
  mood: 5,
  stress: 5,
  energy: 5,
  sleep: 5,
  focus: 5,
  motivation: 5,
  socialBattery: 5,
  note: '',
};

export function CheckInForm({ onSubmit }: { onSubmit: (values: CheckInValues) => void }) {
  const [values, setValues] = useState<CheckInValues>(initialValues);

  return (
    <Card className='space-y-5 p-5 sm:p-6'>
      <div className='space-y-1'>
        <h2 className='font-heading text-3xl text-[var(--color-text-strong)]'>How are you, right now?</h2>
        <p className='text-sm text-[var(--color-muted)]'>Seven quick sliders. Go with your first instinct.</p>
      </div>

      <div className='grid gap-x-8 gap-y-5 md:grid-cols-2'>
        {checkInDimensions.map((dimension) => (
          <div key={dimension.key} className='space-y-1.5'>
            <div className='flex items-baseline justify-between'>
              <label htmlFor={`check-in-${dimension.key}`} className='text-sm font-semibold text-[var(--color-text)]'>
                {dimension.label}
              </label>
              <span className='font-heading text-2xl tabular-nums text-[var(--color-text-strong)]'>{values[dimension.key]}</span>
            </div>
            <input
              id={`check-in-${dimension.key}`}
              type='range'
              min={1}
              max={10}
              value={values[dimension.key]}
              onChange={(event) => setValues((prev) => ({ ...prev, [dimension.key]: Number(event.target.value) }))}
              className='w-full'
              style={{ accentColor: dimension.color }}
              aria-valuetext={`${values[dimension.key]} of 10`}
            />
            <div className='flex justify-between text-xs text-[var(--color-muted)]'>
              <span>{dimension.low}</span>
              <span>{dimension.high}</span>
            </div>
          </div>
        ))}
      </div>

      <div className='space-y-2'>
        <label htmlFor='check-in-note' className='text-sm font-semibold text-[var(--color-text)]'>Anything behind those numbers?</label>
        <textarea
          id='check-in-note'
          value={values.note}
          maxLength={500}
          onChange={(event) => setValues((prev) => ({ ...prev, note: event.target.value }))}
          className='h-24 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm outline-none focus:border-[var(--color-primary)]'
          placeholder='Optional — a sentence is plenty.'
        />
      </div>

      <Button
        onClick={() => {
          onSubmit(values);
          setValues((prev) => ({ ...prev, note: '' }));
        }}
      >
        Save check-in
      </Button>
    </Card>
  );
}
