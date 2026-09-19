import React from 'react';
import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function SkeletonLoader({ className, lines = 3 }: SkeletonProps) {
  return (
    <div className={cn('space-y-3 w-full animate-pulse opacity-70', className)} aria-hidden="true">
      <div className="h-4 bg-rule/80 rounded-sm w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-rule/60 rounded-sm"
          style={{ width: `${Math.max(40, 100 - i * 15)}%` }}
        />
      ))}
    </div>
  );
}
