import { describe, expect, it } from 'vitest';
import { crisisRegions, getCrisisRegion, guessCrisisRegion } from '@/data/crisisResources';

describe('crisis regions', () => {
  it('guesses the region from browser language tags', () => {
    expect(guessCrisisRegion(['en-GB', 'en'])).toBe('gb');
    expect(guessCrisisRegion(['fr-CA'])).toBe('ca');
    expect(guessCrisisRegion(['ar-DZ', 'fr-FR'])).toBe('fr');
  });

  it('falls back to the generic list when nothing matches', () => {
    expect(guessCrisisRegion(['ar-DZ', 'ar'])).toBe('other');
    expect(getCrisisRegion('zz').code).toBe('other');
  });

  it('gives every region an emergency entry first', () => {
    for (const region of crisisRegions) {
      expect(region.resources[0].detail).toMatch(/112|911|9-1-1|999|emergency/i);
    }
  });
});
