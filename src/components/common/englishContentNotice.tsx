'use client';

import { Languages } from 'lucide-react';
import { useLocale } from '@/i18n/useLocale';

/** Shown outside English so nobody mistakes an untranslated questionnaire for a translated one. */
export function EnglishContentNotice() {
  const { locale, t } = useLocale();
  if (locale === 'en') return null;

  return (
    <p className='flex items-start gap-2 rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-muted)]'>
      <Languages size={16} className='mt-0.5 shrink-0' aria-hidden />
      {t('notice.englishContent')}
    </p>
  );
}
