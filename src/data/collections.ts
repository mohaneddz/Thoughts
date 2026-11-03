export interface CollectionStep {
  kind: 'test' | 'tool';
  /** Test slug or reflection tool id. */
  id: string;
}

export interface CollectionGuide {
  id: string;
  title: string;
  intro: string;
  steps: CollectionStep[];
}

const test = (id: string): CollectionStep => ({ kind: 'test', id });
const tool = (id: string): CollectionStep => ({ kind: 'tool', id });

export const collectionsData: CollectionGuide[] = [
  {
    id: 'understand-yourself',
    title: 'Understand yourself',
    intro: 'Build a clear snapshot of your patterns with gentle structure.',
    steps: [test('emotional-awareness-test'), tool('emotion-wheel'), test('overthinking-test')],
  },
  {
    id: 'relationships',
    title: 'Relationships',
    intro: 'Reflect on closeness, communication, and emotional boundaries.',
    steps: [test('attachment-style-test'), tool('conflict-reflection'), test('social-battery-test')],
  },
  {
    id: 'burnout-check',
    title: 'Burnout check',
    intro: 'Notice early stress signals and reset your recovery habits.',
    steps: [test('pss-perceived-stress-scale'), tool('energy-drain-finder'), test('burnout-reflection-test')],
  },
  {
    id: 'confidence',
    title: 'Confidence',
    intro: 'Strengthen self-trust through values and realistic habits.',
    steps: [test('rosenberg-self-esteem-scale'), tool('values-sorter'), test('inner-critic-test')],
  },
  {
    id: 'career-direction',
    title: 'Career direction',
    intro: 'Clarify what type of work supports your growth and energy.',
    steps: [test('values-clarity-test'), test('career-direction-test'), tool('decision-helper')],
  },
  {
    id: 'overthinking',
    title: 'Overthinking',
    intro: 'Move from looping thoughts to practical reflection.',
    steps: [test('overthinking-test'), tool('overthinking-unpacker'), tool('why-feel-this')],
  },
  {
    id: 'emotional-clarity',
    title: 'Emotional clarity',
    intro: 'Name feelings clearly and respond with intention.',
    steps: [tool('emotion-wheel'), test('emotional-awareness-test'), tool('why-feel-this')],
  },
  {
    id: 'discipline-habits',
    title: 'Discipline and habits',
    intro: 'Design a smaller, sustainable discipline system.',
    steps: [test('habit-loop-test'), tool('habit-loop-analyzer'), test('motivation-style-test')],
  },
];
