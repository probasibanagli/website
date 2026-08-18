'use client';

import React, { useState, useMemo } from 'react';
import { X, Sparkles, Search, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { TAMIL_WORDS, FOOD_TAMIL_WORDS, STAY_TAMIL_WORDS, HOSPITAL_TAMIL_WORDS, TRAVEL_TAMIL_WORDS, COMMUNITY_TAMIL_WORDS, EMERGENCY_TAMIL_WORDS, SERVICES_TAMIL_WORDS } from '@/lib/constants';

interface WordDef {
  meaning: string;
  pronunciation: string;
  tamil: string;
  bengali: string;
  bengaliMeaning?: string;
}

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [wordSearch, setWordSearch] = useState('');
  const [dynamicWords, setDynamicWords] = useState<WordDef[]>([]);
  const [isLoadingWord, setIsLoadingWord] = useState(false);

  const currentWords = useMemo(() => {
    let baseWords = [...dynamicWords, ...TAMIL_WORDS];
    if (pathname?.includes('/explore/food')) baseWords = [...dynamicWords, ...FOOD_TAMIL_WORDS, ...TAMIL_WORDS];
    else if (pathname?.includes('/explore/stay')) baseWords = [...dynamicWords, ...STAY_TAMIL_WORDS, ...TAMIL_WORDS];
    else if (pathname?.includes('/explore/travel')) baseWords = [...dynamicWords, ...TRAVEL_TAMIL_WORDS, ...TAMIL_WORDS];
    else if (pathname?.includes('/emergency/hospital')) baseWords = [...dynamicWords, ...HOSPITAL_TAMIL_WORDS, ...TAMIL_WORDS];
    else if (pathname?.includes('/community')) baseWords = [...dynamicWords, ...COMMUNITY_TAMIL_WORDS, ...TAMIL_WORDS];
    else if (pathname?.includes('/emergency')) baseWords = [...dynamicWords, ...EMERGENCY_TAMIL_WORDS, ...TAMIL_WORDS];
    else if (pathname?.includes('/services')) baseWords = [...dynamicWords, ...SERVICES_TAMIL_WORDS, ...TAMIL_WORDS];
    
    // Deduplicate by meaning
    const seen = new Set();
    return baseWords.filter(w => {
      const key = w.meaning.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [pathname, dynamicWords]);

  const filteredWords = useMemo(() => {
    if (!wordSearch) return currentWords;
    const term = wordSearch.toLowerCase();
    return currentWords.filter(w => 
      w.meaning.toLowerCase().includes(term) ||
      w.pronunciation.toLowerCase().includes(term) ||
      (w.bengali && w.bengali.toLowerCase().includes(term)) ||
      (w.tamil && w.tamil.includes(term))
    );
  }, [wordSearch, currentWords]);

  const fetchTranslation = async (term: string) => {
    setIsLoadingWord(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'translate_word', word: term }),
      });
      
      const data = await res.json();
      
      if (data.tamil && data.bengali) {
        setDynamicWords(prev => [data, ...prev]);
      } else {
        setDynamicWords(prev => [{
          meaning: term,
          pronunciation: "Not Found",
          tamil: term + " (API Error)",
          bengali: term + " (API Error)",
          bengaliMeaning: data.error || "Configure Google Cloud API Key"
        }, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoadingWord(false);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordSearch.trim() || filteredWords.length > 0 || isLoadingWord) return;
    fetchTranslation(wordSearch);
  };

  React.useEffect(() => {
    if (!wordSearch.trim() || filteredWords.length > 0 || isLoadingWord) return;

    const timeoutId = setTimeout(() => {
      fetchTranslation(wordSearch);
    }, 800); // 800ms debounce

    return () => clearTimeout(timeoutId);
  }, [wordSearch, filteredWords.length, isLoadingWord]);

  // Clear search and reset state when opened/closed or on page change
  React.useEffect(() => {
    setWordSearch('');
  }, [isOpen]);

  React.useEffect(() => {
    setDynamicWords([]);
    setWordSearch('');
  }, [pathname]);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Text-To-Speech Playback using High-Quality Cloud API
  const speakMessage = (word: WordDef) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Always prefer reading the actual native Tamil script for perfect pronunciation
    let lang = 'ta';
    let textToSpeak = word.tamil || word.pronunciation || word.meaning;
    
    if (/[\u0980-\u09FF]/.test(textToSpeak)) {
      lang = 'bn';
    }

    // Proxy the TTS request through our Next.js backend to bypass browser CORS and Referer restrictions
    const url = `/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${lang}`;
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.play().catch(err => {
      console.error("Audio playback failed:", err);
      // Fallback to basic browser TTS if cloud audio fails (e.g., offline)
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/[*#_`]/g, ''));
        utterance.lang = lang === 'ta' ? 'ta-IN' : 'bn-IN';
        window.speechSynthesis.speak(utterance);
      }
    });
  };

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-border animate-slide-up flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Tamil Word Helper</p>
                <p className="text-[10px] text-white/70">Learn Tamil easily in Bengali or English</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Search Bar */}
            <div className="p-3 border-b border-border bg-surface/50">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  value={wordSearch}
                  onChange={(e) => setWordSearch(e.target.value)}
                  placeholder="Search to translate automatically..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </form>
            </div>

            {/* Words List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 select-none">
              {filteredWords.map((word, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-surface border border-border/40 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-bold text-text-primary truncate">{word.meaning}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      <span className="text-[9px] font-semibold text-primary uppercase tracking-wider mr-1">Speak:</span>
                      <span className="italic">{word.pronunciation}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xs font-bold text-primary block bengali-text">{word.bengali}</span>
                      <span className="text-[9px] text-text-muted block mt-0.5">{word.tamil}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakMessage(word)}
                      className="p-1.5 rounded-lg border border-border bg-white text-text-muted hover:text-primary hover:border-primary/30 cursor-pointer shadow-sm"
                      title="Speak message"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredWords.length === 0 && !isLoadingWord && (
                <div className="text-center py-8">
                  <p className="text-xs text-text-muted mb-3">Fetching translation for "{wordSearch}"...</p>
                </div>
              )}
              
              {isLoadingWord && (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <p className="text-xs text-text-muted animate-pulse">Translating...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      {mounted && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Tamil Word Helper"
          title="Tamil Word Helper"
          className={cn(
            'fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-2xl shadow-primary/25 flex items-center justify-center transition-all duration-300 cursor-pointer ring-1 ring-primary/10 hover:ring-primary/20',
            isOpen
              ? 'bg-primary-dark rotate-90 text-white'
              : 'bg-primary text-white hover:scale-110'
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <svg viewBox="0 0 64 64" className="w-full h-full p-[2px]">
              <defs>
                <filter id="premium-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000" floodOpacity="0.22" />
                </filter>
                <linearGradient id="bubble-back" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FAFAFA" />
                  <stop offset="100%" stopColor="#E2E2E2" />
                </linearGradient>
                <linearGradient id="bubble-front" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F0F0F0" />
                </linearGradient>
              </defs>
              <g filter="url(#premium-shadow)">
                {/* Back bubble (Tamil) - Tail on right */}
                <g transform="translate(26, 12)">
                  <path d="M8 0h12a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-2l6 6l-10-6h-6a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8z" fill="url(#bubble-back)" />
                  <text x="14" y="15" textAnchor="middle" dominantBaseline="middle" fill="#C04820" fontSize="15" fontWeight="900" fontFamily="sans-serif">அ</text>
                </g>

                {/* Front bubble (English) - Tail on left */}
                <g transform="translate(10, 18)">
                  <path d="M8 0h12a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-6l-10 6l6-6h-2a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8z" fill="url(#bubble-front)" />
                  <text x="14" y="15" textAnchor="middle" dominantBaseline="middle" fill="#D85A30" fontSize="17" fontWeight="900" fontFamily="sans-serif">A</text>
                </g>
              </g>
            </svg>
          )}
        </button>
      )}
    </>
  );
}
