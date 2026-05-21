import { notFound, redirect } from 'next/navigation';
import { invitationService } from '@/modules/invitation/server/service';
import { getCoupleSlug } from '@/lib/utils';

export default async function AttendanceRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const invitation = await invitationService.getBySlug(slug);
    const coupleSlug = getCoupleSlug(invitation.groomName, invitation.brideName);
    redirect(`/invitation/${coupleSlug}/${slug}/attendance`);
  } catch {
    notFound();
  }
}
