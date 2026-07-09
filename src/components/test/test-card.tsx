'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Files, Layers3, TriangleAlert, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { routes } from '@/config/routes';
import { imageForTest } from '@/components/test/test-image';
import type { TestCatalogEntry } from '@/utils/tests/catalog';
import type { TestDefinition } from '@/types/test';

type TestCardData = TestCatalogEntry | TestDefinition;

function isCatalogEntry(test: TestCardData): test is TestCatalogEntry {
  return 'variants' in test;
}

function getQuestionCount(test: TestDefinition): number {
  return Array.isArray(test.questions) ? test.questions.length : 0;
}

function normalizeTestCardData(test: TestCardData): TestCatalogEntry {
  if (isCatalogEntry(test)) {
    return {
      ...test,
      variants: test.variants.map((variant) => ({
        ...variant,
        questions: Array.isArray(variant.questions) ? variant.questions : [],
      })),
      defaultVariant: {
        ...test.defaultVariant,
        questions: Array.isArray(test.defaultVariant.questions) ? test.defaultVariant.questions : [],
      },
      questionCount: typeof test.questionCount === 'number' ? test.questionCount : getQuestionCount(test.defaultVariant),
      questionCountLabel:
        test.questionCountLabel ??
        `${typeof test.questionCount === 'number' ? test.questionCount : getQuestionCount(test.defaultVariant)} prompts`,
    };
  }

  const safeQuestions = Array.isArray(test.questions) ? test.questions : [];

  return {
    id: test.variantGroup ?? test.id,
    slug: test.slug,
    title: test.title,
    description: test.description,
    category: test.category,
    estimatedMinutes: test.estimatedMinutes,
    estimatedMinutesLabel: `${test.estimatedMinutes} min`,
    depth: test.depth,
    tone: test.tone,
    status: test.status,
    riskLevel: test.riskLevel,
    tags: test.tags,
    sourceUrl: test.sourceUrl,
    licenseNote: test.licenseNote,
    questionCount: safeQuestions.length,
    questionCountLabel: `${safeQuestions.length} prompts`,
    coverSlug: test.slug,
    defaultVariant: {
      ...test,
      questions: safeQuestions,
    },
    variants: [{
      ...test,
      questions: safeQuestions,
    }],
  };
}

function VariantDialog({
  test,
  open,
  onClose,
}: {
  test: TestCatalogEntry;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-end justify-center bg-[rgba(8,15,24,0.54)] p-3 sm:items-center sm:p-6'
      role='dialog'
      aria-modal='true'
      aria-labelledby={`variant-dialog-title-${test.id}`}
      onClick={onClose}
    >
      <div
        className='w-full max-w-3xl rounded-[1.9rem] border border-[var(--color-panel-border)] bg-[var(--color-panel)] p-4 shadow-[0_28px_90px_rgba(8,15,24,0.28)] sm:p-6'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-2'>
            <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Select test version</p>
            <h3 id={`variant-dialog-title-${test.id}`} className='font-heading text-3xl leading-tight text-[var(--color-text-strong)]'>
              {test.title}
            </h3>
            <p className='max-w-2xl text-sm leading-6 text-[var(--color-muted)]'>{test.description}</p>
          </div>
          <button
            type='button'
            aria-label='Close variant chooser'
            className='inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] transition hover:text-[var(--color-text-strong)]'
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className='mt-5 grid gap-3'>
          {test.variants.map((variant) => {
            const isPending = variant.status === 'pending';
            const isDefault = variant.slug === test.defaultVariant.slug;

            return (
              <button
                key={variant.id}
                type='button'
                disabled={isPending}
                className='group cursor-pointer rounded-[1.4rem] border border-[var(--color-panel-border)] bg-[var(--color-surface)] p-4 text-left transition enabled:hover:border-[var(--color-primary)]/45 enabled:hover:bg-[var(--color-surface-soft)] disabled:cursor-not-allowed disabled:opacity-60'
                onClick={() => {
                  router.push(routes.test(variant.slug));
                  onClose();
                }}
              >
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='font-heading text-2xl leading-none text-[var(--color-text-strong)]'>{variant.title}</span>
                  {isDefault ? <Badge>recommended</Badge> : null}
                  <Badge>{variant.status}</Badge>
                  <Badge>{variant.riskLevel} risk</Badge>
                </div>
                <p className='mt-2 text-sm leading-6 text-[var(--color-muted)]'>{variant.description}</p>
                <div className='mt-3 flex flex-wrap gap-2 text-sm text-[var(--color-muted)]'>
                  <span>{variant.estimatedMinutes} min</span>
                  <span>{variant.questions.length} prompts</span>
                  <span className='capitalize'>{variant.depth}</span>
                  <span className='capitalize'>{variant.tone}</span>
                </div>
                <div className='mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]'>
                  {isPending ? 'Variant not available yet' : 'Open this test'}
                  {!isPending ? <ArrowRight size={14} className='transition group-hover:translate-x-0.5' /> : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function TestCard({ test, compact = false }: { test: TestCardData; compact?: boolean }) {
  const normalizedTest = normalizeTestCardData(test);
  const router = useRouter();
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const hasVariantChoice = normalizedTest.variants.length > 1;
  const variantLabel = hasVariantChoice ? `${normalizedTest.variants.length} versions` : 'Single version';

  return (
    <>
      <button
        type='button'
        className='block h-full w-full cursor-pointer text-left'
        aria-haspopup={hasVariantChoice ? 'dialog' : undefined}
        aria-label={hasVariantChoice ? `Choose a variant for ${normalizedTest.title}` : `Open ${normalizedTest.title}`}
        onClick={() => {
          if (hasVariantChoice) {
            setIsVariantDialogOpen(true);
            return;
          }

          router.push(routes.test(normalizedTest.slug));
        }}
      >
        <Card className='group flex h-full flex-col overflow-hidden border-[var(--color-panel-border)] bg-[var(--color-panel)] p-0 transition duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-[0_24px_55px_rgba(8,15,24,0.12)]'>
          <div className='relative h-40 w-full overflow-hidden rounded-t-[1.6rem] bg-[var(--color-surface-soft)]'>
            <Image
              src={imageForTest(normalizedTest.coverSlug)}
              alt=''
              fill
              className='object-cover transition duration-500 group-hover:scale-[1.04]'
              sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 420px'
            />
            <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,24,0.06),rgba(8,15,24,0.48))]' />
            <div className='absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_bottom,rgba(248,242,231,0.18),transparent_62%)]' />
            <div className='absolute right-3 top-3'>
              <span className='inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-[rgba(8,15,24,0.48)] px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm'>
                {hasVariantChoice ? <Layers3 size={12} /> : <Files size={12} />}
                {variantLabel}
              </span>
            </div>
          </div>

          <div className='flex flex-1 flex-col gap-4 p-5'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge>{normalizedTest.category}</Badge>
              <Badge>{normalizedTest.depth}</Badge>
              {normalizedTest.riskLevel === 'high' ? (
                <span className='inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-text-strong)]'>
                  <TriangleAlert size={12} />
                  review carefully
                </span>
              ) : null}
            </div>

            <div className='space-y-2'>
              <h3 className='line-clamp-2 font-heading text-[1.95rem] leading-[1.05] text-[var(--color-text-strong)]'>
                {normalizedTest.title}
              </h3>
              <p className='line-clamp-3 text-sm leading-6 text-[var(--color-muted)]'>{normalizedTest.description}</p>
            </div>

            <div className='grid grid-cols-1 gap-2 rounded-[1.2rem] border border-[var(--color-panel-border)] bg-[var(--color-surface-soft)]/55 p-3 text-sm text-[var(--color-muted)] sm:grid-cols-3'>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]/80'>Time</p>
                <p className='mt-1 text-[var(--color-text-strong)]'>{normalizedTest.estimatedMinutesLabel}</p>
              </div>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]/80'>Prompts</p>
                <p className='mt-1 text-[var(--color-text-strong)]'>{normalizedTest.questionCountLabel}</p>
              </div>
              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]/80'>Tone</p>
                <p className='mt-1 capitalize text-[var(--color-text-strong)]'>{normalizedTest.tone}</p>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {normalizedTest.tags.slice(0, 3).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            <div className='mt-auto flex flex-col gap-2 border-t border-[var(--color-panel-border)] pt-4'>
              <div className='flex items-center justify-between gap-3'>
                <div className='inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition group-hover:translate-x-0.5'>
                  {hasVariantChoice ? 'Choose a version' : 'Open this test'} <ArrowRight size={14} />
                </div>
                <span className='text-xs text-[var(--color-muted)]'>{variantLabel}</span>
              </div>
              {compact ? <div className='text-xs text-[var(--color-muted)]'>Built for reflection, not diagnosis.</div> : null}
            </div>
          </div>
        </Card>
      </button>

      {hasVariantChoice ? (
        <VariantDialog test={normalizedTest} open={isVariantDialogOpen} onClose={() => setIsVariantDialogOpen(false)} />
      ) : null}
    </>
  );
}
