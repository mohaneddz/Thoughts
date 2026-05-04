'use client';

import { useMemo } from 'react';
import { CategoryFilter } from '@/components/test/category-filter';
import { SearchInput } from '@/components/test/search-input';
import { TestCard } from '@/components/test/test-card';
import { PrivacyNotice } from '@/components/common/privacy-notice';
import { useTests } from '@/hooks/use-tests';
import { TestsIntro } from '@/sections/tests/intro';

export function TestsLibraryPage() {
  const { tests, query, category, depth, tone, setQuery, setCategory, setDepth, setTone } = useTests();

  const categories = useMemo(() => ['all', ...new Set(tests.map((test) => test.category))], [tests]);

  return (
    <div className='space-y-6'>
      <TestsIntro />
      <SearchInput value={query} onChange={setQuery} />

      <div className='space-y-3'>
        <h2 className='text-sm font-semibold text-[var(--color-muted)]'>Browse by category</h2>
        <CategoryFilter categories={categories} active={category} onSelect={setCategory} />
      </div>

      <div className='flex flex-wrap gap-2'>
        <CategoryFilter categories={['all', 'quick', 'medium', 'deep']} active={depth} onSelect={setDepth} />
        <CategoryFilter categories={['all', 'fun', 'serious', 'reflective']} active={tone} onSelect={setTone} />
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {tests.map((test) => (
          <TestCard key={test.id} test={test} compact />
        ))}
      </div>
      <PrivacyNotice />
    </div>
  );
}

