import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

export function InsightCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className='space-y-3 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
      <h3 className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>{title}</h3>
      <div className='text-sm leading-7 text-[var(--color-muted)]'>{children}</div>
    </Card>
  );
}

