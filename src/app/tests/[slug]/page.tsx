import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/common/appShell';
import { TestRunnerPage } from '@/components/pages/testRunnerPage';
import { testsData } from '@/data/tests';

function findRunnableTest(slug: string) {
  return testsData.find((item) => item.slug === slug && item.status !== 'pending' && item.questions.length > 0);
}

export function generateStaticParams() {
  return testsData.filter((item) => item.status !== 'pending').map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const test = findRunnableTest((await params).slug);
  return test ? { title: test.title, description: test.description } : {};
}

export default async function SingleTestPage({ params }: { params: Promise<{ slug: string }> }) {
  const test = findRunnableTest((await params).slug);
  if (!test) notFound();

  return (
    <AppShell backgroundMode='none'>
      <TestRunnerPage test={test} />
    </AppShell>
  );
}
