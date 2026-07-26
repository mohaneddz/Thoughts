export interface PatternScore {
  label: string;
  value: number;
}

export interface CrisisSignal {
  level: 'urgent' | 'elevated';
  reason: string;
}

export interface TestResultSummary {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  score: number;
  pattern: string;
  strengths: string[];
  growthAreas: string[];
  meaning: string;
  nonMeaning: string[];
  createdAt: string;
  keyPatterns: PatternScore[];
  crisisSignal?: CrisisSignal;
}

export type AIInterpretationMode =
  | 'gentle-explanation'
  | 'honest-mirror'
  | 'practical-advice'
  | 'ask-me-questions'
  | 'explain-simply'
  | 'journal-prompts';

export interface AIInterpretation {
  id: string;
  resultId: string;
  mode: AIInterpretationMode;
  response: string;
  createdAt: string;
}

export interface CheckInEntry {
  id: string;
  mood: number;
  stress: number;
  energy: number;
  sleep: number;
  focus: number;
  motivation: number;
  socialBattery: number;
  note?: string;
  createdAt: string;
}

