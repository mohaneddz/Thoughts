import Link from 'next/link';
import { Menu } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { routes } from '@/config/routes';
import { Logo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className='sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6'>
        <Logo />
        <nav className='hidden items-center gap-7 md:flex'>
          {siteConfig.navLinks.map((link) => (
            <Link key={link.href} href={link.href} className='text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]'>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className='hidden items-center gap-2 md:flex'>
          <ThemeToggle />
          <Button variant='secondary'>Log in</Button>
          <Link href={routes.tests}><Button>Get started</Button></Link>
        </div>
        <div className='flex items-center gap-2 md:hidden'>
          <ThemeToggle />
          <button className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)]'>
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

