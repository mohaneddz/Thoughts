import type { Metadata } from 'next';
import { AppShell } from '@/components/common/appShell';
import { TestsLibraryPage } from '@/components/pages/testsLibraryPage';

export const metadata: Metadata = { title: 'Test library' };

export default function TestsPage() {
  return (
    <AppShell className='max-w-[92rem]'>
      <TestsLibraryPage />
    </AppShell>
  );
}

