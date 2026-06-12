'use client';

import { useState, useEffect } from 'react';
import type { Invitation } from '@/types';
import { layouts } from '../layouts';
import Link from 'next/link';
import { TierProvider } from '../layouts/shared';
import ThemeNavbar from './ThemeNavbar';
import DynamicThemeRenderer from '../layouts/DynamicThemeRenderer';

const PREMIUM_LAYOUTS = [
  'golden-classic', 'luxury-emerald', 'forest-grace', 'garden-chapel', 
  'mandala-fusion', 'zen-garden', 'oriental-luxe', 'onyx-premium', 
  'batik-heritage', 'premium-charcoal', 'premium-javanese',
  'elegant-sundanese'
];

interface InvitationPreviewProps {
  invitation: Invitation;
  isPreview?: boolean;
  themeTemplate?: any;
}

export default function InvitationPreview({ invitation, isPreview = false, themeTemplate }: InvitationPreviewProps) {
  const isHardcoded = invitation.layout in layouts;
  const LayoutComponent = isHardcoded ? (layouts as Record<string, React.ElementType>)[invitation.layout] : null;
  const isDraft = invitation.tier === 'DRAFT';

  const [dbTheme, setDbTheme] = useState<any>(themeTemplate || null);
  const [loadingTheme, setLoadingTheme] = useState(!isHardcoded && !themeTemplate);

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

  useEffect(() => {
    if (!isHardcoded && !themeTemplate) {
      // loadingTheme is already `true` from useState initialization — no need to call setLoadingTheme(true)
      fetch(`/api/themes/${invitation.layout}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setDbTheme(data.data);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch dynamic theme template:', err);
        })
        .finally(() => {
          setLoadingTheme(false);
        });
    } else if (themeTemplate) {
      setTimeout(() => setDbTheme(themeTemplate), 0);
    }
  }, [invitation.layout, isHardcoded, themeTemplate]);

  if (loadingTheme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9]">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPremiumTheme = PREMIUM_LAYOUTS.includes(invitation.layout) || dbTheme?.isPremium;

  return (
    <TierProvider tier={invitation.tier} isPreview={isPreview}>
      <div className="relative min-h-screen flex flex-col justify-between">
        <div className="flex-1 w-full">
          {!isHardcoded && dbTheme ? (
            <DynamicThemeRenderer invitation={invitation} config={dbTheme.config} isPreview={isPreview} />
          ) : LayoutComponent ? (
            <LayoutComponent invitation={invitation} isPreview={isPreview} />
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9] text-sm text-stone-500">
              Template tema tidak didukung.
            </div>
          )}
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
        
        {isPremiumTheme && <ThemeNavbar />}
      </div>
    </TierProvider>
  );
}

