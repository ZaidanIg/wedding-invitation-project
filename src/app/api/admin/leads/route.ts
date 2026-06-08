// GET /api/admin/leads  — List all leads
// POST /api/admin/leads — Create a new lead
// PATCH /api/admin/leads?id=xxx — Update lead status
// DELETE /api/admin/leads?id=xxx — Delete a lead
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError, ValidationError } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const data = await adminService.getLeads();
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
    const data = await adminService.createLead(body);
    return successResponse(data);
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
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      throw new ValidationError('id parameter is required');
    }
    const body = await req.json();
    const data = await adminService.updateLeadStatus(id, body);
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
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      throw new ValidationError('id parameter is required');
    }
    const data = await adminService.deleteLead(id);
    return successResponse(data);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
