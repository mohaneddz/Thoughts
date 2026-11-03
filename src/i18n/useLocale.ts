'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { locales, messages, rtlLocales, type Locale, type MessageKey } from '@/i18n/messages';

export const LOCALE_STORAGE_KEY = 'happy-healthy-human.locale';
const LOCALE_EVENT = 'happy-healthy-human:locale';

function readLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return locales.includes(stored as Locale) ? (stored as Locale) : 'en';
  } catch {
    return 'en';
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(LOCALE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(LOCALE_EVENT, onChange);
  };
}

export function applyLocaleToDocument(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = rtlLocales.has(locale) ? 'rtl' : 'ltr';
}

/** Server renders English; the stored choice takes over right after hydration. */
export function useLocale() {
  const locale = useSyncExternalStore(subscribe, readLocale, () => 'en' as Locale);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    applyLocaleToDocument(next);
    window.dispatchEvent(new Event(LOCALE_EVENT));
  }, []);

  const t = useCallback((key: MessageKey) => messages[locale][key], [locale]);

  return { locale, setLocale, t };
}
