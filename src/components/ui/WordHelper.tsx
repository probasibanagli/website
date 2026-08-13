'use client';

import React, { useState } from 'react';
import { Megaphone, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface TamilWord {
  meaning: string;
  pronunciation: string;
  tamil: string;
  bengali: string;
  bengaliMeaning?: string;
}

interface WordHelperProps {
  words: TamilWord[];
  title?: string;
  subtitle?: string;
  variant?: 'vertical' | 'horizontal';
}

export function WordHelper({ 
  words, 
  title = "Tamil & Bengali Word Helper", 
  subtitle = "Flashcards for daily phrases. Click the speaker to hear pronunciation.",
  variant = 'vertical'
}: WordHelperProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!words || words.length === 0) return null;

  const currentWord = words[currentIdx] || words[0];

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ta-IN'; // Tamil language code
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (variant === 'horizontal') {
    return (
      <Card className="relative overflow-hidden border-primary/20 shadow-xs flex flex-wrap items-center p-4 gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex-1 w-full min-w-[200px] flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-1 inline-flex items-center gap-2 text-text-primary">
            <Megaphone className="w-5 h-5 text-primary" /> {title}
          </h3>
          <p className="text-xs text-text-muted mb-4 font-medium">{subtitle}</p>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => (prev - 1 + words.length) % words.length)}
              className="px-3 py-1.5 border border-border bg-white text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => (prev + 1) % words.length)}
              className="px-3 py-1.5 border border-border bg-white text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
            >
              Next →
            </button>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase ml-2">
              {currentIdx + 1} of {words.length}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full min-w-[250px] bg-slate-50 border border-slate-150 rounded-2xl p-4 shadow-inner relative flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-xl font-extrabold text-slate-800">{currentWord.pronunciation}</div>
              <div className="text-xs font-bold text-primary font-tamil tracking-wider mt-0.5">{currentWord.tamil}</div>
            </div>
            <button
              type="button"
              onClick={() => speakWord(currentWord.tamil)}
              className="p-1.5 rounded-lg bg-primary-light hover:bg-primary/15 text-primary border border-primary/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Listen Tamil Pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 py-2 border-t border-dashed border-slate-200/60 mt-1">
            <div className="text-xs text-slate-500 font-semibold">
              উচ্চারণ: <span className="text-slate-800 font-bold font-bengali">{currentWord.bengali || ''}</span>
            </div>
            {currentWord.bengaliMeaning && (
              <div className="text-xs text-slate-500 font-semibold">
                অর্থ: <span className="text-primary-dark font-bold font-bengali">{currentWord.bengaliMeaning}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200/50 pt-2 text-xs font-semibold text-text-muted mt-1">
            English Meaning: <span className="text-slate-700 font-bold">{currentWord.meaning}</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-primary/20 shadow-xs">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
      <h3 className="text-lg font-bold mb-2 inline-flex items-center gap-2 text-text-primary">
        <Megaphone className="w-5 h-5 text-primary" /> {title}
      </h3>
      <p className="text-xs text-text-muted mb-4 font-medium">{subtitle}</p>
      
      <div className="relative bg-slate-50 border border-slate-150 rounded-2xl p-5 text-center min-h-[170px] flex flex-col justify-between shadow-inner">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            {currentIdx + 1} of {words.length}
          </span>
          <button
            type="button"
            onClick={() => speakWord(currentWord.tamil)}
            className="p-1.5 rounded-lg bg-primary-light hover:bg-primary/15 text-primary border border-primary/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title="Listen Tamil Pronunciation"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="my-2 space-y-1">
          <div className="text-xl font-extrabold text-slate-800">
            {currentWord.pronunciation}
          </div>
          <div className="text-xs font-bold text-primary font-tamil tracking-wider">
            {currentWord.tamil}
          </div>
          
          {/* Bengali equivalent */}
          <div className="pt-2 border-t border-dashed border-slate-200/60 mt-2 space-y-1 bg-white/50 p-2 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold">
              উচ্চারণ: <span className="text-slate-800 font-bold font-bengali">{currentWord.bengali || ''}</span>
            </div>
            {currentWord.bengaliMeaning && (
              <div className="text-xs text-slate-500 font-semibold">
                অর্থ: <span className="text-primary-dark font-bold font-bengali">{currentWord.bengaliMeaning}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200/50 pt-2 text-xs font-semibold text-text-muted">
          English Meaning: <span className="text-slate-700 font-bold">{currentWord.meaning}</span>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex justify-between items-center mt-3 gap-2">
        <button
          type="button"
          onClick={() => setCurrentIdx((prev) => (prev - 1 + words.length) % words.length)}
          className="px-3 py-1.5 border border-border bg-white text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => setCurrentIdx((prev) => (prev + 1) % words.length)}
          className="px-3 py-1.5 border border-border bg-white text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
        >
          Next →
        </button>
      </div>
    </Card>
  );
}
