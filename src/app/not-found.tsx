import Link from 'next/link';
import { AppShell } from '@/components/common/appShell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { routes } from '@/config/routes';

export default function NotFound() {
  return (
    <AppShell>
      <Card className='mx-auto max-w-xl space-y-4 p-8 text-center'>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]'>404</p>
        <h1 className='font-heading text-4xl text-[var(--color-text-strong)]'>Nothing lives at this address</h1>
        <p className='text-sm text-[var(--color-muted)]'>
          The link may be old, or the result it pointed to was erased from this device.
        </p>
        <div className='flex flex-wrap justify-center gap-2'>
          <Link href={routes.tests}><Button>Browse tests</Button></Link>
          <Link href={routes.home}><Button variant='secondary'>Go home</Button></Link>
        </div>
      </Card>
    </AppShell>
  );
}
