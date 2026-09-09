'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type Language = 'en' | 'bn' | 'ta';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language, skipReload?: boolean) => void;
  isMounted: boolean;
  isTranslating: boolean;
  targetLanguage: Language | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function applyGoogleTranslate(lang: Language) {
    if (lang === 'en') {
      // Clear translation cookies to revert to English
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      document.cookie = 'googtrans=/en/en; path=/; max-age=31536000; SameSite=Lax';
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname.includes('.')) {
        document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        document.cookie = `googtrans=/en/en; path=/; domain=${window.location.hostname}; max-age=31536000; SameSite=Lax`;
      }
    } else {
      const cookieValue = `/en/${lang}`;
      const autoCookieValue = `/auto/${lang}`;
      
      // Set cookie on root path without domain for localhost support
      document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `googtrans=${autoCookieValue}; path=/; max-age=31536000; SameSite=Lax`;
      
      // Also set on root domain if applicable on live host
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname.includes('.')) {
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}; max-age=31536000; SameSite=Lax`;
        const parts = window.location.hostname.split('.');
        if (parts.length > 1) {
          const rootDomain = '.' + parts.slice(-2).join('.');
          document.cookie = `googtrans=${cookieValue}; path=/; domain=${rootDomain}; max-age=31536000; SameSite=Lax`;
        }
      }
    }

    if (typeof window === 'undefined') return;

    // Also attempt in-page combo dispatch if present
    const googleTranslateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleTranslateCombo) {
      googleTranslateCombo.value = lang;
      googleTranslateCombo.dispatchEvent(new Event('change', { bubbles: true }));
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
      // Ensure cookies match saved language on mount without refreshing
      applyGoogleTranslate(initialLang);
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    // If selecting the currently active language, do nothing
    if (lang === language) return;

    // 1. Show changing wireframe animation immediately
    setIsTranslating(true);
    setTargetLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('pb_lang', lang);

    // 2. Set translation cookies
    applyGoogleTranslate(lang);

    // 3. Smoothly reload after 450ms while transition animation is active so Google Translate translates the entire website automatically
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 450);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      isMounted,
      isTranslating,
      targetLanguage
    }}>
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

