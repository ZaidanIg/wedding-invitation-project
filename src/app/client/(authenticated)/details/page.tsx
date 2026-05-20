import React from 'react';
import { AssetForm } from '@/components/client/AssetForm';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getCachedClientAccount } from '@/lib/client-auth';

export const dynamic = 'force-dynamic';

export default async function ClientDetailsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'CLIENT') {
    return null;
  }

  // Fetch the ClientAccount directly from the database using user ID to prevent session tampering
  const clientAccount = await getCachedClientAccount(session.user.id);

  if (!clientAccount) {
    return null;
  }

  const projectId = clientAccount.projectId;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      agency: true,
    },
  });

  const isDiyProject = project?.agency?.name === 'Sahinaja Direct';

  const invitation = await prisma.invitation.findFirst({
    where: { projectId: projectId },
  });

  const formattedInvitation = invitation
    ? {
        ...invitation,
        eventDate: invitation.eventDate.toISOString().split('T')[0],
      }
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-[#2c2a29] tracking-tight">
          Detail Undangan
        </h1>
        <p className="text-sm text-[#8c8885] mt-1">
          Lengkapi dan perbarui informasi pernikahan Anda di sini.
        </p>
      </div>
      <AssetForm 
        initialData={formattedInvitation} 
        isDiyProject={isDiyProject}
        projectSettings={{
          isWhiteLabel: project?.isWhiteLabel ?? false,
          hasQrScanner: project?.hasQrScanner ?? false,
          projectId: project?.id ?? '',
        }}
      />
    </div>
  );
}
