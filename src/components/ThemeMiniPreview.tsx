'use client';

import React from 'react';
import type { Invitation, Layout } from '@/types';
import { layouts } from './layouts';

import { MOCK_INVITATION } from '@/constants/demoData';

interface ThemeMiniPreviewProps {
  layout: Layout;
  isInteractable?: boolean;
  scale?: number;
  hideNotch?: boolean;
  hideMockup?: boolean;
  groomName?: string;
  brideName?: string;
}

export default function ThemeMiniPreview({ layout, isInteractable = false, scale = 0.55, hideNotch = false, hideMockup = false, groomName, brideName }: ThemeMiniPreviewProps) {
  const renderLayout = () => {
    const LayoutComponent = (layouts as any)[layout] || layouts['elegant-cream'];
    const invitation = {
      ...MOCK_INVITATION,
      groomName: groomName || MOCK_INVITATION.groomName,
      brideName: brideName || MOCK_INVITATION.brideName,
      stylePreferences: {
        ...MOCK_INVITATION.stylePreferences,
        layout: layout
      }
    };
    return <LayoutComponent invitation={invitation} isPreview={false} />;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center ${isInteractable ? '' : 'bg-transparent pb-8'}`}>
      {!isInteractable && (
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1c1c1c 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      )}

      {/* Container that scales the real invitation component */}
      <div 
        className={`relative origin-center w-[375px] h-[812px] select-none shrink-0 ${isInteractable ? 'pointer-events-auto' : 'pointer-events-none'}`} 
        style={{ transform: `scale(${isInteractable ? 1 : scale})` }}
      >
        {/* Content Layer */}
        <div className={`absolute inset-0 overflow-hidden bg-white ${isInteractable ? '' : 'rounded-[3.5rem]'}`}>
          <div className="w-full h-full overflow-y-auto no-scrollbar">
            {renderLayout()}
          </div>
        </div>
        
        {/* Mockup Frame Layer (Always on Top) */}
        {!isInteractable && !hideMockup && (
          <>
            <div className="absolute inset-0 border-[12px] border-[#1c1c1c] rounded-[3.5rem] shadow-2xl ring-1 ring-black/5 pointer-events-none z-[1000]" />
            <div className="absolute inset-1 border border-white/5 rounded-[3rem] pointer-events-none z-[1001]" />
            {!hideNotch && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1c1c1c] rounded-b-2xl z-[1010]" />
            )}
          </>
        )}
      </div>
      
      {!isInteractable && (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/90 to-transparent z-10" />
      )}
    </div>
  );
}
