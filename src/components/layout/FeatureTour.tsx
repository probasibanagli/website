'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { T } from '@/lib/contexts/LanguageContext';
import { usePathname } from 'next/navigation';

interface Step {
  targetId: string;
  title: string;
  description: string;
  position: 'bottom' | 'top' | 'left' | 'right';
}

const TOUR_STEPS: Step[] = [
  {
    targetId: 'navbar-lang-selector',
    title: 'Translate Entire Website',
    description: 'You can translate this entire website into Bengali, Tamil, or English instantly. Try switching languages anytime!',
    position: 'bottom',
  },
  {
    targetId: 'word-helper-fab',
    title: 'Tamil Word Helper',
    description: 'Struggling with Tamil words? Click this speech bubble icon to find common phrases, view meanings, and listen to correct pronunciations.',
    position: 'top',
  },
];

export function FeatureTour() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const startTour = () => {
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    if (!isMounted || pathname !== '/') return;

    // Check if the welcome modal is dismissed and tour is not yet completed
    const checkWelcomeAndTour = () => {
      const welcomeDismissed = localStorage.getItem('pb_welcome_dismissed') === 'true';
      const tourCompleted = localStorage.getItem('pb_tour_completed') === 'true';
      
      // Delay slightly to let the welcome modal animation complete
      if (welcomeDismissed && !tourCompleted && currentStepIndex === null) {
        const timer = setTimeout(() => {
          startTour();
        }, 1000);
        return () => clearTimeout(timer);
      }
    };

    // Initial check
    checkWelcomeAndTour();

    // Set up a storage listener in case welcome modal dismiss updates localStorage
    const handleStorageChange = () => {
      checkWelcomeAndTour();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll/check regularly because state is modified inside the same window (WelcomeModal is on the same page)
    const interval = setInterval(checkWelcomeAndTour, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isMounted, pathname, currentStepIndex]);

  // Update target rect when step changes or window scrolls/resizes
  useEffect(() => {
    if (currentStepIndex === null) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const step = TOUR_STEPS[currentStepIndex];
      const element = document.getElementById(step.targetId);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    // Set up MutationObserver to detect when the element is rendered in DOM
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new MutationObserver(updateRect);
    observerRef.current.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [currentStepIndex]);

  if (currentStepIndex === null || !targetRect || pathname !== '/') return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('pb_tour_completed', 'true');
    setCurrentStepIndex(null);
  };

  // Compute tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) return {};

    const margin = 16;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    switch (currentStep.position) {
      case 'bottom':
        return {
          top: `${targetRect.bottom + scrollY + margin}px`,
          left: `${Math.max(margin, Math.min(window.innerWidth - 340, targetRect.left + scrollX + targetRect.width / 2 - 160))}px`,
          width: '320px',
        };
      case 'top':
        return {
          top: `${targetRect.top + scrollY - margin - 180}px`, // approximate height
          left: `${Math.max(margin, Math.min(window.innerWidth - 340, targetRect.left + scrollX + targetRect.width / 2 - 160))}px`,
          width: '320px',
        };
      case 'left':
        return {
          top: `${targetRect.top + scrollY + targetRect.height / 2 - 100}px`,
          left: `${targetRect.left + scrollX - 320 - margin}px`,
          width: '320px',
        };
      case 'right':
        return {
          top: `${targetRect.top + scrollY + targetRect.height / 2 - 100}px`,
          left: `${targetRect.right + scrollX + margin}px`,
          width: '320px',
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 z-[99] pointer-events-none">
      {/* SVG Overlay Spotlight */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto">
        <svg className="w-full h-full">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx={currentStep.targetId === 'word-helper-fab' ? 9999 : 24}
                fill="black"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="black" opacity="0.4" mask="url(#spotlight-mask)" />
        </svg>
      </div>

      {/* Target element highlight ring (purely aesthetic border) */}
      <div
        className="absolute transition-all duration-300 border-[3px] border-[#D85A30] animate-pulse pointer-events-none"
        style={{
          top: `${targetRect.top + window.scrollY - 6}px`,
          left: `${targetRect.left - 6}px`,
          width: `${targetRect.width + 12}px`,
          height: `${targetRect.height + 12}px`,
          borderRadius: currentStep.targetId === 'word-helper-fab' ? '9999px' : '24px',
        }}
      />

      {/* Tooltip Card */}
      <div
        className="absolute z-[100] bg-white rounded-2xl border border-black/5 shadow-2xl p-6 flex flex-col gap-4 pointer-events-auto animate-fade-in animate-slide-up"
        style={getTooltipStyle()}
      >
        <button
          onClick={handleComplete}
          className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Skip tour"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step counter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-[#D85A30] uppercase bg-[#FAECE7] px-2 py-0.5 rounded-full">
            Step {currentStepIndex + 1} of {TOUR_STEPS.length}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-neutral-900 leading-snug">
          <T>{currentStep.title}</T>
        </h3>

        {/* Description */}
        <p className="text-neutral-600 text-xs leading-relaxed">
          <T>{currentStep.description}</T>
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
          <button
            onClick={handleComplete}
            className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Skip
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 py-2 px-4 rounded-full text-xs font-semibold text-white bg-[#D85A30] hover:bg-[#C24D27] transition-all active:scale-[0.98] shadow-md shadow-[#D85A30]/10"
          >
            {currentStepIndex === TOUR_STEPS.length - 1 ? (
              <>
                Got it <Check className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Next <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
