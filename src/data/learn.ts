export interface LearnSection {
  heading?: string;
  paragraphs: string[];
  /** Short practical steps, rendered as a list after the paragraphs. */
  steps?: string[];
}

export interface LearnArticle {
  /** Used in the URL. */
  id: string;
  title: string;
  topic: string;
  summary: string;
  minutes: number;
  /** Test slugs. */
  relatedTests: string[];
  /** Reflection tool ids. */
  relatedTools: string[];
  sections: LearnSection[];
}

export const learnData: LearnArticle[] = [
  {
    id: 'personality-as-pattern',
    title: 'Personality as pattern, not label',
    topic: 'Personality',
    summary: 'Use personality ideas as language for reflection, not identity traps.',
    minutes: 4,
    relatedTests: ['ipip-big-five-50', 'social-battery-test'],
    relatedTools: ['values-sorter'],
    sections: [
      {
        paragraphs: [
          'Personality tests are popular because they hand us words for things we already half-know about ourselves. "I am an introvert" can be a relief: it explains why parties leave you drained. The risk is when the word stops describing and starts deciding — "I am an introvert, so I do not do presentations."',
          'The more useful way to read any trait score is as a tendency: what you do more often, more easily, or with less effort. It says little about what you can do.',
        ],
      },
      {
        heading: 'Traits are dimensions, not boxes',
        paragraphs: [
          'Most well-researched models, like the Big Five, measure traits on a continuum. Very few people sit at the extremes; most sit somewhere in the middle on most traits. Type-based quizzes that sort you into one of a few boxes throw that information away, which is why two people with the same "type" can feel nothing alike.',
          'Traits also shift. On average, people become somewhat more conscientious and emotionally stable across adulthood, and context matters a lot: you may be talkative with friends and quiet at work.',
        ],
      },
      {
        heading: 'Using a result well',
        paragraphs: ['Treat a trait profile as a map of where things are easy and where they cost you energy.'],
        steps: [
          'Notice where a trait helps you, and design more of your week around it.',
          'Notice where it costs you, and decide whether that cost is worth paying for something you value.',
          'Retake in a few months; if a score moves, ask what changed.',
        ],
      },
    ],
  },
  {
    id: 'attachment-in-daily-moments',
    title: 'Attachment in daily moments',
    topic: 'Attachment',
    summary: 'Attachment shows up in conflict, closeness, and repair conversations.',
    minutes: 4,
    relatedTests: ['attachment-style-test'],
    relatedTools: ['conflict-reflection', 'why-feel-this'],
    sections: [
      {
        paragraphs: [
          'Attachment theory started with how infants respond to separation from caregivers. In adults, it is usually described with two dimensions: anxiety (how much you worry about being left or not loved enough) and avoidance (how uncomfortable you are with closeness and depending on others).',
          'These patterns rarely announce themselves. They show up in small moments: a reply that takes too long, a partner who wants to talk about "us", a friend who cancels plans.',
        ],
      },
      {
        heading: 'What it looks like',
        paragraphs: [
          'Higher anxiety often feels like scanning for signs of distance and needing reassurance to settle. Higher avoidance often feels like wanting space exactly when things get close, or keeping feelings private to stay in control.',
          'Neither is a flaw. Both are strategies that once made sense. They become a problem when they run on autopilot and create the very distance or pressure you fear.',
        ],
      },
      {
        heading: 'Moving toward security',
        paragraphs: ['Attachment patterns are not fixed. They tend to soften through steady relationships and deliberate practice.'],
        steps: [
          'Name the need directly ("I could use a check-in tonight") instead of testing whether someone notices.',
          'If you tend to withdraw, try saying "I need an hour, then I want to talk" instead of going quiet.',
          'After a conflict, aim for repair, not a perfect conversation: "I got defensive earlier. Can we try again?"',
        ],
      },
    ],
  },
  {
    id: 'stress-is-a-signal',
    title: 'Stress is a signal',
    topic: 'Stress',
    summary: 'Stress patterns can guide better pacing, boundaries, and recovery.',
    minutes: 4,
    relatedTests: ['pss-perceived-stress-scale', 'burnout-reflection-test'],
    relatedTools: ['energy-drain-finder'],
    sections: [
      {
        paragraphs: [
          'Stress is your body preparing to deal with a demand: heart rate up, attention narrowed, energy mobilised. In short bursts, that response is useful. It helps you meet a deadline or handle an emergency.',
          'Problems start when the response stays switched on, with no recovery between demands. Sleep gets lighter, patience gets shorter, and small things start to feel big.',
        ],
      },
      {
        heading: 'Reading the signal',
        paragraphs: ['Instead of only trying to "reduce stress", ask what it is pointing at.'],
        steps: [
          'Is the demand too large, or is recovery too small? They need different fixes.',
          'Is it one source or many small ones? Many small drains are easier to cut than one big one.',
          'Is it about control? Perceived stress rises sharply when things feel unpredictable or out of your hands.',
        ],
      },
      {
        heading: 'Recovery counts as much as effort',
        paragraphs: [
          'Recovery is not laziness; it is the second half of performance. Short, regular breaks, genuinely restful evenings, movement, and sleep all bring the stress response back down.',
          'If stress has stayed high for weeks and is affecting your sleep, appetite, or mood, it is worth talking to a doctor or counsellor.',
        ],
      },
    ],
  },
  {
    id: 'habit-loops-that-stick',
    title: 'Habit loops that actually stick',
    topic: 'Habits',
    summary: 'Small cues and rewards beat large motivation spikes.',
    minutes: 4,
    relatedTests: ['habit-loop-test', 'motivation-style-test'],
    relatedTools: ['habit-loop-analyzer'],
    sections: [
      {
        paragraphs: [
          'A habit is a behaviour that runs with little conscious decision. It usually has three parts: a cue (a time, place, feeling, or preceding action), a routine (the behaviour), and a reward (what the behaviour gives you).',
          'Habits form through repetition in a stable context. That is why "go to the gym more" rarely sticks, while "after I drop my bag at home, I put on my running shoes" often does.',
        ],
      },
      {
        heading: 'Design beats willpower',
        paragraphs: ['Willpower is unreliable, especially when you are tired or stressed. Environment is reliable.'],
        steps: [
          'Make the good habit obvious and easy: lay things out in advance, remove steps.',
          'Make the unwanted habit awkward: move the phone charger out of the bedroom, keep snacks out of sight.',
          'Anchor new habits to something you already do every day.',
          'Shrink the habit until it is almost too easy, then grow it once it is automatic.',
        ],
      },
      {
        heading: 'Slips are part of the process',
        paragraphs: [
          'Missing one day barely affects how strongly a habit forms. What matters is not letting one miss become a pattern. A simple rule, "never miss twice", protects most habits better than a perfect streak.',
        ],
      },
    ],
  },
  {
    id: 'emotions-as-data',
    title: 'Emotions as data',
    topic: 'Emotions',
    summary: 'Naming your emotions gives you more choices in how to respond.',
    minutes: 3,
    relatedTests: ['emotional-awareness-test'],
    relatedTools: ['emotion-wheel', 'why-feel-this'],
    sections: [
      {
        paragraphs: [
          'Emotions carry information. Anxiety points at something that matters and feels uncertain. Anger often points at a boundary that was crossed. Sadness points at a loss. The feeling is not always accurate, but it is always telling you something about what you care about.',
        ],
      },
      {
        heading: 'Precision helps',
        paragraphs: [
          'People who can name their feelings precisely — "disappointed and a bit embarrassed" rather than just "bad" — tend to handle them better. A precise label suggests a specific response: disappointment might call for adjusting expectations, embarrassment for a little self-compassion.',
          'Naming a feeling also creates a small gap between the feeling and your reaction, and that gap is where choice lives.',
        ],
      },
      {
        heading: 'A simple practice',
        paragraphs: [],
        steps: [
          'Pause and ask: what am I feeling, and where do I feel it in my body?',
          'Find the most precise word you can. The emotion wheel tool can help.',
          'Ask what the feeling might be pointing at, and what you need.',
          'Choose one small response, even if it is just waiting before you reply.',
        ],
      },
    ],
  },
  {
    id: 'motivation-beyond-mood',
    title: 'Motivation beyond mood',
    topic: 'Motivation',
    summary: 'Reliable systems reduce dependence on perfect motivation.',
    minutes: 3,
    relatedTests: ['motivation-style-test'],
    relatedTools: ['habit-loop-analyzer'],
    sections: [
      {
        paragraphs: [
          'Waiting to feel motivated is a trap, because motivation often comes after starting, not before. Once you are a few minutes into a task, resistance usually drops.',
          'Different people are fuelled by different things: interest, mastery, other people, deadlines, or purpose. Knowing your main fuel lets you add it deliberately to tasks that lack it.',
        ],
      },
      {
        heading: 'Make starting cheap',
        paragraphs: [],
        steps: [
          'Define the next physical action, not the whole project ("open the document and write one heading").',
          'Commit to five minutes; you are allowed to stop after that.',
          'Add your fuel: a deadline you tell someone about, a progress log, or a note on who benefits.',
          'Remove one source of friction before you need to start.',
        ],
      },
      {
        heading: 'When motivation is gone for weeks',
        paragraphs: [
          'A long-lasting loss of motivation and pleasure in things you used to enjoy can be a sign of depression or burnout, not a character problem. If that sounds familiar, a PHQ-9 or the burnout check can help you put words to it, and a professional can help further.',
        ],
      },
    ],
  },
  {
    id: 'cognitive-bias-in-self-talk',
    title: 'Cognitive bias in self-talk',
    topic: 'Cognitive bias',
    summary: 'Biases shape conclusions quickly; reflection slows the loop.',
    minutes: 4,
    relatedTests: ['overthinking-test', 'inner-critic-test'],
    relatedTools: ['overthinking-unpacker'],
    sections: [
      {
        paragraphs: [
          'Your mind takes shortcuts. Most of the time they help you move quickly. But when you are stressed or low, the same shortcuts can produce conclusions that feel true and are not.',
        ],
      },
      {
        heading: 'Common thinking traps',
        paragraphs: [],
        steps: [
          'Catastrophising: jumping to the worst possible outcome.',
          'Mind reading: assuming you know what others think of you.',
          'All-or-nothing: if it is not perfect, it is a failure.',
          'Personalising: assuming you caused something you did not control.',
          'Should statements: rigid rules about how you or others must behave.',
        ],
      },
      {
        heading: 'Slowing the loop',
        paragraphs: [
          'You do not have to argue yourself into positive thinking. The aim is accurate thinking. Write the thought down, name the trap if there is one, and ask what a fair friend would point out. Often the thought shrinks once it is on paper.',
          'The overthinking unpacker walks you through exactly this.',
        ],
      },
    ],
  },
  {
    id: 'self-esteem-and-standards',
    title: 'Self-esteem and standards',
    topic: 'Self-esteem',
    summary: 'Healthy self-esteem grows from honest standards and self-respect.',
    minutes: 4,
    relatedTests: ['rosenberg-self-esteem-scale', 'self-esteem-reflection-test', 'inner-critic-test'],
    relatedTools: ['values-sorter'],
    sections: [
      {
        paragraphs: [
          'Healthy self-esteem is not thinking you are better than others. It is a steady sense that you are basically okay and worth treating well, even when you fail.',
          'Self-esteem built only on achievement or approval is fragile, because it rises and falls with every result and every opinion.',
        ],
      },
      {
        heading: 'Standards versus harshness',
        paragraphs: [
          'Many people fear that being kinder to themselves will make them lazy. Research on self-compassion points the other way: people who respond to failure with understanding are, on average, more likely to try again and take responsibility, because failure feels less threatening.',
          'You can keep high standards and still speak to yourself like someone on your own side.',
        ],
      },
      {
        heading: 'Small practices',
        paragraphs: [],
        steps: [
          'Keep promises to yourself, starting small. Self-trust grows from evidence.',
          'Notice harsh self-talk and ask what you would say to a friend in the same spot.',
          'Act on your values even when no one is watching, and let that count.',
        ],
      },
    ],
  },
  {
    id: 'burnout-early-signs',
    title: 'Burnout early signs',
    topic: 'Burnout',
    summary: 'Burnout starts quietly with repeated depletion and reduced recovery.',
    minutes: 4,
    relatedTests: ['burnout-reflection-test', 'pss-perceived-stress-scale'],
    relatedTools: ['energy-drain-finder'],
    sections: [
      {
        paragraphs: [
          'Burnout is usually described with three parts: exhaustion that rest does not fix, growing detachment or cynicism about your work, and a sense that you are no longer effective. It builds slowly, which is why it is easy to miss until it is heavy.',
        ],
      },
      {
        heading: 'Early signs to watch',
        paragraphs: [],
        steps: [
          'Weekends no longer feel restorative.',
          'You start dreading messages or tasks you used to handle easily.',
          'You feel irritable or numb about work you once cared about.',
          'Small tasks take a disproportionate effort.',
        ],
      },
      {
        heading: 'What helps',
        paragraphs: [
          'Burnout is rarely solved by individual effort alone; workload, control, fairness, and support at work all matter. Still, some things are within reach: protecting recovery time, reducing the biggest drains, reconnecting with the parts of the work that feel meaningful, and talking honestly with a manager or teacher about load.',
          'If exhaustion is accompanied by persistent low mood, hopelessness, or thoughts of not wanting to be here, please reach out to a professional or a crisis line.',
        ],
      },
    ],
  },
  {
    id: 'values-and-decision-clarity',
    title: 'Values and decision clarity',
    topic: 'Values',
    summary: 'Values turn difficult choices into clearer trade-offs.',
    minutes: 3,
    relatedTests: ['values-clarity-test', 'career-direction-test'],
    relatedTools: ['values-sorter', 'decision-helper'],
    sections: [
      {
        paragraphs: [
          'Values are what you want your life to stand for: honesty, family, growth, freedom. They are different from goals. A goal can be finished; a value is a direction you keep walking in.',
          'Hard decisions are often hard because two values pull in different directions — security and adventure, family and career. Naming the values in conflict does not make the choice easy, but it makes it clear.',
        ],
      },
      {
        heading: 'Turning values into choices',
        paragraphs: [],
        steps: [
          'Pick your top three values with the values sorter.',
          'For a decision, list which values each option serves and which it costs.',
          'Use the decision helper with your values as criteria, weighted by importance.',
          'Choose the option you would be proud to explain in a year, even if it is not the comfortable one.',
        ],
      },
    ],
  },
];
