import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { invitationRepository } from '@/modules/invitation/server/repository';
import InvitationPreview from '@/components/InvitationPreview';
import RsvpForm from '@/components/RsvpForm';
import type { Invitation } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await invitationRepository.findBySlug(slug);

  if (!invitation) {
    return { title: 'Undangan Tidak Ditemukan — Sahinaja' };
  }

  const title = `The Wedding of ${invitation.groomName} & ${invitation.brideName}`;
  const description = invitation.greeting || `Undangan pernikahan digital ${invitation.groomName} & ${invitation.brideName}. Mohon doa restu dan kehadirannya.`;
  
  // Use header photo if available, otherwise first photo from gallery, otherwise default
  const ogImage = invitation.headerPhotoUrl || (invitation.photoUrls && (invitation.photoUrls as string[]).length > 0 ? (invitation.photoUrls as string[])[0] : '/images/hero-bg.png');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/invitation/${slug}`,
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
}


export default async function InvitationPage({ params }: PageProps) {
  const { slug } = await params;
  const invitation = await invitationRepository.findBySlug(slug);

  if (!invitation) {
    notFound();
  }

  if (invitation.tier === 'DRAFT') {
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

  // Increment view count (fire-and-forget)
  invitationRepository.incrementViewCount(slug).catch(() => {});

  // Determine watermark enforcement from project feature flags
  const isWhiteLabel = invitation.project?.isWhiteLabel ?? false;
  const showWatermark = !isWhiteLabel;

  // Serialize for client components
  const serialized: Invitation = {
    ...invitation,
    schedule: (invitation.schedule as unknown as Invitation['schedule']) || [],
    loveStory: (invitation.loveStory as unknown as Invitation['loveStory']) || [],
    digitalGifts: (invitation.digitalGifts as unknown as Invitation['digitalGifts']) || [],
    eventDate: invitation.eventDate.toISOString(),
    createdAt: invitation.createdAt.toISOString(),
    updatedAt: invitation.updatedAt.toISOString(),
    showWatermark,
    guests: (invitation.guests || []).map((g) => ({
      ...g,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
    })),
  };

  return (
    <div className={`min-h-screen ${serialized.layout === 'luxury-emerald' ? 'bg-[#faf7f0]' : 'bg-[#f7f4ed]'}`}>
      <InvitationPreview invitation={serialized} />

      {/* Hide external RSVP for themes that have their own integrated version */}
      {!['luxury-emerald', 'islamic-grace', 'islamic-minimalist', 'islamic-midnight', 'islamic-arabesque', 'christian-elegant', 'hindu-mandala', 'buddhist-zen', 'confucian-oriental'].includes(serialized.layout) && (
        <section className="py-24 px-4 bg-[#f7f4ed]">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[2px] font-bold text-[#1c1c1c]/40 mb-3">Konfirmasi Kehadiran</p>
              <h2 className="text-[32px] font-display font-bold text-[#1c1c1c] mb-2 tracking-tight">RSVP</h2>
              <p className="text-[#5f5f5d]">Kami sangat menantikan kehadiran Anda.</p>
            </div>
            <div className="bg-[#f7f4ed] rounded-xl border border-[#eceae4] p-6 sm:p-10 shadow-sm">
              <RsvpForm slug={slug} tier={serialized.tier} qrEnabled={serialized.qrEnabled} />
            </div>

          </div>
        </section>
      )}
    </div>
  );
}

