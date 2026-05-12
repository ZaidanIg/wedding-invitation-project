// POST /api/invitations/[slug]/rsvp — Submit RSVP
// GET  /api/invitations/[slug]/rsvp — Get RSVPs for an invitation
import { NextResponse } from 'next/server';
import {
  getInvitationBySlug,
  submitRsvp,
  getGuestsByInvitation,
  getRsvpStats,
} from '@/services/db.service';
import { validateRsvp } from '@/lib/validations';
import type { SubmitRsvpRequest } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validation = validateRsvp(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 },
      );
    }

    // Find invitation by slug (using id param which contains the slug)
    const invitation = await getInvitationBySlug(id);
    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 },
      );
    }

    // Create RSVP
    const guest = await submitRsvp(invitation.id, body as SubmitRsvpRequest);

    return NextResponse.json(
      { success: true, data: guest },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Submit RSVP Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit RSVP' },
      { status: 500 },
    );
  }
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Find invitation by slug (using id param which contains the slug)
    const invitation = await getInvitationBySlug(id);
    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 },
      );
    }

    // Get guests and stats
    const [guests, stats] = await Promise.all([
      getGuestsByInvitation(invitation.id),
      getRsvpStats(invitation.id),
    ]);

    return NextResponse.json({
      success: true,
      data: { guests, stats },
    });
  } catch (error) {
    console.error('[Get RSVPs Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs' },
      { status: 500 },
    );
  }
}
