'use client';

import { Input } from '@/components/ui/input';

export function NumericScaleQuestion({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
}: {
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const sliderValue = value ?? min;
  return (
    <div className='space-y-3'>
      <input
        type='range'
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className='w-full'
      />
      <Input
        type='number'
        min={min}
        max={max}
        step={step}
        value={value ?? ''}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
