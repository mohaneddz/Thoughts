'use client';

import { useMemo, useState } from 'react';
import { sampleCheckIns } from '@/data/tests';
import type { CheckInEntry } from '@/types/result';

export function useCheckIns() {
  const [entries, setEntries] = useState<CheckInEntry[]>(sampleCheckIns);

  const addEntry = (entry: CheckInEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const trend = useMemo(() => {
    if (!entries.length) return { mood: 0, stress: 0, energy: 0 };
    const divisor = entries.length;
    const totals = entries.reduce(
      (acc, current) => {
        acc.mood += current.mood;
        acc.stress += current.stress;
        acc.energy += current.energy;
        return acc;
      },
      { mood: 0, stress: 0, energy: 0 },
    );

    return {
      mood: Math.round((totals.mood / divisor) * 10) / 10,
      stress: Math.round((totals.stress / divisor) * 10) / 10,
      energy: Math.round((totals.energy / divisor) * 10) / 10,
    };
  }, [entries]);

  return { entries, addEntry, trend };
}

