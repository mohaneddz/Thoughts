import { TriangleAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { crisisCopy } from '@/data/crisisResources';
import { CrisisResourceList } from '@/components/common/crisisResourceList';
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
      <CrisisResourceList />
    </Card>
  );
}
