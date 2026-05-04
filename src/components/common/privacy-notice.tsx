import { Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function PrivacyNotice() {
  return (
    <Card className='flex items-center justify-between gap-3 rounded-xl p-3'>
      <div className='flex items-center gap-2'>
        <Lock size={16} className='text-[var(--color-primary)]' />
        <div>
          <p className='text-sm font-semibold text-[var(--color-text)]'>Your privacy is our priority.</p>
          <p className='text-xs text-[var(--color-muted)]'>Your data is encrypted, never sold, and always in your control.</p>
        </div>
      </div>
      <span className='text-xs text-[var(--color-primary)]'>Learn more</span>
    </Card>
  );
}

