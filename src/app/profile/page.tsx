'use client';

import { useRef, useState } from 'react';
import { Check, Download, Trash2, Upload } from 'lucide-react';
import { AppShell } from '@/components/common/app-shell';
import { Avatar } from '@/components/common/avatar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/use-profile';
import { usePersonalData } from '@/hooks/use-personal-data';
import { accentOptions, avatarEmojiOptions, clearProfile, fileToAvatarDataUrl } from '@/utils/storage/profile';
import { clearPersonalData } from '@/utils/storage/personal-data';
import { cn } from '@/utils/cn';

export default function ProfilePage() {
  const { profile, updateProfile, hasProfile } = useProfile();
  const { checkIns, results, savedThoughts, drafts } = usePersonalData();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const nameValue = nameDraft ?? profile.displayName;

  const stats = [
    { label: 'Test results', value: results.length },
    { label: 'Check-ins', value: checkIns.length },
    { label: 'Saved thoughts', value: savedThoughts.length },
    { label: 'Tests in progress', value: drafts.length },
  ];

  const saveName = () => {
    updateProfile({ displayName: nameValue.trim() });
    setNameDraft(null);
    setSavedNote(true);
    window.setTimeout(() => setSavedNote(false), 2000);
  };

  const onPickImage = async (file: File | undefined) => {
    if (!file) return;
    setAvatarError(null);

    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      updateProfile({ avatarKind: 'image', avatarImage: dataUrl });
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : 'Could not use that image.');
    }
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile,
      results,
      checkIns,
      savedThoughts,
      drafts,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `happy-healthy-human-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const wipeEverything = () => {
    if (deletePhrase !== 'DELETE') {
      setDeleteMessage('Type DELETE to confirm.');
      return;
    }

    clearPersonalData();
    clearProfile();
    setDeletePhrase('');
    setDeleteMessage('All local data erased from this device.');
  };

  return (
    <AppShell className='space-y-5'>
      <section className='space-y-2'>
        <h1 className='font-heading text-5xl text-[var(--color-text-strong)]'>Your profile</h1>
        <p className='max-w-2xl text-[var(--color-muted)]'>
          There is no account and no sign-in. Everything below is stored only in this browser, on this device.
        </p>
      </section>

      {!hasProfile ? (
        <Card className='border-[var(--color-warning-border)] bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]'>
          <p className='text-sm'>Pick a name and an avatar so results and check-ins feel like yours. You can change both any time.</p>
        </Card>
      ) : null}

      <Card className='space-y-5'>
        <div className='flex items-center gap-4'>
          <Avatar profile={profile} size={64} />
          <div className='min-w-0'>
            <p className='font-heading text-2xl text-[var(--color-text-strong)]'>{profile.displayName.trim() || 'Unnamed'}</p>
            <p className='text-sm text-[var(--color-muted)]'>
              {profile.createdAt ? `On this device since ${new Date(profile.createdAt).toLocaleDateString()}` : 'Not saved yet'}
            </p>
          </div>
        </div>

        <div className='space-y-2'>
          <label htmlFor='display-name' className='text-sm font-semibold text-[var(--color-text)]'>
            What should we call you?
          </label>
          <div className='flex flex-wrap gap-2'>
            <Input
              id='display-name'
              className='max-w-xs'
              value={nameValue}
              maxLength={48}
              placeholder='Your name or a nickname'
              onChange={(event) => setNameDraft(event.target.value)}
            />
            <Button onClick={saveName}>{savedNote ? 'Saved' : 'Save'}</Button>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-sm font-semibold text-[var(--color-text)]'>Avatar</p>
          <div className='flex flex-wrap gap-2'>
            {avatarEmojiOptions.map((emoji) => {
              const active = profile.avatarKind === 'emoji' && profile.avatarEmoji === emoji;
              return (
                <button
                  key={emoji}
                  type='button'
                  aria-label={`Use ${emoji} as avatar`}
                  aria-pressed={active}
                  onClick={() => updateProfile({ avatarKind: 'emoji', avatarEmoji: emoji })}
                  className={cn(
                    'grid h-11 w-11 place-items-center rounded-full border text-xl transition',
                    active
                      ? 'border-[var(--color-primary)] bg-[var(--color-surface-soft)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-soft)]',
                  )}
                >
                  {emoji}
                </button>
              );
            })}
          </div>

          <div className='flex flex-wrap items-center gap-2 pt-1'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(event) => {
                void onPickImage(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
            <Button variant='secondary' onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} />
              Upload a picture
            </Button>
            {profile.avatarImage ? (
              <Button variant='ghost' onClick={() => updateProfile({ avatarKind: 'emoji', avatarImage: undefined })}>
                Remove picture
              </Button>
            ) : null}
          </div>
          <p className='text-xs text-[var(--color-muted)]'>
            Pictures are cropped and shrunk in your browser before being saved locally. Nothing is uploaded anywhere.
          </p>
          {avatarError ? <p className='text-sm text-[var(--color-danger-text)]'>{avatarError}</p> : null}
        </div>

        <div className='space-y-2'>
          <p className='text-sm font-semibold text-[var(--color-text)]'>Accent</p>
          <div className='flex flex-wrap gap-2'>
            {accentOptions.map((accent) => {
              const active = profile.accent === accent.value;
              return (
                <button
                  key={accent.value}
                  type='button'
                  aria-label={accent.label}
                  aria-pressed={active}
                  onClick={() => updateProfile({ accent: accent.value })}
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-full border-2 transition',
                    active ? 'border-[var(--color-text-strong)]' : 'border-transparent',
                  )}
                  style={{ backgroundColor: accent.value }}
                >
                  {active ? <Check size={14} className='text-white' /> : null}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className='space-y-4'>
        <h2 className='font-heading text-3xl'>What is stored on this device</h2>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <div key={stat.label} className='rounded-[1.2rem] border border-[var(--color-border)] p-3'>
              <p className='font-heading text-3xl text-[var(--color-text-strong)]'>{stat.value}</p>
              <p className='text-sm text-[var(--color-muted)]'>{stat.label}</p>
            </div>
          ))}
        </div>
        <Button variant='secondary' onClick={exportData}>
          <Download size={14} />
          Export everything as JSON
        </Button>
      </Card>

      <Card className='space-y-3 border-[var(--color-danger-border)] bg-[var(--color-danger-bg)]'>
        <h2 className='font-heading text-3xl text-[var(--color-danger-text)]'>Erase local data</h2>
        <p className='text-sm text-[var(--color-muted)]'>
          Clearing your browser data does the same thing. This removes your profile, results, check-ins, saved thoughts, and
          any test in progress. It cannot be undone, so export first if you want a copy.
        </p>
        <Input
          className='max-w-xs'
          value={deletePhrase}
          onChange={(event) => setDeletePhrase(event.target.value)}
          placeholder='Type DELETE to confirm'
          aria-label='Type DELETE to confirm erasing local data'
        />
        {deleteMessage ? <p className='text-sm text-[var(--color-danger-text)]'>{deleteMessage}</p> : null}
        <Button variant='secondary' onClick={wipeEverything}>
          <Trash2 size={14} />
          Erase everything
        </Button>
      </Card>
    </AppShell>
  );
}
