import { z } from 'zod';
import type { AIInterpretationMode, TestResultSummary } from '@/types/result';

export const aiModes = [
  'gentle-explanation',
  'honest-mirror',
  'practical-advice',
  'ask-me-questions',
  'explain-simply',
  'journal-prompts',
] as const satisfies readonly AIInterpretationMode[];

const shortText = z.string().trim().max(400);

/** The only result data that ever leaves the device: no answers, no profile, no notes. */
export const resultContextSchema = z.object({
  testTitle: shortText,
  pattern: shortText,
  meaning: z.string().trim().max(1200),
  score: z.number().optional(),
  minScore: z.number().optional(),
  maxScore: z.number().optional(),
  higherIs: z.enum(['better', 'worse', 'neutral']).optional(),
  band: z.object({ label: shortText, description: shortText.optional() }).optional(),
  domains: z
    .array(z.object({ label: shortText, score: z.number(), maxScore: z.number(), band: shortText.optional() }))
    .max(12)
    .optional(),
  crisis: z.enum(['urgent', 'elevated']).optional(),
});

export type AIResultContext = z.infer<typeof resultContextSchema>;

export const interpretRequestSchema = z.object({
  mode: z.enum(aiModes),
  context: resultContextSchema,
});

export const chatRequestSchema = z.object({
  context: resultContextSchema,
  messages: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(1500) }))
    .min(1)
    .max(12),
});

export type ChatMessage = z.infer<typeof chatRequestSchema>['messages'][number];

export function toResultContext(result: TestResultSummary): AIResultContext {
  return {
    testTitle: result.testTitle,
    pattern: result.pattern,
    meaning: result.meaning,
    score: result.rawScore,
    minScore: result.minScore,
    maxScore: result.maxScore,
    higherIs: result.higherIs,
    band: result.band ? { label: result.band.label, description: result.band.description } : undefined,
    domains: result.domains
      ?.filter((domain) => !domain.parentId)
      .slice(0, 12)
      .map((domain) => ({ label: domain.label, score: domain.score, maxScore: domain.maxScore, band: domain.band?.label })),
    crisis: result.crisisSignal?.level,
  };
}
