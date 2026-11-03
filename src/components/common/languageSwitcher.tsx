'use client';

import { Languages } from 'lucide-react';
import { useHydrated } from '@/hooks/useHydrated';
import { localeNames, localeShortNames, locales, type Locale } from '@/i18n/messages';
import { useLocale } from '@/i18n/useLocale';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const hydrated = useHydrated();

  return (
    <label className='inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-sm text-[var(--color-text)]'>
      <Languages size={15} aria-hidden />
      <span className='sr-only'>{t('nav.language')}</span>
      <select
        value={locale}
        disabled={!hydrated}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className='bg-transparent text-sm font-semibold outline-none'
      >
        {locales.map((option) => (
          <option key={option} value={option} aria-label={localeNames[option]}>
            {localeShortNames[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
