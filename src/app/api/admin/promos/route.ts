import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const promoSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  description: z.string().optional(),
  discountPercent: z.number().min(0).max(100),
  maxDiscountAmount: z.number().nullable().optional(),
  maxGlobalUsage: z.number().min(0),
  usageLimitPerUser: z.number().min(0),
  usageLimitPerIp: z.number().min(0),
  isActive: z.boolean().default(true),
  expiresAt: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const promos = await prisma.promo.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { usages: true }
        }
      }
    });
    return successResponse(promos);
  } catch (error) {
    return errorResponse('Failed to fetch promos', 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const body = await req.json();
    const data = promoSchema.parse(body);

    const existing = await prisma.promo.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      return errorResponse('Kode promo sudah digunakan', 400, 'CONFLICT');
    }

    const promo = await prisma.promo.create({
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });

    return successResponse(promo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as any;
      console.error('Zod Validation Error:', zodError.errors);
      return errorResponse(`Validasi gagal: ${zodError.errors.map((e: any) => e.path.join('.') + ' ' + e.message).join(', ')}`, 400, 'VALIDATION_ERROR');
    }
    console.error('Failed to create promo:', error);
    return errorResponse('Gagal membuat promo', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const body = await req.json();
    const { id, isActive } = body;
    
    if (!id) return errorResponse('ID required', 400);

    const promo = await prisma.promo.update({
      where: { id },
      data: { isActive },
    });

    return successResponse(promo);
  } catch (error) {
    return errorResponse('Gagal mengubah status promo', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return errorResponse('ID required', 400);

    await prisma.promo.delete({
      where: { id },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse('Gagal menghapus promo', 500);
  }
}
