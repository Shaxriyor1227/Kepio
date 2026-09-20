import React from 'react';
import { Sheet } from '@/components/paper/Sheet';
import { SkeletonLoader } from '@/components/paper/SkeletonLoader';

export default function LibraryLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Folder Tabs Skeleton */}
      <div className="flex items-center gap-2 border-b border-rule pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-24 bg-paper border border-rule rounded-t-paper animate-pulse" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Sheet key={i} className="p-6 space-y-4">
              <SkeletonLoader lines={3} />
            </Sheet>
          ))}
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Sheet className="p-6 space-y-3">
            <SkeletonLoader lines={2} />
          </Sheet>
          <Sheet className="p-6 space-y-3">
            <SkeletonLoader lines={2} />
          </Sheet>
        </div>
      </div>
    </div>
  );
}
