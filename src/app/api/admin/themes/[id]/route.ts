import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const updateThemeSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').optional(),
  slug: z.string().min(3, 'Slug minimal 3 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)').optional(),
  thumbnail: z.string().optional().nullable(),
  category: z.string().optional(),
  isPremium: z.boolean().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const { id } = await params;
    const theme = await prisma.themeTemplate.findUnique({
      where: { id },
    });

    if (!theme) {
      return errorResponse('Tema tidak ditemukan', 404, 'NOT_FOUND');
    }

    return successResponse(theme);
  } catch (error: unknown) {
    console.error('Failed to fetch theme:', error);
    return errorResponse('Gagal mengambil detail tema', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsedData = updateThemeSchema.parse(body);

    const theme = await prisma.themeTemplate.findUnique({
      where: { id },
    });

    if (!theme) {
      return errorResponse('Tema tidak ditemukan', 404, 'NOT_FOUND');
    }

    // Jika slug dirubah, pastikan unik di database
    if (parsedData.slug && parsedData.slug !== theme.slug) {
      const existing = await prisma.themeTemplate.findUnique({
        where: { slug: parsedData.slug },
      });
      if (existing) {
        return errorResponse('Slug tema sudah digunakan', 400, 'CONFLICT');
      }
    }

    const { config: rawConfig, ...rest } = parsedData;
    const updated = await prisma.themeTemplate.update({
      where: { id },
      data: {
        ...rest,
        ...(rawConfig !== undefined && { config: rawConfig as Prisma.InputJsonObject }),
      },
    });

    return successResponse(updated);
  } catch (error: unknown) {
    console.error('Failed to update theme:', error);
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message, 400, 'VALIDATION_ERROR');
    }
    return errorResponse('Gagal memperbarui tema', 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const { id } = await params;
    const theme = await prisma.themeTemplate.findUnique({
      where: { id },
    });

    if (!theme) {
      return errorResponse('Tema tidak ditemukan', 404, 'NOT_FOUND');
    }

    await prisma.themeTemplate.delete({
      where: { id },
    });

    return successResponse({ message: 'Tema berhasil dihapus' });
  } catch (error: unknown) {
    console.error('Failed to delete theme:', error);
    return errorResponse('Gagal menghapus tema', 500);
  }
}
