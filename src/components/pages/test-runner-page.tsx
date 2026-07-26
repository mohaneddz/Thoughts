'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ShieldAlert, TriangleAlert } from 'lucide-react';
import { testsData } from '@/data/tests';
import { QuestionCard } from '@/components/test/question-card';
import { LikertScale } from '@/components/test/likert-scale';
import { SingleChoiceQuestion } from '@/components/test/single-choice-question';
import { MultiSelectQuestion } from '@/components/test/multi-select-question';
import { NumericScaleQuestion } from '@/components/test/numeric-scale-question';
import { TestBackgroundField } from '@/components/test/test-background-field';
import { imageForTest } from '@/components/test/test-image';
import { TextQuestion } from '@/components/test/text-question';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePersonalData } from '@/hooks/use-personal-data';
import { routes } from '@/config/routes';
import { scoreTestForDefinition, toResultSummaryFromBreakdown } from '@/utils/scoring';
import { crisisResources } from '@/data/crisis-resources';
import type { TestQuestion } from '@/types/test';
import type { AnswerValue } from '@/types/common';

type TestMode = 'full' | 'guided';

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

function isQuestionAnswered(question: TestQuestion, value: AnswerValue): boolean {
  if (!question.required) return true;

  if (Array.isArray(value)) {
    const minRequired = question.minSelections ?? 1;
    if (question.maxSelections && value.length > question.maxSelections) return false;
    return value.length >= minRequired;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number') {
    return !Number.isNaN(value);
  }

  if (typeof value === 'boolean') {
    return true;
  }

  return false;
}

function QuestionInput({
  question,
  answer,
  onAnswer,
  onToggleMulti,
}: {
  question: TestQuestion;
  answer: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
  onToggleMulti: (optionValue: string) => void;
}) {
  return (
    <>
      {question.helperText ? <p className='text-sm text-[var(--color-muted)]'>{question.helperText}</p> : null}

      {(question.type === 'likert' || question.type === 'frequency') && question.choices ? (
        <LikertScale
          options={question.choices}
          selected={typeof answer === 'string' ? answer : undefined}
          onSelect={onAnswer}
        />
      ) : null}

      {(question.type === 'single-choice' || question.type === 'yes-no' || question.type === 'true-false') && question.choices ? (
        <SingleChoiceQuestion
          options={question.choices}
          selected={typeof answer === 'string' ? answer : undefined}
          onSelect={onAnswer}
        />
      ) : null}

      {question.type === 'multi-select' && question.choices ? (
        <MultiSelectQuestion
          options={question.choices}
          selected={Array.isArray(answer) ? (answer as string[]) : []}
          onToggle={onToggleMulti}
        />
      ) : null}

      {question.type === 'numeric-scale' ? (
        <NumericScaleQuestion
          value={typeof answer === 'number' ? answer : undefined}
          min={question.minValue}
          max={question.maxValue}
          step={question.step}
          onChange={onAnswer}
        />
      ) : null}

      {(question.type === 'short-text' || question.type === 'long-text' || question.type === 'reflection') ? (
        <TextQuestion
          value={typeof answer === 'string' ? answer : ''}
          multiline={question.type !== 'short-text'}
          placeholder={question.placeholder ?? 'Write your answer...'}
          onChange={onAnswer}
        />
      ) : null}
    </>
  );
}

export function TestRunnerPage({ slug }: { slug: string }) {
  const router = useRouter();
  const test = useMemo(() => testsData.find((item) => item.slug === slug) || testsData[0], [slug]);
  const { drafts, saveDraft, clearDraft, saveResult } = usePersonalData();
  const draft = useMemo(() => drafts.find((item) => item.slug === test.slug), [drafts, test.slug]);
  const hasRestoredDraftRef = useRef(false);
  const hasEnabledAutosaveRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [mode, setMode] = useState<TestMode>('full');
  const [started, setStarted] = useState(test.riskLevel !== 'high' && test.status !== 'caution');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isDraftReady, setIsDraftReady] = useState(false);

  const visibleQuestions = useMemo(
    () => test.questions.filter((question) => passesVisibility(question, answers)),
    [answers, test.questions],
  );
  const safeIndex = Math.min(index, Math.max(visibleQuestions.length - 1, 0));
  const current = visibleQuestions[safeIndex];

  const persistDraft = useCallback((nextAnswers: Record<string, AnswerValue>, nextIndex: number, nextMode: TestMode) => {
    saveDraft({ slug: test.slug, answers: nextAnswers, index: nextIndex, mode: nextMode });
  }, [saveDraft, test.slug]);

  const setAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const canAdvance = useMemo(() => {
    if (!current) return false;
    return isQuestionAnswered(current, answers[current.id]);
  }, [answers, current]);

  const answeredRequiredCount = useMemo(
    () => visibleQuestions.filter((question) => isQuestionAnswered(question, answers[question.id])).length,
    [answers, visibleQuestions],
  );
  const answeredProgress = visibleQuestions.length > 0 ? Math.round((answeredRequiredCount / visibleQuestions.length) * 100) : 0;
  const guidedProgress = visibleQuestions.length > 0 ? Math.round(((safeIndex + 1) / visibleQuestions.length) * 100) : 0;

  const canSubmit = useMemo(
    () => visibleQuestions.every((question) => isQuestionAnswered(question, answers[question.id])),
    [answers, visibleQuestions],
  );

  const onToggleMulti = (questionId: string, optionValue: string, question: TestQuestion) => {
    const existing = Array.isArray(answers[questionId]) ? [...(answers[questionId] as string[])] : [];
    const has = existing.includes(optionValue);

    if (has) {
      const next = existing.filter((value) => value !== optionValue);
      setAnswers((prev) => ({ ...prev, [questionId]: next }));
      return;
    }

    const next = [...existing, optionValue];
    const clipped = question.maxSelections ? next.slice(0, question.maxSelections) : next;
    setAnswers((prev) => ({ ...prev, [questionId]: clipped }));
  };

  const score = useMemo(() => scoreTestForDefinition(test, answers), [answers, test]);

  const moveToIndex = (nextIndex: number) => {
    setIndex(nextIndex);
  };

  useEffect(() => {
    if (hasRestoredDraftRef.current) {
      return;
    }

    hasRestoredDraftRef.current = true;
    const timer = window.setTimeout(() => {
      if (draft) {
        setIndex(draft.index ?? 0);
        setAnswers(draft.answers ?? {});
        setMode(draft.mode ?? 'full');
        setSavedMessage('Draft restored from your last visit on this device.');
      }
      setIsDraftReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [draft]);

  useEffect(() => {
    if (!isDraftReady) {
      return;
    }

    if (!hasEnabledAutosaveRef.current) {
      hasEnabledAutosaveRef.current = true;
      return;
    }

    persistDraft(answers, safeIndex, mode);
  }, [answers, isDraftReady, mode, persistDraft, safeIndex]);

  const finishTest = () => {
    const result = toResultSummaryFromBreakdown(test, score, answers);
    saveResult(result);
    clearDraft(test.slug);
    router.push(routes.result(result.id));
  };

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(routes.tests);
  };

  if (!current) {
    return (
      <Card>
        <p className='text-sm text-[var(--color-muted)]'>No renderable questions for this test variant.</p>
      </Card>
    );
  }

  return (
    <TestBackgroundField>
      <div className='space-y-5 pb-2 pt-16'>
        <div className='pointer-events-none fixed inset-x-0 top-16 z-20'>
          <span className='sr-only'>
            {started ? `${answeredRequiredCount} of ${visibleQuestions.length} questions answered` : `0 of ${visibleQuestions.length} questions answered`}
          </span>
          <Progress value={started ? answeredProgress : 0} className='h-1.5 rounded-none bg-transparent' />
        </div>

        <div className='pointer-events-none fixed inset-x-0 top-[4.75rem] z-20'>
          <div className='mx-auto w-full px-4 md:px-6'>
            <Button variant='secondary' size='sm' className='pointer-events-auto cursor-pointer' onClick={goBack}>
              <ArrowLeft size={14} />
              Go back
            </Button>
          </div>
        </div>

        <Card className='overflow-hidden border-[var(--color-panel-border)] bg-[var(--color-panel)] p-0'>
          <div className='flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-start'>
            <div className='relative h-48 w-full overflow-hidden rounded-[1.35rem] border border-[var(--color-border)] lg:h-56 lg:w-80 lg:flex-none'>
              <Image
                src={imageForTest(test.slug)}
                alt={`${test.title} cover image`}
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 320px'
                priority
              />
              <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,24,0.04),rgba(8,15,24,0.28))]' />
            </div>

            <div className='flex min-w-0 flex-1 flex-col gap-4'>
              <div className='space-y-3'>
                <h1 className='font-heading text-3xl leading-tight text-[var(--color-text-strong)] sm:text-4xl'>{test.title}</h1>
                <p className='max-w-3xl text-sm leading-7 text-[var(--color-muted)]'>{test.description}</p>
              </div>

              <div className='flex flex-wrap gap-2'>
                <Badge>{test.category}</Badge>
                <Badge>{test.status}</Badge>
                <Badge>{test.riskLevel} risk</Badge>
                <Badge>{test.depth}</Badge>
              </div>

              <div className='grid gap-3 text-sm leading-6 text-[var(--color-muted)] sm:grid-cols-2 xl:grid-cols-4'>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]/70'>Time</p>
                  <p>{test.estimatedMinutes} minutes</p>
                </div>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]/70'>Prompts</p>
                  <p>{visibleQuestions.length} prompts</p>
                </div>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]/70'>Tone</p>
                  <p className='capitalize'>{test.tone}</p>
                </div>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]/70'>Use</p>
                  <p>{test.licenseNote ?? 'Reflection-only use.'}</p>
                </div>
              </div>

              <div className='flex flex-wrap items-start gap-3'>
                <a href={test.sourceUrl} target='_blank' rel='noreferrer' className='text-xs font-semibold text-[var(--color-primary)] underline'>
                  Source and instrument reference
                </a>
                <div className='min-w-0 flex-1'>
                </div>
              </div>
            </div>
          </div>
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
                  <li key={resource.label}>
                    <span className='font-semibold text-[var(--color-text)]'>{resource.label}:</span> {resource.detail}
                  </li>
                ))}
              </ul>
              <Button onClick={() => setStarted(true)}>I understand, continue</Button>
            </Card>
          ) : (
            <Card className='space-y-4 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant={mode === 'full' ? 'primary' : 'secondary'}
                  size='sm'
                  onClick={() => {
                    setMode('full');
                  }}
                >
                  Full
                </Button>
                <Button
                  variant={mode === 'guided' ? 'primary' : 'secondary'}
                  size='sm'
                  onClick={() => {
                    setMode('guided');
                  }}
                >
                  Guided
                </Button>
              </div>
              {savedMessage ? <p className='text-sm text-[var(--color-muted)]'>{savedMessage}</p> : null}

              {mode === 'guided' ? (
                <QuestionCard title={current.prompt}>
                  <QuestionInput
                    question={current}
                    answer={answers[current.id]}
                    onAnswer={(value) => setAnswer(current.id, value)}
                    onToggleMulti={(value) => onToggleMulti(current.id, value, current)}
                  />
                </QuestionCard>
              ) : (
                <div className='space-y-4'>
                  {visibleQuestions.map((question, questionIndex) => (
                    <QuestionCard key={question.id} title={`${questionIndex + 1}. ${question.prompt}`}>
                      <QuestionInput
                        question={question}
                        answer={answers[question.id]}
                        onAnswer={(value) => setAnswer(question.id, value)}
                        onToggleMulti={(value) => onToggleMulti(question.id, value, question)}
                      />
                    </QuestionCard>
                  ))}
                </div>
              )}

              {(test.riskLevel === 'high' || test.tags.includes('suicide-risk')) &&
              (mode === 'full' || safeIndex === visibleQuestions.length - 1) ? (
                <div className='rounded-[1.2rem] border border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] p-4 text-sm text-[var(--color-warning-text)]'>
                  <p className='inline-flex items-center gap-1 font-semibold'>
                    <TriangleAlert size={14} />
                    If you are feeling unsafe now, call or text 988 (US & Canada) or your local emergency number.
                  </p>
                </div>
              ) : null}

              <div className='flex items-center justify-end gap-3'>
                {mode === 'guided' ? (
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
                ) : (
                  <Button onClick={finishTest} disabled={!canSubmit}>Submit and view result</Button>
                )}
              </div>
            </Card>
          )}

          <p className='text-center text-xs text-[var(--color-muted)]'>
            Progress stays on this device unless you create an account later.
          </p>
        </div>
      </div>
    </TestBackgroundField>
  );
}
