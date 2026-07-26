import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export function Footer() {
  const practiceLinks = [
    { href: routes.tests, label: 'Test library' },
    { href: routes.checkIn, label: 'Check-in' },
    { href: routes.savedThoughts, label: 'Saved thoughts' },
    { href: routes.dashboard, label: 'Insight dashboard' },
  ];

  const moreLinks = [
    { href: routes.collections, label: 'Collections' },
    { href: routes.reflectionTools, label: 'Reflection tools' },
    { href: routes.about, label: 'About' },
    { href: routes.privacy, label: 'Privacy' },
  ];

  return (
    <footer className='mt-16 pb-24 pt-4 md:pb-10'>
      <div className='mx-auto max-w-6xl px-4 md:px-6'>
        <div className='relative overflow-hidden rounded-[1.9rem] border border-[var(--color-panel-border)] bg-[var(--color-panel)] shadow-[0_18px_48px_rgba(20,32,43,0.07)]'>
          <div className='absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(45,106,103,0.45),transparent)] opacity-70' />
          <div className='grid gap-8 px-5 py-6 md:px-7 lg:grid-cols-[1.1fr_0.65fr_0.65fr] lg:gap-10 lg:py-7'>
            <div className='space-y-4 text-[var(--color-text)]'>
              <Logo compact />
              <div className='max-w-lg space-y-2.5'>
                <p className='font-heading text-[2rem] leading-[1.06] text-[var(--color-text-strong)]'>
                  Notice patterns earlier and leave with something usable.
                </p>
                <p className='text-sm leading-7 text-[var(--color-muted)]'>{siteConfig.tagline}</p>
              </div>
              <div className='flex flex-wrap gap-2.5'>
                <Link
                  href={routes.tests}
                  className='inline-flex items-center gap-2 rounded-full bg-[var(--color-text-strong)] px-4 py-2 text-sm font-semibold dark:text-[var(--color-surface)] no-underline transition hover:translate-y-[-1px] hover:shadow-[var(--shadow-card)] text-white'
                >
                  Explore tests
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href={routes.learn}
                  className='inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)]'
                >
                  Read and learn
                </Link>
              </div>
            </div>

            <div className='space-y-3 lg:pl-6'>
              <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>Practice</p>
              <div className='grid gap-2.5 text-sm text-[var(--color-text)]'>
                {practiceLinks.map((link) => (
                  <Link key={link.href} href={link.href} className='transition hover:text-[var(--color-primary)]'>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className='space-y-3'>
              <p className='text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]'>More</p>
              <div className='grid gap-2.5 text-sm text-[var(--color-text)]'>
                {moreLinks.map((link) => (
                  <Link key={link.href} href={link.href} className='transition hover:text-[var(--color-primary)]'>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className='border-t border-[var(--color-panel-border)] px-5 py-3.5 text-sm text-[var(--color-muted)] md:px-7'>
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
              <p>&copy; {new Date().getFullYear()} {siteConfig.name}. Built for reflection, not diagnosis.</p>
              <p>Private by default. Useful when used honestly.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

