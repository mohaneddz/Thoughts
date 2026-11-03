export interface CrisisResource {
  label: string;
  detail: string;
  href?: string;
}

export interface CrisisRegion {
  code: string;
  label: string;
  /** One line for tight spaces, e.g. inside the test runner. */
  short: string;
  resources: CrisisResource[];
}

const findAHelpline: CrisisResource = {
  label: 'Find a helpline',
  detail: 'Free, confidential helplines listed by country at findahelpline.com.',
  href: 'https://findahelpline.com',
};

/**
 * Helpline numbers for CA, GB, IE and FR were checked on each service's own site on 2026-11-03;
 * the US entries predate that check, and 112 is the EU-wide emergency number.
 * Countries without a confirmed list fall back to `other` rather than guessing.
 */
export const crisisRegions: CrisisRegion[] = [
  {
    code: 'us',
    label: 'United States',
    short: 'Call or text 988, or call 911 in an emergency.',
    resources: [
      { label: 'Immediate danger', detail: 'Call 911.', href: 'tel:911' },
      { label: '988 Suicide & Crisis Lifeline', detail: 'Call or text 988, 24/7.', href: 'tel:988' },
      { label: 'Crisis Text Line', detail: 'Text HOME to 741741, 24/7.', href: 'sms:741741?body=HOME' },
    ],
  },
  {
    code: 'ca',
    label: 'Canada',
    short: 'Call or text 9-8-8, or call 9-1-1 if your safety is at risk.',
    resources: [
      { label: 'Immediate danger', detail: 'Call 9-1-1.', href: 'tel:911' },
      { label: '9-8-8 Suicide Crisis Helpline', detail: 'Call or text 9-8-8, 24 hours a day, every day.', href: 'tel:988' },
    ],
  },
  {
    code: 'gb',
    label: 'United Kingdom',
    short: 'Call Samaritans free on 116 123, or 999 in an emergency.',
    resources: [
      { label: 'Immediate danger', detail: 'Call 999.', href: 'tel:999' },
      { label: 'Samaritans', detail: 'Call 116 123 free, 24 hours a day, 365 days a year.', href: 'tel:116123' },
      { label: 'Samaritans Welsh Language Line', detail: 'Call 0808 164 0123 free.', href: 'tel:08081640123' },
    ],
  },
  {
    code: 'ie',
    label: 'Ireland',
    short: 'Call Samaritans free on 116 123, or 112 in an emergency.',
    resources: [
      { label: 'Immediate danger', detail: 'Call 112.', href: 'tel:112' },
      { label: 'Samaritans', detail: 'Call 116 123 free, any time.', href: 'tel:116123' },
    ],
  },
  {
    code: 'fr',
    label: 'France',
    short: 'Appelez le 3114 (gratuit, 24h/24), ou le 112 en cas d’urgence.',
    resources: [
      { label: 'Urgence immédiate', detail: 'Appelez le 112.', href: 'tel:112' },
      { label: '3114 — Numéro national de prévention du suicide', detail: 'Gratuit, 24h/24 et 7j/7, partout en France.', href: 'tel:3114' },
    ],
  },
  {
    code: 'other',
    label: 'Another country',
    short: 'Call your local emergency number, or find a helpline at findahelpline.com.',
    resources: [{ label: 'Immediate danger', detail: 'Call your local emergency number now.' }, findAHelpline],
  },
];

export const defaultCrisisRegion = 'other';

/** Best guess from the browser's language tags, e.g. en-GB → gb, fr-CA → ca. */
export function guessCrisisRegion(languages: readonly string[]): string {
  for (const tag of languages) {
    const country = tag.split('-')[1]?.toLowerCase();
    if (country && crisisRegions.some((region) => region.code === country)) return country;
  }
  return defaultCrisisRegion;
}

export function getCrisisRegion(code: string | undefined): CrisisRegion {
  return crisisRegions.find((region) => region.code === code) ?? crisisRegions.find((region) => region.code === defaultCrisisRegion)!;
}

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
