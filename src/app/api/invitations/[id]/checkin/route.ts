// POST /api/invitations/[id]/checkin — Check in a guest

import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { guestService } from '@/modules/guest/server/service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { id } = await params;
    const body = await request.json();
    const result = await guestService.checkin(id, body, session.user.id);

    return successResponse(result, 'Guest checked in');
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
