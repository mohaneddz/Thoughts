import { AppShell } from '@/components/common/app-shell';
import { collectionsData } from '@/data/collections';
import { CollectionCard } from '@/components/common/collection-card';

export default function CollectionsPage() {
  return (
    <AppShell className='space-y-5'>
      <h1 className='font-heading text-5xl'>Collections</h1>
      <p className='text-[var(--color-muted)]'>Guided paths built from tests and reflection tools.</p>
      <div className='grid gap-4 md:grid-cols-2'>
        {collectionsData.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </AppShell>
  );
}

