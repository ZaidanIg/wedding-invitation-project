import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { invitationService } from '@/modules/invitation/server/service';
import { invitationMapper } from '@/modules/invitation/server/mapper';
import { auth } from '@/lib/auth';
import InvitationPreview from '@/components/themes/InvitationPreview';
import RsvpForm from '@/components/themes/RsvpForm';
import type { Invitation } from '@/types';
import { ForbiddenError } from '@/lib/errors';
import { getCoupleSlug } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { layouts } from '@/components/layouts';


interface PageProps {
  params: Promise<{ coupleNames: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { coupleNames, slug } = await params;
  void coupleNames;
  try {
    const entity = await invitationService.getBySlug(slug);
    // v1.2: use mapper to reconstruct flat shape from relational entity
    const invitation = invitationMapper.toResponse(entity as Record<string, unknown>);
    const title = `The Wedding of ${invitation.groomName} & ${invitation.brideName}`;
    const description = invitation.greeting || `Undangan pernikahan digital ${invitation.groomName} & ${invitation.brideName}. Mohon doa restu dan kehadirannya.`;
    const ogImage = invitation.headerPhotoUrl || (invitation.photoUrls && invitation.photoUrls.length > 0 ? invitation.photoUrls[0] : '/images/hero-bg.png');

    const correctCoupleSlug = getCoupleSlug(invitation.groomName, invitation.brideName);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/invitation/${correctCoupleSlug}/${slug}`,
        type: 'article',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: 'Undangan Tidak Ditemukan — Sahinaja' };
  }
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { coupleNames, slug } = await params;
  
  const session = await auth();
  const requestingUserId = session?.user?.id;
  const requestingUserRole = session?.user?.role;

  let invitation;
  try {
    invitation = await invitationService.getBySlug(slug, requestingUserId, requestingUserRole);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      // Return unpaid state paywall
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9] px-4">
          <div className="max-w-md w-full text-center p-8 bg-white border border-[#eceae4] rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/5 blur-[50px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 blur-[50px] rounded-full" />
            
            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6 border border-rose-200">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-[#1c1c1c] mb-3">Undangan Belum Aktif</h2>
              <p className="text-xs text-[#6b6b6b] leading-relaxed font-semibold mb-6">
                Undangan pernikahan digital ini belum diaktifkan oleh pemiliknya. Silakan lakukan pembayaran pada dashboard Sahinaja Anda untuk mengaktifkan seluruh fitur undangan ini secara publik.
              </p>
              <a href="/dashboard" className="inline-block w-full py-4 bg-rose-gradient text-white rounded-2xl font-bold shadow-lg shadow-rose-500/20 hover:scale-[1.02] transition-all text-sm">
                Masuk ke Dashboard Sahinaja
              </a>
            </div>
          </div>
        </div>
      );
    }
    
    // Otherwise standard 404
    notFound();
  }

  // Canonical Couple Name Verification & Redirection
  const correctCoupleSlug = getCoupleSlug(invitation.groomName, invitation.brideName);
  if (coupleNames !== correctCoupleSlug) {
    const sParams = await searchParams;
    const queryString = new URLSearchParams(sParams as any).toString();
    redirect(`/invitation/${correctCoupleSlug}/${slug}${queryString ? `?${queryString}` : ''}`);
  }



  // Serialize for client components using the mapper
  // v1.2: mapper reconstructs photoUrls/schedule/loveStory/digitalGifts from relations
  const mapped = invitationMapper.toResponse(invitation as Record<string, unknown>);

  const guests = (invitation.guests || []).map((g: any) => ({
    ...g,
    createdAt: g.createdAt instanceof Date ? g.createdAt.toISOString() : new Date(g.createdAt).toISOString(),
    updatedAt: g.updatedAt instanceof Date ? g.updatedAt.toISOString() : new Date(g.updatedAt).toISOString(),
  }));

  const serialized: Invitation = {
    ...mapped,
    tier: mapped.tier as import('@/types').Tier,
    guests,
    rsvpSubmitted: false, // Handled client-side
    rsvpGuestId: null,    // Handled client-side
    rsvpStatus: null,     // Handled client-side
    rsvpName: '',         // Handled client-side
    rsvpPhone: '',        // Handled client-side
  };

  const isHardcodedLayout = serialized.layout in layouts;
  let themeTemplate = null;
  if (!isHardcodedLayout) {
    themeTemplate = await prisma.themeTemplate.findUnique({
      where: { slug: serialized.layout },
    });
  }

  const showRsvp = serialized.tier !== 'BASIC' && serialized.tier !== 'DRAFT';

  return (
    <div className={`min-h-screen ${['luxury-emerald', 'premium-charcoal'].includes(serialized.layout) ? 'bg-[#111111]' : 'bg-[#f7f4ed]'}`}>
      <InvitationPreview invitation={serialized} isPreview={false} themeTemplate={themeTemplate} />

      {/* Hide external RSVP for themes that have their own integrated version or if tier doesn't support it */}
      {showRsvp && !['luxury-emerald', 'islamic-grace', 'islamic-minimalist', 'islamic-midnight', 'islamic-arabesque', 'christian-elegant', 'hindu-mandala', 'buddhist-zen', 'confucian-oriental', 'premium-charcoal', 'premium-javanese', 'elegant-sundanese'].includes(serialized.layout) && (
        <section className="py-24 px-4 bg-[#f7f4ed]">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[2px] font-bold text-[#1c1c1c]/40 mb-3">Konfirmasi Kehadiran</p>
              <h2 className="text-[32px] font-display font-bold text-[#1c1c1c] mb-2 tracking-tight">RSVP</h2>
              <p className="text-[#5f5f5d]">Kami sangat menantikan kehadiran Anda.</p>
            </div>
            <div className="bg-[#f7f4ed] rounded-xl border border-[#eceae4] p-6 sm:p-10 shadow-sm">
              <RsvpForm 
                slug={slug} 
                tier={serialized.tier} 
                qrEnabled={serialized.qrEnabled} 
                initialSubmitted={serialized.rsvpSubmitted}
                initialGuestId={serialized.rsvpGuestId}
                initialStatus={serialized.rsvpStatus as any}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
