import { Card } from '@/components/ui/card';
import type { LearnArticle } from '@/data/learn';

export function LearnArticleCard({ article }: { article: LearnArticle }) {
  return (
    <Card className='space-y-2'>
      <p className='text-xs uppercase tracking-wide text-[var(--color-primary)]'>{article.topic}</p>
      <h3 className='font-heading text-2xl text-[var(--color-text-strong)]'>{article.title}</h3>
      <p className='text-sm text-[var(--color-muted)]'>{article.summary}</p>
    </Card>
  );
}

