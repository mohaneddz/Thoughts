export interface CrisisResource {
  label: string;
  detail: string;
  href?: string;
}

export const crisisResources: CrisisResource[] = [
  { label: 'Immediate danger', detail: 'Call your local emergency number now (911 in the US).' },
  { label: '988 Suicide & Crisis Lifeline', detail: 'Call or text 988 — US & Canada, 24/7.', href: 'tel:988' },
  { label: 'Crisis Text Line', detail: 'Text HOME to 741741 — US, Canada, UK.', href: 'sms:741741?body=HOME' },
  { label: 'Outside the US', detail: 'Find a local crisis line at findahelpline.com.', href: 'https://findahelpline.com' },
];

export const crisisCopy = {
  urgent: {
    title: 'Please reach out for support now',
    body: "Your answers include a signal we take seriously. This tool cannot assess immediate risk — a real person can. Please use one of the resources below now, or contact someone you trust.",
  },
  elevated: {
    title: 'Consider talking to a professional',
    body: 'Your answers suggest this may be worth discussing with a doctor, therapist, or counselor. The resources below are available any time you want to talk it through.',
  },
} as const;
