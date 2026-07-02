import { AppShell } from '@/components/common/app-shell';
import { SavedThoughtsPageClient } from '@/components/pages/saved-thoughts-page-client';

export default function SavedThoughtsPage() {
  return (
    <AppShell className='space-y-5'>
      <h1 className='font-heading text-5xl'>Saved Thoughts</h1>
      <p className='text-[var(--color-muted)]'>Private saved insights, notes, and AI interpretations.</p>
      <SavedThoughtsPageClient />
    </AppShell>
  );
}
