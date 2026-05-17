// POST /api/invitations/[id]/rsvp — Submit RSVP
// GET  /api/invitations/[id]/rsvp — Get RSVPs for an invitation

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
    const result = await guestService.submitRsvp(id, body);

    return successResponse(result, 'RSVP submitted', 201);
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await guestService.listByInvitation(id);

    return successResponse(result, 'RSVPs fetched');
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
