'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, ListChecks, Sparkles, UserRound, type LucideIcon } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/utils/cn';

const icons: Record<string, LucideIcon> = {
  home: Home,
  tests: ListChecks,
  'check-in': Sparkles,
  learn: BookOpen,
  profile: UserRound,
};

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-background)] md:hidden'>
      <div className='mx-auto grid max-w-xl grid-cols-5'>
        {siteConfig.mobileLinks.map((item) => {
          const Icon = icons[item.icon];
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-2 text-[11px] text-[var(--color-muted)]',
                active && 'text-[var(--color-primary)]',
              )}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

