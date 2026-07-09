import { Navbar } from '@/layout/navbar';
import { Footer } from '@/layout/footer';
import { MobileNav } from '@/layout/mobile-nav';
import { AppBackground } from '@/components/common/app-background';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

export function AppShell({
  children,
  className,
  backgroundMode = 'default',
}: {
  children: ReactNode;
  className?: string;
  backgroundMode?: 'default' | 'none';
}) {
  return (
    <div className='relative isolate min-h-screen bg-[var(--color-background)] text-[var(--color-text)]'>
      {backgroundMode === 'default' ? <AppBackground /> : null}
      <Navbar />
      <main className={cn('relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:px-6', className)}>{children}</main>
      <div className='relative z-10'>
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
}

