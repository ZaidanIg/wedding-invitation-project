import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function CreateLoading() {
  return (
    <section className="min-h-screen bg-[#fdfcf9] py-24 sm:py-32 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f43f5e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none animate-float" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Form Skeleton */}
          <div className="lg:col-span-7 space-y-8 bg-white border border-[#eceae4] p-8 md:p-10 rounded-[2.5rem] shadow-sm">
            {/* Step Indicators */}
            <div className="flex justify-between items-center pb-6 border-b border-stone-100">
              <Skeleton variant="circular" className="w-10 h-10" />
              <div className="flex-1 h-1 bg-stone-100 mx-4" />
              <Skeleton variant="circular" className="w-10 h-10" />
              <div className="flex-1 h-1 bg-stone-100 mx-4" />
              <Skeleton variant="circular" className="w-10 h-10" />
            </div>

            {/* Title Section */}
            <div className="space-y-3">
              <Skeleton variant="text" className="w-1/3 h-6" />
              <Skeleton variant="text" className="w-2/3 h-4" />
            </div>

            {/* Form Fields */}
            <Skeleton variant="form" />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-stone-100">
              <Skeleton variant="rectangular" className="w-32 h-14 rounded-2xl" />
              <Skeleton variant="rectangular" className="w-40 h-14 rounded-2xl" />
            </div>
          </div>

          {/* Right Side: Phone Preview Mockup Skeleton */}
          <div className="lg:col-span-5 hidden lg:block sticky top-32">
            <div className="relative mx-auto w-[320px] h-[640px] bg-stone-100/60 rounded-[3rem] border-8 border-stone-800 shadow-2xl flex flex-col items-center justify-between p-6">
              {/* Speaker / Notch */}
              <div className="w-32 h-5 bg-stone-800 rounded-b-xl absolute top-0" />
              
              {/* Inner preview contents */}
              <div className="w-full flex-1 flex flex-col items-center justify-center space-y-6 pt-10">
                <Skeleton variant="circular" className="w-20 h-20 bg-stone-200/50" />
                <Skeleton variant="text" className="w-2/3 h-4 mx-auto bg-stone-200/50" />
                <Skeleton variant="text" className="w-1/2 h-8 mx-auto bg-stone-200/50" />
                <Skeleton variant="text" className="w-3/4 h-3 mx-auto bg-stone-200/50" />
                
                <div className="w-full pt-8 space-y-3">
                  <Skeleton variant="rectangular" className="h-10 w-full rounded-xl bg-stone-200/50" />
                  <Skeleton variant="rectangular" className="h-10 w-full rounded-xl bg-stone-200/50" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
