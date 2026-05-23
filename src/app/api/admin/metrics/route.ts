// GET /api/admin/metrics — Real-time global KPI metrics
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const metrics = await adminService.getDashboardMetrics();
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch metrics';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
