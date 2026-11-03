import type { AnswerValue, TestCategory, TestDepth, TestTone } from '@/types/common';

export type QuestionType =
  | 'single-choice'
  | 'multi-select'
  | 'yes-no'
  | 'true-false'
  | 'likert'
  | 'frequency'
  | 'numeric-scale'
  | 'short-text'
  | 'long-text'
  | 'reflection';

export type ScoreDirection = 'better' | 'worse' | 'neutral';

export type TestStatus = 'active' | 'licensed' | 'caution' | 'pending';
export type TestRiskLevel = 'low' | 'medium' | 'high';

export interface ChoiceOption {
  value: string;
  label: string;
  score?: number;
  helperText?: string;
}

export interface VisibilityCondition {
  questionId: string;
  equals?: string | number | boolean;
  includes?: string;
}

export interface QuestionScoreMap {
  [choiceValue: string]: number;
}

export interface TestQuestion {
  id: string;
  prompt: string;
  type: QuestionType;
  helperText?: string;
  required?: boolean;
  allowSkip?: boolean;
  choices?: ChoiceOption[];
  minSelections?: number;
  maxSelections?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  placeholder?: string;
  scoreMap?: QuestionScoreMap;
  reverseScored?: boolean;
  visibilityCondition?: VisibilityCondition;
  followUps?: TestQuestion[];
}

export interface SeverityBand {
  label: string;
  min: number;
  max: number;
  description?: string;
}

export interface ScoringDomain {
  id: string;
  label: string;
  questionIds: string[];
  multiplier?: number;
  cutoffBands?: SeverityBand[];
  /** Facets point at the broad domain they belong to, so results can nest them. */
  parentId?: string;
  /** What scoring high on this domain tends to look like, shown when it is the most pronounced one. */
  description?: string;
  /** One concrete thing to try that fits this domain. */
  tip?: string;
}

/** A named pattern across domains, e.g. secure vs anxious attachment. First match wins. */
export interface ScoreProfile {
  label: string;
  description: string;
  /** Domain id → which half of its range the score must sit in (50% and above counts as high). */
  when: Record<string, 'low' | 'high'>;
}

export interface TestScoringConfig {
  model:
    | 'sum'
    | 'sum-with-severity'
    | 'domain-sum'
    | 'algorithmic'
    | 'external'
    | 'none';
  /** What a higher total means for the person: drives result copy so a high stress score never reads as good news. */
  higherIs: ScoreDirection;
  minScore?: number;
  maxScore?: number;
  cutoffBands?: SeverityBand[];
  domains?: ScoringDomain[];
  profiles?: ScoreProfile[];
  notes?: string;
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
  status: TestStatus;
  riskLevel: TestRiskLevel;
  tags: string[];
  sourceUrl: string;
  licenseNote?: string;
  variantGroup?: string;
  variantKey?: string;
  scoring: TestScoringConfig;
  questions: TestQuestion[];
}

export interface TestAnswer {
  questionId: string;
  value: AnswerValue;
}

export interface TestScoreBreakdown {
  totalScore: number;
  minScore: number;
  maxScore: number;
  normalizedScore: number;
  band?: SeverityBand;
  domains?: DomainScore[];
}

export interface DomainScore {
  id: string;
  label: string;
  score: number;
  minScore: number;
  maxScore: number;
  /** 0-100 position between the domain's lowest and highest possible score. */
  percent: number;
  band?: SeverityBand;
  parentId?: string;
}
