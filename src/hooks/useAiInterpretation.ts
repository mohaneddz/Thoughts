'use client';

import { useMutation } from '@tanstack/react-query';
import type { AIInterpretationMode, TestResultSummary } from '@/types/result';

interface AIRequest {
  mode: AIInterpretationMode;
  result: TestResultSummary;
}

export function useAIInterpretation() {
  return useMutation({
    mutationFn: async ({ mode, result }: AIRequest) => {
      const response = await fetch('/api/ai/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, result }),
      });

      if (!response.ok) {
        throw new Error('Unable to generate interpretation.');
      }

      const data = (await response.json()) as { message: string };
      return data.message;
    },
  });
}

