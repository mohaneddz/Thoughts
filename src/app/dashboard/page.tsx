import { AppShell } from '@/components/common/app-shell';
import { DashboardPageClient } from '@/components/pages/dashboard-page-client';

export default function DashboardPage() {
  return (
    <AppShell className='space-y-5'>
      <DashboardPageClient />
    </AppShell>
  );
}
