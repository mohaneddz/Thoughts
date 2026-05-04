'use client';

import { useMemo } from 'react';
import { sampleResult } from '@/data/tests';

export function useResults(resultId?: string) {
  return useMemo(() => {
    if (!resultId) return sampleResult;
    return { ...sampleResult, id: resultId };
  }, [resultId]);
}

