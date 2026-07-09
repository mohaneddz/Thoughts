'use client';

import { useMemo } from 'react';
import { CategoryFilter } from '@/components/test/category-filter';
import { SearchInput } from '@/components/test/search-input';
import { TestCard } from '@/components/test/test-card';
import { useTests } from '@/hooks/use-tests';
import { TestsIntro } from '@/sections/tests/intro';

export function TestsLibraryPage() {
  const {
    allTests,
    tests,
    query,
    category,
    depth,
    tone,
    compliance,
    setQuery,
    setCategory,
    setDepth,
    setTone,
    setCompliance,
  } = useTests();

  const categories = useMemo(() => ['all', ...new Set(allTests.map((test) => test.category))], [allTests]);
  const hasActiveFilters = query || category !== 'all' || depth !== 'all' || tone !== 'all' || compliance !== 'all';

  const resetFilters = () => {
    setQuery('');
    setCategory('all');
    setDepth('all');
    setTone('all');
    setCompliance('all');
  };

  return (
    <div className='space-y-8'>
      <TestsIntro />

      <div className='rounded-[2rem] border border-[var(--color-panel-border)] bg-[var(--color-panel)] p-5 shadow-[0_24px_65px_rgba(8,15,24,0.06)] md:p-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Search and filters</p>
            <div className='flex items-center gap-4'>
              <p className='text-sm text-[var(--color-muted)]'>
                <span className='font-semibold text-[var(--color-text-strong)]'>{tests.length}</span> matches
              </p>
              {hasActiveFilters ? (
                <button
                  type='button'
                  onClick={resetFilters}
                  className='text-sm font-medium text-[var(--color-primary)] transition hover:text-[var(--color-text-strong)]'
                >
                  Reset all
                </button>
              ) : null}
            </div>
          </div>

          <div className='grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_auto_auto_auto] xl:items-center'>
            <SearchInput value={query} onChange={setQuery} />
            <CategoryFilter categories={['all', 'quick', 'medium', 'deep']} active={depth} onSelect={setDepth} label='Depth' />
            <CategoryFilter categories={['all', 'fun', 'serious', 'reflective']} active={tone} onSelect={setTone} label='Tone' />
            <CategoryFilter
              categories={['all', 'active', 'caution', 'licensed']}
              active={compliance}
              onSelect={setCompliance}
              label='Availability'
            />
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center justify-between gap-3'>
          <h2 className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Browse by category</h2>
          <p className='text-sm text-[var(--color-muted)]'>Single-tap shortcuts instead of the long dropdown.</p>
        </div>
        <CategoryFilter categories={categories} active={category} onSelect={setCategory} mode='chips' />
      </div>

      {tests.length ? (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {tests.map((test) => (
            <TestCard key={test.id} test={test} compact />
          ))}
        </div>
      ) : (
        <div className='rounded-[1.8rem] border border-[var(--color-panel-border)] bg-[var(--color-panel)] p-8 text-center'>
          <p className='text-lg font-semibold text-[var(--color-text-strong)]'>No tests match those filters.</p>
          <p className='mt-2 text-sm text-[var(--color-muted)]'>Try a broader search or reset the current filters.</p>
          {hasActiveFilters ? (
            <div className='mt-4'>
              <button
                type='button'
                onClick={resetFilters}
                className='rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-primary)]/35 hover:text-[var(--color-text-strong)]'
              >
                Reset filters
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
