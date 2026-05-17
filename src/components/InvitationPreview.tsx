'use client';

import type { Invitation } from '@/types';
import { layouts } from './layouts';

interface InvitationPreviewProps {
  invitation: Invitation;
}

export default function InvitationPreview({ invitation }: InvitationPreviewProps) {
  const LayoutComponent = (layouts as any)[invitation.layout] || layouts['elegant-cream'];
  return <LayoutComponent invitation={invitation} isPreview={true} />;
}
