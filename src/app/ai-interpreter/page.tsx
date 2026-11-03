import type { Metadata } from 'next';
import { AppShell } from '@/components/common/appShell';
import { AIInterpreterPage } from '@/components/pages/aiInterpreterPage';

export const metadata: Metadata = { title: 'AI interpreter' };

export default async function AIInterpreterRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const resultId = typeof query.resultId === 'string' ? query.resultId : undefined;

  return (
    <AppShell>
      <AIInterpreterPage resultId={resultId} />
    </AppShell>
  );
}
