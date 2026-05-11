'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
      applyGoogleTranslate(saved);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0];
      let initialLang: Language = 'en';
      if (browserLang === 'bn') initialLang = 'bn';
      else if (browserLang === 'ta') initialLang = 'ta';
      
      setLanguage(initialLang);
      if (initialLang !== 'en') {
        applyGoogleTranslate(initialLang);
      }
    }
  }, []);

  const applyGoogleTranslate = (lang: Language) => {
    // Google Translate uses 'googtrans' cookie
    // Format: /source/target
    const cookieValue = lang === 'en' ? '' : `/en/${lang}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    
    // Trigger reload if needed or just wait for the widget to pick it up
    // Most reliable way is to reload or use the widget API if loaded
    if (typeof window !== 'undefined') {
      const googleTranslateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleTranslateCombo) {
        googleTranslateCombo.value = lang;
        googleTranslateCombo.dispatchEvent(new Event('change'));
      } else if (localStorage.getItem('pb_lang') !== lang) {
        // If switching for the first time and widget not ready, reload
        // window.location.reload(); 
      }
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('pb_lang', lang);
    applyGoogleTranslate(lang);
    
    // For a smooth experience, we can reload or just let the widget handle it
    // Reloading ensures all dynamic content is also translated correctly
    window.location.reload();
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
 * Component to wrap text. 
 * Now a simple pass-through as Google Translate handles the DOM.
 */
export function T({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
