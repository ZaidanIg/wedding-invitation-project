// ============================================================
// Guest Repository — Database access only
// ============================================================

import { prisma } from '@/lib/prisma';
import type { RsvpStatus } from '@prisma/client';

export const guestRepository = {
  async create(data: {
    invitationId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    rsvpStatus: string;
    message?: string | null;
    attendees?: number;
    isVip?: boolean;
  }) {
    return prisma.guest.create({
      data: {
        invitationId: data.invitationId,
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        rsvpStatus: data.rsvpStatus as RsvpStatus,
        message: data.message ?? null,
        attendees: data.attendees ?? 1,
        isVip: data.isVip ?? false,
      },
    });
  },

  async findManyByInvitation(invitationId: string) {
    return prisma.guest.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getStats(invitationId: string) {
    const [attending, notAttending, pending, totalGuests] = await Promise.all([
      prisma.guest.count({ where: { invitationId, rsvpStatus: 'ATTENDING' } }),
      prisma.guest.count({ where: { invitationId, rsvpStatus: 'NOT_ATTENDING' } }),
      prisma.guest.count({ where: { invitationId, rsvpStatus: 'PENDING' } }),
      prisma.guest.aggregate({
        where: { invitationId, rsvpStatus: 'ATTENDING' },
        _sum: { attendees: true },
      }),
    ]);

    return {
      attending,
      notAttending,
      pending,
      totalResponses: attending + notAttending + pending,
      estimatedGuests: totalGuests._sum.attendees ?? 0,
    };
  },

  async findForCheckin(guestId: string, invitationIdOrSlug: string, userId: string, userRole?: string) {
    const isAdmin = userRole === 'ADMIN';
    return prisma.guest.findFirst({
      where: {
        id: guestId,
        invitation: {
          OR: [{ id: invitationIdOrSlug }, { slug: invitationIdOrSlug }],
          ...(isAdmin ? {} : { userId }),
        },
      },
      include: { invitation: true },
    });
  },

  async markCheckedIn(guestId: string) {
    return prisma.guest.update({
      where: { id: guestId },
      data: {
        checkedIn: true,
        rsvpStatus: 'ATTENDING',
      },
    });
  },
};
