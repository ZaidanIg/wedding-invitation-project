import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return errorResponse('User not found', 404, 'NOT_FOUND');
    }

    return successResponse(user, 'User profile retrieved successfully');
  } catch (error) {
    console.error('[API_V2_ME_GET]', error);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { name, image } = body; // Simplified validation for now

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(updatedUser, 'User profile updated successfully');
  } catch (error) {
    console.error('[API_V2_ME_PATCH]', error);
    return errorResponse('Failed to update profile', 500, 'INTERNAL_ERROR');
  }
}
