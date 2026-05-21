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
    const { tier, isPaid, resetAiCount } = await req.json();

    const data: any = {};
    if (tier !== undefined) {
      if (tier !== 'BASIC' && tier !== 'PREMIUM' && tier !== 'ULTIMATE') {
        return NextResponse.json({ success: false, error: 'Invalid tier specified' }, { status: 400 });
      }
      data.tier = tier as Tier;
    }

    if (isPaid !== undefined) {
      data.isPaid = Boolean(isPaid);
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
