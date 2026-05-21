import { notFound, redirect } from 'next/navigation';
import { invitationService } from '@/modules/invitation/server/service';
import { getCoupleSlug } from '@/lib/utils';

export default async function BlastRedirectPage({ params }: { params: Promise<{ coupleNames: string }> }) {
  const { coupleNames } = await params;
  try {
    const invitation = await invitationService.getBySlug(coupleNames);
    const coupleSlug = getCoupleSlug(invitation.groomName, invitation.brideName);
    redirect(`/invitation/${coupleSlug}/${coupleNames}/blast`);
  } catch {
    notFound();
  }
}
