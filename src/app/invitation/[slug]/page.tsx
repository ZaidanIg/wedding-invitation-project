import { notFound, redirect } from 'next/navigation';
import { invitationService } from '@/modules/invitation/server/service';
import { getCoupleSlug } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InvitationRedirectPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  try {
    const invitation = await invitationService.getBySlug(slug);
    const coupleSlug = getCoupleSlug(invitation.groomName, invitation.brideName);
    
    // Build search params query string if any
    const sParams = await searchParams;
    const queryString = new URLSearchParams(sParams as any).toString();
    const targetUrl = `/invitation/${coupleSlug}/${slug}${queryString ? `?${queryString}` : ''}`;
    
    redirect(targetUrl);
  } catch (error) {
    notFound();
  }
}
