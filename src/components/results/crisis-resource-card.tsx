import { TriangleAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { crisisResources, crisisCopy } from '@/data/crisis-resources';
import type { CrisisSignal } from '@/types/result';

export function CrisisResourceCard({ signal }: { signal: CrisisSignal }) {
  const copy = crisisCopy[signal.level];
  const tone = signal.level === 'urgent' ? 'danger' : 'warning';

  return (
    <Card
      className={
        tone === 'danger'
          ? 'space-y-3 border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]'
          : 'space-y-3 border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]'
      }
    >
      <div className='flex items-start gap-2'>
        <TriangleAlert size={18} className='mt-0.5 shrink-0' />
        <div>
          <h2 className='font-heading text-2xl'>{copy.title}</h2>
          <p className='mt-1 text-sm leading-6'>{copy.body}</p>
        </div>
      </div>
      <ul className='space-y-2 rounded-[1.25rem] border border-current/20 bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text)]'>
        {crisisResources.map((resource) =>
          resource.href ? (
            <li key={resource.label}>
              <a href={resource.href} className='font-semibold text-[var(--color-primary)] underline'>
                {resource.label}
              </a>
              : {resource.detail}
            </li>
          ) : (
            <li key={resource.label}>
              <span className='font-semibold text-[var(--color-text-strong)]'>{resource.label}:</span> {resource.detail}
            </li>
          ),
        )}
      </ul>
    </Card>
  );
}
