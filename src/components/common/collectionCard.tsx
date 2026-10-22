import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { reflectionToolsData } from '@/data/reflectionTools';
import { testsData } from '@/data/tests';
import type { CollectionGuide, CollectionStep } from '@/data/collections';

function resolveStep(step: CollectionStep) {
  if (step.kind === 'test') {
    const test = testsData.find((item) => item.slug === step.id);
    return test ? { href: routes.test(test.slug), title: test.title, kind: 'Test' } : undefined;
  }
  const tool = reflectionToolsData.find((item) => item.id === step.id);
  return tool ? { href: routes.tool(tool.id), title: tool.title, kind: 'Tool' } : undefined;
}

export function CollectionCard({ collection }: { collection: CollectionGuide }) {
  const steps = collection.steps.map(resolveStep).filter((step) => step !== undefined);

  return (
    <Card className='space-y-4'>
      <div className='space-y-2'>
        <h3 className='font-heading text-3xl text-[var(--color-text-strong)]'>{collection.title}</h3>
        <p className='text-sm text-[var(--color-muted)]'>{collection.intro}</p>
      </div>
      <ol className='space-y-2'>
        {steps.map((step, index) => (
          <li key={step.href}>
            <Link
              href={step.href}
              className='flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm transition hover:border-[var(--color-primary)]/50'
            >
              <span className='grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-surface-soft)] text-xs font-semibold text-[var(--color-primary)]'>
                {index + 1}
              </span>
              <span className='flex-1 font-medium text-[var(--color-text)]'>{step.title}</span>
              <span className='text-xs uppercase tracking-wide text-[var(--color-muted)]'>{step.kind}</span>
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}
