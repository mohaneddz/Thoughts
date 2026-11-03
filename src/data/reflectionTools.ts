export interface ReflectionTool {
  id: string;
  title: string;
  description: string;
  minutes: number;
}

export const reflectionToolsData: ReflectionTool[] = [
  { id: 'emotion-wheel', title: 'Emotion wheel', description: 'Name subtle emotions with more precision.', minutes: 3 },
  { id: 'values-sorter', title: 'Values sorter', description: 'Pick the values that matter most, then rank them.', minutes: 6 },
  { id: 'decision-helper', title: 'Decision helper', description: 'Compare options against weighted criteria.', minutes: 8 },
  { id: 'overthinking-unpacker', title: 'Overthinking unpacker', description: 'Separate useful thinking from mental noise.', minutes: 5 },
  { id: 'why-feel-this', title: 'Why do I feel this?', description: 'Map trigger, emotion, need, and next tiny step.', minutes: 4 },
  { id: 'conflict-reflection', title: 'Conflict reflection', description: 'Prepare for, or debrief, a difficult conversation.', minutes: 6 },
  { id: 'habit-loop-analyzer', title: 'Habit loop analyzer', description: 'Spot cue, routine and reward, then redesign the loop.', minutes: 5 },
  { id: 'energy-drain-finder', title: 'Energy drain finder', description: 'Map what drains you and what charges you back up.', minutes: 6 },
];

export interface EmotionFamily {
  id: string;
  label: string;
  color: string;
  feelings: Array<{ label: string; nuances: string[] }>;
}

export const emotionFamilies: EmotionFamily[] = [
  {
    id: 'joy',
    label: 'Joy',
    color: '#d9a53f',
    feelings: [
      { label: 'Content', nuances: ['Satisfied', 'At ease', 'Grateful'] },
      { label: 'Proud', nuances: ['Accomplished', 'Confident', 'Worthy'] },
      { label: 'Excited', nuances: ['Eager', 'Energised', 'Curious'] },
      { label: 'Playful', nuances: ['Silly', 'Light', 'Cheeky'] },
    ],
  },
  {
    id: 'calm',
    label: 'Calm',
    color: '#5c9e8a',
    feelings: [
      { label: 'Peaceful', nuances: ['Still', 'Quiet', 'Settled'] },
      { label: 'Safe', nuances: ['Protected', 'Held', 'Secure'] },
      { label: 'Hopeful', nuances: ['Optimistic', 'Open', 'Encouraged'] },
      { label: 'Connected', nuances: ['Close', 'Seen', 'Belonging'] },
    ],
  },
  {
    id: 'sadness',
    label: 'Sadness',
    color: '#5b7fb3',
    feelings: [
      { label: 'Lonely', nuances: ['Isolated', 'Left out', 'Unseen'] },
      { label: 'Hurt', nuances: ['Disappointed', 'Let down', 'Rejected'] },
      { label: 'Grieving', nuances: ['Heartbroken', 'Empty', 'Missing someone'] },
      { label: 'Low', nuances: ['Flat', 'Tired', 'Hopeless'] },
    ],
  },
  {
    id: 'anger',
    label: 'Anger',
    color: '#c45a48',
    feelings: [
      { label: 'Frustrated', nuances: ['Blocked', 'Impatient', 'Stuck'] },
      { label: 'Resentful', nuances: ['Bitter', 'Used', 'Unappreciated'] },
      { label: 'Irritated', nuances: ['Annoyed', 'On edge', 'Touchy'] },
      { label: 'Betrayed', nuances: ['Deceived', 'Disrespected', 'Violated'] },
    ],
  },
  {
    id: 'fear',
    label: 'Fear',
    color: '#8b6bb3',
    feelings: [
      { label: 'Anxious', nuances: ['Worried', 'Restless', 'Dreading'] },
      { label: 'Insecure', nuances: ['Inadequate', 'Exposed', 'Self-conscious'] },
      { label: 'Overwhelmed', nuances: ['Swamped', 'Pressured', 'Frozen'] },
      { label: 'Scared', nuances: ['Panicky', 'Threatened', 'Helpless'] },
    ],
  },
  {
    id: 'shame',
    label: 'Shame',
    color: '#a2708a',
    feelings: [
      { label: 'Embarrassed', nuances: ['Awkward', 'Humiliated', 'Flustered'] },
      { label: 'Guilty', nuances: ['Regretful', 'Remorseful', 'Responsible'] },
      { label: 'Worthless', nuances: ['Small', 'Defective', 'Not enough'] },
      { label: 'Judged', nuances: ['Criticised', 'Ridiculed', 'Watched'] },
    ],
  },
];

export const valueOptions = [
  'Adventure', 'Autonomy', 'Balance', 'Belonging', 'Compassion', 'Courage', 'Creativity', 'Curiosity', 'Faith',
  'Family', 'Freedom', 'Friendship', 'Growth', 'Health', 'Honesty', 'Humility', 'Independence', 'Justice',
  'Kindness', 'Knowledge', 'Leadership', 'Learning', 'Loyalty', 'Mastery', 'Peace', 'Purpose', 'Recognition',
  'Responsibility', 'Security', 'Service', 'Simplicity', 'Stability', 'Wealth', 'Wisdom',
];

export type PromptStepKind = 'text' | 'longText' | 'choice' | 'multi' | 'scale';

export interface PromptStep {
  id: string;
  label: string;
  helper?: string;
  kind: PromptStepKind;
  options?: string[];
  placeholder?: string;
  optional?: boolean;
}

export interface PromptSequence {
  toolId: string;
  /** Optional named paths, e.g. before vs after a conversation. */
  variants?: Array<{ id: string; label: string; steps: PromptStep[] }>;
  steps?: PromptStep[];
  closing: string;
}

const needs = ['Rest', 'Connection', 'Safety', 'Respect', 'Autonomy', 'Clarity', 'Recognition', 'Fairness', 'Space', 'Support', 'Play', 'Meaning'];

export const promptSequences: PromptSequence[] = [
  {
    toolId: 'overthinking-unpacker',
    closing: 'Thoughts are guesses, not facts. You can come back to this one later.',
    steps: [
      { id: 'thought', label: 'What thought keeps looping?', kind: 'longText', placeholder: 'Write it exactly as it sounds in your head.' },
      { id: 'prediction', label: 'What is it predicting will happen?', kind: 'text', placeholder: 'If this is true, then…' },
      { id: 'pattern', label: 'Does it follow a familiar pattern?', helper: 'Pick any that fit.', kind: 'multi', options: ['Catastrophising', 'Mind reading', 'All-or-nothing', 'Fortune telling', 'Should statements', 'Personalising', 'Rehearsing a conversation', 'None of these'] },
      { id: 'evidenceFor', label: 'Evidence that supports it', kind: 'longText', placeholder: 'Facts only — what actually happened?' },
      { id: 'evidenceAgainst', label: 'Evidence that does not fit', kind: 'longText', placeholder: 'What would a fair friend point out?' },
      { id: 'control', label: 'How much of this is in your control?', kind: 'choice', options: ['Most of it', 'Some of it', 'Very little'] },
      { id: 'nextStep', label: 'One action, or one thing to let go of', kind: 'text', placeholder: 'Send the message / park it until Friday / …' },
    ],
  },
  {
    toolId: 'why-feel-this',
    closing: 'Feelings point at needs. Meeting the need, even a little, usually helps more than arguing with the feeling.',
    steps: [
      { id: 'trigger', label: 'What happened just before the feeling showed up?', kind: 'longText', placeholder: 'Where were you, who was there, what was said?' },
      { id: 'emotion', label: 'What are you feeling?', kind: 'multi', options: ['Anxious', 'Sad', 'Angry', 'Ashamed', 'Lonely', 'Overwhelmed', 'Disappointed', 'Jealous', 'Numb', 'Restless'] },
      { id: 'intensity', label: 'How strong is it right now?', kind: 'scale' },
      { id: 'body', label: 'Where do you notice it in your body?', kind: 'multi', optional: true, options: ['Chest', 'Throat', 'Stomach', 'Shoulders', 'Jaw', 'Head', 'Hands', 'Nowhere obvious'] },
      { id: 'need', label: 'What might you need?', kind: 'multi', options: needs },
      { id: 'tinyStep', label: 'One tiny step toward that need', kind: 'text', placeholder: 'Something you could do in the next hour.' },
    ],
  },
  {
    toolId: 'conflict-reflection',
    closing: 'Repair matters more than getting every word right.',
    variants: [
      {
        id: 'before',
        label: 'Before a conversation',
        steps: [
          { id: 'situation', label: 'What is the conversation about?', kind: 'longText' },
          { id: 'goal', label: 'What outcome would feel good enough?', kind: 'text', placeholder: 'Not perfect — good enough.' },
          { id: 'myNeed', label: 'What do you need from it?', kind: 'multi', options: needs },
          { id: 'theirView', label: 'How might they see it?', kind: 'longText', placeholder: 'Their best-case reasoning, not the worst.' },
          { id: 'opening', label: 'Your first sentence', kind: 'text', placeholder: 'I would like to talk about… because…' },
          { id: 'boundary', label: 'What will you not accept?', kind: 'text', optional: true },
        ],
      },
      {
        id: 'after',
        label: 'After a conversation',
        steps: [
          { id: 'happened', label: 'What happened, in plain facts?', kind: 'longText' },
          { id: 'feltDuring', label: 'How did you feel during it?', kind: 'multi', options: ['Heard', 'Dismissed', 'Defensive', 'Calm', 'Angry', 'Hurt', 'Relieved', 'Confused'] },
          { id: 'wentWell', label: 'What went better than expected?', kind: 'text' },
          { id: 'myPart', label: 'What was your part, honestly?', kind: 'longText' },
          { id: 'repair', label: 'Is there anything to repair or follow up?', kind: 'text', optional: true },
        ],
      },
    ],
  },
  {
    toolId: 'habit-loop-analyzer',
    closing: 'Keep the cue and the reward, change only the routine — that is the part you can actually swap.',
    steps: [
      { id: 'habit', label: 'Which habit do you want to look at?', kind: 'text', placeholder: 'Scrolling in bed, snacking at 4pm, …' },
      { id: 'cue', label: 'Cue: what usually sets it off?', kind: 'multi', options: ['A time of day', 'A place', 'A feeling', 'Other people', 'Finishing something', 'Boredom', 'Tiredness'] },
      { id: 'cueDetail', label: 'Describe the cue more precisely', kind: 'text', optional: true },
      { id: 'reward', label: 'Reward: what does the habit give you?', kind: 'multi', options: ['Relief', 'Distraction', 'Comfort', 'Energy', 'Connection', 'A break', 'Pleasure', 'Avoiding something'] },
      { id: 'newRoutine', label: 'A new routine that gives a similar reward', kind: 'text', placeholder: 'Five minutes outside, a glass of water, texting a friend…' },
      { id: 'plan', label: 'Write it as a plan', helper: 'When [cue], I will [new routine].', kind: 'text', placeholder: 'When I get into bed, I will put my phone on the desk and read two pages.' },
    ],
  },
];
