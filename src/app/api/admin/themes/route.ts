import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const themeTemplateSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter').regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)'),
  thumbnail: z.string().optional().nullable(),
  category: z.string().default('Modern'),
  isPremium: z.boolean().default(false),
  config: z.record(z.string(), z.unknown()), // Konfigurasi harus berupa objek JSON
});

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const themes = await prisma.themeTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(themes);
  } catch (error: unknown) {
    console.error('Failed to fetch themes:', error);
    return errorResponse('Gagal mengambil daftar tema', 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const body = await req.json();
    const parsedData = themeTemplateSchema.parse(body);

    const existing = await prisma.themeTemplate.findUnique({
      where: { slug: parsedData.slug },
    });

    if (existing) {
      return errorResponse('Slug tema sudah digunakan', 400, 'CONFLICT');
    }

    const newTheme = await prisma.themeTemplate.create({
      data: {
        ...parsedData,
        config: parsedData.config as Prisma.InputJsonObject,
      },
    });

    return successResponse(newTheme);
  } catch (error: unknown) {
    console.error('Failed to create theme:', error);
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0].message, 400, 'VALIDATION_ERROR');
    }
    return errorResponse('Gagal membuat tema baru', 500);
  }
}
