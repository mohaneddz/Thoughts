'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeMode } from '@/components/common/themeProvider';
import { useSyncExternalStore } from 'react';
import { useLocale } from '@/i18n/useLocale';

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeMode();
  const mounted = useIsClient();
  const { t } = useLocale();

  if (!mounted) {
    return (
      <Button variant='secondary' size='sm' aria-label={t('nav.toggleTheme')} className="invisible">
        <Sun size={16} />
      </Button>
    );
  }

  return (
    <Button variant='secondary' size='sm' onClick={toggleTheme} aria-label={t('nav.toggleTheme')}>
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  );
}
