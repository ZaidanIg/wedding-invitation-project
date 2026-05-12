// ============================================================
// DB Service — All Prisma database operations
// ============================================================

import { prisma } from '@/lib/prisma';
import type {
  CreateInvitationRequest,
  UpdateInvitationRequest,
  SubmitRsvpRequest,
} from '@/types';

// ---- Invitation CRUD ----

export async function createInvitation(data: CreateInvitationRequest, userId?: string) {
  return prisma.invitation.create({
    data: {
      groomName: data.groomName,
      brideName: data.brideName,
      eventDate: new Date(data.eventDate),
      eventTime: data.eventTime,
      venueName: data.venueName,
      venueAddress: data.venueAddress,
      greeting: data.greeting,
      mainBody: data.mainBody,
      eventInfo: data.eventInfo,
      closing: data.closing,
      fullText: data.fullText,
      photoUrls: data.photoUrls || [],
      tone: data.tone,
      language: data.language,
      musicUrl: data.musicUrl || null,
      layout: data.layout || 'elegant-cream',
      schedule: (data.schedule || []) as any,
      userId: userId || null,
    },
  });
}

export async function getInvitations(page: number = 1, limit: number = 10, userId?: string) {
  const skip = (page - 1) * limit;
  const where = userId ? { userId } : {};

  const [invitations, total] = await Promise.all([
    prisma.invitation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { guests: true },
        },
      },
    }),
    prisma.invitation.count({ where }),
  ]);

  return {
    invitations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getInvitationById(id: string) {
  return prisma.invitation.findUnique({
    where: { id },
    include: {
      guests: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { guests: true },
      },
    },
  });
}

export async function getInvitationBySlug(slug: string) {
  return prisma.invitation.findUnique({
    where: { slug },
    include: {
      guests: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function updateInvitation(id: string, data: UpdateInvitationRequest) {
  const updateData: Record<string, unknown> = { ...data };

  // Convert eventDate string to Date if provided
  if (data.eventDate) {
    updateData.eventDate = new Date(data.eventDate);
  }

  return prisma.invitation.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteInvitation(id: string) {
  return prisma.invitation.delete({
    where: { id },
  });
}

export async function incrementViewCount(slug: string) {
  return prisma.invitation.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  });
}

// ---- Guest / RSVP CRUD ----

export async function submitRsvp(invitationId: string, data: SubmitRsvpRequest) {
  return prisma.guest.create({
    data: {
      invitationId,
      name: data.name,
      email: data.email || null,
      rsvpStatus: data.rsvpStatus,
      message: data.message || null,
      attendees: data.attendees || 1,
    },
  });
}

export async function getGuestsByInvitation(invitationId: string) {
  return prisma.guest.findMany({
    where: { invitationId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRsvpStats(invitationId: string) {
  const [attending, notAttending, pending, totalGuests] = await Promise.all([
    prisma.guest.count({
      where: { invitationId, rsvpStatus: 'ATTENDING' },
    }),
    prisma.guest.count({
      where: { invitationId, rsvpStatus: 'NOT_ATTENDING' },
    }),
    prisma.guest.count({
      where: { invitationId, rsvpStatus: 'PENDING' },
    }),
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
    estimatedGuests: totalGuests._sum.attendees || 0,
  };
}
