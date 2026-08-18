'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function PageSkeletonLoader() {
  const pathname = usePathname();

  // Do not show wireframe skeleton loader on the homepage '/'
  if (pathname === '/') return null;

  return (
    <div className="w-full min-h-screen bg-background animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="w-full bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/5 py-12 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-4 w-32 bg-gray-200 rounded-full" />
          <div className="h-10 sm:h-12 w-3/4 max-w-xl bg-gray-300 rounded-2xl" />
          <div className="h-4 w-1/2 max-w-md bg-gray-200 rounded-lg" />
          
          {/* Search/Filter Bar Skeleton */}
          <div className="pt-4 flex flex-wrap gap-3">
            <div className="h-12 flex-1 min-w-[200px] bg-white rounded-2xl border border-gray-200 shadow-sm" />
            <div className="h-12 w-36 bg-white rounded-2xl border border-gray-200 shadow-sm" />
            <div className="h-12 w-32 bg-primary/30 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Main Grid Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="h-7 w-48 bg-gray-300 rounded-xl" />
          <div className="h-5 w-24 bg-gray-200 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-border/60 shadow-sm space-y-4">
              <div className="w-full h-48 bg-gray-200 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-gray-300 rounded-lg" />
                <div className="h-4 w-1/2 bg-gray-200 rounded-lg" />
              </div>
              <div className="pt-2 flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded-md" />
                <div className="h-9 w-28 bg-primary/20 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
