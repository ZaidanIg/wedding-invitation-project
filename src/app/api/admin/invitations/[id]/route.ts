import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Tier } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
  }

  const { id } = await params;

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: invitation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch invitation' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
  }

  const { id } = await params;

  try {
    // v1.2: isPaid removed — tier is the single source of truth.
    // Admin can manually set tier to BASIC/PREMIUM/ULTIMATE to activate an invitation,
    // or set back to DRAFT to deactivate.
    const { tier, resetAiCount } = await req.json();

    const data: Record<string, unknown> = {};
    if (tier !== undefined) {
      const validTiers = ['DRAFT', 'BASIC', 'PREMIUM', 'ULTIMATE'];
      if (!validTiers.includes(tier)) {
        return NextResponse.json({ success: false, error: 'Invalid tier specified' }, { status: 400 });
      }
      data.tier = tier as Tier;
    }

    if (resetAiCount) {
      data.aiRegenCount = 0;
    }

    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, data: updatedInvitation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update invitation' }, { status: 500 });
  }
}
