'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False during server render and hydration, true once the client has taken over and localStorage is readable. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
