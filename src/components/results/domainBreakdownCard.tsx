import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DomainResult } from '@/types/result';

export function DomainBreakdownCard({ domains }: { domains: DomainResult[] }) {
  return (
    <Card className='space-y-4 border-[var(--color-panel-border)] bg-[var(--color-panel)]'>
      <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Subscale breakdown</p>
      <div className='grid gap-3 sm:grid-cols-3'>
        {domains.map((domain) => (
          <div key={domain.id} className='space-y-2 rounded-[1.2rem] border border-[var(--color-border)] p-3'>
            <p className='text-sm font-semibold text-[var(--color-text-strong)]'>{domain.label}</p>
            <p className='text-xs text-[var(--color-muted)]'>
              {domain.score} / {domain.maxScore}
            </p>
            {domain.band ? <Badge>{domain.band.label}</Badge> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
