'use client';

import { useMemo } from 'react';
import { sampleResult } from '@/data/tests';
import { usePersonalData } from '@/hooks/use-personal-data';

export function useResults(resultId?: string) {
  const { results } = usePersonalData();

  return useMemo(() => {
    if (!resultId) return results[0] ?? sampleResult;
    return results.find((item) => item.id === resultId) ?? { ...sampleResult, id: resultId };
  }, [resultId, results]);
}

