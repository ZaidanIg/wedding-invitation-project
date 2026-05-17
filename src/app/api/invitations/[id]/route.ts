// GET/PUT/DELETE /api/invitations/[id]

import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { invitationService } from '@/modules/invitation/server/service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await invitationService.getById(id);

    return successResponse(result, 'Invitation fetched');
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;
    const body = await request.json();
    const result = await invitationService.update(id, body, session.user.id);

    return successResponse(result, 'Invitation updated');
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;
    const result = await invitationService.delete(id, session.user.id);

    return successResponse(result, 'Invitation deleted');
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
