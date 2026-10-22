import { AppShell } from '@/components/common/appShell';
import { DashboardPageClient } from '@/components/pages/dashboardPageClient';

export default function DashboardPage() {
  return (
    <AppShell className='space-y-5'>
      <DashboardPageClient />
    </AppShell>
  );
}
