'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeMode } from '@/components/common/theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <Button variant='secondary' size='sm' onClick={toggleTheme} aria-label='Toggle theme'>
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  );
}

