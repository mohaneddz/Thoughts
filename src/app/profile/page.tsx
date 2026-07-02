'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/app-shell';
import { useAuth } from '@/components/common/auth-provider';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';

export default function ProfilePage() {
  const router = useRouter();
  const {
    isLoading,
    isAuthenticated,
    user,
    profile,
    signOut,
    updateDisplayName,
    updateEmail,
    updatePassword,
    deleteAccount,
  } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [nextEmail, setNextEmail] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [deletePhrase, setDeletePhrase] = useState('');

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [dangerMessage, setDangerMessage] = useState<string | null>(null);

  const [profilePending, setProfilePending] = useState(false);
  const [emailPending, setEmailPending] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);
  const [dangerPending, setDangerPending] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(routes.auth);
    }
  }, [isAuthenticated, isLoading, router]);

  const joinedDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown';
  const displayNameValue = displayName || profile?.display_name || '';
  const emailValue = nextEmail || profile?.email || user?.email || '';

  const onDisplayNameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileMessage(null);
    setProfilePending(true);
    const result = await updateDisplayName(displayNameValue);
    setProfilePending(false);
    setProfileMessage(result.error ? result.error : 'Display name updated.');
  };

  const onEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailMessage(null);
    setEmailPending(true);
    const result = await updateEmail(emailValue);
    setEmailPending(false);
    setEmailMessage(
      result.error
        ? result.error
        : 'Email update requested. Check your inbox if your Supabase project requires verification.',
    );
  };

  const onPasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage(null);

    if (nextPassword.length < 8) {
      setPasswordMessage('Password must be at least 8 characters.');
      return;
    }

    setPasswordPending(true);
    const result = await updatePassword(nextPassword);
    setPasswordPending(false);
    setPasswordMessage(result.error ? result.error : 'Password updated.');

    if (!result.error) {
      setNextPassword('');
    }
  };

  const onDeleteAccount = async () => {
    setDangerMessage(null);

    if (deletePhrase !== 'DELETE') {
      setDangerMessage('Type DELETE to confirm.');
      return;
    }

    setDangerPending(true);
    const result = await deleteAccount();
    setDangerPending(false);

    if (result.error) {
      setDangerMessage(result.error);
      return;
    }

    router.push(routes.home);
  };

  const onSignOut = async () => {
    await signOut();
    router.push(routes.home);
  };

  if (isLoading) {
    return (
      <AppShell className='space-y-4'>
        <Card>
          <p className='text-sm text-[var(--color-muted)]'>Loading account...</p>
        </Card>
      </AppShell>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <AppShell className='space-y-4'>
      <section className='space-y-2'>
        <h1 className='font-heading text-5xl text-[var(--color-text-strong)]'>Profile</h1>
        <p className='text-[var(--color-muted)]'>Manage your personal details and account security.</p>
      </section>

      <Card className='space-y-2'>
        <h2 className='font-heading text-3xl'>Overview</h2>
        <p className='text-sm text-[var(--color-muted)]'>Email: {profile?.email ?? user.email ?? 'Unknown'}</p>
        <p className='text-sm text-[var(--color-muted)]'>Joined: {joinedDate}</p>
      </Card>

      <Card className='space-y-3'>
        <h2 className='font-heading text-3xl'>Display name</h2>
        <form className='space-y-2' onSubmit={onDisplayNameSubmit}>
          <Input value={displayNameValue} onChange={(event) => setDisplayName(event.target.value)} maxLength={48} />
          {profileMessage ? <p className='text-sm text-[var(--color-muted)]'>{profileMessage}</p> : null}
          <Button type='submit' disabled={profilePending}>
            {profilePending ? 'Saving...' : 'Save name'}
          </Button>
        </form>
      </Card>

      <Card className='space-y-3'>
        <h2 className='font-heading text-3xl'>Email</h2>
        <form className='space-y-2' onSubmit={onEmailSubmit}>
          <Input
            type='email'
            value={emailValue}
            onChange={(event) => setNextEmail(event.target.value)}
            autoComplete='email'
          />
          {emailMessage ? <p className='text-sm text-[var(--color-muted)]'>{emailMessage}</p> : null}
          <Button type='submit' disabled={emailPending}>
            {emailPending ? 'Updating...' : 'Update email'}
          </Button>
        </form>
      </Card>

      <Card className='space-y-3'>
        <h2 className='font-heading text-3xl'>Password</h2>
        <form className='space-y-2' onSubmit={onPasswordSubmit}>
          <Input
            type='password'
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
            autoComplete='new-password'
            placeholder='At least 8 characters'
          />
          {passwordMessage ? <p className='text-sm text-[var(--color-muted)]'>{passwordMessage}</p> : null}
          <Button type='submit' disabled={passwordPending}>
            {passwordPending ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </Card>

      <Card className='space-y-3 border-red-400/40'>
        <h2 className='font-heading text-3xl text-red-300'>Danger zone</h2>
        <p className='text-sm text-[var(--color-muted)]'>
          Delete your account and all linked profile data. This cannot be undone.
        </p>
        <Input
          value={deletePhrase}
          onChange={(event) => setDeletePhrase(event.target.value)}
          placeholder='Type DELETE to confirm'
        />
        {dangerMessage ? <p className='text-sm text-red-300'>{dangerMessage}</p> : null}
        <div className='flex items-center gap-2'>
          <Button variant='secondary' onClick={onSignOut}>
            Sign out
          </Button>
          <Button onClick={onDeleteAccount} disabled={dangerPending}>
            {dangerPending ? 'Deleting...' : 'Delete account'}
          </Button>
        </div>
      </Card>
    </AppShell>
  );
}
