'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, EyeOff } from 'lucide-react';
import { testsData } from '@/data/tests';
import { QuestionCard } from '@/components/test/question-card';
import { ProgressBar } from '@/components/test/progress-bar';
import { LikertScale } from '@/components/test/likert-scale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MediaPlaceholder } from '@/components/common/media-placeholder';
import { DisclaimerBox } from '@/components/common/disclaimer-box';

export function TestRunnerPage({ slug }: { slug: string }) {
  const test = useMemo(() => testsData.find((item) => item.slug === slug) || testsData[0], [slug]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = test.questions[index];
  const progress = Math.round(((index + 1) / test.questions.length) * 100);

  const onSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  return (
    <div className='grid gap-4 lg:grid-cols-[280px_1fr]'>
      <Card className='space-y-3'>
        <h1 className='font-heading text-3xl'>{test.title}</h1>
        <p className='text-sm text-[var(--color-muted)]'>{test.description}</p>
        <MediaPlaceholder className='h-32' variant='hero' />
        <ul className='space-y-2 text-sm text-[var(--color-muted)]'>
          <li>Self-awareness</li>
          <li>Personal growth</li>
          <li>Evidence-based reflection</li>
        </ul>
        <p className='text-xs text-[var(--color-muted)]'>{test.estimatedMinutes} - {test.questions.length} questions</p>
        <DisclaimerBox compact />
      </Card>

      <div className='space-y-4'>
        <Card className='space-y-4'>
          <ProgressBar value={progress} label={`Question ${index + 1} of ${test.questions.length}`} />
          <QuestionCard title={current.prompt}>
            {current.type === 'reflection' ? (
              <textarea
                className='h-32 w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 text-sm'
                value={answers[current.id] || ''}
                onChange={(event) => onSelect(event.target.value)}
                placeholder='Write your thoughts here...'
              />
            ) : (
              <LikertScale
                options={current.options || []}
                selected={answers[current.id]}
                onSelect={onSelect}
              />
            )}
          </QuestionCard>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4 text-sm text-[var(--color-muted)]'>
              <span className='inline-flex items-center gap-1'><Bookmark size={14} /> Save for later</span>
              <span className='inline-flex items-center gap-1'><EyeOff size={14} /> Skip if unsure</span>
            </div>
            <div className='flex gap-2'>
              <Button variant='secondary' onClick={() => setIndex((prev) => Math.max(0, prev - 1))}><ArrowLeft size={14} />Back</Button>
              <Button onClick={() => setIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}>Next<ArrowRight size={14} /></Button>
            </div>
          </div>
        </Card>
        <p className='text-center text-xs text-[var(--color-muted)]'>Your progress is saved automatically.</p>
      </div>
    </div>
  );
}

