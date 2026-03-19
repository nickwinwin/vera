'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import de from '@/i18n/de.json';
import en from '@/i18n/en.json';

type Language = 'de' | 'en';
type Translations = typeof de;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const translations: Record<Language, Translations> = { de, en };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vera_lang') as Language;
      if (saved && (saved === 'de' || saved === 'en')) {
        setTimeout(() => setLanguageState(saved), 0);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vera_lang', lang);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    for (const key of keys) {
      if (current[key] === undefined) return path;
      current = current[key];
    }
    return current;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
