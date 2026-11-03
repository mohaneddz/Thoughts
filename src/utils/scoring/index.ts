import type { AnswerValue } from '@/types/common';
import type { DomainScore, ScoringDomain, SeverityBand, TestDefinition, TestQuestion, TestScoreBreakdown } from '@/types/test';
import type { CrisisSignal, TestResultSummary } from '@/types/result';
import { crisisCopy } from '@/data/crisisResources';

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

function choiceScoreRange(question: TestQuestion): [number, number] {
  const values = question.choices?.map((choice) => choice.score ?? 0) ?? [0];
  return [Math.min(...values), Math.max(...values)];
}

function readQuestionScore(question: TestQuestion, rawValue: AnswerValue): number {
  const rawScore = readRawScore(question, rawValue);
  if (!question.reverseScored || !question.choices?.length) return rawScore;
  const [min, max] = choiceScoreRange(question);
  return min + max - rawScore;
}

/** Lowest and highest score a single question can contribute. */
function questionScoreRange(question: TestQuestion): [number, number] {
  if (question.type === 'numeric-scale') {
    return [question.minValue ?? 0, question.maxValue ?? 0];
  }

  if (!question.choices?.length) return [0, 0];

  if (question.type === 'multi-select') {
    const scores = question.choices.map((choice) => choice.score ?? 0).sort((a, b) => b - a);
    const cap = question.maxSelections ?? scores.length;
    const floor = question.minSelections ?? 0;
    const max = scores.slice(0, cap).reduce((total, value) => total + Math.max(value, 0), 0);
    const min = [...scores].reverse().slice(0, floor).reduce((total, value) => total + value, 0);
    return [min, max];
  }

  return choiceScoreRange(question);
}

function sumRange(questions: TestQuestion[]): [number, number] {
  return questions.reduce<[number, number]>(
    (range, question) => {
      const [min, max] = questionScoreRange(question);
      return [range[0] + min, range[1] + max];
    },
    [0, 0],
  );
}

function toPercent(score: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.round(((score - min) / (max - min)) * 100);
}

function findBand(bands: SeverityBand[] | undefined, score: number) {
  return bands?.find((band) => score >= band.min && score <= band.max);
}

function scoreDomain(test: TestDefinition, domain: ScoringDomain, answers: Record<string, AnswerValue>): DomainScore {
  const questions = domain.questionIds
    .map((questionId) => test.questions.find((item) => item.id === questionId))
    .filter((question): question is TestQuestion => Boolean(question));

  const multiplier = domain.multiplier ?? 1;
  const score = questions.reduce((total, question) => total + readQuestionScore(question, answers[question.id]), 0) * multiplier;
  const [baseMin, baseMax] = sumRange(questions);
  const minScore = baseMin * multiplier;
  const maxScore = baseMax * multiplier;

  return {
    id: domain.id,
    label: domain.label,
    score,
    minScore,
    maxScore,
    percent: toPercent(score, minScore, maxScore),
    band: findBand(domain.cutoffBands, score),
    parentId: domain.parentId,
  };
}

function scoreMdq(answers: Record<string, AnswerValue>): TestScoreBreakdown {
  const symptomYesCount = Array.from({ length: 13 }, (_, index) => answers[`mdq-q${index + 1}`] === 'yes').filter(Boolean).length;
  const samePeriod = answers['mdq-q14'] === 'yes';
  const impairment = answers['mdq-q15'];
  const positive = symptomYesCount >= 7 && samePeriod && (impairment === 'moderate' || impairment === 'serious');

  return {
    totalScore: symptomYesCount,
    minScore: 0,
    maxScore: 13,
    normalizedScore: toPercent(symptomYesCount, 0, 13),
    band: positive
      ? { label: 'Positive screen rule met', min: 0, max: 0, description: 'the common MDQ rule is met (7+ symptoms, in the same period, with moderate or serious impact)' }
      : { label: 'Positive screen rule not met', min: 0, max: 0, description: 'the common MDQ positive-screen rule is not met' },
  };
}

export function scoreTestForDefinition(test: TestDefinition, answers: Record<string, AnswerValue>): TestScoreBreakdown {
  if (test.slug === 'mdq') {
    return scoreMdq(answers);
  }

  const totalScore = test.questions.reduce((total, question) => total + readQuestionScore(question, answers[question.id]), 0);
  const [computedMin, computedMax] = sumRange(test.questions);
  const minScore = test.scoring.minScore ?? computedMin;
  const maxScore = test.scoring.maxScore ?? computedMax;

  return {
    totalScore,
    minScore,
    maxScore,
    normalizedScore: toPercent(totalScore, minScore, maxScore),
    band: findBand(test.scoring.cutoffBands, totalScore),
    domains: test.scoring.domains?.map((domain) => scoreDomain(test, domain, answers)),
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

function worstDomainSeverity(test: TestDefinition, domains: DomainScore[]) {
  let worst: { domain: DomainScore; band: SeverityBand; rank: number } | undefined;

  for (const domain of domains) {
    if (!domain.band) continue;
    const definition = test.scoring.domains?.find((item) => item.id === domain.id);
    const rank = definition?.cutoffBands?.findIndex((band) => band.label === domain.band!.label) ?? -1;
    if (rank < 0) continue;
    if (!worst || rank > worst.rank) worst = { domain, band: domain.band, rank };
  }

  return worst;
}

/** Where a score sits within its own range. Without population norms this is all that can honestly be said. */
function rangeLevel(percent: number): 'low' | 'middle' | 'high' {
  if (percent < 34) return 'low';
  if (percent < 67) return 'middle';
  return 'high';
}

const levelWords = { low: 'Lower', middle: 'Moderate', high: 'Higher' } as const;

function describeTopLevelDomains(domains: DomainScore[]) {
  const topLevel = domains.filter((domain) => !domain.parentId);
  const ranked = [...topLevel].sort((a, b) => b.percent - a.percent);
  return { topLevel, highest: ranked.slice(0, 2), lowest: ranked.slice(-2).reverse() };
}

const nonMeaningBySignal = {
  crisis: ['It is not a diagnosis.', 'It is not a substitute for a real risk assessment by a professional.', 'Reaching out for support is not an overreaction.'],
  screener: ['It is not a diagnosis.', 'A screening tool can be wrong in either direction.', 'Only a qualified professional can properly assess this.'],
  trait: ['It is not a judgement — every trait level has trade-offs.', 'Levels are relative to this scale, not compared with other people.', 'Traits shift with context, age, and effort.'],
  reflection: ['It is not a diagnosis.', 'It does not define your identity.', 'It is one snapshot, not your whole story.'],
};

export function toResultSummaryFromBreakdown(
  test: TestDefinition,
  breakdown: TestScoreBreakdown,
  answers: Record<string, AnswerValue> = {},
): TestResultSummary {
  const crisisSignal = detectCrisisSignal(test, answers, breakdown);
  const direction = test.scoring.higherIs;
  const domains = breakdown.domains ?? [];
  const isScreener = test.tags.includes('clinical-screener');
  const band = breakdown.band;
  const worstDomain = !band ? worstDomainSeverity(test, domains) : undefined;
  const isTraitProfile = direction === 'neutral' && domains.length > 0;
  const level = rangeLevel(breakdown.normalizedScore);
  const scoreLine = `${breakdown.totalScore} of a possible ${breakdown.minScore}–${breakdown.maxScore}`;

  let pattern: string;
  let meaning: string;
  let strengths: string[];
  let growthAreas: string[];
  let nonMeaning: string[];

  if (crisisSignal) {
    pattern = crisisCopy[crisisSignal.level].title;
    meaning = crisisCopy[crisisSignal.level].body;
    strengths = [crisisSignal.reason];
    growthAreas = ['Talk to someone today — a crisis line, a doctor, or a person you trust.'];
    nonMeaning = nonMeaningBySignal.crisis;
  } else if (band) {
    pattern = band.label;
    meaning = `Your score (${scoreLine}) falls in the "${band.label}" range${band.description ? ` — ${band.description}` : ''}.`;
    if (isScreener) {
      meaning += ' This is a screening signal for reflection, not a diagnosis; if it feels relevant, it may be worth discussing with a doctor or therapist.';
    }
    strengths = [`Score: ${scoreLine}`, `Range: ${band.label}`];
    growthAreas = isScreener
      ? ['Retake in two to four weeks to see whether this is a pattern or a passing phase.', 'If this range feels heavy, share the result with a professional.']
      : ['Notice which questions pulled your score the most.', 'Retake later to see how it moves.'];
    nonMeaning = isScreener ? nonMeaningBySignal.screener : nonMeaningBySignal.reflection;
  } else if (worstDomain) {
    pattern = `${worstDomain.domain.label}: ${worstDomain.band.label}`;
    meaning = `Your ${worstDomain.domain.label.toLowerCase()} subscale falls in the "${worstDomain.band.label}" range. The other subscales are broken out below. This is a screening signal for reflection, not a diagnosis; if it feels relevant, it may be worth discussing with a doctor or therapist.`;
    strengths = domains.map((domain) => `${domain.label}: ${domain.score}${domain.band ? ` (${domain.band.label})` : ''}`);
    growthAreas = ['Retake in two to four weeks to see whether this is a pattern or a passing phase.', 'If a subscale feels heavy, share the result with a professional.'];
    nonMeaning = nonMeaningBySignal.screener;
  } else if (isTraitProfile) {
    const { topLevel, highest, lowest } = describeTopLevelDomains(domains);
    pattern = `Most pronounced: ${highest[0].label}`;
    meaning = `Across the ${topLevel.length} areas measured, you scored highest on ${highest.map((item) => item.label).join(' and ')} and lowest on ${lowest.map((item) => item.label).join(' and ')}. Levels are positions on this scale's own range, not comparisons with other people.`;
    strengths = highest.map((domain) => `${domain.label} — ${levelWords[rangeLevel(domain.percent)].toLowerCase()} (${domain.percent}%)`);
    growthAreas = lowest.map((domain) => `${domain.label} — ${levelWords[rangeLevel(domain.percent)].toLowerCase()} (${domain.percent}%)`);
    nonMeaning = nonMeaningBySignal.trait;
  } else {
    const good = direction === 'better' ? level === 'high' : direction === 'worse' ? level === 'low' : undefined;
    const theme = test.category.toLowerCase();
    pattern = `${levelWords[level]} ${direction === 'worse' ? 'strain' : 'score'} on this scale`;
    meaning =
      good === true
        ? `Your answers (${scoreLine}) suggest ${theme} is a relatively steady area for you right now.`
        : good === false
          ? `Your answers (${scoreLine}) suggest ${theme} is taking more out of you right now. A small next step will help more than a full reset.`
          : `Your answers (${scoreLine}) sit in the middle of this scale — some parts of ${theme} are working, some are not.`;
    strengths = [`Score: ${scoreLine}`];
    growthAreas = ['Pick one answer that surprised you and write down why.'];
    nonMeaning = isScreener ? nonMeaningBySignal.screener : nonMeaningBySignal.reflection;
  }

  return {
    id: `result-${Date.now()}`,
    userId: 'local-user',
    testId: test.id,
    testTitle: test.title,
    score: breakdown.normalizedScore,
    rawScore: breakdown.totalScore,
    minScore: breakdown.minScore,
    maxScore: breakdown.maxScore,
    higherIs: direction,
    band,
    pattern,
    strengths,
    growthAreas,
    meaning,
    nonMeaning,
    createdAt: new Date().toISOString(),
    crisisSignal,
    domains: breakdown.domains,
  };
}
