import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getInvitationBySlug, incrementViewCount } from '@/services/db.service';
import InvitationPreview from '@/components/InvitationPreview';
import RsvpForm from '@/components/RsvpForm';
import type { Invitation } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    return { title: 'Undangan Tidak Ditemukan — Sahin' };
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
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  // Increment view count (fire-and-forget)
  incrementViewCount(slug).catch(() => {});

  // Serialize for client components
  const serialized: Invitation = {
    ...invitation,
    schedule: (invitation.schedule as any) || [],
    loveStory: (invitation.loveStory as any) || [],
    digitalGifts: (invitation.digitalGifts as any) || [],
    eventDate: invitation.eventDate.toISOString(),
    createdAt: invitation.createdAt.toISOString(),
    updatedAt: invitation.updatedAt.toISOString(),
    guests: (invitation.guests || []).map((g: any) => ({
      ...g,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
    })),
  };

  return (
    <div className={`min-h-screen ${serialized.layout === 'luxury-emerald' ? 'bg-[#faf7f0]' : 'bg-[#f7f4ed]'}`}>
      <InvitationPreview invitation={serialized} />

      {/* Hide external RSVP for themes that have their own integrated version */}
      {serialized.layout !== 'luxury-emerald' && serialized.layout !== 'islamic-grace' && (
        <section className="py-24 px-4 bg-[#f7f4ed]">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[2px] font-bold text-[#1c1c1c]/40 mb-3">Konfirmasi Kehadiran</p>
              <h2 className="text-[32px] font-display font-bold text-[#1c1c1c] mb-2 tracking-tight">RSVP</h2>
              <p className="text-[#5f5f5d]">Kami sangat menantikan kehadiran Anda.</p>
            </div>
            <div className="bg-[#f7f4ed] rounded-xl border border-[#eceae4] p-6 sm:p-10 shadow-sm">
              <RsvpForm slug={slug} tier={serialized.tier} />
            </div>

          </div>
        </section>
      )}
    </div>
  );
}

