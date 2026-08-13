import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TravelLoading() {
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
          {/* Left/Middle Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <Skeleton className="w-48 h-8 mb-6" />
              <div className="flex gap-4 mb-6">
                <Skeleton className="w-1/2 h-10 rounded-xl" />
                <Skeleton className="w-1/2 h-10 rounded-xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="w-full h-12 rounded-xl" />
                <Skeleton className="w-full h-12 rounded-xl" />
                <Skeleton className="w-full h-32 rounded-xl mt-4" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 h-[400px]">
               <Skeleton className="w-full h-full rounded-xl" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <Skeleton className="w-32 h-6 mb-4" />
              <Skeleton className="w-full h-32 rounded-xl mb-4" />
              <Skeleton className="w-full h-16 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
