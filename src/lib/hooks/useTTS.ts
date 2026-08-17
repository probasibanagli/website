'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { TamilWord } from '@/components/ui/WordHelper';

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  // Plays a single audio phrase from /api/tts endpoint
  const playAudioPhrase = useCallback(
    (text: string, lang: 'ta' | 'bn'): Promise<void> => {
      return new Promise((resolve) => {
        if (!text || !text.trim()) {
          resolve();
          return;
        }

        const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
        const audio = new Audio(audioUrl);
        activeAudioRef.current = audio;

        audio.onended = () => {
          activeAudioRef.current = null;
          resolve();
        };

        audio.onerror = () => {
          activeAudioRef.current = null;
          // Fallback to Web Speech API if audio stream fails
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = lang === 'bn' ? 'bn-IN' : 'ta-IN';
            u.onend = () => resolve();
            u.onerror = () => resolve();
            window.speechSynthesis.speak(u);
          } else {
            resolve();
          }
        };

        audio.play().catch(() => {
          // Fallback if browser blocks autoplay or fails
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = lang === 'bn' ? 'bn-IN' : 'ta-IN';
            u.onend = () => resolve();
            u.onerror = () => resolve();
            window.speechSynthesis.speak(u);
          } else {
            resolve();
          }
        });
      });
    },
    []
  );

  // Speaks full translation card sequentially: 1. Tamil -> 2. Bengali (English sound removed)
  const speakCard = useCallback(
    async (word: TamilWord) => {
      stopAll();
      setIsSpeaking(true);

      try {
        // Step 1: Tamil Audio
        await playAudioPhrase(word.tamil, 'ta');

        // Step 2: Bengali Audio
        const bengaliText = word.bengali || word.bengaliMeaning || '';
        if (bengaliText) {
          await playAudioPhrase(bengaliText, 'bn');
        }
      } catch (err) {
        console.error('Error playing card speech:', err);
      } finally {
        setIsSpeaking(false);
      }
    },
    [stopAll, playAudioPhrase]
  );

  return {
    speakCard,
    stopAll,
    isSpeaking,
    isLoading,
  };
}
