'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Eye, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function LiveViewCounter() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  // Display count starts from 0 as requested
  const [displayCount, setDisplayCount] = useState<number>(0);
  const [targetCount, setTargetCount] = useState<number>(100000);
  const [isHovered, setIsHovered] = useState(false);
  const [hasIncrementedEffect, setHasIncrementedEffect] = useState(false);
  const animRef = useRef<number | null>(null);

  // Smooth Count-Up Animation from current display value to target value
  useEffect(() => {
    if (!mounted) return;

    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }

    const startVal = displayCount;
    const endVal = targetCount;
    if (startVal === endVal) return;

    const duration = startVal === 0 ? 2200 : 800; // 2.2s for initial roll from 0, 800ms for increments
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentVal = Math.floor(startVal + (endVal - startVal) * easedProgress);

      setDisplayCount(currentVal);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setDisplayCount(endVal);
        setHasIncrementedEffect(true);
        setTimeout(() => setHasIncrementedEffect(false), 1000);
      }
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [targetCount, mounted]);

  useEffect(() => {
    setMounted(true);

    // Determine if this browser session has already counted a view
    const sessionKey = 'pb_session_view_recorded';
    const alreadyRecorded = typeof window !== 'undefined' && sessionStorage.getItem(sessionKey);

    const fetchOrIncrement = async () => {
      try {
        let endpoint = '/api/public/view-count';
        if (!alreadyRecorded) {
          endpoint = '/api/public/view-count?increment=true';
          sessionStorage.setItem(sessionKey, 'true');
        }

        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.count === 'number' && data.count >= 100000) {
            setTargetCount(data.count);
          }
        }
      } catch (err) {
        console.warn('[LiveViewCounter] Failed to fetch live view count:', err);
      }
    };

    fetchOrIncrement();

    // Occasional subtle live traffic tick (every 45s) to reflect ongoing live visits
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setTargetCount((prev) => prev + 1);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Do not render on admin dashboards (matches Tamil Word Helper)
  if (!mounted || pathname?.startsWith('/admin')) {
    return null;
  }

  // Format count with standard commas (e.g. 0 -> 100,002)
  const formattedNumber = displayCount.toLocaleString('en-IN');

  return (
    <div
      id="live-website-view-counter"
      className={cn(
        'fixed bottom-5 left-4 sm:left-6 z-50 select-none transition-all duration-300',
        'group cursor-pointer'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Live Website Views"
    >
      {/* Tooltip on hover */}
      <div
        className={cn(
          'absolute bottom-full left-0 mb-2 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-[11px] font-medium backdrop-blur-md shadow-xl border border-white/10 transition-all duration-200 pointer-events-none whitespace-nowrap',
          isHovered
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-1 scale-95'
        )}
      >
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Community Portal Visits</span>
        </div>
      </div>

      {/* Floating Pill - Exact parallel alignment with Tamil Word Helper FAB (h-14) */}
      <div
        className={cn(
          'h-14 pl-2 pr-4 sm:pr-5 rounded-full flex items-center gap-3',
          'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md',
          'border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/10',
          'ring-1 ring-black/5 hover:ring-primary/30 dark:hover:ring-primary/40',
          'transition-all duration-300 hover:scale-105',
          hasIncrementedEffect && 'ring-2 ring-emerald-500/50 scale-[1.03]'
        )}
      >
        {/* Left Icon Badge with Pulse indicator */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-orange-500 text-white flex items-center justify-center shadow-md shadow-primary/25">
            <Eye className="w-5 h-5 text-white" />
          </div>

          {/* Live pulsing dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        </div>

        {/* Counter Info */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Live Views
            </span>
            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>LIVE</span>
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                'text-sm sm:text-base font-extrabold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums transition-colors duration-300',
                hasIncrementedEffect && 'text-emerald-600 dark:text-emerald-400'
              )}
            >
              {formattedNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
