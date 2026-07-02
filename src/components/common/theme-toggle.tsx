'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeMode } from '@/components/common/theme-provider';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeMode();
  const mounted = useIsClient();

  if (!mounted) {
    return (
      <Button variant='secondary' size='sm' aria-label='Toggle theme' className="invisible">
        <Sun size={16} />
      </Button>
    );
  }

  return (
    <Button variant='secondary' size='sm' onClick={toggleTheme} aria-label='Toggle theme'>
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  );
}
