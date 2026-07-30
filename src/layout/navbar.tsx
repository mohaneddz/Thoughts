'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';
import { useProfile } from '@/hooks/use-profile';
import { Avatar } from '@/components/common/avatar';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';

function ProfileChip({ compact = false }: { compact?: boolean }) {
  const { profile, hasProfile, displayName } = useProfile();

  return (
    <Link
      href={routes.profile}
      className='inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)]'
    >
      <Avatar profile={profile} size={compact ? 22 : 24} />
      {compact ? null : <span className='max-w-[10rem] truncate pr-1'>{hasProfile ? displayName : 'Set up profile'}</span>}
    </Link>
  );
}

export function Navbar() {
  return (
    <header className='sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6'>
        <Logo />
        <nav className='hidden items-center gap-6 lg:flex'>
          {siteConfig.navLinks.map((link) => (
            <Link key={link.href} href={link.href} className='text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]'>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className='hidden items-center gap-2 lg:flex'>
          <ThemeToggle />
          <ProfileChip />
        </div>
        <div className='flex items-center gap-2 lg:hidden'>
          <ThemeToggle />
          <ProfileChip compact />
        </div>
      </div>
    </header>
  );
}
