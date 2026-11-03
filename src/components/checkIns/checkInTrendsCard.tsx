'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart } from '@/components/charts/lineChart';
import { ChipGroup } from '@/components/tools/chipGroup';
import { checkInDimensions, entriesSince, type CheckInDimension } from '@/utils/checkIns';
import { formatShortDate } from '@/utils/formatting';
import type { CheckInEntry } from '@/types/result';

const ranges = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 365, label: 'Year' },
];

export function CheckInTrendsCard({ entries, title = 'Trends' }: { entries: CheckInEntry[]; title?: string }) {
  const [days, setDays] = useState(30);
  const [shown, setShown] = useState<CheckInDimension[]>(['mood', 'stress', 'energy', 'sleep']);

  const inRange = entriesSince(entries, days).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const dimensions = checkInDimensions.filter((dimension) => shown.includes(dimension.key));

  return (
    <Card className='space-y-4 p-5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>{title}</p>
        <div className='flex gap-1'>
          {ranges.map((range) => (
            <Button key={range.days} size='sm' variant={days === range.days ? 'primary' : 'ghost'} onClick={() => setDays(range.days)}>
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <ChipGroup
        label='Dimensions to chart'
        options={checkInDimensions.map((dimension) => dimension.label)}
        selected={dimensions.map((dimension) => dimension.label)}
        onToggle={(label) => {
          const key = checkInDimensions.find((dimension) => dimension.label === label)!.key;
          setShown((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
        }}
      />

      {inRange.length >= 2 && dimensions.length ? (
        <LineChart
          labels={inRange.map((entry) => formatShortDate(entry.createdAt))}
          series={dimensions.map((dimension) => ({
            id: dimension.key,
            label: dimension.label,
            color: dimension.color,
            values: inRange.map((entry) => entry[dimension.key]),
          }))}
          yMin={1}
          yMax={10}
          yTicks={4}
        />
      ) : (
        <p className='rounded-xl bg-[var(--color-surface-soft)] p-4 text-sm text-[var(--color-muted)]'>
          {inRange.length < 2 ? 'Two or more check-ins in this range will draw a trend.' : 'Pick at least one dimension to chart.'}
        </p>
      )}
    </Card>
  );
}
