import type { TestAnswer } from '@/types/test';
import type { TestResultSummary } from '@/types/result';
import { sampleResult } from '@/data/tests';

export function scoreTest(answers: TestAnswer[]): number {
  if (!answers.length) return 0;
  const numericValues = answers
    .map((answer) => (typeof answer.value === 'number' ? answer.value : 0))
    .filter((value) => !Number.isNaN(value));

  if (!numericValues.length) return 0;

  const max = numericValues.length * 5;
  const total = numericValues.reduce((sum, value) => sum + value, 0);
  return Math.round((total / max) * 100);
}

export function toResultSummary(score: number, testTitle: string): TestResultSummary {
  return {
    ...sampleResult,
    id: `r-${Date.now()}`,
    score,
    testTitle,
  };
}

