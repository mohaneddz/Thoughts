'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  type LocalProfile,
  PROFILE_STORAGE_KEY,
  defaultProfile,
  readProfile,
  subscribeToProfile,
  writeProfile,
} from '@/utils/storage/profile';

export function useProfile() {
  const rawProfile = useSyncExternalStore(
    subscribeToProfile,
    () => {
      if (typeof window === 'undefined') {
        return '';
      }

      return window.localStorage.getItem(PROFILE_STORAGE_KEY) ?? '';
    },
    () => '',
  );

  const profile = useMemo(() => (rawProfile ? readProfile() : defaultProfile), [rawProfile]);

  const updateProfile = useCallback((patch: Partial<LocalProfile>) => {
    const current = readProfile();
    writeProfile({
      ...current,
      ...patch,
      createdAt: current.createdAt || new Date().toISOString(),
    });
  }, []);

  return {
    profile,
    /** False until the visitor has picked a name, so the app can prompt for one. */
    hasProfile: profile.displayName.trim().length > 0,
    displayName: profile.displayName.trim() || 'You',
    updateProfile,
  };
}
