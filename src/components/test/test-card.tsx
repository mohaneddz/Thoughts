import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TriangleAlert } from 'lucide-react';
import type { TestDefinition } from '@/types/test';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { routes } from '@/config/routes';

function imageForTest(slug: string): string {
  return `/images/tests/unique/${slug}.jpg`;
}

export function TestCard({ test, compact = false }: { test: TestDefinition; compact?: boolean }) {
  return (
    <Card className='group flex h-full flex-col overflow-hidden border-[var(--color-panel-border)] bg-[var(--color-panel)] p-0'>
      <div className='relative h-32 w-full overflow-hidden rounded-t-[1.6rem]'>
        <Image
          src={imageForTest(test.slug)}
          alt=''
          fill
          className='object-cover transition duration-300 group-hover:scale-[1.02]'
          sizes='(max-width: 1024px) 100vw, 420px'
        />
        <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(8,15,24,0.04),rgba(8,15,24,0.42))]' />
      </div>

      <div className='flex min-h-[21rem] flex-1 flex-col p-5'>
        <div className='mb-3 flex flex-wrap gap-2'>
          <Badge>{test.category}</Badge>
          <Badge>{test.depth}</Badge>
          {test.riskLevel === 'high' ? (
            <span className='inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-text-strong)]'>
              <TriangleAlert size={12} />
              review carefully
            </span>
          ) : null}
        </div>

        <div className='min-h-[4.25rem]'>
          <h3 className='line-clamp-2 font-heading text-[1.95rem] leading-[1.05] text-[var(--color-text-strong)]'>
            {test.title}
          </h3>
        </div>

        <div className='min-h-[4.5rem] pt-2'>
          <p className='line-clamp-3 text-sm leading-6 text-[var(--color-muted)]'>{test.description}</p>
        </div>

        <div className='min-h-[2.5rem] pt-4'>
          <p className='text-sm text-[var(--color-muted)]'>
            {test.estimatedMinutes} min · {test.questions.length} prompts · {test.tone}
          </p>
        </div>

        <div className='min-h-[3rem] pt-3'>
          <div className='flex flex-wrap gap-2'>
            {test.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>

        <div className='mt-auto flex flex-col gap-3 pt-6'>
          <Link
            href={routes.test(test.slug)}
            className='inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition group-hover:translate-x-0.5'
          >
            Start this reflection <ArrowRight size={14} />
          </Link>
          {compact ? <div className='text-xs text-[var(--color-muted)]'>Built for reflection, not diagnosis.</div> : null}
        </div>
      </div>
    </Card>
  );
}
