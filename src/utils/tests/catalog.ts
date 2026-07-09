import type { TestDefinition } from '@/types/test';

export interface TestCatalogEntry {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: TestDefinition['category'];
  estimatedMinutes: number;
  estimatedMinutesLabel: string;
  depth: TestDefinition['depth'];
  tone: TestDefinition['tone'];
  status: TestDefinition['status'];
  riskLevel: TestDefinition['riskLevel'];
  tags: string[];
  sourceUrl: string;
  licenseNote?: string;
  questionCount: number;
  questionCountLabel: string;
  coverSlug: string;
  defaultVariant: TestDefinition;
  variants: TestDefinition[];
}

function pickDefaultVariant(variants: TestDefinition[]): TestDefinition {
  return (
    variants.find((item) => item.tags.includes('variant-default')) ??
    variants.find((item) => item.status !== 'pending') ??
    variants[0]
  );
}

function formatRangeLabel(values: number[], suffix: string): string {
  const unique = [...new Set(values)].sort((a, b) => a - b);

  if (unique.length === 0) return `0 ${suffix}`;
  if (unique.length === 1) return `${unique[0]} ${suffix}`;
  return `${unique[0]}-${unique[unique.length - 1]} ${suffix}`;
}

function normalizeVariantTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

function formatVariantLabel(test: TestDefinition): string {
  const parenthetical = test.title.match(/\(([^)]+)\)/)?.[1]?.trim();

  if (parenthetical) return parenthetical;
  if (test.variantKey) return test.variantKey;
  return `${test.questions.length} prompts`;
}

function deriveGroupTitle(variants: TestDefinition[]): string {
  const primary = pickDefaultVariant(variants);
  const normalized = variants.map((item) => normalizeVariantTitle(item.title));

  if (normalized.every((item) => item === normalized[0])) {
    return normalized[0];
  }

  const firstWord = primary.title.split(/[- ]/)[0].toUpperCase();
  if (variants.every((v) => v.title.toUpperCase().startsWith(firstWord))) {
    if (firstWord === 'PHQ') return 'PHQ Depression Screener';
    if (firstWord === 'GAD') return 'GAD Anxiety Screener';
    if (firstWord === 'DASS') return 'DASS (Depression Anxiety Stress Scale)';
    if (firstWord === 'AUDIT') return 'AUDIT Alcohol Screener';
    if (firstWord === 'MMPI') return 'MMPI Personality Inventory';
    if (firstWord === 'BDI') return 'BDI Beck Depression Inventory';
    return firstWord;
  }

  return primary.title;
}

function deriveGroupDescription(variants: TestDefinition[]): string {
  const primary = pickDefaultVariant(variants);
  return primary.description;
}

export function buildTestCatalog(tests: TestDefinition[]): TestCatalogEntry[] {
  const grouped = new Map<string, TestDefinition[]>();

  for (const test of tests) {
    const key = test.variantGroup ?? test.id;
    const existing = grouped.get(key);

    if (existing) {
      existing.push(test);
    } else {
      grouped.set(key, [test]);
    }
  }

  return [...grouped.entries()].flatMap(([key, variants]) => {
    const sortedVariants = [...variants].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return 1;
      if (a.status !== 'pending' && b.status === 'pending') return -1;
      return a.estimatedMinutes - b.estimatedMinutes;
    });
    const usableVariants = sortedVariants.filter((item) => item.status !== 'pending');
    const primary = pickDefaultVariant(sortedVariants);
    const hasUsableVariant = usableVariants.length > 0;

    if (!hasUsableVariant) {
      return [];
    }

    const questionCounts = usableVariants.map((item) => item.questions.length).filter((count) => count > 0);

    return [{
      id: key,
      slug: primary.slug,
      title: deriveGroupTitle(sortedVariants),
      description: deriveGroupDescription(sortedVariants),
      category: primary.category,
      estimatedMinutes: primary.estimatedMinutes,
      estimatedMinutesLabel: formatRangeLabel(usableVariants.map((item) => item.estimatedMinutes), 'min'),
      depth: primary.depth,
      tone: primary.tone,
      status: primary.status,
      riskLevel: primary.riskLevel,
      tags: [...new Set(sortedVariants.flatMap((item) => item.tags))],
      sourceUrl: primary.sourceUrl,
      licenseNote: primary.licenseNote,
      questionCount: primary.questions.length,
      questionCountLabel: formatRangeLabel(questionCounts, 'prompts'),
      coverSlug: primary.slug,
      defaultVariant: primary,
      variants: sortedVariants,
    }];
  });
}
