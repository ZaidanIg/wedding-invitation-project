// GET /api/admin/marketing  — List all marketing spends
// POST /api/admin/marketing — Create a new marketing spend
import { NextRequest } from 'next/server';
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
    const data = await adminService.getMarketingSpends();
    return successResponse(data);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const body = await req.json();
    const data = await adminService.createMarketingSpend(body);
    return successResponse(data);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
