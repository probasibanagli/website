'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  function applyGoogleTranslate(lang: Language) {
    const cookieValue = lang === 'en' ? '' : `/en/${lang}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    
    if (typeof window !== 'undefined') {
      const googleTranslateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleTranslateCombo) {
        googleTranslateCombo.value = lang;
        googleTranslateCombo.dispatchEvent(new Event('change'));
      }
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('pb_lang') as Language;
    let initialLang: Language = 'en';
    if (saved) {
      initialLang = saved;
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'bn') initialLang = 'bn';
      else if (browserLang === 'ta') initialLang = 'ta';
    }

    const handle = requestAnimationFrame(() => {
      setIsMounted(true);
      setLanguage(initialLang);
      if (initialLang !== 'en') {
        applyGoogleTranslate(initialLang);
      }
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('pb_lang', lang);
    applyGoogleTranslate(lang);
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isMounted }}>
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

export function T({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
