'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Bookmark, EyeOff, ShieldAlert, TriangleAlert } from 'lucide-react';
import { testsData } from '@/data/tests';
import { QuestionCard } from '@/components/test/question-card';
import { ProgressBar } from '@/components/test/progress-bar';
import { LikertScale } from '@/components/test/likert-scale';
import { SingleChoiceQuestion } from '@/components/test/single-choice-question';
import { MultiSelectQuestion } from '@/components/test/multi-select-question';
import { NumericScaleQuestion } from '@/components/test/numeric-scale-question';
import { TextQuestion } from '@/components/test/text-question';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MediaPlaceholder } from '@/components/common/media-placeholder';
import { DisclaimerBox } from '@/components/common/disclaimer-box';
import { usePersonalData } from '@/hooks/use-personal-data';
import { routes } from '@/config/routes';
import { scoreTestForDefinition, toResultSummaryFromBreakdown } from '@/utils/scoring';
import type { TestQuestion } from '@/types/test';
import type { AnswerValue } from '@/types/common';

const crisisResources = [
  'If you are in immediate danger, call emergency services now.',
  'US & Canada: Call or text 988 (Suicide & Crisis Lifeline).',
  'If you are outside the US, contact your local emergency or crisis line.',
];

function passesVisibility(question: TestQuestion, answers: Record<string, AnswerValue>): boolean {
  if (!question.visibilityCondition) return true;

  const dependency = answers[question.visibilityCondition.questionId];
  if (question.visibilityCondition.equals !== undefined) {
    return dependency === question.visibilityCondition.equals;
  }

  if (question.visibilityCondition.includes && Array.isArray(dependency)) {
    return dependency.includes(question.visibilityCondition.includes);
  }

  return true;
}

export function TestRunnerPage({ slug }: { slug: string }) {
  const router = useRouter();
  const test = useMemo(() => testsData.find((item) => item.slug === slug) || testsData[0], [slug]);
  const { drafts, saveDraft, clearDraft, saveResult } = usePersonalData();
  const draft = useMemo(() => drafts.find((item) => item.slug === test.slug), [drafts, test.slug]);

  const [index, setIndex] = useState(() => draft?.index ?? 0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(() => draft?.answers ?? {});
  const [started, setStarted] = useState(test.riskLevel !== 'high' && test.status !== 'caution');
  const [savedMessage, setSavedMessage] = useState<string | null>(
    draft ? 'Draft restored from your last visit on this device.' : null,
  );

  const visibleQuestions = useMemo(
    () => test.questions.filter((question) => passesVisibility(question, answers)),
    [answers, test.questions],
  );
  const safeIndex = Math.min(index, Math.max(visibleQuestions.length - 1, 0));
  const current = visibleQuestions[safeIndex];
  const progress = visibleQuestions.length > 0 ? Math.round(((safeIndex + 1) / visibleQuestions.length) * 100) : 0;

  const persistDraft = (nextAnswers: Record<string, AnswerValue>, nextIndex: number) => {
    saveDraft({ slug: test.slug, answers: nextAnswers, index: nextIndex });
  };

  const setAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      persistDraft(next, safeIndex);
      return next;
    });
  };

  const canAdvance = useMemo(() => {
    if (!current) return false;
    if (!current.required) return true;
    const value = answers[current.id];

    if (Array.isArray(value)) {
      const minRequired = current.minSelections ?? 1;
      if (current.maxSelections && value.length > current.maxSelections) return false;
      return value.length >= minRequired;
    }
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !Number.isNaN(value);
    if (typeof value === 'boolean') return true;

    return false;
  }, [answers, current]);

  const onToggleMulti = (questionId: string, optionValue: string, question: TestQuestion) => {
    const existing = Array.isArray(answers[questionId]) ? [...(answers[questionId] as string[])] : [];
    const has = existing.includes(optionValue);

    if (has) {
      setAnswer(questionId, existing.filter((value) => value !== optionValue));
      return;
    }

    const next = [...existing, optionValue];
    const clipped = question.maxSelections ? next.slice(0, question.maxSelections) : next;
    setAnswer(questionId, clipped);
  };

  const score = useMemo(() => scoreTestForDefinition(test, answers), [answers, test]);

  const moveToIndex = (nextIndex: number) => {
    setIndex(nextIndex);
    persistDraft(answers, nextIndex);
  };

  const finishTest = () => {
    const result = toResultSummaryFromBreakdown(test, score);
    saveResult(result);
    clearDraft(test.slug);
    router.push(routes.result(result.id));
  };

  if (!current) {
    return (
      <Card>
        <p className='text-sm text-[var(--color-muted)]'>No renderable questions for this test variant.</p>
      </Card>
    );
  }

  return (
    <div className='grid gap-5 lg:grid-cols-[340px_1fr]'>
      <Card className='space-y-4 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
        <h1 className='font-heading text-3xl leading-tight text-[var(--color-text-strong)]'>{test.title}</h1>
        <p className='text-sm leading-7 text-[var(--color-muted)]'>{test.description}</p>
        <MediaPlaceholder className='h-36' variant='hero' />
        <div className='flex flex-wrap gap-2'>
          <Badge>{test.category}</Badge>
          <Badge>{test.status}</Badge>
          <Badge>{test.riskLevel} risk</Badge>
        </div>
        <ul className='space-y-2 text-sm leading-6 text-[var(--color-muted)]'>
          <li>{test.estimatedMinutes} minutes</li>
          <li>{visibleQuestions.length} prompts</li>
          <li>{test.licenseNote ?? 'Reflection-only use.'}</li>
        </ul>
        <a href={test.sourceUrl} target='_blank' rel='noreferrer' className='text-xs font-semibold text-[var(--color-primary)] underline'>
          Source and instrument reference
        </a>
        <DisclaimerBox compact />
      </Card>

      <div className='space-y-4'>
        {!started ? (
          <Card className='space-y-4 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
            <div className='flex items-start gap-2'>
              <ShieldAlert className='mt-0.5 text-[var(--color-primary)]' size={18} />
              <div>
                <h2 className='font-heading text-2xl'>Safety first</h2>
                <p className='text-sm text-[var(--color-muted)]'>
                  This assessment includes high-sensitivity mental health content. It is not a diagnosis.
                </p>
              </div>
            </div>
            <ul className='space-y-2 rounded-[1.25rem] border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]'>
              {crisisResources.map((resource) => (
                <li key={resource}>&bull; {resource}</li>
              ))}
            </ul>
            <Button onClick={() => setStarted(true)}>I understand, continue</Button>
          </Card>
        ) : (
          <Card className='space-y-4 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
            <ProgressBar value={progress} label={`Question ${safeIndex + 1} of ${visibleQuestions.length}`} />
            {savedMessage ? <p className='text-sm text-[var(--color-muted)]'>{savedMessage}</p> : null}

            <QuestionCard title={current.prompt}>
              {current.helperText ? <p className='text-sm text-[var(--color-muted)]'>{current.helperText}</p> : null}

              {(current.type === 'likert' || current.type === 'frequency') && current.choices ? (
                <LikertScale
                  options={current.choices}
                  selected={typeof answers[current.id] === 'string' ? (answers[current.id] as string) : undefined}
                  onSelect={(value) => setAnswer(current.id, value)}
                />
              ) : null}

              {(current.type === 'single-choice' || current.type === 'yes-no' || current.type === 'true-false') && current.choices ? (
                <SingleChoiceQuestion
                  options={current.choices}
                  selected={typeof answers[current.id] === 'string' ? (answers[current.id] as string) : undefined}
                  onSelect={(value) => setAnswer(current.id, value)}
                />
              ) : null}

              {current.type === 'multi-select' && current.choices ? (
                <MultiSelectQuestion
                  options={current.choices}
                  selected={Array.isArray(answers[current.id]) ? (answers[current.id] as string[]) : []}
                  onToggle={(value) => onToggleMulti(current.id, value, current)}
                />
              ) : null}

              {current.type === 'numeric-scale' ? (
                <NumericScaleQuestion
                  value={typeof answers[current.id] === 'number' ? (answers[current.id] as number) : undefined}
                  min={current.minValue}
                  max={current.maxValue}
                  step={current.step}
                  onChange={(value) => setAnswer(current.id, value)}
                />
              ) : null}

              {(current.type === 'short-text' || current.type === 'long-text' || current.type === 'reflection') ? (
                <TextQuestion
                  value={typeof answers[current.id] === 'string' ? (answers[current.id] as string) : ''}
                  multiline={current.type !== 'short-text'}
                  placeholder={current.placeholder ?? 'Write your answer...'}
                  onChange={(value) => setAnswer(current.id, value)}
                />
              ) : null}
            </QuestionCard>

            {(test.riskLevel === 'high' || test.tags.includes('suicide-risk')) && safeIndex === visibleQuestions.length - 1 ? (
              <div className='rounded-[1.2rem] border border-amber-400/30 bg-amber-100/50 p-4 text-sm text-amber-900'>
                <p className='inline-flex items-center gap-1 font-semibold'>
                  <TriangleAlert size={14} />
                  If you are feeling unsafe now, seek immediate support.
                </p>
              </div>
            ) : null}

            <div className='flex items-center justify-between gap-3'>
              <div className='flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]'>
                <button
                  type='button'
                  className='inline-flex items-center gap-1 text-sm text-[var(--color-muted)]'
                  onClick={() => {
                    persistDraft(answers, safeIndex);
                    setSavedMessage('Progress saved to this device. You can come back later.');
                  }}
                >
                  <Bookmark size={14} /> Save for later
                </button>
                <span className='inline-flex items-center gap-1'>
                  <EyeOff size={14} /> Skip if unsure
                </span>
              </div>

              <div className='flex gap-2'>
                <Button variant='secondary' onClick={() => moveToIndex(Math.max(0, safeIndex - 1))}>
                  <ArrowLeft size={14} />
                  Back
                </Button>
                {safeIndex < visibleQuestions.length - 1 ? (
                  <Button onClick={() => moveToIndex(Math.min(visibleQuestions.length - 1, safeIndex + 1))} disabled={!canAdvance}>
                    Next
                    <ArrowRight size={14} />
                  </Button>
                ) : (
                  <Button onClick={finishTest} disabled={!canAdvance}>Finish and view result</Button>
                )}
              </div>
            </div>
          </Card>
        )}

        <p className='text-center text-xs text-[var(--color-muted)]'>
          Progress stays on this device unless you create an account later.
        </p>
      </div>
    </div>
  );
}
