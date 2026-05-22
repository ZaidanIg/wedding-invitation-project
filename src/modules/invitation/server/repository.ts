// ============================================================
// Invitation Repository — Database access only
// ============================================================

import { prisma } from '@/lib/prisma';

export const invitationRepository = {
  async create(data: {
    groomName: string;
    groomParents?: string | null;
    brideName: string;
    brideParents?: string | null;
    eventDate: Date;
    eventTime: string;
    venueName: string;
    venueAddress: string;
    greeting: string;
    mainBody: string;
    eventInfo: string;
    closing: string;
    fullText: string;
    photoUrls?: string[];
    headerPhotoUrl?: string | null;
    groomPhotoUrl?: string | null;
    bridePhotoUrl?: string | null;
    tone: string;
    language: string;
    musicUrl?: string | null;
    videoUrl?: string | null;
    layout?: string;
    schedule?: unknown[];
    loveStory?: unknown[];
    digitalGifts?: unknown[];
    quotes?: string | null;
    userId?: string | null;
    tier?: string;
  }) {
    return prisma.invitation.create({ data: data as any });
  },

  async findMany(params: {
    userId?: string;
    skip: number;
    take: number;
  }) {
    const where = params.userId ? { userId: params.userId } : {};

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { guests: true } },
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.invitation.count({ where }),
    ]);

    return { invitations, total };
  },

  async findById(id: string) {
    return prisma.invitation.findUnique({
      where: { id },
      include: {
        guests: { orderBy: { createdAt: 'desc' } },
        _count: { select: { guests: true } },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  },

  async findBySlug(slug: string) {
    return prisma.invitation.findUnique({
      where: { slug },
      include: {
        guests: { orderBy: { createdAt: 'desc' } },
      },
    });
  },

  async update(id: string, data: Record<string, unknown>) {
    return prisma.invitation.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.invitation.delete({ where: { id } });
  },

  async incrementViewCount(slug: string) {
    return prisma.invitation.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
  },
};
