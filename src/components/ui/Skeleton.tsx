import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-gray-100", className)}
      {...props}
    >
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col overflow-hidden animate-fade-in">
      {/* Navbar Skeleton */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div className="hidden sm:flex items-center gap-1">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-16 h-5 opacity-60" />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton className="w-28 h-9 rounded-lg" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section Skeleton */}
        <div className="relative py-20 sm:py-28 lg:py-36 bg-gradient-to-br from-surface to-white px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <Skeleton className="w-40 h-6 rounded-full mb-8 bg-primary/10" />
            <Skeleton className="w-full max-w-3xl h-16 sm:h-20 mb-6" />
            <Skeleton className="w-2/3 max-w-xl h-6 mb-12 opacity-70" />
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="w-48 h-12 rounded-xl" />
              <Skeleton className="w-48 h-12 rounded-xl" />
            </div>
            
            {/* Stats Bar Skeleton */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Explore Section Skeleton */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="w-24 h-6 rounded-full mx-auto mb-4" />
              <Skeleton className="w-64 h-10 mx-auto mb-4" />
              <Skeleton className="w-96 h-5 mx-auto opacity-60" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-6 p-8 border-2 border-surface rounded-3xl">
                  <Skeleton className="w-14 h-14 rounded-2xl bg-surface" />
                  <div className="space-y-3">
                    <Skeleton className="w-3/4 h-7" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-5/6 h-4" />
                  </div>
                  <div className="pt-2">
                    <Skeleton className="w-20 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
