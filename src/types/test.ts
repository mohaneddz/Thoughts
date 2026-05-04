import type { AnswerValue, TestCategory, TestDepth, TestTone } from '@/types/common';

export type QuestionType = 'likert' | 'multiple' | 'yes-no' | 'reflection';

export interface TestQuestion {
  id: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
  allowSkip?: boolean;
}

export interface TestDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: TestCategory;
  estimatedMinutes: number;
  depth: TestDepth;
  tone: TestTone;
  questions: TestQuestion[];
}

export interface TestAnswer {
  questionId: string;
  value: AnswerValue;
}

