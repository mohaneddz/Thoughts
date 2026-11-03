import type { Metadata } from 'next';
import { AppShell } from '@/components/common/appShell';
import { ResultsHistoryPageClient } from '@/components/pages/resultsHistoryPageClient';

export const metadata: Metadata = { title: 'Your results', robots: { index: false } };

export default function ResultsPage() {
  return (
    <AppShell className='space-y-5'>
      <section className='space-y-2'>
        <h1 className='font-heading text-5xl text-[var(--color-text-strong)]'>Your results</h1>
        <p className='max-w-2xl text-[var(--color-muted)]'>Every test you have finished on this device, grouped by test, newest first.</p>
      </section>
      <ResultsHistoryPageClient />
    </AppShell>
  );
}
