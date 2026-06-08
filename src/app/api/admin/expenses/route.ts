// GET /api/admin/expenses  — List expenses with pagination
// POST /api/admin/expenses — Create a new expense
// DELETE /api/admin/expenses?id=xxx — Delete an expense
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response';
import { handleServiceError, ValidationError } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const sp = new URL(req.url).searchParams;
    const page = Math.max(1, parseInt(sp.get('page') ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(sp.get('limit') ?? '20', 10)));
    const { data, meta } = await adminService.getExpenses(page, limit);
    return paginatedResponse(data, meta);
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
    const data = await adminService.createExpense(body);
    return successResponse(data);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) {
      throw new ValidationError('id parameter is required');
    }
    const data = await adminService.deleteExpense(id);
    return successResponse(data);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
