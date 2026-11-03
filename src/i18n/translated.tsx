'use client';

import { useLocale } from '@/i18n/useLocale';
import type { MessageKey } from '@/i18n/messages';

/** Lets server components render a translated string without becoming client components. */
export function T({ k }: { k: MessageKey }) {
  const { t } = useLocale();
  return <>{t(k)}</>;
}
