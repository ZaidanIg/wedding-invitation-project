// ============================================================
// Invitation Mapper — Entity to DTO
// ============================================================

import type { InvitationResponseDto } from './dto';

/**
 * Map a raw Prisma invitation entity to a response DTO.
 * Never exposes internal fields like userId directly.
 */
export const invitationMapper = {
  toResponse(entity: Record<string, any>): InvitationResponseDto {
    return {
      id: entity.id,
      slug: entity.slug,
      groomName: entity.groomName,
      groomParents: entity.groomParents ?? null,
      brideName: entity.brideName,
      brideParents: entity.brideParents ?? null,
      eventDate: entity.eventDate instanceof Date
        ? entity.eventDate.toISOString()
        : String(entity.eventDate),
      eventTime: entity.eventTime,
      venueName: entity.venueName,
      venueAddress: entity.venueAddress,
      greeting: entity.greeting,
      mainBody: entity.mainBody,
      eventInfo: entity.eventInfo,
      closing: entity.closing,
      fullText: entity.fullText,
      photoUrls: entity.photoUrls ?? [],
      headerPhotoUrl: entity.headerPhotoUrl ?? null,
      groomPhotoUrl: entity.groomPhotoUrl ?? null,
      bridePhotoUrl: entity.bridePhotoUrl ?? null,
      tone: entity.tone,
      language: entity.language,
      musicUrl: entity.musicUrl ?? null,
      layout: entity.layout ?? 'elegant-cream',
      schedule: entity.schedule ?? [],
      loveStory: entity.loveStory ?? [],
      digitalGifts: entity.digitalGifts ?? [],
      quotes: entity.quotes ?? null,
      viewCount: entity.viewCount ?? 0,
      tier: entity.tier ?? 'DRAFT',
      guestCount: entity._count?.guests ?? entity.guests?.length ?? 0,
      createdAt: entity.createdAt instanceof Date
        ? entity.createdAt.toISOString()
        : String(entity.createdAt),
      transactions: entity.transactions ?? [],
      project: entity.project ? {
        id: entity.project.id,
        name: entity.project.name,
        status: entity.project.status,
      } : null,
    };
  },

  /**
   * Map for list responses (lightweight, no fullText/greeting/etc).
   */
  toListItem(entity: Record<string, any>) {
    return {
      id: entity.id,
      slug: entity.slug,
      groomName: entity.groomName,
      brideName: entity.brideName,
      eventDate: entity.eventDate instanceof Date
        ? entity.eventDate.toISOString()
        : String(entity.eventDate),
      eventTime: entity.eventTime,
      venueName: entity.venueName,
      venueAddress: entity.venueAddress,
      greeting: entity.greeting,
      mainBody: entity.mainBody,
      eventInfo: entity.eventInfo,
      closing: entity.closing,
      fullText: entity.fullText,
      photoUrls: entity.photoUrls ?? [],
      headerPhotoUrl: entity.headerPhotoUrl ?? null,
      groomPhotoUrl: entity.groomPhotoUrl ?? null,
      bridePhotoUrl: entity.bridePhotoUrl ?? null,
      tone: entity.tone,
      language: entity.language,
      musicUrl: entity.musicUrl ?? null,
      layout: entity.layout ?? 'elegant-cream',
      schedule: entity.schedule ?? [],
      loveStory: entity.loveStory ?? [],
      digitalGifts: entity.digitalGifts ?? [],
      quotes: entity.quotes ?? null,
      viewCount: entity.viewCount ?? 0,
      tier: entity.tier ?? 'DRAFT',
      guestCount: entity._count?.guests ?? 0,
      createdAt: entity.createdAt instanceof Date
        ? entity.createdAt.toISOString()
        : String(entity.createdAt),
      transactions: entity.transactions ?? [],
      project: entity.project ? {
        id: entity.project.id,
        name: entity.project.name,
        status: entity.project.status,
      } : null,
    };
  },
};
