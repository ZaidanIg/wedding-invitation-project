import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function PricingLoading() {
  return (
    <section className="min-h-screen bg-[#fdfcf9] py-32 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Skeleton variant="text" className="w-1/4 h-3 mx-auto" />
          <Skeleton variant="text" className="w-3/4 h-10 sm:h-12 mx-auto" />
          <Skeleton variant="text" className="w-5/6 h-4 mx-auto" />
        </div>

        {/* Pricing Cards Grid (4 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-[#eceae4] p-8 rounded-[2.5rem] shadow-sm flex flex-col space-y-6 justify-between h-[480px]">
              <div className="space-y-4">
                <Skeleton variant="text" className="w-1/2 h-5" />
                <Skeleton variant="text" className="w-2/3 h-10" />
                <Skeleton variant="text" className="w-full h-3" />
                <div className="pt-4 space-y-2">
                  <Skeleton variant="text" className="w-5/6 h-3" />
                  <Skeleton variant="text" className="w-4/5 h-3" />
                  <Skeleton variant="text" className="w-full h-3" />
                  <Skeleton variant="text" className="w-3/4 h-3" />
                </div>
              </div>
              <Skeleton variant="rectangular" className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
