import { routes } from '@/config/routes';

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
    { href: routes.tests, label: 'Tests' },
    { href: routes.reflectionTools, label: 'Tools' },
    { href: routes.checkIn, label: 'Check-in' },
    { href: routes.dashboard, label: 'Dashboard' },
    { href: routes.savedThoughts, label: 'Thoughts' },
    { href: routes.learn, label: 'Learn' },
  ],
  mobileLinks: [
    { href: routes.home, label: 'Home', icon: 'home' },
    { href: routes.tests, label: 'Tests', icon: 'tests' },
    { href: routes.checkIn, label: 'Check-in', icon: 'check-in' },
    { href: routes.learn, label: 'Learn', icon: 'learn' },
    { href: routes.profile, label: 'Profile', icon: 'profile' },
  ],
};

