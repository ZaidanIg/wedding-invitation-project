import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const theme = await prisma.themeTemplate.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnail: true,
        category: true,
        isPremium: true,
        config: true,
      }
    });

    if (!theme) {
      return errorResponse('Tema tidak ditemukan', 404, 'NOT_FOUND');
    }

    return successResponse(theme);
  } catch (error: unknown) {
    console.error('Failed to fetch public theme:', error);
    return errorResponse('Gagal mengambil detail tema', 500);
  }
}
