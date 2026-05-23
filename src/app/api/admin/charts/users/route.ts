// GET /api/admin/charts/users?days=7|30|90|365
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';
import { ValidationError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = searchParams.get('days');
    const data = await adminService.getUserGrowthChart(days);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Failed to fetch chart data';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
