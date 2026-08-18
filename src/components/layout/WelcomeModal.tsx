'use client';

import React, { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import { T, useLanguage } from '@/lib/contexts/LanguageContext';
import { usePathname } from 'next/navigation';

interface WelcomeModalProps {
  initiallyOpen?: boolean;
}

export function WelcomeModal({ initiallyOpen = false }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const { setLanguage } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    // Client-side fallback check in case cookie didn't sync or wasn't set
    const dismissed = localStorage.getItem('pb_welcome_dismissed');
    if (dismissed) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, []);

  const dismissModal = () => {
    localStorage.setItem('pb_welcome_dismissed', 'true');
    // Set a cookie that expires in 1 year
    document.cookie = "pb_welcome_dismissed=true; path=/; max-age=31536000; SameSite=Lax";
    setIsOpen(false);
  };

  const handleClose = () => {
    dismissModal();
    setLanguage('en', true);
  };

  const handleSelectEnglish = () => {
    dismissModal();
    setLanguage('en', true);
  };

  const handleSelectBengali = () => {
    dismissModal();
    setLanguage('bn', true);
  };

  // Only render the welcome modal on the landing page (homepage '/')
  if (pathname !== '/') return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-white border border-black/5 shadow-2xl transition-all duration-300 scale-100 flex flex-col z-10 animate-slide-up">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 rounded-full p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top/Main Content Area */}
        <div className="p-8 pt-10 flex flex-col items-center text-center">
          
          {/* Rust Orange Rounded Icon Circle */}
          <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-[#D85A30] text-white">
            <Users className="w-8 h-8" />
          </div>

          {/* Title */}
          <h2 className="mb-3 text-2xl font-bold text-neutral-900 tracking-tight">
            <T>Welcome to ProbasiBangali</T>
          </h2>

          {/* Description */}
          <p className="text-neutral-600 text-sm leading-relaxed max-w-sm">
            <T>Join our vibrant community of global Bengalis. Discover local events, find trusted accommodations, and stay connected with your roots wherever you are.</T>
          </p>
        </div>

        {/* Footer Area with peach background */}
        <div className="bg-[#FAECE7] px-8 py-5 flex items-center justify-center gap-4 border-t border-[#F2DDD7]">
          {/* English Button */}
          <button
            onClick={handleSelectEnglish}
            className="flex-1 py-3 px-6 rounded-full text-sm font-semibold text-neutral-800 border border-[#E5D5D0] bg-white hover:bg-neutral-50 transition-all duration-200 active:scale-[0.98]"
          >
            English
          </button>

          {/* Bengali Button (Orange) */}
          <button
            onClick={handleSelectBengali}
            className="flex-1 py-3 px-6 rounded-full text-sm font-semibold text-white bg-[#D85A30] hover:bg-[#C24D27] flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-[#D85A30]/20 active:scale-[0.98]"
          >
            বাংলা (Bengali)
          </button>
        </div>
      </div>
    </div>
  );
}
