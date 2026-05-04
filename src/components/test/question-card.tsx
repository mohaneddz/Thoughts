import { Card } from '@/components/ui/card';
import type { ReactNode } from 'react';

export function QuestionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className='space-y-4'>
      <h2 className='font-heading text-4xl leading-tight text-[var(--color-text-strong)]'>{title}</h2>
      {children}
    </Card>
  );
}

