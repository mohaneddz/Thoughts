import { AppShell } from '@/components/common/appShell';
import { ResultPageClient } from '@/components/pages/resultPageClient';

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
