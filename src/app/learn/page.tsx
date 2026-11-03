import type { Metadata } from 'next';
import { AppShell } from '@/components/common/appShell';
import { learnData } from '@/data/learn';
import { LearnArticleCard } from '@/components/common/learnArticleCard';
import { EnglishContentNotice } from '@/components/common/englishContentNotice';

export const metadata: Metadata = { title: 'Learn' };

export default function LearnPage() {
  return (
    <AppShell className='space-y-5'>
      <h1 className='font-heading text-5xl'>Learn</h1>
      <p className='text-[var(--color-muted)]'>Short educational articles linked to your reflection practice.</p>
      <EnglishContentNotice />
      <div className='grid gap-4 md:grid-cols-2'>
        {learnData.map((article) => (
          <LearnArticleCard key={article.id} article={article} />
        ))}
      </div>
    </AppShell>
  );
}

