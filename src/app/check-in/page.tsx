'use client';

import { AppShell } from '@/components/common/app-shell';
import { CheckInForm, type CheckInValues } from '@/components/forms/check-in-form';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

export default function CheckInPage() {
  const [reflection, setReflection] = useState<string>('');

  const onSubmit = (values: CheckInValues) => {
    const action = values.stress > 6 ? 'Take a 5-minute breathing break.' : 'Keep the pace and protect your focus block.';
    setReflection(`You reported mood ${values.mood}/10 with stress ${values.stress}/10. Tiny action: ${action}`);
  };

  return (
    <AppShell className='space-y-4'>
      <CheckInForm onSubmit={onSubmit} />
      {reflection && (
        <Card className='space-y-2'>
          <h2 className='font-heading text-3xl'>Your reflection</h2>
          <p className='text-sm text-[var(--color-muted)]'>{reflection}</p>
        </Card>
      )}
    </AppShell>
  );
}

