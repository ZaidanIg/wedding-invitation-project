// GET /api/admin/metrics — Real-time global KPI metrics
import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const metrics = await adminService.getDashboardMetrics();
    return successResponse(metrics);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
