'use client';

import { useMemo, useState } from 'react';
import { testsData } from '@/data/tests';

export function useTests() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [depth, setDepth] = useState<string>('all');
  const [tone, setTone] = useState<string>('all');
  const [compliance, setCompliance] = useState<string>('all');

  const filteredTests = useMemo(() => {
    return testsData.filter((test) => {
      if (test.status === 'pending') return false;

      const queryMatch =
        !query ||
        test.title.toLowerCase().includes(query.toLowerCase()) ||
        test.description.toLowerCase().includes(query.toLowerCase());
      const categoryMatch = category === 'all' || test.category === category;
      const depthMatch = depth === 'all' || test.depth === depth;
      const toneMatch = tone === 'all' || test.tone === tone;
      const complianceMatch =
        compliance === 'all' ||
        test.status === compliance ||
        test.tags.some((tag) => tag.toLowerCase() === compliance.toLowerCase());

      return queryMatch && categoryMatch && depthMatch && toneMatch && complianceMatch;
    });
  }, [query, category, depth, tone, compliance]);

  return {
    tests: filteredTests,
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
  };
}
