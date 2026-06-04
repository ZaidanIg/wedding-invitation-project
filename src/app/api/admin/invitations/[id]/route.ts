// GET  /api/admin/invitations/[id] — Get single invitation detail
// PATCH /api/admin/invitations/[id] — Override tier / reset AI count
import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { adminService } from '@/modules/admin/server/service';
import { ValidationError } from '@/lib/errors';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }
  const { id } = await params;
  // Return from the broader invitations list filtered — sufficient for admin use
  const data = await adminService.getInvitations(id);
  const inv = data.find((i) => i.id === id);
  if (!inv) {
    return errorResponse('Invitation not found', 404, 'NOT_FOUND');
  }
  return successResponse(inv);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const data = await adminService.updateInvitationTier(
      id,
      body,
      session.user.email ?? 'unknown'
    );
    return successResponse(data);
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}

