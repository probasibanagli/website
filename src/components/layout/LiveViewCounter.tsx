'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Eye, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveViewCounter() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [viewCount, setViewCount] = useState<number>(100000);
  const [isHovered, setIsHovered] = useState(false);
  const [hasIncrementedEffect, setHasIncrementedEffect] = useState(false);

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
            setViewCount(data.count);
          }
        }
      } catch (err) {
        console.warn('[LiveViewCounter] Failed to fetch live view count:', err);
      }
    };

    fetchOrIncrement();

    // Occasional subtle live traffic tick (every 45-60s) to reflect ongoing live visits
    const interval = setInterval(() => {
      // Small chance of simulated live active visitor addition
      if (Math.random() > 0.4) {
        setViewCount((prev) => {
          const next = prev + 1;
          setHasIncrementedEffect(true);
          setTimeout(() => setHasIncrementedEffect(false), 1200);
          return next;
        });
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Do not render on admin dashboards (matches Tamil Word Helper)
  if (!mounted || pathname?.startsWith('/admin')) {
    return null;
  }

  // Format count with standard Indian/International commas (e.g. 100,000)
  const formattedNumber = viewCount.toLocaleString('en-IN');

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
