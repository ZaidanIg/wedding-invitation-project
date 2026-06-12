import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <section className="min-h-screen bg-[#fdfcf9] py-32 px-4 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12 text-center sm:text-left">
          <div className="space-y-3 flex-1">
            <Skeleton variant="text" className="w-2/3 h-8 sm:h-10" />
            <Skeleton variant="text" className="w-1/2 h-4" />
          </div>
          <div className="flex gap-4 justify-center sm:justify-start w-full sm:w-auto">
            <Skeleton variant="rectangular" className="w-32 h-16 rounded-2xl shrink-0" />
            <Skeleton variant="rectangular" className="w-44 h-16 rounded-2xl shrink-0" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Skeleton variant="stats" />
          <Skeleton variant="stats" />
          <Skeleton variant="stats" />
          <Skeleton variant="stats" />
        </div>

        {/* Vertical Invitation Cards List Skeleton */}
        <div className="space-y-8 pt-8">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    </section>
  );
}
