import { AppShell } from '@/components/common/app-shell';
import { TestRunnerPage } from '@/components/pages/test-runner-page';

export default async function SingleTestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <AppShell backgroundMode='none'>
      <TestRunnerPage slug={slug} />
    </AppShell>
  );
}
