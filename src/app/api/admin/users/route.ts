// GET /api/admin/users  — List users with pagination
// PATCH /api/admin/users — Update user role
import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response';
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
    const sp = new URL(req.url).searchParams;
    const search = sp.get('search') ?? undefined;
    const page = Math.max(1, parseInt(sp.get('page') ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(sp.get('limit') ?? '20', 10)));
    const { data, meta } = await adminService.getUsers(search, page, limit);
    return paginatedResponse(data, meta);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const body = await req.json();
    const data = await adminService.updateUserRole(body, session.user.email ?? 'unknown');
    return successResponse(data);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
