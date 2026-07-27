import type { CheckInEntry, TestResultSummary } from '@/types/result';
import type { ChoiceOption, TestDefinition, TestQuestion } from '@/types/test';

const agree5: ChoiceOption[] = [
  { value: 'strongly-disagree', label: 'Strongly disagree', score: 1 },
  { value: 'disagree', label: 'Disagree', score: 2 },
  { value: 'neutral', label: 'Neither agree nor disagree', score: 3 },
  { value: 'agree', label: 'Agree', score: 4 },
  { value: 'strongly-agree', label: 'Strongly agree', score: 5 },
];

const freq4: ChoiceOption[] = [
  { value: 'not-at-all', label: 'Not at all', score: 0 },
  { value: 'several-days', label: 'Several days', score: 1 },
  { value: 'more-than-half', label: 'More than half the days', score: 2 },
  { value: 'nearly-every-day', label: 'Nearly every day', score: 3 },
];

const dassChoices: ChoiceOption[] = [
  { value: 'not-at-all', label: 'Did not apply to me at all', score: 0 },
  { value: 'some-degree', label: 'Applied to me to some degree, or some of the time', score: 1 },
  { value: 'considerable', label: 'Applied to me to a considerable degree, or a good part of the time', score: 2 },
  { value: 'very-much', label: 'Applied to me very much, or most of the time', score: 3 },
];

const yesNo: ChoiceOption[] = [
  { value: 'yes', label: 'Yes', score: 1 },
  { value: 'no', label: 'No', score: 0 },
];

const trueFalse: ChoiceOption[] = [
  { value: 'true', label: 'True', score: 1 },
  { value: 'false', label: 'False', score: 0 },
];

const who5Choices: ChoiceOption[] = [
  { value: 'all', label: 'All of the time', score: 5 },
  { value: 'most', label: 'Most of the time', score: 4 },
  { value: 'more-than-half', label: 'More than half of the time', score: 3 },
  { value: 'less-than-half', label: 'Less than half of the time', score: 2 },
  { value: 'some', label: 'Some of the time', score: 1 },
  { value: 'none', label: 'At no time', score: 0 },
];

const dassDepressionBands = [
  { label: 'Normal', min: 0, max: 9 },
  { label: 'Mild', min: 10, max: 13 },
  { label: 'Moderate', min: 14, max: 20 },
  { label: 'Severe', min: 21, max: 27 },
  { label: 'Extremely severe', min: 28, max: 42 },
];

const dassAnxietyBands = [
  { label: 'Normal', min: 0, max: 7 },
  { label: 'Mild', min: 8, max: 9 },
  { label: 'Moderate', min: 10, max: 14 },
  { label: 'Severe', min: 15, max: 19 },
  { label: 'Extremely severe', min: 20, max: 42 },
];

const dassStressBands = [
  { label: 'Normal', min: 0, max: 14 },
  { label: 'Mild', min: 15, max: 18 },
  { label: 'Moderate', min: 19, max: 25 },
  { label: 'Severe', min: 26, max: 33 },
  { label: 'Extremely severe', min: 34, max: 42 },
];

const rosenbergChoices: ChoiceOption[] = [
  { value: 'strongly-agree', label: 'Strongly agree', score: 3 },
  { value: 'agree', label: 'Agree', score: 2 },
  { value: 'disagree', label: 'Disagree', score: 1 },
  { value: 'strongly-disagree', label: 'Strongly disagree', score: 0 },
];

function makeFrequencyQuestions(prefix: string, prompts: string[]): TestQuestion[] {
  return prompts.map((prompt, index) => ({
    id: `${prefix}-q${index + 1}`,
    prompt,
    type: 'frequency',
    choices: freq4,
    required: true,
  }));
}

function makeDassQuestions(prefix: string, prompts: string[]): TestQuestion[] {
  return prompts.map((prompt, index) => ({
    id: `${prefix}-q${index + 1}`,
    prompt,
    type: 'frequency',
    choices: dassChoices,
    required: true,
  }));
}

function makePendingLicensedTest(name: string): TestDefinition {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let variantGroup: string | undefined;
  if (name.startsWith('MMPI')) variantGroup = 'mmpi';
  else if (name.startsWith('NEO-PI')) variantGroup = 'neo-pi';
  else if (name.startsWith('BDI')) variantGroup = 'bdi';

  return {
    id: `pending-${slug}`,
    slug,
    title: name,
    description: 'Metadata prepared. Awaiting licensed item bank import for direct administration.',
    category: 'Personality',
    estimatedMinutes: 0,
    depth: 'quick',
    tone: 'serious',
    status: 'pending',
    riskLevel: 'high',
    tags: ['licensed', 'pending'],
    sourceUrl: 'https://www.ipip.ori.org/',
    licenseNote: 'Licensed instrument. Question payload intentionally omitted until verified content import.',
    variantGroup,
    scoring: { model: 'none' },
    questions: [],
  };
}

function createOriginalQuestions(prefix: string, theme: string): TestQuestion[] {
  return [
    {
      id: `${prefix}-q1`,
      prompt: `In the last 2 weeks, ${theme} has impacted my day-to-day decisions.`,
      type: 'frequency',
      choices: freq4,
      required: true,
    },
    {
      id: `${prefix}-q2`,
      prompt: `Which pattern feels most true about your ${theme} right now?`,
      type: 'single-choice',
      choices: [
        { value: 'stable', label: 'Mostly steady', score: 3 },
        { value: 'mixed', label: 'Mixed and context-dependent', score: 2 },
        { value: 'strained', label: 'Strained or hard to manage', score: 1 },
      ],
      required: true,
    },
    {
      id: `${prefix}-q3`,
      prompt: `Select all factors currently shaping your ${theme}.`,
      type: 'multi-select',
      choices: [
        { value: 'sleep', label: 'Sleep quality', score: 1 },
        { value: 'work', label: 'Work or study pressure', score: 1 },
        { value: 'relationships', label: 'Relationships', score: 1 },
        { value: 'health', label: 'Physical health', score: 1 },
        { value: 'money', label: 'Money stress', score: 1 },
      ],
      maxSelections: 3,
      required: true,
    },
    {
      id: `${prefix}-q4`,
      prompt: 'True or false: I can usually notice this pattern early enough to respond intentionally.',
      type: 'true-false',
      choices: trueFalse,
      required: true,
    },
    {
      id: `${prefix}-q5`,
      prompt: `Rate your current confidence in handling ${theme}.`,
      helperText: '0 = no confidence, 10 = high confidence',
      type: 'numeric-scale',
      minValue: 0,
      maxValue: 10,
      step: 1,
      required: true,
    },
    {
      id: `${prefix}-q6`,
      prompt: 'What is one recent example that captures this pattern?',
      type: 'short-text',
      placeholder: 'One concise example...',
      required: true,
    },
    {
      id: `${prefix}-q7`,
      prompt: 'Short reflection: what tiny change would make next week better?',
      type: 'reflection',
      placeholder: 'Write your reflection...',
      required: true,
    },
  ];
}

const phqPrompts = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

const gadPrompts = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];

const dass21Prompts = [
  'I found it hard to wind down',
  'I was aware of dryness of my mouth',
  "I couldn't seem to experience any positive feeling at all",
  'I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)',
  'I found it difficult to work up the initiative to do things',
  'I tended to over-react to situations',
  'I experienced trembling (e.g., in the hands)',
  'I felt that I was using a lot of nervous energy',
  'I was worried about situations in which I might panic and make a fool of myself',
  'I felt that I had nothing to look forward to',
  'I found myself getting agitated',
  'I found it difficult to relax',
  'I felt down-hearted and blue',
  'I was intolerant of anything that kept me from getting on with what I was doing',
  'I felt I was close to panic',
  'I was unable to become enthusiastic about anything',
  "I felt I wasn't worth much as a person",
  'I felt that I was rather touchy',
  'I was aware of the action of my heart in the absence of physical exertion',
  'I felt scared without any good reason',
  'I felt that life was meaningless',
];

const ipip120Prompts = [
  'Worry about things.',
  'Fear for the worst.',
  'Am afraid of many things.',
  'Get stressed out easily.',
  'Get angry easily.',
  'Get irritated easily.',
  'Lose my temper.',
  'Am not easily annoyed.',
  'Often feel blue.',
  'Dislike myself.',
  'Am often down in the dumps.',
  'Feel comfortable with myself.',
  'Find it difficult to approach others.',
  'Am afraid to draw attention to myself.',
  'Only feel comfortable with friends.',
  'Am not bothered by difficult social situations.',
  'Go on binges.',
  'Rarely overindulge.',
  'Easily resist temptations.',
  'Am able to control my cravings.',
  'Panic easily.',
  'Become overwhelmed by events.',
  "Feel that I'm unable to deal with things.",
  'Remain calm under pressure.',
  'Make friends easily.',
  'Feel comfortable around people.',
  'Avoid contacts with others.',
  'Keep others at a distance.',
  'Love large parties.',
  'Talk to a lot of different people at parties.',
  'Prefer to be alone.',
  'Avoid crowds.',
  'Take charge.',
  'Try to lead others.',
  'Take control of things.',
  'Wait for others to lead the way.',
  'Am always busy.',
  'Am always on the go.',
  'Do a lot in my spare time.',
  'Like to take it easy.',
  'Love excitement.',
  'Seek adventure.',
  'Enjoy being reckless.',
  'Act wild and crazy.',
  'Radiate joy.',
  'Have a lot of fun.',
  'Love life.',
  'Look at the bright side of life.',
  'Have a vivid imagination.',
  'Enjoy wild flights of fantasy.',
  'Love to daydream.',
  'Like to get lost in thought.',
  'Believe in the importance of art.',
  'See beauty in things that others might not notice.',
  'Do not like poetry.',
  'Do not enjoy going to art museums.',
  'Experience my emotions intensely.',
  "Feel others' emotions.",
  'Rarely notice my emotional reactions.',
  "Don't understand people who get emotional.",
  'Prefer variety to routine.',
  'Prefer to stick with things that I know.',
  'Dislike changes.',
  'Am attached to conventional ways.',
  'Love to read challenging material.',
  'Avoid philosophical discussions.',
  'Have difficulty understanding abstract ideas.',
  'Am not interested in theoretical discussions.',
  'Tend to vote for liberal political candidates.',
  'Believe that there is no absolute right and wrong.',
  'Tend to vote for conservative political candidates.',
  'Believe that we should be tough on crime.',
  'Trust others.',
  'Believe that others have good intentions.',
  'Trust what people say.',
  'Distrust people.',
  'Use others for my own ends.',
  'Cheat to get ahead.',
  'Take advantage of others.',
  "Obstruct others' plans.",
  'Am concerned about others.',
  'Love to help others.',
  'Am indifferent to the feelings of others.',
  'Take no time for others.',
  'Love a good fight.',
  'Yell at people.',
  'Insult people.',
  'Get back at others.',
  'Believe that I am better than others.',
  'Think highly of myself.',
  'Have a high opinion of myself.',
  'Boast about my virtues.',
  'Sympathize with the homeless.',
  'Feel sympathy for those who are worse off than myself.',
  "Am not interested in other people's problems.",
  'Try not to think about the needy.',
  'Complete tasks successfully.',
  'Excel in what I do.',
  'Handle tasks smoothly.',
  'Know how to get things done.',
  'Like to tidy up.',
  'Often forget to put things back in their proper place.',
  'Leave a mess in my room.',
  'Leave my belongings around.',
  'Keep my promises.',
  'Tell the truth.',
  'Break rules.',
  'Break my promises.',
  "Do more than what's expected of me.",
  'Work hard.',
  'Put little time and effort into my work.',
  'Do just enough work to get by.',
  'Am always prepared.',
  'Carry out my plans.',
  'Waste my time.',
  'Have difficulty starting tasks.',
  'Jump into things without thinking.',
  'Make rash decisions.',
  'Rush into things.',
  'Act without thinking.',
];

const ipipBigFive50Prompts = `
Am the life of the party.
Feel comfortable around people.
Start conversations.
Talk to a lot of different people at parties.
Don't mind being the center of attention.
Make friends easily.
Take charge.
Know how to captivate people.
Feel at ease with people.
Am skilled in handling social situations.
Am interested in people.
Sympathize with others' feelings.
Have a soft heart.
Take time out for others.
Feel others' emotions.
Make people feel at ease.
Inquire about others' well-being.
Know how to comfort others.
Love children.
Am on good terms with nearly everyone.
Am always prepared.
Pay attention to details.
Get chores done right away.
Like order.
Follow a schedule.
Am exacting in my work.
Do things according to a plan.
Continue until everything is perfect.
Make plans and stick to them.
Love order and regularity.
Am relaxed most of the time.
Seldom feel blue.
Am not easily bothered by things.
Rarely get irritated.
Seldom get mad.
Get stressed out easily.
Worry about things.
Am easily disturbed.
Get upset easily.
Change my mood a lot.
Have a rich vocabulary.
Have a vivid imagination.
Have excellent ideas.
Am quick to understand things.
Use difficult words.
Spend time reflecting on things.
Am full of ideas.
Carry the conversation to a higher level.
Catch on to things quickly.
Can handle a lot of information.
`.trim().split('\n');

const ipipBigFive50Reverse = new Set([36, 37, 38, 39, 40]);

const ipipBigFive100Prompts = `
Am the life of the party.
Feel comfortable around people.
Start conversations.
Talk to a lot of different people at parties.
Don't mind being the center of attention.
Make friends easily.
Take charge.
Know how to captivate people.
Feel at ease with people.
Am skilled in handling social situations.
Don't talk a lot.
Keep in the background.
Have little to say.
Don't like to draw attention to myself.
Am quiet around strangers.
Find it difficult to approach others.
Often feel uncomfortable around others.
Bottle up my feelings.
Am a very private person.
Wait for others to lead the way.
Am interested in people.
Sympathize with others' feelings.
Have a soft heart.
Take time out for others.
Feel others' emotions.
Make people feel at ease.
Inquire about others' well-being.
Know how to comfort others.
Love children.
Am on good terms with nearly everyone.
Have a good word for everyone.
Show my gratitude.
Think of others first.
Love to help others.
Insult people.
Am not interested in other people's problems.
Feel little concern for others.
Am not really interested in others.
Am hard to get to know.
Am indifferent to the feelings of others.
Am always prepared.
Pay attention to details.
Get chores done right away.
Like order.
Follow a schedule.
Am exacting in my work.
Do things according to a plan.
Continue until everything is perfect.
Make plans and stick to them.
Love order and regularity.
Like to tidy up.
Leave my belongings around.
Make a mess of things.
Often forget to put things back in their proper place.
Shirk my duties.
Neglect my duties.
Waste my time.
Do things in a half-way manner.
Find it difficult to get down to work.
Leave a mess in my room.
Am relaxed most of the time.
Seldom feel blue.
Am not easily bothered by things.
Rarely get irritated.
Seldom get mad.
Get stressed out easily.
Worry about things.
Am easily disturbed.
Get upset easily.
Change my mood a lot.
Have frequent mood swings.
Get irritated easily.
Often feel blue.
Get angry easily.
Panic easily.
Feel threatened easily.
Get overwhelmed by emotions.
Take offense easily.
Get caught up in my problems.
Grumble about things.
Have a rich vocabulary.
Have a vivid imagination.
Have excellent ideas.
Am quick to understand things.
Use difficult words.
Spend time reflecting on things.
Am full of ideas.
Carry the conversation to a higher level.
Catch on to things quickly.
Can handle a lot of information.
Love to think up new ways of doing things.
Love to read challenging material.
Am good at many things.
Have difficulty understanding abstract ideas.
Am not interested in abstract ideas.
Do not have a good imagination.
Try to avoid complex people.
Have difficulty imagining things.
Avoid difficult reading material.
Will not probe deeply into a subject.
`.trim().split('\n');

const ipipBigFive100Reverse = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  35, 36, 37, 38, 39, 40,
  52, 53, 54, 55, 56, 57, 58, 59, 60,
  66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
  94, 95, 96, 97, 98, 99, 100,
]);

const dass42Prompts = [
  'I found myself getting upset by quite trivial things',
  'I was aware of dryness of my mouth',
  "I couldn't seem to experience any positive feeling at all",
  'I experienced breathing difficulty (for example, excessively rapid breathing, breathlessness in the absence of physical exertion)',
  "I just couldn't seem to get going",
  'I tended to over-react to situations',
  'I had a feeling of shakiness (for example, legs going to give way)',
  'I found it difficult to relax',
  'I found myself in situations that made me so anxious I was most relieved when they ended',
  'I felt that I had nothing to look forward to',
  'I found myself getting upset rather easily',
  'I felt that I was using a lot of nervous energy',
  'I felt sad and depressed',
  'I found myself getting impatient when I was delayed in any way (for example, elevators, traffic lights, being kept waiting)',
  'I had a feeling of faintness',
  'I felt that I had lost interest in just about everything',
  "I felt I wasn't worth much as a person",
  'I felt that I was rather touchy',
  'I perspired noticeably (for example, hands sweaty) in the absence of high temperatures or physical exertion',
  'I felt scared without any good reason',
  "I felt that life wasn't worthwhile",
  'I found it hard to wind down',
  'I had difficulty in swallowing',
  "I couldn't seem to get any enjoyment out of the things I did",
  'I was aware of the action of my heart in the absence of physical exertion (for example, sense of heart rate increase, heart missing a beat)',
  'I felt down-hearted and blue',
  'I found that I was very irritable',
  'I felt I was close to panic',
  'I found it hard to calm down after something upset me',
  'I feared that I would be "thrown" by some trivial but unfamiliar task',
  'I was unable to become enthusiastic about anything',
  'I found it difficult to tolerate interruptions to what I was doing',
  'I was in a state of nervous tension',
  'I felt I was pretty worthless',
  'I was intolerant of anything that kept me from getting on with what I was doing',
  'I felt terrified',
  'I could see nothing in the future to be hopeful about',
  'I felt that life was meaningless',
  'I found myself getting agitated',
  'I was worried about situations in which I might panic and make a fool of myself',
  'I experienced trembling (for example, in the hands)',
  'I found it difficult to work up the initiative to do things',
];

const pss10Prompts = [
  'In the last month, how often have you been upset because of something that happened unexpectedly?',
  'In the last month, how often have you felt that you were unable to control important things in your life?',
  'In the last month, how often have you felt nervous and stressed?',
  'In the last month, how often have you felt confident about your ability to handle your personal problems?',
  'In the last month, how often have you felt that things were going your way?',
  'In the last month, how often have you found that you could not cope with all the things that you had to do?',
  'In the last month, how often have you been able to control irritations in your life?',
  'In the last month, how often have you felt that you were on top of things?',
  'In the last month, how often have you been angered because of things that happened that were outside of your control?',
  'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
];

const pcl5Prompts = [
  'Repeated, disturbing, and unwanted memories of the stressful experience',
  'Repeated, disturbing dreams of the stressful experience',
  'Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it)',
  'Feeling very upset when something reminded you of the stressful experience',
  'Having strong physical reactions when something reminded you of the stressful experience (for example, heart pounding, trouble breathing, sweating)',
  'Avoiding memories, thoughts, or feelings related to the stressful experience',
  'Avoiding external reminders of the stressful experience (for example, people, places, conversations, activities, objects, or situations)',
  'Trouble remembering important parts of the stressful experience',
  'Having strong negative beliefs about yourself, other people, or the world',
  'Blaming yourself or someone else for the stressful experience or what happened after it',
  'Having strong negative feelings such as fear, horror, anger, guilt, or shame',
  'Loss of interest in activities that you used to enjoy',
  'Feeling distant or cut off from other people',
  'Trouble experiencing positive feelings (for example, being unable to feel happiness or have loving feelings for people close to you)',
  'Irritable behavior, angry outbursts, or acting aggressively',
  'Taking too many risks or doing things that could cause you harm',
  'Being super alert, watchful, or on guard',
  'Feeling jumpy or easily startled',
  'Having difficulty concentrating',
  'Trouble falling or staying asleep',
];

const mdqPrompts = [
  '...you felt so good or so hyper that other people thought you were not your normal self or you were so hyper that you got into trouble?',
  '...you were so irritable that you shouted at people or started fights or arguments?',
  '...you felt much more self-confident than usual?',
  "...you got much less sleep than usual and found that you didn't really miss it?",
  '...you were more talkative or spoke much faster than usual?',
  "...thoughts raced through your head or you couldn't slow your mind down?",
  '...you were so easily distracted by things around you that you had trouble concentrating or staying on track?',
  '...you had much more energy than usual?',
  '...you were much more active or did many more things than usual?',
  '...you were much more social or outgoing than usual, for example, you telephoned friends in the middle of the night?',
  '...you were much more interested in sex than usual?',
  '...you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?',
  '...spending money got you or your family in trouble?',
];

const ipipPersonalityScales = [
  {
    key: 'cognitive-failures',
    label: 'Cognitive Failures',
    items: [
      { prompt: 'Get confused easily.', reverse: false },
      { prompt: 'Often forget things.', reverse: false },
      { prompt: 'Let my attention wander off.', reverse: false },
      { prompt: 'Spill things.', reverse: false },
      { prompt: 'Have difficulty keeping things in mind.', reverse: false },
      { prompt: "Can't make up my mind.", reverse: false },
      { prompt: 'Like to take responsibility for making decisions.', reverse: true },
      { prompt: 'Always know why I do things.', reverse: true },
      { prompt: 'Remain calm under pressure.', reverse: true },
      { prompt: 'Pay attention to details.', reverse: true },
    ],
  },
  {
    key: 'locus-control',
    label: 'Locus of Control',
    items: [
      { prompt: 'Believe that my success depends on ability rather than luck.', reverse: false },
      { prompt: 'Believe that events in my life are determined only by me.', reverse: false },
      { prompt: 'Just know that I will be a success.', reverse: false },
      { prompt: 'Believe that by working hard a person can achieve anything.', reverse: false },
      { prompt: 'Feel comfortable with myself.', reverse: false },
      { prompt: 'Always know why I do things.', reverse: false },
      { prompt: 'See difficulties everywhere.', reverse: true },
      { prompt: 'Believe that unfortunate events occur because of bad luck.', reverse: true },
      { prompt: "Can't stand on my own.", reverse: true },
      { prompt: 'Feel that my life lacks direction.', reverse: true },
    ],
  },
  {
    key: 'order-cleanliness',
    label: 'Need for Order and Cleanliness',
    items: [
      { prompt: 'Want everything to be "just right."', reverse: false },
      { prompt: 'Like order.', reverse: false },
      { prompt: 'Like to tidy up.', reverse: false },
      { prompt: 'Follow a schedule.', reverse: false },
      { prompt: 'Want everything to add up perfectly.', reverse: false },
      { prompt: 'Continue until everything is perfect.', reverse: false },
      { prompt: 'Am not bothered by messy people.', reverse: true },
      { prompt: 'Am not bothered by disorder.', reverse: true },
      { prompt: 'Leave a mess in my room.', reverse: true },
      { prompt: 'Leave my belongings around.', reverse: true },
    ],
  },
  {
    key: 'optimism',
    label: 'Optimism',
    items: [
      { prompt: 'Just know that I will be a success.', reverse: false },
      { prompt: 'Feel comfortable with myself.', reverse: false },
      { prompt: 'Seldom feel blue.', reverse: false },
      { prompt: 'Look at the bright side of life.', reverse: false },
      { prompt: 'Have a dark outlook on the future.', reverse: true },
      { prompt: 'Feel that my life lacks direction.', reverse: true },
      { prompt: 'Dislike myself.', reverse: true },
      { prompt: 'Often feel blue.', reverse: true },
      { prompt: 'See difficulties everywhere.', reverse: true },
      { prompt: 'Am often in a bad mood.', reverse: true },
    ],
  },
  {
    key: 'private-self-consciousness',
    label: 'Private Self-Consciousness',
    items: [
      { prompt: 'Am constantly reflecting about myself.', reverse: false },
      { prompt: 'Examine my motives constantly.', reverse: false },
      { prompt: 'Look for hidden meaning in things.', reverse: false },
      { prompt: 'Try to examine myself objectively.', reverse: false },
      { prompt: 'Spend time reflecting on things.', reverse: false },
      { prompt: 'Like to get lost in thought.', reverse: false },
      { prompt: "Don't try to figure myself out.", reverse: true },
      { prompt: 'Rarely look for a deeper meaning in things.', reverse: true },
      { prompt: 'Seldom daydream.', reverse: true },
      { prompt: 'Seldom get lost in thought.', reverse: true },
    ],
  },
] as const;

const originalTests = [
  { title: 'Attachment style test', slug: 'attachment-style-test', category: 'Relationships' as const, theme: 'attachment style' },
  { title: 'Overthinking test', slug: 'overthinking-test', category: 'Thinking style' as const, theme: 'overthinking' },
  { title: 'Burnout reflection test', slug: 'burnout-reflection-test', category: 'Stress & burnout' as const, theme: 'burnout patterns' },
  { title: 'Values clarity test', slug: 'values-clarity-test', category: 'Career & values' as const, theme: 'values clarity' },
  { title: 'Emotional awareness test', slug: 'emotional-awareness-test', category: 'Emotions' as const, theme: 'emotional awareness' },
  { title: 'Social battery test', slug: 'social-battery-test', category: 'Social energy' as const, theme: 'social energy' },
  { title: 'Motivation style test', slug: 'motivation-style-test', category: 'Focus & motivation' as const, theme: 'motivation style' },
  { title: 'Habit loop test', slug: 'habit-loop-test', category: 'Habits & discipline' as const, theme: 'habit loops' },
  { title: 'Self-esteem reflection test', slug: 'self-esteem-reflection-test', category: 'Self-esteem' as const, theme: 'self-esteem' },
  { title: 'Career direction test', slug: 'career-direction-test', category: 'Career & values' as const, theme: 'career direction' },
  { title: 'Thinking style test', slug: 'thinking-style-test', category: 'Thinking style' as const, theme: 'thinking style' },
  { title: 'Decision-making style test', slug: 'decision-making-style-test', category: 'Thinking style' as const, theme: 'decision-making style' },
  { title: 'Conflict style test', slug: 'conflict-style-test', category: 'Relationships' as const, theme: 'conflict style' },
  { title: 'Love language inspired test', slug: 'love-language-inspired-test', category: 'Relationships' as const, theme: 'connection preferences' },
  { title: 'Inner critic test', slug: 'inner-critic-test', category: 'Self-esteem' as const, theme: 'inner critic' },
];

const notOkayDirectly = [
  'MMPI',
  'MMPI-2',
  'MMPI-2-RF',
  'MMPI-3',
  'MBTI official assessment',
  '16PF official questionnaire',
  'NEO-PI-R',
  'NEO-PI-3',
  'BDI / BDI-II Beck Depression Inventory',
  'BAI Beck Anxiety Inventory',
  'WAIS',
  'WISC',
  'Stanford-Binet official IQ tests',
  'Rorschach official systems',
  'TAT official materials',
  'MCMI / Millon inventories',
  'PAI Personality Assessment Inventory',
  'SCL-90-R',
  'ISI Insomnia Severity Index',
  'Epworth Sleepiness Scale',
];

export const testsData: TestDefinition[] = [
  {
    id: 'ipip-big-five-50',
    slug: 'ipip-big-five-50',
    title: 'IPIP Big Five (50-item)',
    description: 'Public-domain Big Five marker set (short form).',
    category: 'Personality',
    estimatedMinutes: 10,
    depth: 'medium',
    tone: 'reflective',
    status: 'active',
    riskLevel: 'low',
    tags: ['open', 'ipip', 'big-five', 'variant-default'],
    sourceUrl: 'https://ipip.ori.org/newBigFive5broadKey.htm',
    licenseNote: 'IPIP items and scales are public domain.',
    variantGroup: 'ipip-big-five',
    variantKey: '50',
    scoring: { model: 'sum-with-severity', minScore: 50, maxScore: 250 },
    questions: ipipBigFive50Prompts.map((prompt, index) => ({
      id: `ipip50-q${index + 1}`,
      prompt,
      type: 'likert',
      choices: agree5,
      reverseScored: ipipBigFive50Reverse.has(index + 1),
      required: true,
    })),
  },
  {
    id: 'ipip-big-five-100',
    slug: 'ipip-big-five-100',
    title: 'IPIP Big Five (100-item)',
    description: 'Public-domain Big Five extended marker set (20 per domain).',
    category: 'Personality',
    estimatedMinutes: 18,
    depth: 'deep',
    tone: 'reflective',
    status: 'active',
    riskLevel: 'low',
    tags: ['open', 'ipip', 'big-five', 'variant-extended'],
    sourceUrl: 'https://ipip.ori.org/newBigFive5broadKey.htm',
    licenseNote: 'IPIP items and scales are public domain.',
    variantGroup: 'ipip-big-five',
    variantKey: '100',
    scoring: { model: 'sum-with-severity', minScore: 100, maxScore: 500 },
    questions: ipipBigFive100Prompts.map((prompt, index) => ({
      id: `ipip100-q${index + 1}`,
      prompt,
      type: 'likert',
      choices: agree5,
      reverseScored: ipipBigFive100Reverse.has(index + 1),
      required: true,
    })),
  },
  {
    id: 'ipip-neo-120',
    slug: 'ipip-neo-120',
    title: 'IPIP-NEO (120-item)',
    description: 'Public-domain 30-facet representation (Johnson, 2014).',
    category: 'Personality',
    estimatedMinutes: 22,
    depth: 'deep',
    tone: 'reflective',
    status: 'active',
    riskLevel: 'low',
    tags: ['open', 'ipip', 'neo', 'variant-default'],
    sourceUrl: 'https://ipip.ori.org/30FacetNEO-PI-RItems.htm',
    licenseNote: 'IPIP items and scales are public domain.',
    variantGroup: 'ipip-neo',
    variantKey: '120',
    scoring: { model: 'sum-with-severity', minScore: 120, maxScore: 600 },
    questions: ipip120Prompts.map((prompt, index) => ({
      id: `ipip120-q${index + 1}`,
      prompt,
      type: 'likert',
      choices: agree5,
      required: true,
    })),
  },
  {
    id: 'ipip-neo-300',
    slug: 'ipip-neo-300',
    title: 'IPIP-NEO (300-item)',
    description: 'Extended variant; metadata ready, full item payload pending authoritative import.',
    category: 'Personality',
    estimatedMinutes: 45,
    depth: 'deep',
    tone: 'reflective',
    status: 'pending',
    riskLevel: 'low',
    tags: ['open', 'ipip', 'neo', 'pending', 'variant-extended'],
    sourceUrl: 'https://www.ipip.ori.org/KoreanIPIP-NEO-300.htm',
    licenseNote: 'Pending reliable full English payload extraction from official source.',
    variantGroup: 'ipip-neo',
    variantKey: '300',
    scoring: { model: 'none' },
    questions: [],
  },
  {
    id: 'ipip-personality-scales',
    slug: 'ipip-personality-scales',
    title: 'IPIP Personality Scales (Curated Pack)',
    description: 'Curated single-construct IPIP scales grouped into a compact public-domain pack.',
    category: 'Personality',
    estimatedMinutes: 16,
    depth: 'deep',
    tone: 'reflective',
    status: 'active',
    riskLevel: 'low',
    tags: ['open', 'ipip', 'single-construct', 'variant-pack'],
    sourceUrl: 'https://ipip.ori.org/newSingleConstructs.htm',
    licenseNote: 'IPIP items and scales are public domain.',
    variantGroup: 'ipip-single-constructs',
    variantKey: 'curated-5x10',
    scoring: { model: 'domain-sum', minScore: 50, maxScore: 250 },
    questions: ipipPersonalityScales.flatMap((scale) =>
      scale.items.map((item, index) => ({
        id: `${scale.key}-q${index + 1}`,
        prompt: item.prompt,
        helperText: scale.label,
        type: 'likert' as const,
        choices: agree5,
        reverseScored: item.reverse,
        required: true,
      })),
    ),
  },
  {
    id: 'phq-9',
    slug: 'phq-9',
    title: 'PHQ-9',
    description: '9-item depression symptom screener (past 2 weeks).',
    category: 'Emotions',
    estimatedMinutes: 5,
    depth: 'quick',
    tone: 'serious',
    status: 'active',
    riskLevel: 'high',
    tags: ['open', 'clinical-screener', 'depression', 'variant-default'],
    sourceUrl: 'https://www.phqscreeners.com/select-screener',
    variantGroup: 'phq',
    variantKey: '9',
    scoring: {
      model: 'sum-with-severity',
      minScore: 0,
      maxScore: 27,
      cutoffBands: [
        { label: 'Minimal', min: 0, max: 4, description: 'little to no indication of depressive symptoms in the last two weeks' },
        { label: 'Mild', min: 5, max: 9, description: 'some mild depressive symptoms worth keeping an eye on' },
        { label: 'Moderate', min: 10, max: 14, description: 'a moderate symptom burden that many people find worth discussing with a professional' },
        { label: 'Moderately severe', min: 15, max: 19, description: 'a considerable symptom burden' },
        { label: 'Severe', min: 20, max: 27, description: 'a high symptom burden' },
      ],
    },
    questions: makeFrequencyQuestions('phq9', phqPrompts),
  },
  {
    id: 'phq-8',
    slug: 'phq-8',
    title: 'PHQ-8',
    description: 'PHQ-9 variant without self-harm item.',
    category: 'Emotions',
    estimatedMinutes: 4,
    depth: 'quick',
    tone: 'serious',
    status: 'active',
    riskLevel: 'medium',
    tags: ['open', 'clinical-screener', 'depression'],
    sourceUrl: 'https://www.phqscreeners.com/images/sites/g/files/g10016261/f/201412/instructions.pdf',
    variantGroup: 'phq',
    variantKey: '8',
    scoring: {
      model: 'sum-with-severity',
      minScore: 0,
      maxScore: 24,
      cutoffBands: [
        { label: 'Minimal', min: 0, max: 4, description: 'little to no indication of depressive symptoms in the last two weeks' },
        { label: 'Mild', min: 5, max: 9, description: 'some mild depressive symptoms worth keeping an eye on' },
        { label: 'Moderate', min: 10, max: 14, description: 'a moderate symptom burden that many people find worth discussing with a professional' },
        { label: 'Moderately severe', min: 15, max: 19, description: 'a considerable symptom burden' },
        { label: 'Severe', min: 20, max: 24, description: 'a high symptom burden' },
      ],
    },
    questions: makeFrequencyQuestions('phq8', phqPrompts.slice(0, 8)),
  },
  {
    id: 'phq-2',
    slug: 'phq-2',
    title: 'PHQ-2',
    description: 'Ultra-brief depression screener.',
    category: 'Emotions',
    estimatedMinutes: 2,
    depth: 'quick',
    tone: 'serious',
    status: 'active',
    riskLevel: 'medium',
    tags: ['open', 'clinical-screener', 'depression'],
    sourceUrl: 'https://www.phqscreeners.com/images/sites/g/files/g10016261/f/201412/instructions.pdf',
    variantGroup: 'phq',
    variantKey: '2',
    scoring: {
      model: 'sum-with-severity',
      minScore: 0,
      maxScore: 6,
      cutoffBands: [
        { label: 'Lower likelihood', min: 0, max: 2, description: 'a lower likelihood of a depressive disorder based on this ultra-brief screen' },
        { label: 'Positive screen threshold', min: 3, max: 6, description: 'a positive screen — the fuller PHQ-9 would give a more complete picture' },
      ],
    },
    questions: makeFrequencyQuestions('phq2', phqPrompts.slice(0, 2)),
  },
  {
    id: 'gad-7',
    slug: 'gad-7',
    title: 'GAD-7',
    description: '7-item generalized anxiety screener (past 2 weeks).',
    category: 'Emotions',
    estimatedMinutes: 4,
    depth: 'quick',
    tone: 'serious',
    status: 'active',
    riskLevel: 'medium',
    tags: ['open', 'clinical-screener', 'anxiety', 'variant-default'],
    sourceUrl: 'https://www.phqscreeners.com/select-screener',
    variantGroup: 'gad',
    variantKey: '7',
    scoring: {
      model: 'sum-with-severity',
      minScore: 0,
      maxScore: 21,
      cutoffBands: [
        { label: 'Minimal', min: 0, max: 4, description: 'little to no indication of anxiety symptoms in the last two weeks' },
        { label: 'Mild', min: 5, max: 9, description: 'some mild anxiety symptoms worth keeping an eye on' },
        { label: 'Moderate', min: 10, max: 14, description: 'a moderate symptom burden that many people find worth discussing with a professional' },
        { label: 'Severe', min: 15, max: 21, description: 'a high symptom burden' },
      ],
    },
    questions: makeFrequencyQuestions('gad7', gadPrompts),
  },
  {
    id: 'gad-2',
    slug: 'gad-2',
    title: 'GAD-2',
    description: 'Ultra-brief anxiety screener.',
    category: 'Emotions',
    estimatedMinutes: 2,
    depth: 'quick',
    tone: 'serious',
    status: 'active',
    riskLevel: 'medium',
    tags: ['open', 'clinical-screener', 'anxiety'],
    sourceUrl: 'https://www.phqscreeners.com/images/sites/g/files/g10016261/f/201412/instructions.pdf',
    variantGroup: 'gad',
    variantKey: '2',
    scoring: {
      model: 'sum-with-severity',
      minScore: 0,
      maxScore: 6,
      cutoffBands: [
        { label: 'Lower likelihood', min: 0, max: 2, description: 'a lower likelihood of an anxiety disorder based on this ultra-brief screen' },
        { label: 'Positive screen threshold', min: 3, max: 6, description: 'a positive screen — the fuller GAD-7 would give a more complete picture' },
      ],
    },
    questions: makeFrequencyQuestions('gad2', gadPrompts.slice(0, 2)),
  },
  {
    id: 'dass-21',
    slug: 'dass-21',
    title: 'DASS-21',
    description: 'Depression, anxiety, stress (short form).',
    category: 'Stress & burnout',
    estimatedMinutes: 7,
    depth: 'medium',
    tone: 'serious',
    status: 'active',
    riskLevel: 'medium',
    tags: ['open', 'clinical-screener', 'stress', 'anxiety', 'depression', 'variant-default'],
    sourceUrl: 'https://www2.psy.unsw.edu.au/dass/down.htm',
    variantGroup: 'dass',
    variantKey: '21',
    scoring: {
      model: 'domain-sum',
      minScore: 0,
      maxScore: 63,
      domains: [
        { id: 'depression', label: 'Depression', questionIds: ['dass21-q3', 'dass21-q5', 'dass21-q10', 'dass21-q13', 'dass21-q16', 'dass21-q17', 'dass21-q21'], multiplier: 2, cutoffBands: dassDepressionBands },
        { id: 'anxiety', label: 'Anxiety', questionIds: ['dass21-q2', 'dass21-q4', 'dass21-q7', 'dass21-q9', 'dass21-q15', 'dass21-q19', 'dass21-q20'], multiplier: 2, cutoffBands: dassAnxietyBands },
        { id: 'stress', label: 'Stress', questionIds: ['dass21-q1', 'dass21-q6', 'dass21-q8', 'dass21-q11', 'dass21-q12', 'dass21-q14', 'dass21-q18'], multiplier: 2, cutoffBands: dassStressBands },
      ],
    },
    questions: makeDassQuestions('dass21', dass21Prompts),
  },
  {
    id: 'dass-42',
    slug: 'dass-42',
    title: 'DASS-42',
    description: 'DASS full form (42 items).',
    category: 'Stress & burnout',
    estimatedMinutes: 14,
    depth: 'deep',
    tone: 'serious',
    status: 'active',
    riskLevel: 'medium',
    tags: ['open', 'clinical-screener', 'stress', 'anxiety', 'depression'],
    sourceUrl: 'https://www2.psy.unsw.edu.au/dass/down.htm',
    variantGroup: 'dass',
    variantKey: '42',
    scoring: {
      model: 'domain-sum',
      minScore: 0,
      maxScore: 126,
      domains: [
        { id: 'depression', label: 'Depression', questionIds: ['dass42-q3', 'dass42-q5', 'dass42-q10', 'dass42-q13', 'dass42-q16', 'dass42-q17', 'dass42-q21', 'dass42-q24', 'dass42-q26', 'dass42-q31', 'dass42-q34', 'dass42-q37', 'dass42-q38', 'dass42-q42'], cutoffBands: dassDepressionBands },
        { id: 'anxiety', label: 'Anxiety', questionIds: ['dass42-q2', 'dass42-q4', 'dass42-q7', 'dass42-q9', 'dass42-q15', 'dass42-q19', 'dass42-q20', 'dass42-q23', 'dass42-q25', 'dass42-q28', 'dass42-q30', 'dass42-q36', 'dass42-q40', 'dass42-q41'], cutoffBands: dassAnxietyBands },
        { id: 'stress', label: 'Stress', questionIds: ['dass42-q1', 'dass42-q6', 'dass42-q8', 'dass42-q11', 'dass42-q12', 'dass42-q14', 'dass42-q18', 'dass42-q22', 'dass42-q27', 'dass42-q29', 'dass42-q32', 'dass42-q33', 'dass42-q35', 'dass42-q39'], cutoffBands: dassStressBands },
      ],
    },
    questions: makeDassQuestions('dass42', dass42Prompts),
  },
  {
    id: 'pss-10',
    slug: 'pss-perceived-stress-scale',
    title: 'PSS Perceived Stress Scale (10-item)',
    description: 'Perceived stress screener (past month). Copyrighted instrument; use with permission.',
    category: 'Stress & burnout',
    estimatedMinutes: 4,
    depth: 'quick',
    tone: 'serious',
    status: 'licensed',
    riskLevel: 'medium',
    tags: ['caution', 'licensed', 'stress'],
    sourceUrl: 'https://www.mindgarden.com/documents/PerceivedStressScale.pdf',
    licenseNote: 'PSS is copyrighted; confirm permission terms for your usage context.',
    scoring: { model: 'sum-with-severity', minScore: 0, maxScore: 40 },
    questions: makeFrequencyQuestions('pss10', pss10Prompts).map((q, idx) => ({
      ...q,
      reverseScored: [3, 4, 6, 7].includes(idx),
      choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'almost-never', label: 'Almost never', score: 1 },
        { value: 'sometimes', label: 'Sometimes', score: 2 },
        { value: 'fairly-often', label: 'Fairly often', score: 3 },
        { value: 'very-often', label: 'Very often', score: 4 },
      ],
    })),
  },
  {
    id: 'rosenberg-self-esteem',
    slug: 'rosenberg-self-esteem-scale',
    title: 'Rosenberg Self-Esteem Scale',
    description: '10-item global self-esteem measure.',
    category: 'Self-esteem',
    estimatedMinutes: 4,
    depth: 'quick',
    tone: 'reflective',
    status: 'active',
    riskLevel: 'low',
    tags: ['open', 'self-esteem', 'public-domain'],
    sourceUrl: 'https://socy.umd.edu/about-us/rosenberg-self-esteem-scale',
    scoring: { model: 'sum-with-severity', minScore: 0, maxScore: 30 },
    questions: [
      { id: 'rse-q1', prompt: 'On the whole, I am satisfied with myself.', type: 'single-choice', choices: rosenbergChoices, required: true },
      { id: 'rse-q2', prompt: 'At times, I think I am no good at all.', type: 'single-choice', choices: rosenbergChoices, reverseScored: true, required: true },
      { id: 'rse-q3', prompt: 'I feel that I have a number of good qualities.', type: 'single-choice', choices: rosenbergChoices, required: true },
      { id: 'rse-q4', prompt: 'I am able to do things as well as most other people.', type: 'single-choice', choices: rosenbergChoices, required: true },
      { id: 'rse-q5', prompt: 'I feel I do not have much to be proud of.', type: 'single-choice', choices: rosenbergChoices, reverseScored: true, required: true },
      { id: 'rse-q6', prompt: 'I certainly feel useless at times.', type: 'single-choice', choices: rosenbergChoices, reverseScored: true, required: true },
      { id: 'rse-q7', prompt: 'I feel that I am a person of worth, at least on an equal plane with others.', type: 'single-choice', choices: rosenbergChoices, required: true },
      { id: 'rse-q8', prompt: 'I wish I could have more respect for myself.', type: 'single-choice', choices: rosenbergChoices, reverseScored: true, required: true },
      { id: 'rse-q9', prompt: 'All in all, I am inclined to feel that I am a failure.', type: 'single-choice', choices: rosenbergChoices, reverseScored: true, required: true },
      { id: 'rse-q10', prompt: 'I take a positive attitude toward myself.', type: 'single-choice', choices: rosenbergChoices, required: true },
    ],
  },
  {
    id: 'who-5',
    slug: 'who-5-well-being-index',
    title: 'WHO-5 Well-Being Index',
    description: '5-item well-being measure (past 2 weeks).',
    category: 'Emotions',
    estimatedMinutes: 3,
    depth: 'quick',
    tone: 'reflective',
    status: 'active',
    riskLevel: 'low',
    tags: ['open', 'wellbeing', 'who'],
    sourceUrl: 'https://www.who.int/publications/m/item/WHO-UCN-MSD-MHE-2024.01',
    scoring: {
      model: 'sum-with-severity',
      minScore: 0,
      maxScore: 25,
      cutoffBands: [
        { label: 'Lower well-being range', min: 0, max: 12, description: 'a lower well-being score; if this feels persistent, it may be worth a fuller depression screen' },
        { label: 'Higher well-being range', min: 13, max: 25, description: 'a higher well-being score over the last two weeks' },
      ],
      notes: 'WHO-5 raw score is commonly multiplied by 4 to get a 0-100 well-being percentage.',
    },
    questions: [
      { id: 'who5-q1', prompt: 'I have felt cheerful and in good spirits.', type: 'single-choice', choices: who5Choices, required: true },
      { id: 'who5-q2', prompt: 'I have felt calm and relaxed.', type: 'single-choice', choices: who5Choices, required: true },
      { id: 'who5-q3', prompt: 'I have felt active and vigorous.', type: 'single-choice', choices: who5Choices, required: true },
      { id: 'who5-q4', prompt: 'I woke up feeling fresh and rested.', type: 'single-choice', choices: who5Choices, required: true },
      { id: 'who5-q5', prompt: 'My daily life has been filled with things that interest me.', type: 'single-choice', choices: who5Choices, required: true },
    ],
  },
  {
    id: 'audit',
    slug: 'audit',
    title: 'AUDIT',
    description: 'WHO alcohol use screening questionnaire (10 items).',
    category: 'Habits & discipline',
    estimatedMinutes: 5,
    depth: 'medium',
    tone: 'serious',
    status: 'active',
    riskLevel: 'medium',
    tags: ['open', 'substance-use', 'who', 'variant-default'],
    sourceUrl: 'https://auditscreen.org/check-your-drinking',
    variantGroup: 'audit',
    variantKey: '10',
    scoring: {
      model: 'sum-with-severity',
      minScore: 0,
      maxScore: 40,
      cutoffBands: [
        { label: 'Lower risk', min: 0, max: 7, description: 'drinking patterns in the lower-risk range' },
        { label: 'Hazardous use', min: 8, max: 15, description: 'a pattern associated with a raised risk of harm' },
        { label: 'Harmful use', min: 16, max: 19, description: 'a pattern already likely causing harm' },
        { label: 'Possible dependence', min: 20, max: 40, description: 'a pattern consistent with possible alcohol dependence — worth a real conversation with a professional' },
      ],
    },
    questions: [
      { id: 'audit-q1', prompt: 'How often do you have a drink containing alcohol?', type: 'single-choice', choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'monthly-or-less', label: 'Monthly or less', score: 1 },
        { value: '2-4-month', label: '2 to 4 times a month', score: 2 },
        { value: '2-3-week', label: '2 to 3 times a week', score: 3 },
        { value: '4-plus-week', label: '4 or more times a week', score: 4 },
      ], required: true },
      { id: 'audit-q2', prompt: 'How many standard drinks do you have on a typical day when drinking?', type: 'single-choice', choices: [
        { value: '1-2', label: '1 or 2', score: 0 },
        { value: '3-4', label: '3 or 4', score: 1 },
        { value: '5-6', label: '5 or 6', score: 2 },
        { value: '7-9', label: '7 to 9', score: 3 },
        { value: '10-plus', label: '10 or more', score: 4 },
      ], required: true },
      { id: 'audit-q3', prompt: 'How often do you have six or more drinks on one occasion?', type: 'single-choice', choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'less-than-monthly', label: 'Less than monthly', score: 1 },
        { value: 'monthly', label: 'Monthly', score: 2 },
        { value: 'weekly', label: 'Weekly', score: 3 },
        { value: 'daily', label: 'Daily or almost daily', score: 4 },
      ], required: true },
      { id: 'audit-q4', prompt: 'How often during the last year have you found that you were not able to stop drinking once you had started?', type: 'single-choice', choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'less-than-monthly', label: 'Less than monthly', score: 1 },
        { value: 'monthly', label: 'Monthly', score: 2 },
        { value: 'weekly', label: 'Weekly', score: 3 },
        { value: 'daily', label: 'Daily or almost daily', score: 4 },
      ], required: true },
      { id: 'audit-q5', prompt: 'How often during the last year have you failed to do what was normally expected of you because of drinking?', type: 'single-choice', choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'less-than-monthly', label: 'Less than monthly', score: 1 },
        { value: 'monthly', label: 'Monthly', score: 2 },
        { value: 'weekly', label: 'Weekly', score: 3 },
        { value: 'daily', label: 'Daily or almost daily', score: 4 },
      ], required: true },
      { id: 'audit-q6', prompt: 'How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?', type: 'single-choice', choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'less-than-monthly', label: 'Less than monthly', score: 1 },
        { value: 'monthly', label: 'Monthly', score: 2 },
        { value: 'weekly', label: 'Weekly', score: 3 },
        { value: 'daily', label: 'Daily or almost daily', score: 4 },
      ], required: true },
      { id: 'audit-q7', prompt: 'How often during the last year have you had a feeling of guilt or remorse after drinking?', type: 'single-choice', choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'less-than-monthly', label: 'Less than monthly', score: 1 },
        { value: 'monthly', label: 'Monthly', score: 2 },
        { value: 'weekly', label: 'Weekly', score: 3 },
        { value: 'daily', label: 'Daily or almost daily', score: 4 },
      ], required: true },
      { id: 'audit-q8', prompt: 'How often during the last year have you been unable to remember what happened the night before because you had been drinking?', type: 'single-choice', choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'less-than-monthly', label: 'Less than monthly', score: 1 },
        { value: 'monthly', label: 'Monthly', score: 2 },
        { value: 'weekly', label: 'Weekly', score: 3 },
        { value: 'daily', label: 'Daily or almost daily', score: 4 },
      ], required: true },
      { id: 'audit-q9', prompt: 'Have you or someone else been injured because of your drinking?', type: 'single-choice', choices: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'yes-not-last-year', label: 'Yes, but not in the last year', score: 2 },
        { value: 'yes-last-year', label: 'Yes, during the last year', score: 4 },
      ], required: true },
      { id: 'audit-q10', prompt: 'Has a relative, friend, doctor, or other health worker been concerned about your drinking or suggested you cut down?', type: 'single-choice', choices: [
        { value: 'no', label: 'No', score: 0 },
        { value: 'yes-not-last-year', label: 'Yes, but not in the last year', score: 2 },
        { value: 'yes-last-year', label: 'Yes, during the last year', score: 4 },
      ], required: true },
    ],
  },
  {
    id: 'audit-c',
    slug: 'audit-c',
    title: 'AUDIT-C',
    description: 'Brief 3-item alcohol use screener.',
    category: 'Habits & discipline',
    estimatedMinutes: 2,
    depth: 'quick',
    tone: 'serious',
    status: 'active',
    riskLevel: 'medium',
    tags: ['open', 'substance-use', 'who'],
    sourceUrl: 'https://auditscreen.org/about/audit-derivatives',
    variantGroup: 'audit',
    variantKey: 'c',
    scoring: {
      model: 'sum-with-severity',
      minScore: 0,
      maxScore: 12,
      cutoffBands: [
        { label: 'Lower risk range', min: 0, max: 2 },
        { label: 'Elevated risk range', min: 3, max: 12 },
      ],
    },
    questions: [
      { id: 'auditc-q1', prompt: 'How often do you have a drink containing alcohol?', type: 'single-choice', choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'monthly-or-less', label: 'Monthly or less', score: 1 },
        { value: '2-4-month', label: '2 to 4 times a month', score: 2 },
        { value: '2-3-week', label: '2 to 3 times a week', score: 3 },
        { value: '4-plus-week', label: '4 or more times a week', score: 4 },
      ], required: true },
      { id: 'auditc-q2', prompt: 'How many drinks do you have on a typical day when drinking?', type: 'single-choice', choices: [
        { value: '1-2', label: '1 or 2', score: 0 },
        { value: '3-4', label: '3 or 4', score: 1 },
        { value: '5-6', label: '5 or 6', score: 2 },
        { value: '7-9', label: '7 to 9', score: 3 },
        { value: '10-plus', label: '10 or more', score: 4 },
      ], required: true },
      { id: 'auditc-q3', prompt: 'How often do you have six or more drinks on one occasion?', type: 'single-choice', choices: [
        { value: 'never', label: 'Never', score: 0 },
        { value: 'less-than-monthly', label: 'Less than monthly', score: 1 },
        { value: 'monthly', label: 'Monthly', score: 2 },
        { value: 'weekly', label: 'Weekly', score: 3 },
        { value: 'daily', label: 'Daily or almost daily', score: 4 },
      ], required: true },
    ],
  },
  {
    id: 'pcl-5',
    slug: 'pcl-5',
    title: 'PCL-5 PTSD Checklist',
    description: '20-item PTSD symptom checklist for the past month.',
    category: 'Stress & burnout',
    estimatedMinutes: 8,
    depth: 'medium',
    tone: 'serious',
    status: 'caution',
    riskLevel: 'high',
    tags: ['caution', 'ptsd', 'clinical-screener'],
    sourceUrl: 'https://ptsd.va.gov/PTSD/professional/assessment/documents/using-PCL5.pdf',
    scoring: {
      model: 'sum-with-severity',
      minScore: 0,
      maxScore: 80,
      cutoffBands: [
        { label: 'Below common cutoff range', min: 0, max: 30 },
        { label: 'Common probable PTSD cutoff range', min: 31, max: 80 },
      ],
      domains: [
        { id: 'cluster-b', label: 'Intrusion (B)', questionIds: ['pcl5-q1', 'pcl5-q2', 'pcl5-q3', 'pcl5-q4', 'pcl5-q5'] },
        { id: 'cluster-c', label: 'Avoidance (C)', questionIds: ['pcl5-q6', 'pcl5-q7'] },
        { id: 'cluster-d', label: 'Negative Cognitions/Mood (D)', questionIds: ['pcl5-q8', 'pcl5-q9', 'pcl5-q10', 'pcl5-q11', 'pcl5-q12', 'pcl5-q13', 'pcl5-q14'] },
        { id: 'cluster-e', label: 'Arousal/Reactivity (E)', questionIds: ['pcl5-q15', 'pcl5-q16', 'pcl5-q17', 'pcl5-q18', 'pcl5-q19', 'pcl5-q20'] },
      ],
    },
    questions: pcl5Prompts.map((prompt, index) => ({
      id: `pcl5-q${index + 1}`,
      prompt,
      type: 'single-choice',
      choices: [
        { value: '0', label: 'Not at all', score: 0 },
        { value: '1', label: 'A little bit', score: 1 },
        { value: '2', label: 'Moderately', score: 2 },
        { value: '3', label: 'Quite a bit', score: 3 },
        { value: '4', label: 'Extremely', score: 4 },
      ],
      required: true,
    })),
  },
  {
    id: 'c-ssrs',
    slug: 'c-ssrs',
    title: 'C-SSRS Columbia Suicide Severity Rating Scale',
    description: 'High-risk suicidal ideation/behavior screening flow.',
    category: 'Emotions',
    estimatedMinutes: 5,
    depth: 'deep',
    tone: 'serious',
    status: 'caution',
    riskLevel: 'high',
    tags: ['caution', 'suicide-risk', 'clinical-screener'],
    sourceUrl: 'https://cssrs.columbia.edu/the-columbia-scale-c-ssrs/cssrs-for-research/',
    scoring: { model: 'sum-with-severity', minScore: 0, maxScore: 6 },
    questions: [
      { id: 'cssrs-q1', prompt: 'Have you wished you were dead or wished you could go to sleep and not wake up?', type: 'yes-no', choices: yesNo, required: true },
      { id: 'cssrs-q2', prompt: 'Have you actually had any thoughts about killing yourself?', type: 'yes-no', choices: yesNo, required: true },
      { id: 'cssrs-q3', prompt: 'Have you thought about how you might do this?', type: 'yes-no', choices: yesNo, visibilityCondition: { questionId: 'cssrs-q2', equals: 'yes' }, required: true },
      { id: 'cssrs-q4', prompt: 'Have you had any intention of acting on these thoughts of killing yourself?', type: 'yes-no', choices: yesNo, visibilityCondition: { questionId: 'cssrs-q2', equals: 'yes' }, required: true },
      { id: 'cssrs-q5', prompt: 'Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?', type: 'yes-no', choices: yesNo, visibilityCondition: { questionId: 'cssrs-q2', equals: 'yes' }, required: true },
      { id: 'cssrs-q6', prompt: 'Have you done anything, started to do anything, or prepared to do anything to end your life?', type: 'yes-no', choices: yesNo, required: true },
    ],
  },
  {
    id: 'mdq',
    slug: 'mdq',
    title: 'MDQ Mood Disorder Questionnaire',
    description: 'Bipolar-spectrum screener (licensed + caution handling).',
    category: 'Emotions',
    estimatedMinutes: 6,
    depth: 'medium',
    tone: 'serious',
    status: 'caution',
    riskLevel: 'high',
    tags: ['caution', 'licensed', 'clinical-screener', 'bipolar'],
    sourceUrl: 'https://psychopharmacology.uic.edu/images/stories/physicians/rating%20scales/MDQ_Quest%5B1%5D.pdf',
    licenseNote: 'MDQ content is copyrighted; use according to holder terms and local policy.',
    scoring: {
      model: 'algorithmic',
      minScore: 0,
      maxScore: 13,
      notes: 'Common positive screen rule: 7 or more symptom yes responses + same-period endorsement + moderate/serious impairment.',
    },
    questions: [
      ...mdqPrompts.map((prompt, index) => ({
        id: `mdq-q${index + 1}`,
        prompt: `Has there ever been a period of time when you were not your usual self and ${prompt}`,
        type: 'yes-no' as const,
        choices: yesNo,
        required: true,
      })),
      {
        id: 'mdq-q14',
        prompt: 'If you checked yes to more than one symptom above, did several of these happen during the same period of time?',
        type: 'yes-no',
        choices: yesNo,
        required: true,
      },
      {
        id: 'mdq-q15',
        prompt: 'How much of a problem did these cause you (work, family, money/legal, arguments/fights)?',
        type: 'single-choice',
        choices: [
          { value: 'none', label: 'No problem', score: 0 },
          { value: 'minor', label: 'Minor problem', score: 1 },
          { value: 'moderate', label: 'Moderate problem', score: 2 },
          { value: 'serious', label: 'Serious problem', score: 3 },
        ],
        required: true,
      },
    ],
  },
  ...originalTests.map<TestDefinition>((item, index) => ({
    id: `orig-${index + 1}`,
    slug: item.slug,
    title: item.title,
    description: `Original reflection-oriented ${item.title} designed for non-clinical self-awareness.`,
    category: item.category,
    estimatedMinutes: 8,
    depth: 'medium' as const,
    tone: 'reflective' as const,
    status: 'active' as const,
    riskLevel: 'low' as const,
    tags: ['original', 'non-clinical'],
    sourceUrl: '#original',
    licenseNote: 'Original in-app authoring; not derived from any external instrument.',
    scoring: { model: 'sum-with-severity', minScore: 0, maxScore: 20 },
    questions: createOriginalQuestions(item.slug.replace(/[^a-z0-9]/g, ''), item.theme),
  })),
  ...notOkayDirectly.map((name) => makePendingLicensedTest(name)),
];

export const sampleResult: TestResultSummary = {
  id: 'r1',
  userId: 'u1',
  testId: 'orig-5',
  testTitle: 'Emotional awareness test',
  score: 72,
  pattern: 'Balanced',
  strengths: ['Reflective', 'Growth-Oriented', 'Values-Led'],
  growthAreas: ['Overthinking', 'Consistency', 'Boundaries'],
  meaning:
    "You're someone who cares deeply and thinks things through. You're building something meaningful through small, repeated choices.",
  nonMeaning: [
    "It doesn't define your worth.",
    "It's not a label.",
    "It's a snapshot, not the whole story.",
  ],
  createdAt: new Date().toISOString(),
  keyPatterns: [
    { label: 'Self-Awareness', value: 78 },
    { label: 'Emotional Balance', value: 69 },
    { label: 'Purpose & Values', value: 74 },
    { label: 'Relationships', value: 63 },
    { label: 'Mindset', value: 75 },
  ],
};

export const sampleCheckIns: CheckInEntry[] = [
  {
    id: 'c1',
    mood: 7,
    stress: 4,
    energy: 6,
    sleep: 6,
    focus: 7,
    motivation: 7,
    socialBattery: 5,
    note: 'Felt calmer after a short walk.',
    createdAt: '2026-05-01T08:10:00.000Z',
  },
  {
    id: 'c2',
    mood: 6,
    stress: 6,
    energy: 5,
    sleep: 5,
    focus: 5,
    motivation: 6,
    socialBattery: 4,
    note: 'Too many tabs open mentally.',
    createdAt: '2026-05-02T08:10:00.000Z',
  },
  {
    id: 'c3',
    mood: 8,
    stress: 3,
    energy: 7,
    sleep: 7,
    focus: 7,
    motivation: 8,
    socialBattery: 6,
    note: 'Good pace today and fewer interruptions.',
    createdAt: '2026-05-03T08:10:00.000Z',
  },
];
