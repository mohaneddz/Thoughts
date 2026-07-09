import { AppShell } from '@/components/common/app-shell';
import { TestsLibraryPage } from '@/components/pages/tests-library-page';

export default function TestsPage() {
  return (
    <AppShell className='max-w-[92rem]'>
      <TestsLibraryPage />
    </AppShell>
  );
}

