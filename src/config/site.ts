import { routes } from '@/config/routes';
import type { MessageKey } from '@/i18n/messages';

export const siteConfig = {
  name: 'Happy Healthy Human',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:27384',
  title: 'Happy Healthy Human | Self-reflection tools',
  description:
    'Self-reflection tools, not diagnosis. Understand patterns and grow intentionally.',
  tagline: 'Reflect with clarity, build healthier patterns, and grow as a happier human.',
  disclaimer:
    'This is for self-reflection only. It is not a diagnosis or medical advice.',
  navLinks: [
    { href: routes.tests, labelKey: 'nav.tests' },
    { href: routes.reflectionTools, labelKey: 'nav.tools' },
    { href: routes.checkIn, labelKey: 'nav.checkIn' },
    { href: routes.dashboard, labelKey: 'nav.dashboard' },
    { href: routes.savedThoughts, labelKey: 'nav.thoughts' },
    { href: routes.learn, labelKey: 'nav.learn' },
  ] satisfies Array<{ href: string; labelKey: MessageKey }>,
  mobileLinks: [
    { href: routes.home, labelKey: 'nav.home', icon: 'home' },
    { href: routes.tests, labelKey: 'nav.tests', icon: 'tests' },
    { href: routes.checkIn, labelKey: 'nav.checkIn', icon: 'checkIn' },
    { href: routes.learn, labelKey: 'nav.learn', icon: 'learn' },
    { href: routes.profile, labelKey: 'nav.profile', icon: 'profile' },
  ] satisfies Array<{ href: string; labelKey: MessageKey; icon: string }>,
};

