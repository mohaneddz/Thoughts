import type { PatternScore } from '@/types/result';
import { Card } from '@/components/ui/card';

export function ScoreChart({ score, patterns }: { score: number; patterns: PatternScore[] }) {
  return (
    <Card className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold text-[var(--color-text)]'>Key pattern map</h3>
        <div className='grid h-20 w-20 place-items-center rounded-full border-8 border-[var(--color-primary)]/90 text-2xl font-bold text-[var(--color-text-strong)]'>
          {score}
        </div>
      </div>
      <div className='space-y-2'>
        {patterns.map((pattern) => (
          <div key={pattern.label} className='grid grid-cols-[1fr_auto] items-center gap-3 text-sm'>
            <div className='h-1.5 rounded-full bg-[var(--color-surface-soft)]'>
              <div className='h-1.5 rounded-full bg-[var(--color-primary)]' style={{ width: `${pattern.value}%` }} />
            </div>
            <span className='text-[var(--color-muted)]'>{pattern.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

