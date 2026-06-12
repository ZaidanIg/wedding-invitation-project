import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function ThemesLoading() {
  return (
    <section className="min-h-screen bg-[#fdfcf9] py-32 px-4 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Skeleton variant="text" className="w-1/4 h-3 mx-auto" />
          <Skeleton variant="text" className="w-3/4 h-10 sm:h-12 mx-auto" />
          <Skeleton variant="text" className="w-5/6 h-4 mx-auto" />
        </div>

        {/* Filter categories tabs skeleton */}
        <div className="flex justify-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          <Skeleton variant="rectangular" className="w-24 h-10 rounded-full shrink-0" />
          <Skeleton variant="rectangular" className="w-28 h-10 rounded-full shrink-0" />
          <Skeleton variant="rectangular" className="w-24 h-10 rounded-full shrink-0" />
          <Skeleton variant="rectangular" className="w-32 h-10 rounded-full shrink-0" />
        </div>

        {/* Theme Cards Grid (8 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[#eceae4] rounded-3xl p-4 space-y-4 shadow-sm flex flex-col justify-between h-[360px]">
              <Skeleton variant="rectangular" className="h-48 w-full rounded-2xl" />
              <div className="space-y-2 px-2">
                <Skeleton variant="text" className="w-1/2 h-5" />
                <Skeleton variant="text" className="w-1/3 h-3" />
              </div>
              <div className="flex gap-3 pt-2">
                <Skeleton variant="rectangular" className="h-10 flex-1 rounded-xl" />
                <Skeleton variant="rectangular" className="h-10 w-12 rounded-xl shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
