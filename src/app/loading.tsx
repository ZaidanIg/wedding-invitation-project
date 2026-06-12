import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function RootLoading() {
  return (
    <div className="w-full min-h-screen bg-[#fdfcf9] py-32 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Simulating Hero/Header Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <Skeleton variant="text" className="w-1/4 h-3 mx-auto" />
          <Skeleton variant="text" className="w-3/4 h-10 mx-auto sm:h-12" />
          <Skeleton variant="text" className="w-5/6 h-4 mx-auto" />
        </div>
        
        {/* Simulating Action Buttons */}
        <div className="flex justify-center gap-4">
          <Skeleton variant="rectangular" className="w-36 h-12 rounded-xl" />
          <Skeleton variant="rectangular" className="w-40 h-12 rounded-xl" />
        </div>

        {/* Simulating Grid Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <Skeleton variant="rectangular" className="h-56 rounded-3xl" />
          <Skeleton variant="rectangular" className="h-56 rounded-3xl" />
          <Skeleton variant="rectangular" className="h-56 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
