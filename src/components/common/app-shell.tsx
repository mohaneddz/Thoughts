import { Navbar } from '@/layout/navbar';
import { Footer } from '@/layout/footer';
import { MobileNav } from '@/layout/mobile-nav';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className='min-h-screen bg-[var(--color-background)] text-[var(--color-text)]'>
      <Navbar />
      <main className={cn('mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:px-6', className)}>{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}

