'use client';

import React from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Sparkles, Languages } from 'lucide-react';

export function LanguageTransitionOverlay() {
  const { isTranslating, targetLanguage } = useLanguage();

  if (!isTranslating) return null;

  const getLanguageLabel = (lang: string | null) => {
    switch (lang) {
      case 'bn':
        return {
          native: 'বাংলা (Bengali)',
          subtext: 'বাংলা ভাষায় রূপান্তরিত হচ্ছে...',
          enSubtext: 'Translating page to Bengali...',
        };
      case 'ta':
        return {
          native: 'தமிழ் (Tamil)',
          subtext: 'தமிழுக்கு மாற்றப்படுகிறது...',
          enSubtext: 'Translating page to Tamil...',
        };
      case 'en':
      default:
        return {
          native: 'English',
          subtext: 'Switching to English...',
          enSubtext: 'Translating page to English...',
        };
    }
  };

  const currentInfo = getLanguageLabel(targetLanguage);

  return (
    <aside aria-label="Language translation in progress" className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none">
      <style>{`
        @keyframes laser-sweep {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes wireframe-glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.45; }
        }
        .laser-bar {
          animation: laser-sweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .wireframe-pulse {
          animation: wireframe-glow 0.9s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Top Laser Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-200/40 overflow-hidden shadow-md">
        <div className="h-full w-full bg-gradient-to-r from-[#D85A30] via-amber-400 to-[#1D9E75] laser-bar shadow-[0_0_12px_rgba(216,90,48,0.8)]" />
      </div>

      {/* Dynamic Wireframe / Holographic Mesh Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-primary/[0.02] backdrop-blur-[1px] transition-all duration-300">
        {/* Subtle grid pattern resembling wireframe scanning */}
        <div 
          className="absolute inset-0 wireframe-pulse pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(216, 90, 48, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(216, 90, 48, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Soft scanning light beam */}
        <div className="absolute inset-x-0 h-40 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-xl animate-pulse" />
      </div>

      {/* Centered / Top Floating Glassmorphic Transformation Pill */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto animate-slide-down">
        <div className="flex items-center gap-3.5 px-5 py-3 rounded-full bg-white/95 backdrop-blur-xl border-2 border-primary/40 shadow-[0_12px_40px_rgba(216,90,48,0.25)] ring-4 ring-primary/10">
          
          {/* Animated Spinner & Icon */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#D85A30] to-amber-500 text-white shadow-md shadow-[#D85A30]/30 shrink-0">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
          </div>

          {/* Text Details */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-neutral-900 tracking-tight flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-primary" />
                {currentInfo.native}
              </span>
              <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary">
                Live Translate
              </span>
            </div>
            <p className="text-[11px] font-semibold text-neutral-600 leading-tight">
              {currentInfo.subtext}
            </p>
          </div>

          {/* Animated Wave Indicator Dots */}
          <div className="flex items-center gap-1 pl-1 pr-0.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D85A30] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

        </div>
      </div>
    </aside>
  );
}
