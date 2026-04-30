'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateText } from '@/lib/translate';

type Language = 'en' | 'bn' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Persistence & Auto-detection
  useEffect(() => {
    const saved = localStorage.getItem('pb_lang') as Language;
    if (saved) {
      setLanguage(saved);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'bn') setLanguage('bn');
      else if (browserLang === 'ta') setLanguage('ta');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('pb_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Component to wrap text for auto-translation with Caching
 */
export function T({ children }: { children: string }) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    if (language === 'en') {
      setTranslated(children);
      return;
    }

    const performTranslation = async () => {
      console.log(`T component triggering for: "${children}" to ${language}`);
      try {
        // Check cache first
        const cacheKey = `trans_${language}_${children}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          console.log(`Cache hit for: "${children}"`);
          setTranslated(cached);
          return;
        }

        const result = await translateText(children, language);
        if (result) {
          setTranslated(result);
          // Save to cache
          localStorage.setItem(cacheKey, result);
        }
      } catch (error) {
        console.error('T Component Error:', error);
        // Fallback to original text on error
        setTranslated(children);
      }
    };

    performTranslation();
  }, [children, language]);

  return <>{translated}</>;
}
