import { AppShell } from '@/components/common/appShell';
import { TestRunnerPage } from '@/components/pages/testRunnerPage';

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
