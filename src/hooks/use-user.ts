'use client';

import { useProfile } from '@/hooks/use-profile';

/**
 * Identity is local-only: there are no accounts, sessions, or servers involved.
 * Kept as a thin alias over useProfile so callers read naturally.
 */
export function useUser() {
  const { profile, hasProfile, displayName } = useProfile();

  return {
    profile,
    displayName,
    hasProfile,
  };
}
