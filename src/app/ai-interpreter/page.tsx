import { AppShell } from '@/components/common/app-shell';
import { AIInterpreterPage } from '@/components/pages/ai-interpreter-page';
import { sampleResult } from '@/data/tests';

export default async function AIInterpreterRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const resultId = typeof query.resultId === 'string' ? query.resultId : sampleResult.id;
  const result = { ...sampleResult, id: resultId };

  return (
    <AppShell>
      <AIInterpreterPage result={result} />
    </AppShell>
  );
}

