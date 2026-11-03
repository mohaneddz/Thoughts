import type { TestCategory, TestDepth, TestTone } from '@/types/common';
import type { ChoiceOption, ScoreDirection, ScoreProfile, SeverityBand, TestDefinition, TestQuestion } from '@/types/test';

/**
 * The in-app reflection tests. Every item here was written for this app; none is copied
 * from a published instrument. Some borrow well-known *ideas* (attachment dimensions,
 * Holland interest areas, conflict modes) and say so in their descriptions.
 */

const agreeScale: ChoiceOption[] = [
  { value: 'strongly-disagree', label: 'Strongly disagree', score: 1 },
  { value: 'disagree', label: 'Disagree', score: 2 },
  { value: 'neutral', label: 'Neither agree nor disagree', score: 3 },
  { value: 'agree', label: 'Agree', score: 4 },
  { value: 'strongly-agree', label: 'Strongly agree', score: 5 },
];

const oftenScale: ChoiceOption[] = [
  { value: 'never', label: 'Never', score: 0 },
  { value: 'rarely', label: 'Rarely', score: 1 },
  { value: 'sometimes', label: 'Sometimes', score: 2 },
  { value: 'often', label: 'Often', score: 3 },
  { value: 'almost-always', label: 'Almost always', score: 4 },
];

/** A prompt, or a prompt plus `true` when agreeing should lower the domain score. */
type ItemSpec = string | [string, true];

interface DomainSpec {
  id: string;
  label: string;
  description: string;
  tip: string;
  items: ItemSpec[];
}

interface ReflectionTestSpec {
  index: number;
  slug: string;
  title: string;
  description: string;
  category: TestCategory;
  tone: TestTone;
  depth: TestDepth;
  minutes: number;
  higherIs: ScoreDirection;
  scale: 'agree' | 'often';
  domains: DomainSpec[];
  /** Labels and descriptions for the lower, middle and upper third of the total range. */
  thirds?: Array<{ label: string; description: string }>;
  profiles?: ScoreProfile[];
}

function thirdBands(min: number, max: number, thirds: NonNullable<ReflectionTestSpec['thirds']>): SeverityBand[] {
  const span = max - min;
  const firstCut = min + Math.floor(span / 3);
  const secondCut = min + Math.floor((span * 2) / 3);
  return [
    { ...thirds[0], min, max: firstCut },
    { ...thirds[1], min: firstCut + 1, max: secondCut },
    { ...thirds[2], min: secondCut + 1, max },
  ];
}

/** Interleaves domains so consecutive questions rarely measure the same thing. */
function buildReflectionTest(spec: ReflectionTestSpec): TestDefinition {
  const prefix = spec.slug.replace(/-test$/, '').replace(/[^a-z]/g, '');
  const choices = spec.scale === 'agree' ? agreeScale : oftenScale;
  const longest = Math.max(...spec.domains.map((domain) => domain.items.length));
  const questions: TestQuestion[] = [];
  const questionIdsByDomain = new Map<string, string[]>();

  for (let row = 0; row < longest; row += 1) {
    for (const domain of spec.domains) {
      const item = domain.items[row];
      if (!item) continue;
      const [prompt, reverseScored] = typeof item === 'string' ? [item, false] : item;
      const id = `${prefix}-${domain.id}-${row + 1}`;
      questions.push({ id, prompt, type: spec.scale === 'agree' ? 'likert' : 'frequency', choices, reverseScored, required: true });
      questionIdsByDomain.set(domain.id, [...(questionIdsByDomain.get(domain.id) ?? []), id]);
    }
  }

  const [low, high] = spec.scale === 'agree' ? [1, 5] : [0, 4];
  const minScore = questions.length * low;
  const maxScore = questions.length * high;

  return {
    id: `orig-${spec.index}`,
    slug: spec.slug,
    title: spec.title,
    description: spec.description,
    category: spec.category,
    estimatedMinutes: spec.minutes,
    depth: spec.depth,
    tone: spec.tone,
    status: 'active',
    riskLevel: 'low',
    tags: ['original', 'non-clinical'],
    sourceUrl: '',
    licenseNote: 'Written for this app for self-reflection; not a validated psychological instrument.',
    scoring: {
      model: spec.thirds ? 'sum-with-severity' : 'domain-sum',
      higherIs: spec.higherIs,
      minScore,
      maxScore,
      cutoffBands: spec.thirds ? thirdBands(minScore, maxScore, spec.thirds) : undefined,
      profiles: spec.profiles,
      domains: spec.domains.map((domain) => ({
        id: domain.id,
        label: domain.label,
        description: domain.description,
        tip: domain.tip,
        questionIds: questionIdsByDomain.get(domain.id) ?? [],
      })),
    },
    questions,
  };
}

const specs: ReflectionTestSpec[] = [
  {
    index: 1,
    slug: 'attachment-style-test',
    title: 'Attachment patterns',
    description: 'How you handle closeness and distance in relationships, on the two dimensions attachment research uses: anxiety and avoidance.',
    category: 'Relationships',
    tone: 'reflective',
    depth: 'medium',
    minutes: 5,
    higherIs: 'neutral',
    scale: 'agree',
    domains: [
      {
        id: 'anxiety',
        label: 'Attachment anxiety',
        description: 'Closeness matters a lot to you, and distance or silence can feel like a sign something is wrong.',
        tip: 'Before reacting to a slow reply, write down two neutral explanations for it.',
        items: [
          'I worry that people I am close to will lose interest in me.',
          'When someone I care about seems distant, I assume I did something wrong.',
          'I need a lot of reassurance that I am loved.',
          'I get anxious when a message to someone close goes unanswered for a while.',
          'I sometimes feel I care more about my relationships than the other person does.',
          ['I trust that the people who love me will stay.', true],
        ],
      },
      {
        id: 'avoidance',
        label: 'Attachment avoidance',
        description: 'Independence feels safe, and too much closeness or need can start to feel like pressure.',
        tip: 'Share one small, true feeling with someone you trust this week and notice what happens.',
        items: [
          'I prefer not to depend on other people.',
          'I get uncomfortable when someone wants to be very close to me.',
          'I keep my feelings to myself, even with people I trust.',
          'When a relationship gets serious, I tend to pull back.',
          ['I find it easy to ask for comfort when I need it.', true],
          ['I am comfortable sharing private thoughts with people close to me.', true],
        ],
      },
    ],
    profiles: [
      {
        label: 'Secure-leaning',
        description: 'You tend to trust closeness and also feel fine on your own. Distance or conflict is uncomfortable, but it does not usually feel like a threat to the relationship.',
        when: { anxiety: 'low', avoidance: 'low' },
      },
      {
        label: 'Anxious-leaning',
        description: 'You value closeness strongly and may read distance as a warning sign. Reassurance helps, but the worry can come back quickly. Naming the need directly ("I could use a check-in") usually works better than waiting for the other person to guess.',
        when: { anxiety: 'high', avoidance: 'low' },
      },
      {
        label: 'Avoidant-leaning',
        description: 'Independence feels safe and closeness can start to feel like pressure. You may pull back exactly when a relationship deepens. Small, low-stakes moments of openness are a gentle way to stretch this.',
        when: { anxiety: 'low', avoidance: 'high' },
      },
      {
        label: 'Anxious and avoidant at once',
        description: 'You may want closeness and fear it at the same time, which can feel like push and pull. This is common after painful relationships, and it often softens with a steady, patient relationship or with therapy.',
        when: { anxiety: 'high', avoidance: 'high' },
      },
    ],
  },
  {
    index: 2,
    slug: 'overthinking-test',
    title: 'Overthinking patterns',
    description: 'How much your mind loops on the past, the future, and decisions — and which kind of looping is loudest.',
    category: 'Thinking style',
    tone: 'reflective',
    depth: 'medium',
    minutes: 5,
    higherIs: 'worse',
    scale: 'often',
    domains: [
      {
        id: 'rumination',
        label: 'Replaying the past',
        description: 'Your mind goes back over things that already happened, looking for what went wrong.',
        tip: 'Give replays a fixed ten-minute slot each day; outside it, jot the thought down and leave it there.',
        items: [
          'I replay conversations in my head long after they end.',
          'I go over past mistakes again and again.',
          'I find it hard to let go of something embarrassing I did.',
          'I analyse why I feel the way I do without reaching an answer.',
        ],
      },
      {
        id: 'worry',
        label: 'Rehearsing the future',
        description: 'Your mind runs ahead, preparing for problems that may never arrive.',
        tip: 'For each worry, ask: is there one action I can take today? If not, it is a thought to notice, not a task.',
        items: [
          'I imagine worst-case scenarios before they happen.',
          'I lie awake thinking about things I need to deal with.',
          'I mentally rehearse conversations that may never happen.',
          'Worrying about something feels like I am doing something about it.',
        ],
      },
      {
        id: 'deciding',
        label: 'Decision looping',
        description: 'Choices, even small ones, turn into long loops of weighing and second-guessing.',
        tip: 'Set a decision deadline and a "good enough" bar before you start researching.',
        items: [
          'I struggle with small decisions because I keep weighing options.',
          'I ask several people for their opinion before deciding.',
          'After deciding, I keep wondering whether I chose wrong.',
          'I keep researching long after it stops helping.',
        ],
      },
    ],
    thirds: [
      { label: 'Light overthinking', description: 'your thinking mostly moves on once it has done its job' },
      { label: 'Moderate overthinking', description: 'loops show up regularly and cost some time and calm' },
      { label: 'Heavy overthinking', description: 'looping thoughts take up a lot of your days and nights' },
    ],
  },
  {
    index: 3,
    slug: 'burnout-reflection-test',
    title: 'Burnout check',
    description: 'Early signs of burnout from work or study across the three areas burnout research describes: exhaustion, detachment, and lost effectiveness.',
    category: 'Stress & burnout',
    tone: 'reflective',
    depth: 'medium',
    minutes: 5,
    higherIs: 'worse',
    scale: 'often',
    domains: [
      {
        id: 'exhaustion',
        label: 'Exhaustion',
        description: 'Your energy is not refilling, even after rest.',
        tip: 'Protect one evening this week with no work, no catching up, and no screens after 9pm.',
        items: [
          'I feel drained before the day has properly started.',
          'Weekends and evenings do not seem to refill my energy.',
          'I feel emotionally worn out by my work or studies.',
          'Small tasks take a huge amount of effort.',
        ],
      },
      {
        id: 'detachment',
        label: 'Detachment',
        description: 'You are pulling away from work and the people around it to protect yourself.',
        tip: 'Reconnect with one part of the work you used to like, even for twenty minutes.',
        items: [
          'I feel cynical about whether my work matters.',
          'I do the minimum just to get through.',
          'I feel distant from the people I work or study with.',
          'I dread checking work or study messages.',
        ],
      },
      {
        id: 'effectiveness',
        label: 'Lost effectiveness',
        description: 'You feel less capable and less productive than you used to.',
        tip: 'Write down three things you finished this week, however small. Burnout hides progress.',
        items: [
          'I get less done than I used to.',
          'I doubt whether I am good at what I do.',
          'I struggle to concentrate on tasks I used to find easy.',
          'I rarely feel a sense of accomplishment lately.',
        ],
      },
    ],
    thirds: [
      { label: 'Few burnout signs', description: 'your energy and engagement are mostly holding up' },
      { label: 'Some burnout signs', description: 'strain is building in at least one area and is worth acting on early' },
      { label: 'Strong burnout signs', description: 'exhaustion and detachment are significant; consider talking to someone and reducing load where you can' },
    ],
  },
  {
    index: 4,
    slug: 'values-clarity-test',
    title: 'Values clarity',
    description: 'How clear your values are to you, how closely your days follow them, and how much you lean on them when choices get hard.',
    category: 'Career & values',
    tone: 'reflective',
    depth: 'medium',
    minutes: 5,
    higherIs: 'better',
    scale: 'agree',
    domains: [
      {
        id: 'clarity',
        label: 'Knowing your values',
        description: 'You can name what matters to you and what you would not trade it for.',
        tip: 'Try the values sorter tool and keep your top three somewhere you will see them.',
        items: [
          'I could name my three most important values without much thought.',
          'I know what I would refuse to do, even for money or approval.',
          'When I picture a life well lived, the picture is fairly clear.',
          ['I often feel unsure what actually matters to me.', true],
        ],
      },
      {
        id: 'alignment',
        label: 'Living them',
        description: 'How you spend your time and energy matches what you say matters.',
        tip: 'Compare last week\'s calendar with your top three values. Move one hour toward the biggest gap.',
        items: [
          'How I spend my time reflects what I say matters to me.',
          'I make choices I would be proud to explain to someone I respect.',
          ['I often say yes to things that pull me away from my priorities.', true],
          'My days feel connected to something I care about.',
        ],
      },
      {
        id: 'steering',
        label: 'Using them to decide',
        description: 'Your values guide you when choices are hard or other people push back.',
        tip: 'Next time you are stuck, ask: which option would the person I want to be choose?',
        items: [
          'When choices are hard, I use my values to decide.',
          'I can tolerate someone\'s disappointment when I act on my values.',
          ['My priorities change depending on who I am with.', true],
          'I notice quickly when something conflicts with my values.',
        ],
      },
    ],
    thirds: [
      { label: 'Values still forming', description: 'what matters to you is not yet clear or not yet guiding your days' },
      { label: 'Values partly clear', description: 'you know a good part of what matters, and live some of it' },
      { label: 'Clear and lived values', description: 'you know what matters and your choices mostly follow it' },
    ],
  },
  {
    index: 5,
    slug: 'emotional-awareness-test',
    title: 'Emotional awareness',
    description: 'How well you notice, name, and respond to your emotions.',
    category: 'Emotions',
    tone: 'reflective',
    depth: 'medium',
    minutes: 5,
    higherIs: 'better',
    scale: 'agree',
    domains: [
      {
        id: 'noticing',
        label: 'Noticing',
        description: 'You catch emotions as they arise, including in your body.',
        tip: 'Set three random phone reminders a day that just ask: what am I feeling right now?',
        items: [
          'I notice changes in my mood as they happen.',
          'I can tell when my body is reacting to stress, like a tight chest or a clenched jaw.',
          ['I often realise hours later that something upset me.', true],
          'I can usually tell what triggered a strong feeling.',
        ],
      },
      {
        id: 'naming',
        label: 'Naming',
        description: 'You have precise words for what you feel.',
        tip: 'Use the emotion wheel tool once a day for a week to widen your vocabulary.',
        items: [
          'I have words for more feelings than good, bad, or stressed.',
          'I can tell the difference between being sad, disappointed, and lonely.',
          ['When someone asks how I feel, I often do not know.', true],
          'I can describe my feelings to someone I trust.',
        ],
      },
      {
        id: 'responding',
        label: 'Responding',
        description: 'You can feel strongly without being pushed around by it.',
        tip: 'When a strong feeling hits, take ten slow breaths before you reply, send, or decide.',
        items: [
          'I can feel a strong emotion without acting on it straight away.',
          'I know a few things that reliably help me calm down.',
          ['My emotions often push me into things I later regret.', true],
          'I can let a feeling pass without needing to fix it immediately.',
        ],
      },
    ],
    thirds: [
      { label: 'Awareness developing', description: 'emotions often arrive before you can see or name them' },
      { label: 'Solid awareness', description: 'you usually notice and name what you feel, with some blind spots' },
      { label: 'Strong awareness', description: 'you notice, name, and respond to emotions with real skill' },
    ],
  },
  {
    index: 6,
    slug: 'social-battery-test',
    title: 'Social battery',
    description: 'Whether people or solitude recharge you — measured separately, because many people need both.',
    category: 'Social energy',
    tone: 'fun',
    depth: 'quick',
    minutes: 3,
    higherIs: 'neutral',
    scale: 'agree',
    domains: [
      {
        id: 'people',
        label: 'Charged by people',
        description: 'Time with others tends to give you energy rather than take it.',
        tip: 'Schedule social time on purpose when you feel flat; it is more likely to lift you than rest alone.',
        items: [
          'Being around people usually gives me energy.',
          'After a lively evening out, I feel energised rather than drained.',
          'I think best when I can talk ideas through with others.',
          'A weekend alone would leave me restless.',
          'I enjoy meeting new people at events.',
        ],
      },
      {
        id: 'solitude',
        label: 'Charged by solitude',
        description: 'Quiet time alone is how you refill.',
        tip: 'Block recovery time after big social days before the week fills up, not after you are already drained.',
        items: [
          'I need quiet time alone to recharge after socialising.',
          'Too many plans in a row leave me exhausted.',
          'I look forward to evenings with nothing scheduled.',
          'I prefer one-to-one conversations to group settings.',
          'I can enjoy a whole day by myself.',
        ],
      },
    ],
    profiles: [
      { label: 'Recharges with people', description: 'People are your power source. Long stretches alone can leave you restless or low, so plan company into hard weeks.', when: { people: 'high', solitude: 'low' } },
      { label: 'Recharges in solitude', description: 'Quiet time is how you refill. Socialising can be lovely, but it costs energy, so pace it and protect recovery time.', when: { people: 'low', solitude: 'high' } },
      { label: 'Flexible battery', description: 'You draw energy from both people and solitude, depending on the day. The skill is noticing which one you need right now.', when: { people: 'high', solitude: 'high' } },
      { label: 'Running low right now', description: 'Neither people nor time alone seem to recharge you at the moment. That can point to general depletion rather than a social style — worth a check-in or the burnout check.', when: { people: 'low', solitude: 'low' } },
    ],
  },
  {
    index: 7,
    slug: 'motivation-style-test',
    title: 'Motivation style',
    description: 'What actually gets you moving: interest, mastery, other people, structure, or purpose.',
    category: 'Focus & motivation',
    tone: 'reflective',
    depth: 'quick',
    minutes: 4,
    higherIs: 'neutral',
    scale: 'agree',
    domains: [
      {
        id: 'interest',
        label: 'Interest',
        description: 'Curiosity and enjoyment are your main fuel; boredom is your main enemy.',
        tip: 'Attach a boring task to something you enjoy — a podcast, a nice place, a new method.',
        items: ['I work hardest on things I find genuinely interesting.', 'Curiosity gets me started more than rewards do.', 'I lose steam quickly when a task bores me.'],
      },
      {
        id: 'mastery',
        label: 'Mastery',
        description: 'Getting better is its own reward; visible progress keeps you going.',
        tip: 'Track one skill with a simple log so you can see improvement week by week.',
        items: ['Getting better at something is a reward in itself.', 'I like tracking my progress over time.', 'I enjoy practising a skill until it feels effortless.'],
      },
      {
        id: 'people',
        label: 'Other people',
        description: 'Commitments, feedback, and someone counting on you make you follow through.',
        tip: 'Tell one person your goal and when you will report back.',
        items: ['Praise or feedback from others pushes me to do more.', 'I work harder when someone is counting on me.', 'Public commitments help me follow through.'],
      },
      {
        id: 'structure',
        label: 'Structure',
        description: 'Deadlines, schedules, and clear rules turn intention into action for you.',
        tip: 'Make your own deadlines real: put them in a calendar with a specific time, not just a date.',
        items: ['I get the most done when a deadline is close.', 'Clear rules and schedules help me start.', 'Without an external plan, I tend to drift.'],
      },
      {
        id: 'purpose',
        label: 'Purpose',
        description: 'You commit when you can see why a task matters and who it helps.',
        tip: 'Before a dull task, write one line on who benefits when it is done.',
        items: ['I keep going when I can see how my work helps someone.', 'I need to know why a task matters before I commit.', 'Meaningless busywork drains my motivation quickly.'],
      },
    ],
  },
  {
    index: 8,
    slug: 'habit-loop-test',
    title: 'Habit system check',
    description: 'How well your habits are set up: knowing your cues, shaping your environment, staying consistent, and recovering from slips.',
    category: 'Habits & discipline',
    tone: 'reflective',
    depth: 'quick',
    minutes: 4,
    higherIs: 'better',
    scale: 'agree',
    domains: [
      {
        id: 'cues',
        label: 'Cue awareness',
        description: 'You know what sets your habits off, good and bad.',
        tip: 'Use the habit loop analyzer on one habit you want to change.',
        items: ['I know what usually triggers my unwanted habits.', 'I can name the time or place where my best habits happen.', ['My bad habits often happen on autopilot.', true]],
      },
      {
        id: 'environment',
        label: 'Environment design',
        description: 'Your surroundings make good habits easy and bad ones awkward.',
        tip: 'Move one temptation out of sight and one useful item into plain view today.',
        items: ['I set up my space so good habits are the easy option.', 'I remove temptations instead of relying on willpower.', 'I keep what I need for my habits in plain sight.'],
      },
      {
        id: 'consistency',
        label: 'Consistency',
        description: 'Your habits survive low-energy days because they are small and anchored.',
        tip: 'Define a two-minute version of your key habit for bad days.',
        items: ['I do my key habits even on low-energy days, in a smaller form.', 'My habits are tied to things I already do every day.', ['I start new habits strong, but they fade within weeks.', true]],
      },
      {
        id: 'recovery',
        label: 'Recovery',
        description: 'A missed day does not become a missed month.',
        tip: 'Adopt a "never miss twice" rule: one skip is fine, two in a row is the thing to avoid.',
        items: ['After missing a day, I get back on track quickly.', ['One slip makes me feel like giving up entirely.', true], 'I treat setbacks as information rather than failure.'],
      },
    ],
    thirds: [
      { label: 'Fragile habit system', description: 'your habits rely mostly on willpower and break easily' },
      { label: 'Working habit system', description: 'some parts are solid; one or two weak spots let habits slip' },
      { label: 'Strong habit system', description: 'your habits are designed to survive real life' },
    ],
  },
  {
    index: 9,
    slug: 'self-esteem-reflection-test',
    title: 'Self-worth reflection',
    description: 'Three sides of how you relate to yourself: your sense of worth, how kind you are to yourself, and how much you depend on others\' approval.',
    category: 'Self-esteem',
    tone: 'reflective',
    depth: 'medium',
    minutes: 5,
    higherIs: 'better',
    scale: 'agree',
    domains: [
      {
        id: 'worth',
        label: 'Sense of worth',
        description: 'You feel fundamentally okay as a person, even on bad days.',
        tip: 'Each evening this week, write one thing you did that you respect — not achieved, respected.',
        items: ['I feel I am a person of value, even on bad days.', 'I can accept compliments without brushing them off.', ['I often feel I am not good enough.', true], 'I can list things I genuinely like about myself.'],
      },
      {
        id: 'kindness',
        label: 'Self-kindness',
        description: 'You treat your own mistakes with the patience you would show a friend.',
        tip: 'When you catch harsh self-talk, ask what you would say to a friend in the same spot, and say that.',
        items: ['When I fail, I talk to myself the way I would to a friend.', 'I can forgive myself for mistakes.', ['I am much harsher with myself than with others.', true], 'I take care of my needs without feeling guilty.'],
      },
      {
        id: 'independence',
        label: 'Independence from approval',
        description: 'Your sense of yourself holds even when others disagree or are unimpressed.',
        tip: 'Make one small choice this week purely because you like it, and tell no one.',
        items: [['My mood depends heavily on what others think of me.', true], ['I compare myself to others and come out worse.', true], 'I can disagree with people without fearing rejection.', 'I can make a decision others disagree with and still feel okay.'],
      },
    ],
    thirds: [
      { label: 'Shaky self-worth', description: 'your sense of yourself is easily knocked and often harsh' },
      { label: 'Mixed self-worth', description: 'steady in some areas, fragile in others' },
      { label: 'Steady self-worth', description: 'you mostly feel okay about yourself and treat yourself fairly' },
    ],
  },
  {
    index: 10,
    slug: 'career-direction-test',
    title: 'Career interests',
    description: 'Which kinds of work draw you most, using the six interest areas from Holland\'s widely used career model.',
    category: 'Career & values',
    tone: 'reflective',
    depth: 'quick',
    minutes: 3,
    higherIs: 'neutral',
    scale: 'agree',
    domains: [
      { id: 'building', label: 'Building', description: 'Hands-on, practical work with tools, materials, machines, or the outdoors — engineering, trades, hardware, agriculture.', tip: 'Look for roles where your work leaves something physical behind.', items: ['I enjoy working with tools, machines, or physical materials.', 'I like seeing a tangible result I made with my own hands.'] },
      { id: 'investigating', label: 'Investigating', description: 'Analysing, researching, and solving complex problems — science, data, medicine, software.', tip: 'Seek work where the hardest part is figuring something out.', items: ['I enjoy figuring out how complex things work.', 'I like solving problems with data, logic, or experiments.'] },
      { id: 'creating', label: 'Creating', description: 'Original expression through design, writing, art, media, or music.', tip: 'Protect some creative ownership in any role, even a technical one.', items: ['I enjoy expressing ideas through design, writing, art, or music.', 'I prefer work with room for originality over fixed procedures.'] },
      { id: 'helping', label: 'Helping', description: 'Teaching, caring, counselling, or supporting people directly.', tip: 'Look for roles where you see the people you help, not just numbers.', items: ['I feel fulfilled when I help someone learn or feel better.', 'I am drawn to work that involves caring for or teaching people.'] },
      { id: 'leading', label: 'Leading', description: 'Persuading, organising people, selling ideas, and starting things — management, entrepreneurship, law, sales.', tip: 'Volunteer to lead one small project to test how it feels.', items: ['I enjoy persuading people and taking the lead on projects.', 'Starting something new or selling an idea excites me.'] },
      { id: 'organizing', label: 'Organising', description: 'Bringing order to information, money, and processes — finance, operations, administration, quality.', tip: 'Roles with clear systems to improve will likely suit you better than open-ended chaos.', items: ['I like bringing order to information, money, or processes.', 'I enjoy work with clear steps, accuracy, and follow-through.'] },
    ],
  },
  {
    index: 11,
    slug: 'thinking-style-test',
    title: 'Thinking style',
    description: 'Whether you lean analytical or intuitive, and big-picture or detail-focused.',
    category: 'Thinking style',
    tone: 'fun',
    depth: 'quick',
    minutes: 3,
    higherIs: 'neutral',
    scale: 'agree',
    domains: [
      { id: 'analytical', label: 'Analytical', description: 'You break problems into steps and trust evidence over impressions.', tip: 'Pair up with an intuitive thinker on early ideas so you do not over-analyse too soon.', items: ['I like to break problems down into steps.', 'I trust conclusions more when I can see the evidence.', 'I enjoy finding the flaw in an argument.'] },
      { id: 'intuitive', label: 'Intuitive', description: 'You read situations quickly and often know the answer before you can explain it.', tip: 'Write your gut call down, then check it later — you will learn when to trust it.', items: ['My first impression of a situation is usually right.', 'I often know the answer before I can explain why.', 'I pay close attention to hunches.'] },
      { id: 'bigPicture', label: 'Big picture', description: 'Ideas, patterns, and possibilities energise you more than execution.', tip: 'Find a detail-minded partner for follow-through.', items: ['I am drawn to ideas, patterns, and possibilities.', 'I get bored once the overall concept is clear.', 'I like connecting topics that seem unrelated.'] },
      { id: 'detail', label: 'Detail', description: 'You notice what others miss and like to finish things properly.', tip: 'Ask "what is this for?" before polishing, so effort goes where it counts.', items: ['I notice small errors other people miss.', 'I prefer concrete facts to abstract theories.', 'I like to finish one thing completely before starting another.'] },
    ],
  },
  {
    index: 12,
    slug: 'decision-making-style-test',
    title: 'Decision-making style',
    description: 'Your default way of making decisions, based on five styles described in decision-making research: rational, intuitive, dependent, avoidant, and spontaneous.',
    category: 'Thinking style',
    tone: 'reflective',
    depth: 'quick',
    minutes: 4,
    higherIs: 'neutral',
    scale: 'agree',
    domains: [
      { id: 'rational', label: 'Rational', description: 'You gather information and compare options methodically.', tip: 'Set a time limit so thoroughness does not turn into delay.', items: ['I gather information before making important decisions.', 'I compare options carefully against what I want.', 'I make decisions in a logical, step-by-step way.'] },
      { id: 'intuitive', label: 'Intuitive', description: 'You go with what feels right and trust your inner sense.', tip: 'For big, irreversible decisions, add one deliberate check of the facts.', items: ['I go with my gut on important decisions.', 'When a decision feels right, I do not need to justify it.', 'I rely on my feelings to know which choice is mine.'] },
      { id: 'dependent', label: 'Dependent', description: 'You lean on other people\'s advice and agreement to feel sure.', tip: 'Decide privately first, then ask for input, so others refine your choice rather than make it.', items: ['I rarely make important decisions without consulting others.', 'I like having someone point me in the right direction.', 'I feel better about a decision when people I trust agree.'] },
      { id: 'avoidant', label: 'Avoidant', description: 'You put decisions off because facing them is uncomfortable.', tip: 'Shrink the decision: what is the smallest reversible step you could take today?', items: ['I put off decisions because thinking about them makes me uneasy.', 'I wait until the last moment to decide.', 'I hope problems will resolve themselves so I do not have to choose.'] },
      { id: 'spontaneous', label: 'Spontaneous', description: 'You decide fast and adjust as you go.', tip: 'Sleep on anything expensive or hard to undo.', items: ['I often decide on the spur of the moment.', 'I make quick decisions and adjust later.', 'Weighing options for too long frustrates me.'] },
    ],
  },
  {
    index: 13,
    slug: 'conflict-style-test',
    title: 'Conflict style',
    description: 'How you tend to handle disagreement, across the five classic conflict modes: competing, collaborating, compromising, avoiding, and accommodating.',
    category: 'Relationships',
    tone: 'reflective',
    depth: 'quick',
    minutes: 4,
    higherIs: 'neutral',
    scale: 'agree',
    domains: [
      { id: 'competing', label: 'Competing', description: 'You stand firm and push for your position. Useful in emergencies and on principle; costly when overused in close relationships.', tip: 'In your next disagreement, ask one genuine question before restating your view.', items: ['In a disagreement, I push firmly for my position.', 'I find it hard to let a point go when I am sure I am right.', 'Winning the argument matters to me.'] },
      { id: 'collaborating', label: 'Collaborating', description: 'You look for a solution that fully works for both sides. Great for important issues; slow for small ones.', tip: 'Save the full problem-solving effort for things that matter; let small ones go faster.', items: ['I try to find a solution that fully works for both of us.', 'I want to understand the other person\'s real concerns.', 'I am willing to keep talking until we find something better than either first idea.'] },
      { id: 'compromising', label: 'Compromising', description: 'You meet in the middle quickly. Efficient and fair, though sometimes both people leave half-satisfied.', tip: 'Before splitting the difference, check whether a better option exists for both of you.', items: ['I look for a middle ground quickly.', 'I am happy to give a little if they give a little.', 'Splitting the difference usually seems fair to me.'] },
      { id: 'avoiding', label: 'Avoiding', description: 'You step away from conflict. Wise for trivial issues or when emotions are high; harmful when important things stay unsaid.', tip: 'Use the conflict reflection tool to prepare one conversation you have been putting off.', items: ['I change the subject when tension rises.', 'I would rather let something go than have an uncomfortable conversation.', 'I wait for conflicts to blow over.'] },
      { id: 'accommodating', label: 'Accommodating', description: 'You give way to keep the peace. Generous and relationship-protecting; risky when your own needs keep disappearing.', tip: 'Notice one moment this week where you give in automatically, and state your preference first.', items: ['I give in to keep the peace.', 'The relationship matters more to me than getting my way.', 'I put other people\'s needs ahead of mine in a disagreement.'] },
    ],
  },
  {
    index: 14,
    slug: 'love-language-inspired-test',
    title: 'Connection preferences',
    description: 'Which kinds of care make you feel most loved. Inspired by the popular "five love languages" idea; this is not the official quiz.',
    category: 'Relationships',
    tone: 'fun',
    depth: 'quick',
    minutes: 3,
    higherIs: 'neutral',
    scale: 'agree',
    domains: [
      { id: 'words', label: 'Words', description: 'Appreciation, encouragement, and kind words land deeply with you.', tip: 'Tell people close to you that a specific compliment means more to you than a general one.', items: ['Hearing "I appreciate you" means a lot to me.', 'A thoughtful message can make my whole day.', 'Harsh words stay with me for a long time.'] },
      { id: 'time', label: 'Time together', description: 'Undivided attention is how you feel cared for.', tip: 'Ask for one phone-free hour with someone you love this week.', items: ['Undivided attention matters more to me than grand gestures.', 'I feel closest to people when we do things together.', 'Being half-listened to while someone is on their phone hurts.'] },
      { id: 'help', label: 'Practical help', description: 'Actions that lighten your load say "I care" most clearly.', tip: 'Name one concrete thing that would help you, instead of hoping someone notices.', items: ['I feel loved when someone takes a chore off my plate.', 'Actions speak louder than words to me.', 'A broken promise to help bothers me more than forgotten words.'] },
      { id: 'gifts', label: 'Thoughtful gifts', description: 'Small, meaningful tokens show you were on someone\'s mind.', tip: 'Let people know it is the thought you value, not the price.', items: ['A small, thoughtful gift shows me someone was thinking of me.', 'I remember the meaning behind gifts for years.', 'A forgotten special occasion hurts.'] },
      { id: 'touch', label: 'Physical closeness', description: 'Hugs and physical presence make you feel safe and connected.', tip: 'Tell your partner or family what kind of physical affection feels good to you.', items: ['A hug can change my mood.', 'Sitting close to someone I love makes me feel secure.', 'I notice when physical affection is missing.'] },
    ],
  },
  {
    index: 15,
    slug: 'inner-critic-test',
    title: 'Inner critic',
    description: 'How loud your inner critic is, and whether it speaks through harsh self-talk, perfectionism, or comparison.',
    category: 'Self-esteem',
    tone: 'reflective',
    depth: 'medium',
    minutes: 5,
    higherIs: 'worse',
    scale: 'often',
    domains: [
      {
        id: 'harshness',
        label: 'Harsh self-talk',
        description: 'Your inner voice is quick to blame and slow to credit.',
        tip: 'Give your critic a silly name. It is easier to argue with "Gerald" than with yourself.',
        items: ['When I make a mistake, I call myself names in my head.', 'I tell myself I should have known better.', 'My self-talk would sound cruel if I said it to a friend.', 'I find it hard to give myself credit.'],
      },
      {
        id: 'perfectionism',
        label: 'Perfectionism',
        description: 'Anything short of perfect feels like failure, so you redo, delay, or avoid.',
        tip: 'Pick one task this week to finish at "good enough" on purpose, and notice that nothing bad happens.',
        items: ['Anything less than perfect feels like failure.', 'I redo things that are already good enough.', 'I avoid starting tasks I cannot do perfectly.', 'I hold myself to standards I would never expect of others.'],
      },
      {
        id: 'comparison',
        label: 'Comparison',
        description: 'Your worth gets measured against other people\'s highlights.',
        tip: 'Mute or unfollow three accounts that reliably leave you feeling behind.',
        items: ['I measure my worth against other people\'s achievements.', 'Social media leaves me feeling behind.', 'Other people\'s success makes me feel smaller.', 'I assume others judge me as harshly as I judge myself.'],
      },
    ],
    thirds: [
      { label: 'Quiet inner critic', description: 'you can usually treat yourself fairly' },
      { label: 'Noticeable inner critic', description: 'harsh self-judgement shows up often enough to wear you down' },
      { label: 'Loud inner critic', description: 'self-criticism is a constant companion and likely costs you a lot of energy' },
    ],
  },
];

export const reflectionTestsData: TestDefinition[] = specs.map(buildReflectionTest);
