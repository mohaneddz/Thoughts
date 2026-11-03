'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';
import { useProfile } from '@/hooks/useProfile';
import { Avatar } from '@/components/common/avatar';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/themeToggle';
import { LanguageSwitcher } from '@/components/common/languageSwitcher';
import { useLocale } from '@/i18n/useLocale';

function ProfileChip({ compact = false }: { compact?: boolean }) {
  const { profile, hasProfile, displayName } = useProfile();
  const { t } = useLocale();

  return (
    <Link
      href={routes.profile}
      className='inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)]'
    >
      <Avatar profile={profile} size={compact ? 22 : 24} />
      {compact ? null : <span className='max-w-[10rem] truncate pe-1'>{hasProfile ? displayName : t('nav.setUpProfile')}</span>}
    </Link>
  );
}

export function Navbar() {
  const { t } = useLocale();

  return (
    <header className='sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6'>
        <Logo />
        <nav className='hidden items-center gap-4 lg:flex xl:gap-6'>
          {siteConfig.navLinks.map((link) => (
            <Link key={link.href} href={link.href} className='whitespace-nowrap text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]'>
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>
        <div className='flex items-center gap-2'>
          <LanguageSwitcher />
          <ThemeToggle />
          <span className='hidden xl:inline-flex'>
            <ProfileChip />
          </span>
          <span className='xl:hidden'>
            <ProfileChip compact />
          </span>
        </div>
      </div>
    </header>
  );
}
