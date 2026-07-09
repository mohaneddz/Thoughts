import { TestCard } from '@/components/test/test-card';
import { testsData } from '@/data/tests';
import { buildTestCatalog } from '@/utils/tests/catalog';

export function FeaturedTests() {
  const featured = buildTestCatalog(testsData).filter((test) =>
    ['emotional-awareness-test', 'values-clarity-test', 'overthinking-test', 'social-battery-test'].includes(test.slug),
  );

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]'>Start here</p>
          <h2 className='font-heading text-4xl'>Reflections that are easy to enter</h2>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {featured.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </section>
  );
}

