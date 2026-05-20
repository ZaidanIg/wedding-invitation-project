import React from 'react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ClientLayoutWrapper } from '@/components/client/ClientLayoutWrapper';
import { getCachedClientAccount } from '@/lib/client-auth';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // If not a CLIENT role, the middleware will redirect — this is a fallback safety check
  if (!session?.user || session.user.role !== 'CLIENT') {
    return null;
  }

  // Fetch the ClientAccount directly from the database using user ID to prevent session tampering
  const clientAccount = await getCachedClientAccount(session.user.id);

  if (!clientAccount) {
    return null;
  }

  const projectId = clientAccount.projectId;

  // Get the invitation slug for the "View Invitation" link
  let invitationSlug: string | null = null;
  const invitation = await prisma.invitation.findFirst({
    where: { projectId },
    select: { slug: true },
  });
  invitationSlug = invitation?.slug ?? null;

  return (
    <ClientLayoutWrapper 
      userName={session.user.name} 
      invitationSlug={invitationSlug}
    >
      {children}
    </ClientLayoutWrapper>
  );
}
