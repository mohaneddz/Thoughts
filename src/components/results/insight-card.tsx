import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

export function InsightCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className='space-y-2'>
      <h3 className='font-semibold text-[var(--color-text)]'>{title}</h3>
      <div className='text-sm text-[var(--color-muted)]'>{children}</div>
    </Card>
  );
}

