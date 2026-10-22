'use client';

import { useMemo, useState } from 'react';
import { testsData } from '@/data/tests';
import { buildTestCatalog } from '@/utils/tests/catalog';

export function useTests() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [depth, setDepth] = useState<string>('all');
  const [tone, setTone] = useState<string>('all');
  const [compliance, setCompliance] = useState<string>('all');
  const catalog = useMemo(() => buildTestCatalog(testsData), []);

  const filteredTests = useMemo(() => {
    return catalog.filter((test) => {
      const queryMatch =
        !query ||
        test.title.toLowerCase().includes(query.toLowerCase()) ||
        test.description.toLowerCase().includes(query.toLowerCase()) ||
        test.variants.some((variant) =>
          variant.title.toLowerCase().includes(query.toLowerCase()) ||
          variant.description.toLowerCase().includes(query.toLowerCase()),
        );
      const categoryMatch = category === 'all' || test.category === category;
      const depthMatch = depth === 'all' || test.depth === depth;
      const toneMatch = tone === 'all' || test.tone === tone;
      const complianceMatch =
        compliance === 'all' ||
        test.variants.some((variant) =>
          variant.status === compliance ||
          variant.tags.some((tag) => tag.toLowerCase() === compliance.toLowerCase()),
        );

      return queryMatch && categoryMatch && depthMatch && toneMatch && complianceMatch;
    });
  }, [catalog, query, category, depth, tone, compliance]);

  return {
    allTests: catalog,
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
