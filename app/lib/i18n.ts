import { useState, useEffect } from 'react';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import es from '../../messages/es.json';
import nl from '../../messages/nl.json';

const translations = { en, fr, es, nl } as const;
export type Locale = keyof typeof translations;
export type T = typeof en;

export const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'nl', label: 'Nederlands' },
];

const EVENT = 'tehilim:languagechange';

export function useTranslations() {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pref_language') as Locale;
      if (saved && saved in translations) setLocaleState(saved);
    } catch {}

    function onExternalChange(e: Event) {
      setLocaleState((e as CustomEvent<Locale>).detail);
    }
    window.addEventListener(EVENT, onExternalChange);
    return () => window.removeEventListener(EVENT, onExternalChange);
  }, []);

  function setLocale(lang: Locale) {
    setLocaleState(lang);
    try { localStorage.setItem('pref_language', lang); } catch {}
    window.dispatchEvent(new CustomEvent<Locale>(EVENT, { detail: lang }));
  }

  return { t: translations[locale] as T, locale, setLocale };
}
