import { AppShell } from '@/components/common/appShell';
import { TestsLibraryPage } from '@/components/pages/testsLibraryPage';

export default function TestsPage() {
  return (
    <AppShell className='max-w-[92rem]'>
      <TestsLibraryPage />
    </AppShell>
  );
}

