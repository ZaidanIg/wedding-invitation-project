// POST /api/invitations — Save invitation (authenticated)
// GET  /api/invitations — List user's invitations (authenticated)
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createInvitation, getInvitations } from '@/services/db.service';
import { validateCreateInvitation } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validation = validateCreateInvitation(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 },
      );
    }

    const invitation = await createInvitation(body, session.user.id);

    return NextResponse.json(
      { success: true, data: invitation },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Create Invitation Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save invitation' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

    const result = await getInvitations(page, limit, session.user.id);

    return NextResponse.json({
      success: true,
      data: result.invitations,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('[List Invitations Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitations' },
      { status: 500 },
    );
  }
}
