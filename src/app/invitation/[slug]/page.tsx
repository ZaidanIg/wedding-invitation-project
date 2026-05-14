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
    return { title: 'Undangan Tidak Ditemukan — Wedding Invitation' };
  }

  return {
    title: `${invitation.groomName} & ${invitation.brideName} — Undangan Pernikahan`,
    description: invitation.greeting,
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

      {/* Hide external RSVP for luxury-emerald as it has its own integrated version */}
      {serialized.layout !== 'luxury-emerald' && (
        <section className="py-24 px-4 bg-[#f7f4ed]">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[2px] font-bold text-[#1c1c1c]/40 mb-3">Konfirmasi Kehadiran</p>
              <h2 className="text-[32px] font-display font-bold text-[#1c1c1c] mb-2 tracking-tight">RSVP</h2>
              <p className="text-[#5f5f5d]">Kami sangat menantikan kehadiran Anda.</p>
            </div>
            <div className="bg-[#f7f4ed] rounded-xl border border-[#eceae4] p-6 sm:p-10 shadow-sm">
              <RsvpForm slug={slug} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

