// POST /api/invitations/[id]/rsvp — Submit RSVP
// GET  /api/invitations/[id]/rsvp — Get RSVPs for an invitation

import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { guestService } from '@/modules/guest/server/service';
import { cookies } from 'next/headers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const cookieStore = await cookies();
    const rsvpCookie = cookieStore.get(`rsvp_submitted_${id}`);
    const guestIdFromCookie = rsvpCookie?.value || null;

    const result = await guestService.submitRsvp(id, body, guestIdFromCookie);

    const response = successResponse(result, 'RSVP submitted', 201);

    // Save session guest ID in cookie for 1 year to avoid duplication and spam
    response.cookies.set(`rsvp_submitted_${id}`, result.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
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
