import type { AnswerValue } from '@/types/common';
import type { TestDefinition, TestQuestion, TestScoreBreakdown } from '@/types/test';
import type { CrisisSignal, TestResultSummary } from '@/types/result';
import { sampleResult } from '@/data/tests';
import { crisisCopy } from '@/data/crisis-resources';

function readRawScore(question: TestQuestion, rawValue: AnswerValue): number {
  if (rawValue == null) return 0;

  const scoreFromValue = (value: string | number | boolean): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value ? 1 : 0;

    const mapped = question.scoreMap?.[value];
    if (typeof mapped === 'number') return mapped;

    const match = question.choices?.find((choice) => choice.value === value);
    if (typeof match?.score === 'number') return match.score;

    return 0;
  };

  if (Array.isArray(rawValue)) {
    return rawValue.reduce((total, value) => total + scoreFromValue(value), 0);
  }

  if (typeof rawValue === 'object') {
    return 0;
  }

  return scoreFromValue(rawValue);
}

function applyReverseIfNeeded(question: TestQuestion, score: number): number {
  if (!question.reverseScored || !question.choices?.length) return score;
  const values = question.choices.map((choice) => choice.score ?? 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min + max - score;
}

function readQuestionScore(question: TestQuestion, rawValue: AnswerValue): number {
  const rawScore = readRawScore(question, rawValue);
  return applyReverseIfNeeded(question, rawScore);
}

function resolveBand(test: TestDefinition, score: number) {
  return test.scoring.cutoffBands?.find((band) => score >= band.min && score <= band.max);
}

function computeMaxScore(test: TestDefinition): number {
  if (typeof test.scoring.maxScore === 'number') {
    return test.scoring.maxScore;
  }

  return test.questions.reduce((total, question) => {
    if (question.choices?.length) {
      const maxChoice = Math.max(...question.choices.map((choice) => choice.score ?? 0));
      if (question.type === 'multi-select') {
        const cap = question.maxSelections ?? question.choices.length;
        return total + maxChoice * cap;
      }
      return total + maxChoice;
    }

    if (question.type === 'numeric-scale') {
      return total + (question.maxValue ?? 0);
    }

    return total;
  }, 0);
}

export function scoreTestForDefinition(
  test: TestDefinition,
  answers: Record<string, AnswerValue>,
): TestScoreBreakdown {
  if (test.slug === 'mdq') {
    const symptomYesCount = Array.from({ length: 13 }, (_, index) => answers[`mdq-q${index + 1}`] === 'yes').filter(Boolean).length;
    const samePeriod = answers['mdq-q14'] === 'yes';
    const impairment = answers['mdq-q15'];
    const moderateOrSerious = impairment === 'moderate' || impairment === 'serious';
    const positive = symptomYesCount >= 7 && samePeriod && moderateOrSerious;

    return {
      totalScore: symptomYesCount,
      maxScore: 13,
      normalizedScore: Math.round((symptomYesCount / 13) * 100),
      band: positive
        ? { label: 'Positive screen rule met', min: 0, max: 0, description: 'Common MDQ rule met (7+ symptoms, same period, moderate/serious impact).' }
        : { label: 'Positive screen rule not met', min: 0, max: 0, description: 'Does not meet common MDQ positive screen rule.' },
    };
  }

  const totalScore = test.questions.reduce((total, question) => total + readQuestionScore(question, answers[question.id]), 0);

  const maxScore = computeMaxScore(test);
  const normalizedScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const domains = test.scoring.domains?.map((domain) => {
    const domainScore = domain.questionIds.reduce((total, questionId) => {
      const question = test.questions.find((item) => item.id === questionId);
      if (!question) return total;
      return total + readQuestionScore(question, answers[questionId]);
    }, 0);

    const baseMax = domain.questionIds.reduce((total, questionId) => {
      const question = test.questions.find((item) => item.id === questionId);
      if (!question) return total;
      if (question.choices?.length) {
        return total + Math.max(...question.choices.map((choice) => choice.score ?? 0));
      }
      return total;
    }, 0);

    return {
      id: domain.id,
      label: domain.label,
      score: domain.multiplier ? domainScore * domain.multiplier : domainScore,
      maxScore: baseMax,
    };
  });

  return {
    totalScore,
    maxScore,
    normalizedScore,
    band: resolveBand(test, totalScore),
    domains,
  };
}

export function detectCrisisSignal(
  test: TestDefinition,
  answers: Record<string, AnswerValue>,
  breakdown: TestScoreBreakdown,
): CrisisSignal | undefined {
  if (test.slug === 'c-ssrs') {
    const activeIdeation = ['cssrs-q2', 'cssrs-q3', 'cssrs-q4', 'cssrs-q5'].some((id) => answers[id] === 'yes');
    const behavior = answers['cssrs-q6'] === 'yes';
    const passiveOnly = answers['cssrs-q1'] === 'yes' && !activeIdeation && !behavior;

    if (activeIdeation || behavior) {
      return { level: 'urgent', reason: 'Your answers include active suicidal thoughts, a plan, intent, or a related behavior.' };
    }
    if (passiveOnly) {
      return { level: 'elevated', reason: 'Your answers include a wish to be dead or to not wake up.' };
    }
    return undefined;
  }

  if (test.slug === 'phq-9') {
    const question = test.questions.find((item) => item.id === 'phq9-q9');
    if (question && readQuestionScore(question, answers['phq9-q9']) > 0) {
      return { level: 'urgent', reason: 'You indicated some thoughts of self-harm or being better off dead.' };
    }
  }

  if (test.slug === 'pcl-5' && breakdown.band?.label === 'Common probable PTSD cutoff range') {
    return { level: 'elevated', reason: 'Your responses fall in the common probable PTSD cutoff range.' };
  }

  if (test.slug === 'mdq' && breakdown.band?.label === 'Positive screen rule met') {
    return { level: 'elevated', reason: 'Your answers meet the common MDQ positive screen rule for bipolar-spectrum symptoms.' };
  }

  return undefined;
}

export function scoreTest(): number {
  return 0;
}

export function toResultSummary(score: number, testTitle: string): TestResultSummary {
  return {
    ...sampleResult,
    id: `r-${Date.now()}`,
    score,
    testTitle,
  };
}

export function toResultSummaryFromBreakdown(
  test: TestDefinition,
  breakdown: TestScoreBreakdown,
  answers: Record<string, AnswerValue> = {},
): TestResultSummary {
  const normalized = breakdown.normalizedScore;
  const crisisSignal = detectCrisisSignal(test, answers, breakdown);

  const pattern = crisisSignal
    ? crisisCopy[crisisSignal.level].title
    : normalized >= 80
      ? 'Strongly grounded'
      : normalized >= 60
        ? 'Mostly steady'
        : normalized >= 40
          ? 'Mixed right now'
          : 'Needs attention';

  const strengths = [
    normalized >= 65 ? 'Clear self-awareness' : 'Honest signal',
    test.tone === 'reflective' ? 'Reflection-ready' : 'Direct feedback',
    test.depth === 'deep' ? 'Pattern depth' : 'Quick clarity',
  ];

  const growthAreas = [
    normalized >= 70 ? 'Consistency under pressure' : 'Stabilizing your baseline',
    test.category,
    breakdown.band?.label ?? 'Reading context carefully',
  ];

  const meaning = crisisSignal
    ? crisisCopy[crisisSignal.level].body
    : normalized >= 70
      ? `This result suggests you currently have a workable foundation in ${test.category.toLowerCase()}, with a few edges worth refining.`
      : `This result suggests ${test.category.toLowerCase()} is costing you more energy right now, and a smaller next step would help more than forcing a full reset.`;

  const nonMeaning = crisisSignal
    ? ['It is not a diagnosis.', 'It is not a substitute for a real risk assessment by a professional.', 'Reaching out for support is not an overreaction.']
    : ['It is not a diagnosis.', 'It does not define your identity.', 'It is one snapshot, not your whole story.'];

  return {
    id: `result-${Date.now()}`,
    userId: 'local-user',
    testId: test.id,
    testTitle: test.title,
    score: breakdown.normalizedScore,
    pattern,
    strengths,
    growthAreas,
    meaning,
    nonMeaning,
    createdAt: new Date().toISOString(),
    keyPatterns: [
      { label: 'Overall clarity', value: breakdown.normalizedScore },
      { label: 'Current strain', value: Math.max(10, 100 - breakdown.normalizedScore) },
      { label: 'Follow-through', value: Math.min(100, breakdown.normalizedScore + 8) },
      { label: 'Recovery room', value: Math.max(15, 88 - breakdown.normalizedScore) },
    ],
    crisisSignal,
  };
}
