import type { DomainScore, ScoreDirection, SeverityBand } from '@/types/test';

export interface PatternScore {
  label: string;
  value: number;
}

export interface CrisisSignal {
  level: 'urgent' | 'elevated';
  reason: string;
}

/** Older saved results may lack minScore/percent, so those stay optional when reading from storage. */
export type DomainResult = Omit<DomainScore, 'minScore' | 'percent'> & Partial<Pick<DomainScore, 'minScore' | 'percent'>>;

export interface TestResultSummary {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  /** 0-100 position between the lowest and highest possible total. */
  score: number;
  rawScore?: number;
  minScore?: number;
  maxScore?: number;
  higherIs?: ScoreDirection;
  band?: SeverityBand;
  pattern: string;
  strengths: string[];
  growthAreas: string[];
  meaning: string;
  nonMeaning: string[];
  createdAt: string;
  /** Legacy field from results saved before 2026-10; it held invented numbers and is no longer written or shown. */
  keyPatterns?: PatternScore[];
  crisisSignal?: CrisisSignal;
  domains?: DomainResult[];
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

