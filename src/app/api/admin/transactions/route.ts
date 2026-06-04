// GET /api/admin/transactions — Paginated transaction list with filters
import { NextRequest, NextResponse } from 'next/server';
import { paginatedResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';
import { ValidationError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const { searchParams } = new URL(req.url);
    const rawFilters = {
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
      status: searchParams.get('status') ?? undefined,
      type: searchParams.get('type') ?? undefined,
      startDate: searchParams.get('startDate') ?? undefined,
      endDate: searchParams.get('endDate') ?? undefined,
    };

    const result = await adminService.getTransactions(rawFilters);
    return paginatedResponse(result.data, result.meta);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
