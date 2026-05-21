import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            invitations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
  }

  try {
    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ success: false, error: 'userId and role are required' }, { status: 400 });
    }

    if (role !== 'USER' && role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Invalid role specified' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as Role },
      select: { id: true, role: true },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update user' }, { status: 500 });
  }
}
