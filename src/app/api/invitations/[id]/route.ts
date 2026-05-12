// GET    /api/invitations/[id] — Get single invitation
// PUT    /api/invitations/[id] — Update invitation
// DELETE /api/invitations/[id] — Delete invitation
import { NextResponse } from 'next/server';
import {
  getInvitationById,
  updateInvitation,
  deleteInvitation,
} from '@/services/db.service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const invitation = await getInvitationById(id);

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: invitation });
  } catch (error) {
    console.error('[Get Invitation Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitation' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await getInvitationById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 },
      );
    }

    const updated = await updateInvitation(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Update Invitation Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invitation' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existing = await getInvitationById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 },
      );
    }

    await deleteInvitation(id);
    return NextResponse.json({ success: true, data: { message: 'Invitation deleted' } });
  } catch (error) {
    console.error('[Delete Invitation Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invitation' },
      { status: 500 },
    );
  }
}
