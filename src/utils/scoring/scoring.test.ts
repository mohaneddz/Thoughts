import { describe, expect, it } from 'vitest';
import { testsData } from '@/data/tests';
import { scoreTestForDefinition, toResultSummaryFromBreakdown } from '@/utils/scoring';
import type { AnswerValue } from '@/types/common';
import type { TestDefinition } from '@/types/test';

function getTest(slug: string): TestDefinition {
  const test = testsData.find((item) => item.slug === slug);
  if (!test) throw new Error(`No test with slug ${slug}`);
  return test;
}

function answerAll(test: TestDefinition, value: string): Record<string, AnswerValue> {
  return Object.fromEntries(test.questions.map((question) => [question.id, value]));
}

function run(slug: string, answers: Record<string, AnswerValue>) {
  const test = getTest(slug);
  const breakdown = scoreTestForDefinition(test, answers);
  return { breakdown, summary: toResultSummaryFromBreakdown(test, breakdown, answers) };
}

describe('PHQ-9', () => {
  it('scores the maximum as severe and flags item 9', () => {
    const { breakdown, summary } = run('phq-9', answerAll(getTest('phq-9'), 'nearly-every-day'));
    expect(breakdown.totalScore).toBe(27);
    expect(breakdown.band?.label).toBe('Severe');
    expect(summary.crisisSignal?.level).toBe('urgent');
  });

  it('scores no symptoms as minimal with no crisis signal', () => {
    const { breakdown, summary } = run('phq-9', answerAll(getTest('phq-9'), 'not-at-all'));
    expect(breakdown.totalScore).toBe(0);
    expect(breakdown.normalizedScore).toBe(0);
    expect(summary.pattern).toBe('Minimal');
    expect(summary.crisisSignal).toBeUndefined();
  });
});

describe('PSS-10', () => {
  it('reverse-scores items 4, 5, 7 and 8', () => {
    const { breakdown } = run('pss-perceived-stress-scale', answerAll(getTest('pss-perceived-stress-scale'), 'very-often'));
    expect(breakdown.totalScore).toBe(24);
    expect(breakdown.band?.label).toBe('Moderate perceived stress');
  });

  it('never describes high stress as a good result', () => {
    const test = getTest('pss-perceived-stress-scale');
    const answers = Object.fromEntries(
      test.questions.map((question, index) => [question.id, [3, 4, 6, 7].includes(index) ? 'never' : 'very-often']),
    );
    const { breakdown, summary } = run('pss-perceived-stress-scale', answers);
    expect(breakdown.totalScore).toBe(40);
    expect(summary.pattern).toBe('High perceived stress');
  });
});

describe('Rosenberg', () => {
  it('reverse-scores the five negatively worded items', () => {
    const { breakdown } = run('rosenberg-self-esteem-scale', answerAll(getTest('rosenberg-self-esteem-scale'), 'strongly-agree'));
    expect(breakdown.totalScore).toBe(15);
    expect(breakdown.band?.label).toBe('Typical self-esteem range');
  });
});

describe('DASS-21', () => {
  it('doubles each subscale and bands it', () => {
    const { breakdown, summary } = run('dass-21', answerAll(getTest('dass-21'), 'very-much'));
    expect(breakdown.domains?.map((domain) => domain.score)).toEqual([42, 42, 42]);
    expect(breakdown.domains?.every((domain) => domain.band?.label === 'Extremely severe')).toBe(true);
    expect(summary.pattern).toMatch(/Extremely severe/);
  });
});

describe('C-SSRS', () => {
  it('reads all-no answers as no reported risk', () => {
    const test = getTest('c-ssrs');
    const { summary } = run('c-ssrs', { 'cssrs-q1': 'no', 'cssrs-q2': 'no', 'cssrs-q6': 'no' });
    expect(test.questions.length).toBe(6);
    expect(summary.crisisSignal).toBeUndefined();
    expect(summary.pattern).toBe('No ideation or behavior reported');
  });

  it('marks active ideation as urgent', () => {
    const { summary } = run('c-ssrs', { 'cssrs-q1': 'yes', 'cssrs-q2': 'yes', 'cssrs-q3': 'no', 'cssrs-q4': 'no', 'cssrs-q5': 'no', 'cssrs-q6': 'no' });
    expect(summary.crisisSignal?.level).toBe('urgent');
  });
});

describe('IPIP-NEO-120', () => {
  const test = getTest('ipip-neo-120');

  it('has 5 domains and 30 facets of 4 items each', () => {
    const domains = test.scoring.domains ?? [];
    expect(domains.filter((domain) => !domain.parentId)).toHaveLength(5);
    expect(domains.filter((domain) => domain.parentId)).toHaveLength(30);
    expect(domains.filter((domain) => domain.parentId).every((facet) => facet.questionIds.length === 4)).toBe(true);
  });

  it('applies the published reverse keys', () => {
    const { breakdown } = run('ipip-neo-120', answerAll(test, 'strongly-agree'));
    const byId = Object.fromEntries((breakdown.domains ?? []).map((domain) => [domain.id, domain.score]));
    // 17 forward-keyed items at 5 + 7 reverse-keyed items at 1
    expect(byId.neuroticism).toBe(92);
    // Morality, Cooperation, Modesty and Cautiousness are entirely reverse-keyed
    expect(byId.agreeableness_morality).toBe(4);
    expect(byId.conscientiousness_cautiousness).toBe(4);
    expect(byId.extraversion_excitement_seeking).toBe(20);
  });

  it('describes the profile by its highest and lowest domains, not a total', () => {
    const { summary } = run('ipip-neo-120', answerAll(test, 'neutral'));
    expect(summary.pattern).toMatch(/^Most pronounced: /);
    expect(summary.domains?.find((domain) => domain.id === 'openness')?.percent).toBe(50);
  });
});

describe('IPIP Big Five', () => {
  it('scores five separate domains on the 50-item form', () => {
    const { breakdown } = run('ipip-big-five-50', answerAll(getTest('ipip-big-five-50'), 'neutral'));
    expect(breakdown.domains?.map((domain) => domain.score)).toEqual([30, 30, 30, 30, 30]);
  });

  it('scores five separate domains on the 100-item form', () => {
    const { breakdown } = run('ipip-big-five-100', answerAll(getTest('ipip-big-five-100'), 'agree'));
    expect(breakdown.domains).toHaveLength(5);
    expect(breakdown.domains?.every((domain) => domain.maxScore === 100 && domain.minScore === 20)).toBe(true);
  });
});

describe('IPIP curated pack', () => {
  it('scores each scale on its own', () => {
    const { breakdown } = run('ipip-personality-scales', answerAll(getTest('ipip-personality-scales'), 'neutral'));
    expect(breakdown.domains?.map((domain) => domain.id)).toEqual([
      'cognitive-failures',
      'locus-control',
      'order-cleanliness',
      'optimism',
      'private-self-consciousness',
    ]);
  });
});

describe('MDQ', () => {
  it('applies the positive-screen rule', () => {
    const answers: Record<string, AnswerValue> = { 'mdq-q14': 'yes', 'mdq-q15': 'serious' };
    for (let index = 1; index <= 13; index += 1) answers[`mdq-q${index}`] = index <= 7 ? 'yes' : 'no';
    const { breakdown, summary } = run('mdq', answers);
    expect(breakdown.totalScore).toBe(7);
    expect(breakdown.band?.label).toBe('Positive screen rule met');
    expect(summary.crisisSignal?.level).toBe('elevated');
  });
});

describe('normalization', () => {
  it('maps the lowest possible likert answers to 0%', () => {
    const test = getTest('ipip-big-five-50');
    const lowest = Object.fromEntries(test.questions.map((question) => [question.id, question.reverseScored ? 'strongly-agree' : 'strongly-disagree']));
    const { breakdown } = run('ipip-big-five-50', lowest);
    expect(breakdown.normalizedScore).toBe(0);
    expect(breakdown.domains?.every((domain) => domain.percent === 0)).toBe(true);
  });

  it('every runnable test has a score direction and a usable range', () => {
    for (const test of testsData.filter((item) => item.status !== 'pending')) {
      const breakdown = scoreTestForDefinition(test, {});
      expect(['better', 'worse', 'neutral']).toContain(test.scoring.higherIs);
      expect(breakdown.maxScore).toBeGreaterThan(breakdown.minScore);
    }
  });
});
