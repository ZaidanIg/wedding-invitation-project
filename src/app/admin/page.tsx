import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Pre-fetch initial global metrics server-side
  const [totalUsers, totalInvitations, draftInvitations, liveInvitations, volumeResult] = await Promise.all([
    prisma.user.count(),
    prisma.invitation.count(),
    prisma.invitation.count({ where: { tier: 'DRAFT' } }),
    prisma.invitation.count({ where: { tier: { not: 'DRAFT' } } }),
    prisma.transaction.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
    }),
  ]);

  const totalVolume = volumeResult._sum.amount || 0;

  return (
    <AdminDashboardClient
      initialMetrics={{
        totalUsers,
        totalInvitations,
        paidInvitations: liveInvitations,
        unpaidInvitations: draftInvitations,
        totalVolume,
      }}
    />
  );
}
