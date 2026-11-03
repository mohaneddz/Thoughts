import type { Metadata } from 'next';
import { AppShell } from '@/components/common/appShell';
import { DashboardPageClient } from '@/components/pages/dashboardPageClient';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <AppShell className='space-y-5'>
      <DashboardPageClient />
    </AppShell>
  );
}
