'use client';

import { useEffect } from 'react';
import type { Invitation } from '@/types';
import { layouts } from '../layouts';
import Link from 'next/link';
import { TierProvider } from '../layouts/shared';
import ThemeNavbar from './ThemeNavbar';

const PREMIUM_LAYOUTS = [
  'golden-classic', 'luxury-emerald', 'forest-grace', 'garden-chapel', 
  'mandala-fusion', 'zen-garden', 'oriental-luxe', 'onyx-premium', 
  'batik-heritage', 'premium-charcoal', 'premium-javanese',
  'elegant-sundanese'
];

interface InvitationPreviewProps {
  invitation: Invitation;
  isPreview?: boolean;
}

export default function InvitationPreview({ invitation, isPreview = false }: InvitationPreviewProps) {
  const LayoutComponent = (layouts as any)[invitation.layout] || layouts['elegant-cream'];
  // v1.2: isPaid removed — derive from tier
  const isDraft = invitation.tier === 'DRAFT';

  useEffect(() => {
    if (!isPreview && invitation.slug) {
      fetch('/api/invitations/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: invitation.slug }),
      }).catch((err) => {
        console.error('Failed to record view:', err);
      });
    }
  }, [isPreview, invitation.slug]);

  return (
    <TierProvider tier={invitation.tier} isPreview={isPreview}>
      <div className="relative min-h-screen flex flex-col justify-between">
        <div className="flex-1 w-full">
          <LayoutComponent invitation={invitation} isPreview={isPreview} />
        </div>
        
        {isDraft && (
          <div className="bg-[#1c1c1c] text-white/80 py-4 px-6 text-center text-xs font-semibold tracking-wide border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 select-none z-[100] relative w-full">
            <span>Dibuat dengan ❤️ oleh</span>
            <Link href="/" target="_blank" className="text-rose-400 hover:text-rose-300 font-bold transition-all underline decoration-rose-400/30 hover:decoration-rose-300 underline-offset-4">
              Sahinaja
            </Link>
            <span className="text-[10px] text-white/40 font-normal sm:ml-2 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              Free Draft Mode
            </span>
          </div>
        )}
        
        {PREMIUM_LAYOUTS.includes(invitation.layout) && <ThemeNavbar />}
      </div>
    </TierProvider>
  );
}

