'use client';

import { useMemo, useState } from 'react';
import { testsData } from '@/data/tests';

export function useTests() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [depth, setDepth] = useState<string>('all');
  const [tone, setTone] = useState<string>('all');

  const filteredTests = useMemo(() => {
    return testsData.filter((test) => {
      const queryMatch =
        !query ||
        test.title.toLowerCase().includes(query.toLowerCase()) ||
        test.description.toLowerCase().includes(query.toLowerCase());
      const categoryMatch = category === 'all' || test.category === category;
      const depthMatch = depth === 'all' || test.depth === depth;
      const toneMatch = tone === 'all' || test.tone === tone;

      return queryMatch && categoryMatch && depthMatch && toneMatch;
    });
  }, [query, category, depth, tone]);

  return {
    tests: filteredTests,
    query,
    category,
    depth,
    tone,
    setQuery,
    setCategory,
    setDepth,
    setTone,
  };
}

