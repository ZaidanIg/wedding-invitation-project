// POST /api/invitations — Save invitation (authenticated)
// GET  /api/invitations — List user's invitations (authenticated)
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createInvitation, getInvitations } from '@/services/db.service';
import { validateCreateInvitation } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { accountType: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    let tier = 'DRAFT';
    let maxPhotos = 1;

    if (user.accountType === 'B2B_PRO') {
      tier = 'B2B_GENERATED';
      maxPhotos = 6;
    } else if (user.accountType === 'B2B_ALL_TIME') {
      tier = 'B2B_GENERATED';
      maxPhotos = 99; // effectively unlimited
    } else {
      // B2C_FREE default is now BASIC (Published) instead of DRAFT
      tier = 'BASIC';
      maxPhotos = 1;
    }

    if (body.photoUrls && body.photoUrls.length > maxPhotos) {
      return NextResponse.json(
        { success: false, error: `Your current plan allows a maximum of ${maxPhotos} photo(s). Please upgrade to add more.` },
        { status: 403 }
      );
    }

    // Force tier based on account (B2C upgrades happen later via transactions)
    const invitationData = { ...body, tier };

    const invitation = await createInvitation(invitationData, session.user.id);

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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { accountType: true, freeGeneratesUsed: true },
    });

    return NextResponse.json({
      success: true,
      data: result.invitations,
      pagination: result.pagination,
      user: user,
    });
  } catch (error) {
    console.error('[List Invitations Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitations' },
      { status: 500 },
    );
  }
}
