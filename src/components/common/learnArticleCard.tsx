import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { testsData } from '@/data/tests';
import type { LearnArticle } from '@/data/learn';

export function LearnArticleCard({ article }: { article: LearnArticle }) {
  const related = article.relatedTests
    .map((slug) => testsData.find((test) => test.slug === slug))
    .filter((test) => test !== undefined);

  return (
    <Card className='space-y-3'>
      <p className='text-xs uppercase tracking-wide text-[var(--color-primary)]'>{article.topic}</p>
      <h3 className='font-heading text-2xl text-[var(--color-text-strong)]'>{article.title}</h3>
      <p className='text-sm text-[var(--color-muted)]'>{article.summary}</p>
      {related.length ? (
        <div className='flex flex-wrap gap-2 pt-1'>
          {related.map((test) => (
            <Link
              key={test.slug}
              href={routes.test(test.slug)}
              className='rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            >
              {test.title}
            </Link>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
