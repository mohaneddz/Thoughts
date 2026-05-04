'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const fields = ['mood', 'stress', 'energy', 'sleep', 'focus', 'motivation', 'socialBattery'] as const;

type FieldName = (typeof fields)[number];

export interface CheckInValues {
  mood: number;
  stress: number;
  energy: number;
  sleep: number;
  focus: number;
  motivation: number;
  socialBattery: number;
  note: string;
}

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

  const update = (field: FieldName, value: number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className='space-y-4'>
      <h2 className='font-heading text-3xl'>Quick Check-in</h2>
      {fields.map((field) => (
        <label key={field} className='block space-y-1'>
          <span className='text-sm capitalize text-[var(--color-muted)]'>{field.replace('Battery', ' battery')}</span>
          <input
            type='range'
            min={1}
            max={10}
            value={values[field]}
            onChange={(event) => update(field, Number(event.target.value))}
            className='w-full accent-[var(--color-primary)]'
          />
        </label>
      ))}
      <textarea
        value={values.note}
        onChange={(event) => setValues((prev) => ({ ...prev, note: event.target.value }))}
        className='h-24 w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 text-sm'
        placeholder='Optional note'
      />
      <Button onClick={() => onSubmit(values)}>Save check-in</Button>
    </Card>
  );
}

