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
    <div className="flex flex-col animate-fade-in w-full">

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section Skeleton */}
        <div className="relative pt-10 pb-20 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32 bg-white/90 px-4 sm:px-6 lg:px-8 border-b border-border/50">
          <div className="max-w-[1536px] mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Text Column Skeleton */}
              <div className="flex-1 text-center lg:text-left space-y-6 w-full">
                <Skeleton className="w-64 h-6 rounded-full mx-auto lg:mx-0" />
                <div className="space-y-2">
                  <Skeleton className="w-full max-w-xl h-12 sm:h-16 mx-auto lg:mx-0" />
                  <Skeleton className="w-3/4 max-w-lg h-12 sm:h-16 mx-auto lg:mx-0" />
                </div>
                <Skeleton className="w-full max-w-2xl h-6 mx-auto lg:mx-0 opacity-70" />
                <Skeleton className="w-5/6 max-w-xl h-6 mx-auto lg:mx-0 opacity-70" />
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Skeleton className="w-full sm:w-40 h-12 rounded-lg" />
                  <Skeleton className="w-full sm:w-40 h-12 rounded-lg" />
                </div>
                
                {/* Stats Bar Skeleton */}
                <div className="grid grid-cols-2 gap-3 max-w-md pt-4 mx-auto lg:mx-0">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 rounded-xl" />
                  ))}
                </div>
              </div>

              {/* Image Column Skeleton */}
              <div className="flex-1 w-full max-w-md lg:max-w-lg">
                <Skeleton className="w-full aspect-[4/3] rounded-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Explore Section Skeleton */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-[1536px] mx-auto">
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
