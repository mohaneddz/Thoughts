import { Progress } from '@/components/ui/progress';

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-xs text-[var(--color-muted)]'>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

