import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/common/appShell';
import { Card } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { learnData } from '@/data/learn';
import { reflectionToolsData } from '@/data/reflectionTools';
import { testsData } from '@/data/tests';

export function generateStaticParams() {
  return learnData.map((article) => ({ id: article.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = learnData.find((item) => item.id === id);
  return article ? { title: article.title, description: article.summary } : {};
}

export default async function LearnArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = learnData.findIndex((item) => item.id === id);
  if (index < 0) notFound();

  const article = learnData[index];
  const next = learnData[(index + 1) % learnData.length];
  const relatedLinks = [
    ...article.relatedTests
      .map((slug) => testsData.find((test) => test.slug === slug))
      .filter((test) => test !== undefined)
      .map((test) => ({ href: routes.test(test.slug), label: test.title, kind: 'Test' })),
    ...article.relatedTools
      .map((toolId) => reflectionToolsData.find((tool) => tool.id === toolId))
      .filter((tool) => tool !== undefined)
      .map((tool) => ({ href: routes.tool(tool.id), label: tool.title, kind: 'Tool' })),
  ];

  return (
    <AppShell className='max-w-3xl space-y-6'>
      <Link href={routes.learn} className='inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]'>
        <ArrowLeft size={14} />
        All articles
      </Link>

      <header className='space-y-3'>
        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]'>
          {article.topic} · {article.minutes} min read
        </p>
        <h1 className='font-heading text-5xl leading-tight text-[var(--color-text-strong)]'>{article.title}</h1>
        <p className='text-lg text-[var(--color-muted)]'>{article.summary}</p>
      </header>

      <article className='space-y-7'>
        {article.sections.map((section, sectionIndex) => (
          <section key={section.heading ?? sectionIndex} className='space-y-3'>
            {section.heading ? <h2 className='font-heading text-3xl text-[var(--color-text-strong)]'>{section.heading}</h2> : null}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className='leading-8 text-[var(--color-text)]'>{paragraph}</p>
            ))}
            {section.steps ? (
              <ul className='space-y-2 border-s-2 border-[var(--color-primary)]/40 ps-4'>
                {section.steps.map((step) => (
                  <li key={step} className='leading-7 text-[var(--color-text)]'>{step}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>

      <p className='text-xs text-[var(--color-muted)]'>For reflection and general education only — not medical or psychological advice.</p>

      {relatedLinks.length ? (
        <Card className='space-y-3 p-5'>
          <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Try it yourself</p>
          <div className='grid gap-2 sm:grid-cols-2'>
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm transition hover:border-[var(--color-primary)]/50'
              >
                <span className='font-medium text-[var(--color-text)]'>{link.label}</span>
                <span className='text-xs uppercase tracking-wide text-[var(--color-muted)]'>{link.kind}</span>
              </Link>
            ))}
          </div>
        </Card>
      ) : null}

      <Link href={routes.article(next.id)} className='group flex items-center justify-between rounded-[1.6rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-primary)]/50'>
        <span>
          <span className='block text-xs uppercase tracking-wide text-[var(--color-muted)]'>Next article</span>
          <span className='font-heading text-2xl text-[var(--color-text-strong)]'>{next.title}</span>
        </span>
        <ArrowRight size={18} className='text-[var(--color-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--color-primary)]' />
      </Link>
    </AppShell>
  );
}
