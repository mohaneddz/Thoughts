import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { routes } from '@/config/routes';
import type { LearnArticle } from '@/data/learn';

export function LearnArticleCard({ article }: { article: LearnArticle }) {
  return (
    <Link href={routes.article(article.id)} className='group'>
      <Card className='h-full space-y-3 transition group-hover:-translate-y-0.5 group-hover:border-[var(--color-primary)]/40'>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-xs uppercase tracking-wide text-[var(--color-primary)]'>{article.topic}</p>
          <p className='inline-flex items-center gap-1 text-xs text-[var(--color-muted)]'>
            <Clock size={12} />
            {article.minutes} min read
          </p>
        </div>
        <h3 className='font-heading text-2xl text-[var(--color-text-strong)] group-hover:text-[var(--color-primary)]'>{article.title}</h3>
        <p className='text-sm text-[var(--color-muted)]'>{article.summary}</p>
      </Card>
    </Link>
  );
}
