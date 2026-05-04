import { ShieldAlert } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Card } from '@/components/ui/card';

export function DisclaimerBox({ compact = false }: { compact?: boolean }) {
  return (
    <Card className='flex items-start gap-2 rounded-xl p-3'>
      <ShieldAlert size={16} className='mt-0.5 text-[var(--color-primary)]' />
      <p className={compact ? 'text-xs text-[var(--color-muted)]' : 'text-sm text-[var(--color-muted)]'}>
        {siteConfig.disclaimer}
      </p>
    </Card>
  );
}

