import { AppShell } from '@/components/common/app-shell';
import { Card } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <AppShell className='space-y-5'>
      <h1 className='font-heading text-5xl'>Privacy & Safety</h1>
      <div className='grid gap-4 md:grid-cols-2'>
        <Card><h2 className='font-semibold'>What we store</h2><p className='mt-2 text-sm text-[var(--color-muted)]'>Your test answers, results, check-ins, and saved notes linked to your account.</p></Card>
        <Card><h2 className='font-semibold'>What we do not store</h2><p className='mt-2 text-sm text-[var(--color-muted)]'>We do not sell your data and do not use this service as clinical profiling.</p></Card>
        <Card><h2 className='font-semibold'>AI usage</h2><p className='mt-2 text-sm text-[var(--color-muted)]'>AI uses your selected result context to generate reflective guidance.</p></Card>
        <Card><h2 className='font-semibold'>Delete data</h2><p className='mt-2 text-sm text-[var(--color-muted)]'>You can request deletion of your private data from account settings.</p></Card>
      </div>
      <Card>
        <h2 className='font-semibold'>Important</h2>
        <p className='mt-2 text-sm text-[var(--color-muted)]'>This is not therapy or diagnosis. If you feel in immediate danger or severe distress, seek local emergency support or a qualified professional.</p>
      </Card>
    </AppShell>
  );
}

