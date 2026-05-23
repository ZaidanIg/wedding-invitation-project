import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminService } from '@/modules/admin/server/service';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard — Sahinaja Internal',
  description: 'Business intelligence dashboard untuk tim internal Sahinaja.',
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  // Pre-fetch all initial data server-side for instant render
  const [metrics, revenueChart, userGrowthChart, tierDistribution] = await Promise.all([
    adminService.getDashboardMetrics(),
    adminService.getRevenueChart(30),
    adminService.getUserGrowthChart(30),
    adminService.getTierDistribution(),
  ]);

  return (
    <AdminDashboardClient
      initialMetrics={metrics}
      initialRevenueChart={revenueChart}
      initialUserGrowthChart={userGrowthChart}
      initialTierDistribution={tierDistribution}
    />
  );
}

