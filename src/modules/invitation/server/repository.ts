// ============================================================
// Invitation Repository — Database access only
// API Version: 1.2
// ============================================================

import { prisma } from '@/lib/prisma';
import type { ScheduleItem, LoveStoryItem, DigitalGiftItem } from '@/types';

const INVITATION_RELATIONS = {
  _count: { select: { guests: true } },
  guests: { orderBy: { createdAt: 'desc' as const } },
  transactions: {
    orderBy: { createdAt: 'desc' as const },
    take: 3,
  },
  events: { orderBy: { sortOrder: 'asc' as const } },
  stories: { orderBy: { sortOrder: 'asc' as const } },
  gifts: { orderBy: { sortOrder: 'asc' as const } },
  photos: { orderBy: { sortOrder: 'asc' as const } },
};

const LIST_RELATIONS = {
  _count: { select: { guests: true } },
  transactions: {
    orderBy: { createdAt: 'desc' as const },
    take: 1,
  },
  events: { orderBy: { sortOrder: 'asc' as const } },
  stories: { orderBy: { sortOrder: 'asc' as const } },
  gifts: { orderBy: { sortOrder: 'asc' as const } },
  photos: { orderBy: { sortOrder: 'asc' as const } },
};

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
    photoUrls?: string[];       // Flat array — will be normalized to InvitationPhoto
    headerPhotoUrl?: string | null;
    groomPhotoUrl?: string | null;
    bridePhotoUrl?: string | null;
    tone: string;
    language: string;
    musicUrl?: string | null;
    videoUrl?: string | null;
    layout?: string;
    schedule?: ScheduleItem[];   // Normalized to InvitationEvent
    loveStory?: LoveStoryItem[]; // Normalized to InvitationStory
    digitalGifts?: DigitalGiftItem[]; // Normalized to InvitationGift
    quotes?: string | null;
    userId?: string | null;
    tier?: string;
  }) {
    const {
      photoUrls = [],
      schedule = [],
      loveStory = [],
      digitalGifts = [],
      userId,
      ...rest
    } = data;

    return prisma.invitation.create({
      data: {
        ...rest,
        userId: userId as string,
        events: {
          create: (schedule as ScheduleItem[]).map((item, idx) => ({
            label: item.label,
            time: item.time,
            icon: item.icon || 'heart',
            sortOrder: idx,
          })),
        },
        stories: {
          create: (loveStory as LoveStoryItem[]).map((item, idx) => ({
            year: item.year,
            title: item.title,
            description: item.description,
            photoUrl: item.photoUrl || null,
            sortOrder: idx,
          })),
        },
        gifts: {
          create: (digitalGifts as DigitalGiftItem[]).map((item, idx) => ({
            bankName: item.bankName,
            accountNumber: item.accountNumber,
            accountHolder: item.accountHolder,
            sortOrder: idx,
          })),
        },
        photos: {
          create: photoUrls.map((url, idx) => ({
            url,
            type: 'GALLERY' as const,
            sortOrder: idx,
          })),
        },
      } as Parameters<typeof prisma.invitation.create>[0]['data'],
      include: INVITATION_RELATIONS,
    });
  },

  async findMany(params: { userId?: string; skip: number; take: number }) {
    const where = params.userId ? { userId: params.userId } : {};

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: LIST_RELATIONS,
      }),
      prisma.invitation.count({ where }),
    ]);

    return { invitations, total };
  },

  async findById(id: string) {
    return prisma.invitation.findUnique({
      where: { id },
      include: INVITATION_RELATIONS,
    });
  },

  async findBySlug(slug: string) {
    return prisma.invitation.findUnique({
      where: { slug },
      include: INVITATION_RELATIONS,
    });
  },

  /**
   * Update an invitation's scalar fields.
   * For relational updates (events/stories/gifts/photos), use updateRelations.
   */
  async update(id: string, data: Record<string, unknown>) {
    return prisma.invitation.update({
      where: { id },
      data,
      include: INVITATION_RELATIONS,
    });
  },

  /**
   * Update relational data (events, stories, gifts, photos) using delete+recreate strategy.
   * This ensures order and removes orphaned records.
   */
  async updateRelations(
    id: string,
    relations: {
      events?: ScheduleItem[];
      stories?: LoveStoryItem[];
      gifts?: DigitalGiftItem[];
      photoUrls?: string[];
    }
  ) {
    return prisma.$transaction(async (tx) => {
      if (relations.events !== undefined) {
        await tx.invitationEvent.deleteMany({ where: { invitationId: id } });
        if (relations.events.length > 0) {
          await tx.invitationEvent.createMany({
            data: relations.events.map((item, idx) => ({
              invitationId: id,
              label: item.label,
              time: item.time,
              icon: item.icon || 'heart',
              sortOrder: idx,
            })),
          });
        }
      }

      if (relations.stories !== undefined) {
        await tx.invitationStory.deleteMany({ where: { invitationId: id } });
        if (relations.stories.length > 0) {
          await tx.invitationStory.createMany({
            data: relations.stories.map((item, idx) => ({
              invitationId: id,
              year: item.year,
              title: item.title,
              description: item.description,
              photoUrl: item.photoUrl || null,
              sortOrder: idx,
            })),
          });
        }
      }

      if (relations.gifts !== undefined) {
        await tx.invitationGift.deleteMany({ where: { invitationId: id } });
        if (relations.gifts.length > 0) {
          await tx.invitationGift.createMany({
            data: relations.gifts.map((item, idx) => ({
              invitationId: id,
              bankName: item.bankName,
              accountNumber: item.accountNumber,
              accountHolder: item.accountHolder,
              sortOrder: idx,
            })),
          });
        }
      }

      if (relations.photoUrls !== undefined) {
        await tx.invitationPhoto.deleteMany({
          where: { invitationId: id, type: 'GALLERY' },
        });
        if (relations.photoUrls.length > 0) {
          await tx.invitationPhoto.createMany({
            data: relations.photoUrls.map((url, idx) => ({
              invitationId: id,
              url,
              type: 'GALLERY' as const,
              sortOrder: idx,
            })),
          });
        }
      }

      return prisma.invitation.findUnique({
        where: { id },
        include: INVITATION_RELATIONS,
      });
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
