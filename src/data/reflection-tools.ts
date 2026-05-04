export interface ReflectionTool {
  id: string;
  title: string;
  description: string;
}

export const reflectionToolsData: ReflectionTool[] = [
  { id: 'emotion-wheel', title: 'Emotion wheel', description: 'Name subtle emotions with more precision.' },
  { id: 'values-sorter', title: 'Values sorter', description: 'Prioritize values that guide your choices.' },
  { id: 'decision-helper', title: 'Decision helper', description: 'Compare options against values and energy cost.' },
  { id: 'overthinking-unpacker', title: 'Overthinking unpacker', description: 'Separate useful thinking from mental noise.' },
  { id: 'why-feel-this', title: 'Why do I feel this? guide', description: 'Map trigger, emotion, need, and next tiny step.' },
  { id: 'conflict-reflection', title: 'Conflict reflection', description: 'Reflect before and after difficult conversations.' },
  { id: 'habit-loop-analyzer', title: 'Habit loop analyzer', description: 'Spot cue-routine-reward loops and redesign them.' },
  { id: 'energy-drain-finder', title: 'Energy drain finder', description: 'Track people, tasks, and environments that deplete you.' },
];

