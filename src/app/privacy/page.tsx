import { AppShell } from '@/components/common/app-shell';
import { Card } from '@/components/ui/card';
import { crisisResources } from '@/data/crisis-resources';

export default function PrivacyPage() {
  return (
    <AppShell className='space-y-5'>
      <h1 className='font-heading text-5xl'>Privacy & Safety</h1>
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <h2 className='font-semibold'>Where your data lives</h2>
          <p className='mt-2 text-sm text-[var(--color-muted)]'>
            In your browser&apos;s local storage on this device — your profile, test answers, results, check-ins, and saved
            notes. There is no account, no sign-in, and no server holding a copy.
          </p>
        </Card>
        <Card>
          <h2 className='font-semibold'>What that means</h2>
          <p className='mt-2 text-sm text-[var(--color-muted)]'>
            Your data does not follow you to another browser or device, and clearing your browser data erases it. Anyone
            with access to this device and browser profile can see it.
          </p>
        </Card>
        <Card>
          <h2 className='font-semibold'>AI usage</h2>
          <p className='mt-2 text-sm text-[var(--color-muted)]'>
            AI interpretation is the one feature that leaves your device: the result you choose to interpret is sent to the
            Groq API to generate a response. Nothing is sent unless you ask for an interpretation.
          </p>
        </Card>
        <Card>
          <h2 className='font-semibold'>Export or delete</h2>
          <p className='mt-2 text-sm text-[var(--color-muted)]'>
            Your profile page can export everything as a JSON file, or erase all of it from this device in one step. No
            request or approval needed — it is your browser.
          </p>
        </Card>
      </div>
      <Card>
        <h2 className='font-semibold'>Important</h2>
        <p className='mt-2 text-sm text-[var(--color-muted)]'>This is not therapy or diagnosis. A few tests here are real clinical screeners (e.g. depression, anxiety, PTSD, suicide-risk screening) offered for informational reflection only, not assessment by a qualified professional.</p>
        <ul className='mt-3 space-y-2 rounded-[1.25rem] border border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]'>
          {crisisResources.map((resource) => (
            <li key={resource.label}>
              {resource.href ? (
                <a href={resource.href} className='font-semibold text-[var(--color-primary)] underline'>
                  {resource.label}
                </a>
              ) : (
                <span className='font-semibold text-[var(--color-text)]'>{resource.label}</span>
              )}
              : {resource.detail}
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}

