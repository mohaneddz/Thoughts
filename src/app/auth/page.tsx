'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/app-shell';
import { useAuth } from '@/components/common/auth-provider';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';

type AuthMode = 'sign-in' | 'sign-up';

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(routes.profile);
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    if (mode === 'sign-up' && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setPending(true);

    if (mode === 'sign-in') {
      const result = await signIn({ email, password });
      if (result.error) {
        setError(result.error);
      } else {
        router.push(routes.profile);
      }
      setPending(false);
      return;
    }

    const result = await signUp({ email, password, displayName });
    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    if (result.needsEmailVerification) {
      setMessage('Account created. Check your email to verify your account, then sign in.');
      setMode('sign-in');
      setPassword('');
      setPending(false);
      return;
    }

    router.push(routes.profile);
    setPending(false);
  };

  return (
    <AppShell className='max-w-xl space-y-4'>
      <section className='space-y-2'>
        <h1 className='font-heading text-5xl text-[var(--color-text-strong)]'>Your account</h1>
        <p className='text-[var(--color-muted)]'>Sign in to sync your profile, results, and saved thoughts.</p>
      </section>

      <Card className='space-y-4'>
        <div className='flex gap-2 rounded-xl bg-[var(--color-surface-soft)] p-1'>
          <Button
            variant={mode === 'sign-in' ? 'primary' : 'ghost'}
            className='flex-1'
            onClick={() => setMode('sign-in')}
            type='button'
          >
            Sign in
          </Button>
          <Button
            variant={mode === 'sign-up' ? 'primary' : 'ghost'}
            className='flex-1'
            onClick={() => setMode('sign-up')}
            type='button'
          >
            Create account
          </Button>
        </div>

        <form className='space-y-3' onSubmit={onSubmit}>
          {mode === 'sign-up' ? (
            <div className='space-y-1'>
              <label className='text-sm text-[var(--color-muted)]' htmlFor='display-name'>
                Display name
              </label>
              <Input
                id='display-name'
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder='How should we call you?'
              />
            </div>
          ) : null}

          <div className='space-y-1'>
            <label className='text-sm text-[var(--color-muted)]' htmlFor='email'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder='you@example.com'
              required
            />
          </div>

          <div className='space-y-1'>
            <label className='text-sm text-[var(--color-muted)]' htmlFor='password'>
              Password
            </label>
            <Input
              id='password'
              type='password'
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder='At least 8 characters'
              required
            />
          </div>

          {error ? <p className='text-sm text-red-400'>{error}</p> : null}
          {message ? <p className='text-sm text-emerald-400'>{message}</p> : null}

          <Button className='w-full' type='submit' disabled={pending}>
            {pending ? 'Please wait...' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}
