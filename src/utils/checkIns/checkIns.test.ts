import { describe, expect, it } from 'vitest';
import { checkInStreak, reflectOnCheckIn } from '@/utils/checkIns';
import type { CheckInEntry } from '@/types/result';

const base = { mood: 5, stress: 5, energy: 5, sleep: 5, focus: 5, motivation: 5, socialBattery: 5 };

function entryOn(date: string): CheckInEntry {
  return { id: date, ...base, createdAt: new Date(date).toISOString() };
}

describe('checkInStreak', () => {
  const now = new Date('2026-10-22T18:00:00');

  it('counts consecutive days ending today', () => {
    expect(checkInStreak([entryOn('2026-10-22T09:00:00'), entryOn('2026-10-21T09:00:00'), entryOn('2026-10-20T09:00:00')], now)).toBe(3);
  });

  it('still counts a streak that ended yesterday', () => {
    expect(checkInStreak([entryOn('2026-10-21T09:00:00'), entryOn('2026-10-20T09:00:00')], now)).toBe(2);
  });

  it('breaks on a missed day', () => {
    expect(checkInStreak([entryOn('2026-10-22T09:00:00'), entryOn('2026-10-20T09:00:00')], now)).toBe(1);
  });
});

describe('reflectOnCheckIn', () => {
  it('treats high stress as the hardest dimension', () => {
    const reflection = reflectOnCheckIn({ ...base, stress: 10, mood: 8 });
    expect(reflection.headline).toMatch(/stress is the hardest/);
    expect(reflection.headline).toMatch(/^Mood/);
  });

  it('calls an all-high day steady', () => {
    const reflection = reflectOnCheckIn({ mood: 9, stress: 2, energy: 8, sleep: 8, focus: 9, motivation: 8, socialBattery: 7 });
    expect(reflection.headline).toBe('A steady day across the board.');
  });
});
