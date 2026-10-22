import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/utils/formatting';
import type { TestResultSummary } from '@/types/result';

export function ResultSummaryCard({ result }: { result: TestResultSummary }) {
  return (
    <Card className='space-y-4 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
      <div className='flex flex-wrap items-center gap-2'>
        <Badge>{result.testTitle}</Badge>
        <Badge>{formatDateTime(result.createdAt)}</Badge>
      </div>
      <h2 className='font-heading text-4xl leading-tight text-[var(--color-text-strong)]'>{result.pattern}</h2>
      <p className='text-sm leading-7 text-[var(--color-muted)]'>{result.meaning}</p>
    </Card>
  );
}
