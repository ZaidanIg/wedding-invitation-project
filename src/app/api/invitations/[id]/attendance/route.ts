// POST /api/invitations/[id]/attendance — Public guest book self check-in / registration

import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { guestService } from '@/modules/guest/server/service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await guestService.submitAttendance(id, body);

    return successResponse(result, 'Attendance registered successfully', 201);
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
