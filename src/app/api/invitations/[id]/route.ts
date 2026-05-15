import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await getInvitationById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
    }

    // SECURITY: IDOR Protection
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized to edit this invitation' }, { status: 403 });
    }

    // SECURITY: Tier Escalation Protection
    // Prevent sensitive fields from being updated via standard PUT
    const { tier, userId, slug, viewCount, ...safeData } = body;

    const updated = await updateInvitation(id, safeData);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Update Invitation Error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to update invitation' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await getInvitationById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
    }

    // SECURITY: IDOR Protection
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized to delete this invitation' }, { status: 403 });
    }

    await deleteInvitation(id);
    return NextResponse.json({ success: true, data: { message: 'Invitation deleted' } });
  } catch (error) {
    console.error('[Delete Invitation Error]:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete invitation' }, { status: 500 });
  }
}
