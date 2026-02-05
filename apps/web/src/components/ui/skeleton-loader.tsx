'use client';

import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  lines?: number;
  lineHeight?: number;
  gap?: number;
  className?: string;
}

export function SkeletonLoader({
  lines = 5,
  lineHeight = 48,
  gap = 8,
  className,
}: SkeletonLoaderProps) {
  return (
    <div className={cn('space-y-2', className)} style={{ gap: `${gap}px` }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer rounded-lg"
          style={{ height: `${lineHeight}px` }}
        />
      ))}
    </div>
  );
}

export function SkeletonText({
  width = '100%',
  className,
}: {
  width?: string;
  className?: string;
}) {
  return (
    <div
      className={cn('skeleton-shimmer h-4 rounded', className)}
      style={{ width }}
    />
  );
}
