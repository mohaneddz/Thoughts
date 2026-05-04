import { AppShell } from '@/components/common/app-shell';
import { learnData } from '@/data/learn';
import { LearnArticleCard } from '@/components/common/learn-article-card';

export default function LearnPage() {
  return (
    <AppShell className='space-y-5'>
      <h1 className='font-heading text-5xl'>Learn</h1>
      <p className='text-[var(--color-muted)]'>Short educational articles linked to your reflection practice.</p>
      <div className='grid gap-4 md:grid-cols-2'>
        {learnData.map((article) => (
          <LearnArticleCard key={article.id} article={article} />
        ))}
      </div>
    </AppShell>
  );
}

