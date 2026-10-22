export interface LearnArticle {
  id: string;
  title: string;
  topic: string;
  summary: string;
  /** Test slugs. */
  relatedTests: string[];
}

export const learnData: LearnArticle[] = [
  { id: 'l1', title: 'Personality as pattern, not label', topic: 'Personality', summary: 'Use personality ideas as language for reflection, not identity traps.', relatedTests: ['ipip-big-five-50', 'social-battery-test'] },
  { id: 'l2', title: 'Attachment in daily moments', topic: 'Attachment', summary: 'Attachment shows up in conflict, closeness, and repair conversations.', relatedTests: ['attachment-style-test'] },
  { id: 'l3', title: 'Stress is a signal', topic: 'Stress', summary: 'Stress patterns can guide better pacing, boundaries, and recovery.', relatedTests: ['pss-perceived-stress-scale'] },
  { id: 'l4', title: 'Habit loops that actually stick', topic: 'Habits', summary: 'Small cues and rewards beat large motivation spikes.', relatedTests: ['habit-loop-test', 'motivation-style-test'] },
  { id: 'l5', title: 'Emotions as data', topic: 'Emotions', summary: 'Naming your emotions gives you more choices in how to respond.', relatedTests: ['emotional-awareness-test'] },
  { id: 'l6', title: 'Motivation beyond mood', topic: 'Motivation', summary: 'Reliable systems reduce dependence on perfect motivation.', relatedTests: ['motivation-style-test'] },
  { id: 'l7', title: 'Cognitive bias in self-talk', topic: 'Cognitive bias', summary: 'Biases shape conclusions quickly; reflection slows the loop.', relatedTests: ['overthinking-test'] },
  { id: 'l8', title: 'Self-esteem and standards', topic: 'Self-esteem', summary: 'Healthy self-esteem grows from honest standards and self-respect.', relatedTests: ['rosenberg-self-esteem-scale', 'self-esteem-reflection-test'] },
  { id: 'l9', title: 'Burnout early signs', topic: 'Burnout', summary: 'Burnout starts quietly with repeated depletion and reduced recovery.', relatedTests: ['burnout-reflection-test', 'pss-perceived-stress-scale'] },
  { id: 'l10', title: 'Values and decision clarity', topic: 'Values', summary: 'Values turn difficult choices into clearer trade-offs.', relatedTests: ['values-clarity-test', 'career-direction-test'] },
];
