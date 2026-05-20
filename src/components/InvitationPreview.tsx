'use client';

import React from 'react';
import type { Invitation } from '@/types';
import { layouts } from './layouts';
import Link from 'next/link';

interface InvitationPreviewProps {
  invitation: Invitation;
}

export default function InvitationPreview({ invitation }: InvitationPreviewProps) {
  const LayoutComponent = (layouts as Record<string, React.ComponentType<{ invitation: Invitation; isPreview: boolean }>>)[invitation.layout] || layouts['elegant-cream'];
  const shouldShowWatermark = invitation.showWatermark ?? invitation.tier === 'DRAFT';

  return (
    <div className="min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      <div className="w-full flex-1">
        <LayoutComponent invitation={invitation} isPreview={true} />
      </div>

      {/* Watermark Section (Only shown if tier is DRAFT or showWatermark is true) */}
      {shouldShowWatermark && (
        <div className="bg-[#1c1c1c] text-white/80 py-4 px-6 text-center text-xs font-semibold tracking-wide border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 select-none z-[100] relative max-w-lg mx-auto w-full shadow-2xl">
          <span>Dibuat dengan ❤️ oleh</span>
          <Link href="/" target="_blank" className="text-rose-400 hover:text-rose-300 font-bold transition-all underline decoration-rose-400/30 hover:decoration-rose-300 underline-offset-4">
            Sahinaja
          </Link>
          <span className="text-[10px] text-white/40 font-normal sm:ml-2 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            {invitation.tier === 'DRAFT' ? 'Free Draft Mode' : 'Powered by Sahinaja'}
          </span>
        </div>
      )}
    </div>
  );
}
