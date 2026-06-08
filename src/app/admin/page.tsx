// src/app/admin/page.tsx — Main Admin BI Dashboard (Server Component)
import React from 'react';
import { adminService } from '@/modules/admin/server/service';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [metrics, revenueChart, userGrowth, tierDistribution] = await Promise.all([
    adminService.getDashboardMetrics(),
    adminService.getRevenueChart(30),
    adminService.getUserGrowthChart(30),
    adminService.getTierDistribution(),
  ]);

  return (
    <AdminDashboardClient
      initialMetrics={metrics}
      initialRevenueChart={revenueChart}
      initialUserGrowthChart={userGrowth}
      initialTierDistribution={tierDistribution}
    />
  );
}
