import { AppShell } from '@/components/common/app-shell';
import { AIInterpreterPage } from '@/components/pages/ai-interpreter-page';

export default async function AIInterpreterRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const resultId = typeof query.resultId === 'string' ? query.resultId : 'r1';

  return (
    <AppShell>
      <AIInterpreterPage resultId={resultId} />
    </AppShell>
  );
}
