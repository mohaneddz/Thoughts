import { routes } from '@/config/routes';

export const siteConfig = {
  name: 'Happy Healthy Human',
  title: 'Happy Healthy Human | Self-reflection tools',
  description:
    'Self-reflection tools, not diagnosis. Understand patterns and grow intentionally.',
  tagline: 'Reflect with clarity, build healthier patterns, and grow as a happier human.',
  disclaimer:
    'This is for self-reflection only. It is not a diagnosis or medical advice.',
  navLinks: [
    { href: routes.tests, label: 'Tests' },
    { href: routes.checkIn, label: 'Check-in' },
    { href: routes.learn, label: 'Learn' },
    { href: routes.about, label: 'About' },
    { href: routes.privacy, label: 'Privacy' },
  ],
  mobileLinks: [
    { href: routes.home, label: 'Home', icon: 'home' },
    { href: routes.tests, label: 'Tests', icon: 'tests' },
    { href: routes.checkIn, label: 'Check-in', icon: 'check-in' },
    { href: routes.learn, label: 'Learn', icon: 'learn' },
    { href: routes.profile, label: 'Profile', icon: 'profile' },
  ],
};

