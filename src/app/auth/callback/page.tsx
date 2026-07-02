'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/app-shell';
import { Card } from '@/components/ui/card';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import { routes } from '@/config/routes';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [message, setMessage] = useState('Finishing authentication...');

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      router.replace(routes.auth);
      return;
    }

    void supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          setMessage(error.message);
          return;
        }
        router.replace(routes.profile);
      })
      .catch(() => {
        setMessage('Could not complete authentication. Try again.');
      });
  }, [router, supabase]);

  return (
    <AppShell className='max-w-xl'>
      <Card>
        <p className='text-sm text-[var(--color-muted)]'>
          {supabase ? message : 'Supabase is not configured.'}
        </p>
      </Card>
    </AppShell>
  );
}
