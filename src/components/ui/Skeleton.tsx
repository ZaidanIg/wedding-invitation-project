import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'stats' | 'form';
}

export default function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  // Base classes with dynamic pulse and soft gold/stone shimmer
  const baseClass = "animate-pulse bg-stone-200/50 dark:bg-stone-800/30 rounded-xl relative overflow-hidden";
  const shimmerOverlay = "after:absolute after:inset-0 after:translate-x-[-100%] after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-stone-100/10 after:to-transparent";

  if (variant === 'text') {
    return (
      <div className={`${baseClass} ${shimmerOverlay} h-4 w-full ${className}`} />
    );
  }

  if (variant === 'circular') {
    return (
      <div className={`${baseClass} ${shimmerOverlay} rounded-full shrink-0 ${className}`} />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`border border-stone-200/60 rounded-[2.5rem] bg-white p-6 md:p-8 space-y-6 shadow-sm ${className}`}>
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" className="w-14 h-14" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" className="w-1/3 h-5" />
            <Skeleton variant="text" className="w-1/4 h-3" />
          </div>
        </div>
        <Skeleton variant="rectangular" className="h-44 w-full rounded-3xl" />
        <div className="space-y-3">
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-5/6 h-4" />
          <Skeleton variant="text" className="w-2/3 h-4" />
        </div>
        <div className="flex gap-4 pt-4 border-t border-stone-100">
          <Skeleton variant="rectangular" className="h-12 flex-1 rounded-xl" />
          <Skeleton variant="rectangular" className="h-12 flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (variant === 'stats') {
    return (
      <div className={`p-8 bg-white border border-[#eceae4] rounded-[2.5rem] shadow-sm space-y-4 ${className}`}>
        <Skeleton variant="text" className="w-1/2 h-3" />
        <Skeleton variant="text" className="w-1/3 h-8" />
        <Skeleton variant="text" className="w-1/4 h-3" />
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="space-y-2">
          <Skeleton variant="text" className="w-1/4 h-3" />
          <Skeleton variant="rectangular" className="h-12 w-full rounded-2xl" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" className="w-1/3 h-3" />
          <Skeleton variant="rectangular" className="h-12 w-full rounded-2xl" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" className="w-1/5 h-3" />
          <Skeleton variant="rectangular" className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClass} ${shimmerOverlay} ${className}`} />
  );
}
