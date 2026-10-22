import type { CheckInEntry } from '@/types/result';

export type CheckInDimension = 'mood' | 'stress' | 'energy' | 'sleep' | 'focus' | 'motivation' | 'socialBattery';

export const checkInDimensions: Array<{
  key: CheckInDimension;
  label: string;
  low: string;
  high: string;
  /** Stress is the one dimension where a high number is the harder day. */
  higherIsBetter: boolean;
  color: string;
}> = [
  { key: 'mood', label: 'Mood', low: 'Heavy', high: 'Bright', higherIsBetter: true, color: 'var(--color-primary)' },
  { key: 'stress', label: 'Stress', low: 'Calm', high: 'Wound up', higherIsBetter: false, color: 'var(--color-scale-5)' },
  { key: 'energy', label: 'Energy', low: 'Drained', high: 'Charged', higherIsBetter: true, color: 'var(--color-scale-3)' },
  { key: 'sleep', label: 'Sleep', low: 'Poor', high: 'Restful', higherIsBetter: true, color: '#6a86c4' },
  { key: 'focus', label: 'Focus', low: 'Scattered', high: 'Locked in', higherIsBetter: true, color: '#8b6bb3' },
  { key: 'motivation', label: 'Motivation', low: 'Flat', high: 'Driven', higherIsBetter: true, color: 'var(--color-accent)' },
  { key: 'socialBattery', label: 'Social battery', low: 'Empty', high: 'Full', higherIsBetter: true, color: '#4f8f7a' },
];

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** Consecutive days with at least one check-in, ending today or yesterday. */
export function checkInStreak(entries: CheckInEntry[], now = new Date()) {
  const days = new Set(entries.map((entry) => dayKey(new Date(entry.createdAt))));
  const cursor = new Date(now);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function entriesSince(entries: CheckInEntry[], days: number, now = new Date()) {
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return entries.filter((entry) => new Date(entry.createdAt).getTime() >= cutoff);
}

export function average(entries: CheckInEntry[], key: CheckInDimension) {
  if (!entries.length) return null;
  return Math.round((entries.reduce((total, entry) => total + entry[key], 0) / entries.length) * 10) / 10;
}

/**
 * A short, rule-based read of one check-in: the strongest and weakest dimensions
 * (stress inverted so "weakest" always means "hardest"), plus one small action.
 */
export function reflectOnCheckIn(entry: Omit<CheckInEntry, 'id' | 'createdAt'>) {
  const wellbeing = checkInDimensions.map((dimension) => ({
    ...dimension,
    value: dimension.higherIsBetter ? entry[dimension.key] : 11 - entry[dimension.key],
  }));
  const sorted = [...wellbeing].sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const hardest = sorted[sorted.length - 1];

  const actions: Record<CheckInDimension, string> = {
    mood: 'Do one small thing you usually enjoy, even for ten minutes.',
    stress: 'Take five slow breaths, then write down the one thing that is pressing hardest.',
    energy: 'Step outside or drink some water before the next task.',
    sleep: 'Set a wind-down alarm an hour before bed tonight.',
    focus: 'Close everything except one task and set a 25-minute timer.',
    motivation: 'Shrink the next task until it feels almost too easy to start.',
    socialBattery: 'Protect an hour alone, or reach out to one easy person — whichever recharges you.',
  };

  if (hardest.value >= 7) {
    return { headline: 'A steady day across the board.', detail: `${strongest.label} stands out most. Notice what made today work.`, action: 'Write down one thing you want to repeat tomorrow.' };
  }

  return {
    headline: `${strongest.label} is holding up best; ${hardest.label.toLowerCase()} is the hardest right now.`,
    detail: hardest.key === 'stress' ? `Stress is at ${entry.stress}/10.` : `${hardest.label} is at ${entry[hardest.key]}/10.`,
    action: actions[hardest.key],
  };
}
