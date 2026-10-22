'use client';

import { useMemo } from 'react';
import { usePersonalData } from '@/hooks/usePersonalData';

export function useResult(resultId: string | undefined) {
  const { results, isReady } = usePersonalData();

  const result = useMemo(
    () => (resultId ? results.find((item) => item.id === resultId) : results[0]),
    [resultId, results],
  );

  return { result, isReady };
}
