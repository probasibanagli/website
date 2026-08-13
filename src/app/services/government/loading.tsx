import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function GovernmentServicesLoading() {
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

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
              <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-4" />
              <Skeleton className="w-3/4 h-6 mx-auto" />
              <Skeleton className="w-full h-4 mx-auto" />
              <Skeleton className="w-5/6 h-4 mx-auto" />
              <Skeleton className="w-full h-10 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
