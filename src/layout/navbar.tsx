'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';
import { useAuth } from '@/components/common/auth-provider';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push(routes.home);
  };

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
          {!isLoading && isAuthenticated ? (
            <>
              <Link href={routes.profile}>
                <Button variant='secondary'>Profile</Button>
              </Link>
              <Button variant='ghost' onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href={routes.auth}>
                <Button variant='secondary'>Log in</Button>
              </Link>
              <Link href={routes.auth}>
                <Button>Get started</Button>
              </Link>
            </>
          )}
        </div>
        <div className='flex items-center gap-2 lg:hidden'>
          <ThemeToggle />
          <Link href={isAuthenticated ? routes.profile : routes.auth}>
            <Button variant='secondary' className='h-10 px-3'>
              {isAuthenticated ? 'Profile' : 'Log in'}
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

