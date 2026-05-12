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
    return { title: 'Invitation Not Found — WeddingAI' };
  }

  return {
    title: `${invitation.groomName} & ${invitation.brideName} — Wedding Invitation`,
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
    eventDate: invitation.eventDate.toISOString(),
    createdAt: invitation.createdAt.toISOString(),
    updatedAt: invitation.updatedAt.toISOString(),
    guests: invitation.guests.map((g) => ({
      ...g,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
    })),
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <InvitationPreview invitation={serialized} />

      {/* RSVP Section — same cream theme */}
      <section className="py-16 px-4 bg-[#f5f0eb]">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-3">Confirm Attendance</p>
            <h2 className="text-3xl font-display font-bold text-stone-800 mb-2">RSVP</h2>
            <p className="text-sm text-stone-500">We can&apos;t wait to celebrate with you.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <RsvpForm slug={slug} />
          </div>
        </div>
      </section>
    </div>
  );
}
