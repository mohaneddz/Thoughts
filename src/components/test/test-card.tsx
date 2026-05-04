import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { TestDefinition } from '@/types/test';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MediaPlaceholder } from '@/components/common/media-placeholder';
import { routes } from '@/config/routes';

export function TestCard({ test, compact = false }: { test: TestDefinition; compact?: boolean }) {
  return (
    <Card className='group p-0'>
      <div className='relative h-24 w-full overflow-hidden rounded-t-2xl'>
        <MediaPlaceholder className='h-full w-full rounded-none border-0' variant='ring' />
      </div>
      <div className='space-y-3 p-4'>
        <div className='space-y-1'>
          <h3 className='font-heading text-2xl text-[var(--color-text-strong)]'>{test.title}</h3>
          <p className='text-sm text-[var(--color-muted)]'>{test.description}</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Badge>{test.category}</Badge>
          <Badge>{test.estimatedMinutes} min</Badge>
          <Badge>{test.questions.length} questions</Badge>
        </div>
        <Link
          href={routes.test(test.slug)}
          className='inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]'
        >
          Start test <ArrowRight size={14} />
        </Link>
      </div>
      {compact && <div className='px-4 pb-4 text-xs text-[var(--color-muted)]'>Reflection, not diagnosis.</div>}
    </Card>
  );
}

