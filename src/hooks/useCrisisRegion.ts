'use client';

import { useHydrated } from '@/hooks/useHydrated';
import { useProfile } from '@/hooks/useProfile';
import { defaultCrisisRegion, getCrisisRegion, guessCrisisRegion } from '@/data/crisisResources';

/** The visitor's chosen region, else a guess from the browser language once hydrated. */
export function useCrisisRegion() {
  const hydrated = useHydrated();
  const { profile, updateProfile } = useProfile();
  const code = profile.crisisRegion ?? (hydrated ? guessCrisisRegion(navigator.languages) : defaultCrisisRegion);

  return {
    region: getCrisisRegion(code),
    setRegion: (next: string) => updateProfile({ crisisRegion: next }),
  };
}
