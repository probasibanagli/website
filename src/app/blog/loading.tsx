import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Banner Skeleton */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="w-48 h-4 mb-4" />
          <Skeleton className="w-64 h-10 mb-2" />
          <Skeleton className="w-full max-w-2xl h-6" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Blog Post (Hero) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <Skeleton className="w-full h-80" />
              <div className="p-6 space-y-4">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-3/4 h-8" />
                <Skeleton className="w-full h-4 mt-4" />
                <Skeleton className="w-5/6 h-4" />
                <div className="flex gap-4 pt-4">
                  <Skeleton className="w-24 h-6 rounded-full" />
                  <Skeleton className="w-32 h-6 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Smaller Posts */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-border p-4 flex gap-4">
                <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-5/6 h-4" />
                  <Skeleton className="w-1/2 h-3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
