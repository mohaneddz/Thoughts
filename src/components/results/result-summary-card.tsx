import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TestResultSummary } from '@/types/result';

export function ResultSummaryCard({ result }: { result: TestResultSummary }) {
  return (
    <Card className='space-y-3'>
      <p className='text-sm text-[var(--color-muted)]'>Your overall pattern</p>
      <h2 className='font-heading text-4xl text-[var(--color-text-strong)]'>{result.pattern}</h2>
      <div className='flex flex-wrap gap-2'>
        {result.strengths.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
      <p className='text-sm text-[var(--color-muted)]'>You show a healthy mix of self-awareness, emotional balance, and purpose.</p>
    </Card>
  );
}

