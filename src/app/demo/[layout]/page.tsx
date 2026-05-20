'use client';

import { use } from 'react';
import { layouts } from '@/components/layouts';
import { MOCK_INVITATION } from '@/constants/demoData';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import InvitationPreview from '@/components/InvitationPreview';

interface PageProps {
  params: Promise<{ layout: string }>;
}

export default function DemoPage({ params }: PageProps) {
  const { layout } = use(params);
  
  const LayoutComponent = (layouts as any)[layout];

  if (!LayoutComponent) {
    return notFound();
  }

  // Override mock invitation layout to match the URL parameter
  const invitation = {
    ...MOCK_INVITATION,
    layout: layout,
    stylePreferences: {
      ...(MOCK_INVITATION as any).stylePreferences,
      layout: layout
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Premium Corner Ribbon */}
      <div className="fixed top-0 right-0 z-[10000] w-32 h-32 pointer-events-none overflow-hidden hidden sm:block">
        <div className="absolute top-7 -right-8 w-40 py-1 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-[0.2em] text-center rotate-45 shadow-lg backdrop-blur-sm border-y border-white/20">
          Demo Version
        </div>
      </div>

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-[10000]">
        <button 
          onClick={() => window.location.href = '/themes'}
          className="bg-white/90 hover:bg-white text-[#1c1c1c] p-2.5 rounded-full shadow-2xl backdrop-blur-md border border-black/5 transition-all active:scale-95 group cursor-pointer"
          title="Kembali ke Galeri"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Mobile Demo Badge */}
      <div className="fixed top-20 left-6 z-[10000] sm:hidden pointer-events-none">
        <div className="bg-red-600/90 text-white px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm">
          Demo
        </div>
      </div>

      {/* Premium Mockup Frame & Split-screen Invitation Preview */}
      <InvitationPreview invitation={invitation as any} />

      {/* Floating CTA Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] w-[90%] max-w-md">
        <div className="glass-dark rounded-2xl p-4 flex items-center justify-between shadow-2xl border border-white/10 bg-[#1c1c1c]">
          <div className="flex flex-col">
            <span className="text-white/50 text-[10px] uppercase tracking-wider font-bold">Tertarik dengan tema ini?</span>
            <span className="text-white text-sm font-display font-medium">Buat undangan premium Anda</span>
          </div>
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-rose-500/20 cursor-pointer"
          >
            Buat Undangan Seperti Ini
          </button>
        </div>
      </div>
    </div>
  );
}
