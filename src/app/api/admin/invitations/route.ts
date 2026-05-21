import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
  }

  try {
    const invitations = await prisma.invitation.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: invitations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch invitations' }, { status: 500 });
  }
}
