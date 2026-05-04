export interface CollectionGuide {
  id: string;
  title: string;
  intro: string;
  tests: string[];
  tools: string[];
  order: string[];
}

export const collectionsData: CollectionGuide[] = [
  {
    id: 'understand-yourself',
    title: 'Understand yourself',
    intro: 'Build a clear snapshot of your patterns with gentle structure.',
    tests: ['Emotional Awareness Test', 'Overthinking Style Test'],
    tools: ['Emotion wheel', 'Why do I feel this? guide'],
    order: ['Emotional Awareness Test', 'Emotion wheel', 'Overthinking Style Test'],
  },
  {
    id: 'relationships',
    title: 'Relationships',
    intro: 'Reflect on closeness, communication, and emotional boundaries.',
    tests: ['Attachment Reflection Test', 'Social Battery Test'],
    tools: ['Conflict reflection', 'Decision helper'],
    order: ['Attachment Reflection Test', 'Conflict reflection', 'Social Battery Test'],
  },
  {
    id: 'burnout-check',
    title: 'Burnout check',
    intro: 'Notice early stress signals and reset your recovery habits.',
    tests: ['Stress Pattern Test', 'Motivation Style Test'],
    tools: ['Energy drain finder', 'Habit loop analyzer'],
    order: ['Stress Pattern Test', 'Energy drain finder', 'Motivation Style Test'],
  },
  {
    id: 'confidence',
    title: 'Confidence',
    intro: 'Strengthen self-trust through values and realistic habits.',
    tests: ['Self-Esteem Reflection Test', 'Values Clarity Test'],
    tools: ['Values sorter', 'Overthinking unpacker'],
    order: ['Self-Esteem Reflection Test', 'Values sorter', 'Values Clarity Test'],
  },
  {
    id: 'career-direction',
    title: 'Career direction',
    intro: 'Clarify what type of work supports your growth and energy.',
    tests: ['Career Direction Test', 'Values Clarity Test'],
    tools: ['Decision helper', 'Energy drain finder'],
    order: ['Values Clarity Test', 'Career Direction Test', 'Decision helper'],
  },
  {
    id: 'overthinking',
    title: 'Overthinking',
    intro: 'Move from looping thoughts to practical reflection.',
    tests: ['Overthinking Style Test', 'Stress Pattern Test'],
    tools: ['Overthinking unpacker', 'Why do I feel this? guide'],
    order: ['Overthinking Style Test', 'Overthinking unpacker', 'Stress Pattern Test'],
  },
  {
    id: 'emotional-clarity',
    title: 'Emotional clarity',
    intro: 'Name feelings clearly and respond with intention.',
    tests: ['Emotional Awareness Test', 'Attachment Reflection Test'],
    tools: ['Emotion wheel', 'Conflict reflection'],
    order: ['Emotion wheel', 'Emotional Awareness Test', 'Attachment Reflection Test'],
  },
  {
    id: 'discipline-habits',
    title: 'Discipline and habits',
    intro: 'Design a smaller, sustainable discipline system.',
    tests: ['Habit Loop Test', 'Motivation Style Test'],
    tools: ['Habit loop analyzer', 'Values sorter'],
    order: ['Habit Loop Test', 'Habit loop analyzer', 'Motivation Style Test'],
  },
];

