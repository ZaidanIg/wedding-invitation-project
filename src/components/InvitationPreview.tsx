'use client';

import type { Invitation } from '@/types';
import ElegantCream from './layouts/ElegantCream';
import RoyalBlue from './layouts/RoyalBlue';
import RoseGarden from './layouts/RoseGarden';
import GoldenClassic from './layouts/GoldenClassic';

interface InvitationPreviewProps {
  invitation: Invitation;
}

export default function InvitationPreview({ invitation }: InvitationPreviewProps) {
  // Route to the selected layout
  switch (invitation.layout) {
    case 'royal-blue':
      return <RoyalBlue invitation={invitation} />;
    case 'rose-garden':
      return <RoseGarden invitation={invitation} />;
    case 'golden-classic':
      return <GoldenClassic invitation={invitation} />;
    case 'elegant-cream':
    default:
      return <ElegantCream invitation={invitation} />;
  }
}
