import { describe, expect, it } from 'vitest';
import { reflectionTestsData } from '@/data/reflectionTests';
import { testsData } from '@/data/tests';
import { scoreTestForDefinition, toResultSummaryFromBreakdown } from '@/utils/scoring';
import type { AnswerValue } from '@/types/common';
import type { TestDefinition } from '@/types/test';

function getTest(slug: string): TestDefinition {
  const test = testsData.find((item) => item.slug === slug);
  if (!test) throw new Error(`No test with slug ${slug}`);
  return test;
}

/** Answers every item in the named domains at the top of the scale, everything else at the bottom. */
function answerHighOn(test: TestDefinition, highDomains: string[]): Record<string, AnswerValue> {
  const choices = test.questions[0].choices!;
  const [bottom, top] = [choices[0].value, choices[choices.length - 1].value];
  const highIds = new Set(test.scoring.domains!.filter((domain) => highDomains.includes(domain.id)).flatMap((domain) => domain.questionIds));
  return Object.fromEntries(
    test.questions.map((question) => {
      const wantHigh = highIds.has(question.id);
      return [question.id, wantHigh !== Boolean(question.reverseScored) ? top : bottom];
    }),
  );
}

function summarize(slug: string, answers: Record<string, AnswerValue>) {
  const test = getTest(slug);
  return toResultSummaryFromBreakdown(test, scoreTestForDefinition(test, answers), answers);
}

describe('reflection test content', () => {
  it('replaces all 15 templated tests and keeps their ids and slugs', () => {
    expect(reflectionTestsData).toHaveLength(15);
    expect(reflectionTestsData.map((test) => test.id)).toEqual(Array.from({ length: 15 }, (_, index) => `orig-${index + 1}`));
    expect(testsData.filter((test) => test.id.startsWith('orig-'))).toHaveLength(15);
  });

  it('puts every question in exactly one domain, with no duplicate prompts inside a test', () => {
    for (const test of reflectionTestsData) {
      const domainIds = test.scoring.domains!.flatMap((domain) => domain.questionIds);
      expect(new Set(domainIds).size).toBe(test.questions.length);
      expect(new Set(test.questions.map((question) => question.prompt)).size).toBe(test.questions.length);
      expect(test.scoring.domains!.every((domain) => domain.questionIds.length >= 2 && domain.description && domain.tip)).toBe(true);
    }
  });

  it('gives each banded test three contiguous bands covering the whole range', () => {
    for (const test of reflectionTestsData.filter((item) => item.scoring.cutoffBands)) {
      const bands = test.scoring.cutoffBands!;
      expect(bands[0].min).toBe(test.scoring.minScore);
      expect(bands[2].max).toBe(test.scoring.maxScore);
      expect(bands[1].min).toBe(bands[0].max + 1);
      expect(bands[2].min).toBe(bands[1].max + 1);
    }
  });
});

describe('attachment profiles', () => {
  const test = getTest('attachment-style-test');

  it.each([
    [[], 'Secure-leaning'],
    [['anxiety'], 'Anxious-leaning'],
    [['avoidance'], 'Avoidant-leaning'],
    [['anxiety', 'avoidance'], 'Anxious and avoidant at once'],
  ])('high on %j reads as %s', (high, label) => {
    expect(summarize(test.slug, answerHighOn(test, high)).pattern).toBe(label);
  });
});

describe('style tests', () => {
  it('names the most pronounced career interest and its tip', () => {
    const test = getTest('career-direction-test');
    const summary = summarize(test.slug, answerHighOn(test, ['helping']));
    expect(summary.pattern).toBe('Most pronounced: Helping');
    expect(summary.meaning).toMatch(/^Helping: /);
    expect(summary.meaning).toMatch(/Try this:/);
  });
});

describe('banded reflection tests', () => {
  it('points burnout at the heaviest area and its tip', () => {
    const test = getTest('burnout-reflection-test');
    const summary = summarize(test.slug, answerHighOn(test, ['exhaustion']));
    expect(summary.strengths).toContain('Most room to grow: Exhaustion');
    expect(summary.growthAreas[0]).toBe(test.scoring.domains!.find((domain) => domain.id === 'exhaustion')!.tip);
  });

  it('reads a low inner-critic score as quiet', () => {
    const test = getTest('inner-critic-test');
    expect(summarize(test.slug, answerHighOn(test, [])).pattern).toBe('Quiet inner critic');
  });
});

describe('SWLS', () => {
  const test = getTest('satisfaction-with-life-scale');

  it('scores 5–35 and bands the extremes', () => {
    const all = (value: string) => Object.fromEntries(test.questions.map((question) => [question.id, value]));
    expect(scoreTestForDefinition(test, all('strongly-agree')).totalScore).toBe(35);
    expect(summarize(test.slug, all('strongly-agree')).pattern).toBe('Extremely satisfied');
    expect(summarize(test.slug, all('neutral')).pattern).toBe('Neutral');
    expect(summarize(test.slug, all('strongly-disagree')).pattern).toBe('Extremely dissatisfied');
  });
});
