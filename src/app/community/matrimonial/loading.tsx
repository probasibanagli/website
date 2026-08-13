import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function MatrimonialLoading() {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <Skeleton className="w-32 h-6 mb-4" />
              <div className="space-y-4">
                <Skeleton className="w-full h-10 rounded-xl" />
                <Skeleton className="w-full h-10 rounded-xl" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Profiles Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-2">
              <Skeleton className="w-32 h-10 rounded-xl" />
              <Skeleton className="w-32 h-10 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-border p-6 text-center">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="w-48 h-6 mx-auto mb-2" />
                  <Skeleton className="w-32 h-4 mx-auto mb-4" />
                  <div className="grid grid-cols-2 gap-2 text-left mb-4">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                  </div>
                  <Skeleton className="w-full h-10 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
