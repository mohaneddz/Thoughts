import { AppShell } from '@/components/common/app-shell';
import { ResultPageClient } from '@/components/pages/result-page-client';

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell className='space-y-5'>
      <ResultPageClient resultId={id} />
    </AppShell>
  );
}
