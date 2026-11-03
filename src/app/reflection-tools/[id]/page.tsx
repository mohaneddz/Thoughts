import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AppShell } from '@/components/common/appShell';
import { ToolRenderer } from '@/components/tools/toolRenderer';
import { routes } from '@/config/routes';
import { reflectionToolsData } from '@/data/reflectionTools';

export function generateStaticParams() {
  return reflectionToolsData.map((tool) => ({ id: tool.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tool = reflectionToolsData.find((item) => item.id === id);
  return tool ? { title: tool.title, description: tool.description } : {};
}

export default async function ReflectionToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = reflectionToolsData.find((item) => item.id === id);
  if (!tool) notFound();

  return (
    <AppShell className='space-y-5'>
      <Link href={routes.reflectionTools} className='inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]'>
        <ArrowLeft size={14} />
        All tools
      </Link>
      <section className='space-y-2'>
        <h1 className='font-heading text-5xl text-[var(--color-text-strong)]'>{tool.title}</h1>
        <p className='max-w-2xl text-[var(--color-muted)]'>{tool.description} Nothing you type leaves this device unless you save it — and even then it stays in this browser.</p>
      </section>
      <ToolRenderer tool={tool} />
    </AppShell>
  );
}
