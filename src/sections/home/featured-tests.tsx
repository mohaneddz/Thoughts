import { TestCard } from '@/components/test/test-card';
import { testsData } from '@/data/tests';

export function FeaturedTests() {
  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='font-heading text-4xl'>Recommended for you</h2>
      </div>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {testsData.slice(0, 4).map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </section>
  );
}

