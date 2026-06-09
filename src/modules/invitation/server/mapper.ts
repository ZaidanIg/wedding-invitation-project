// ============================================================
// Invitation Mapper — Entity (Prisma) to DTO
// API Version: 1.2
//
// Strategy: reconstruct flat frontend-compatible arrays from
// normalized relational tables so that layout components and
// InvitationForm.tsx do not need to change their read API.
// ============================================================

import type { InvitationResponseDto, InvitationListItemDto } from './dto';

function mapEntity(entity: Record<string, unknown>): Omit<InvitationResponseDto, 'guestCount'> & { guestCount?: number } {
  if (!entity) return {} as any;

  // Reconstruct flat photoUrls from InvitationPhoto relation (type GALLERY)
  const photos = (entity.photos as Array<{ url: string; type: string; sortOrder: number }> | undefined) ?? [];
  const photoUrls = photos
    .filter((p) => p.type === 'GALLERY')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => p.url);

  // Reconstruct schedule from InvitationEvent relation
  const events = (entity.events as Array<{ id: string; label: string; time: string; icon: string; sortOrder: number }> | undefined) ?? [];
  const schedule = events
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((e) => ({ id: e.id, label: e.label, time: e.time, icon: e.icon }));

  // Reconstruct loveStory from InvitationStory relation
  const stories = (entity.stories as Array<{ id: string; year: string; title: string; description: string; photoUrl?: string | null; sortOrder: number }> | undefined) ?? [];
  const loveStory = stories
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({ id: s.id, year: s.year, title: s.title, description: s.description, photoUrl: s.photoUrl ?? undefined }));

  // Reconstruct digitalGifts from InvitationGift relation
  const gifts = (entity.gifts as Array<{ id: string; bankName: string; accountNumber: string; accountHolder: string; sortOrder: number }> | undefined) ?? [];
  const digitalGifts = gifts
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((g) => ({ id: g.id, bankName: g.bankName, accountNumber: g.accountNumber, accountHolder: g.accountHolder }));

  const createdAt = entity.createdAt instanceof Date
    ? entity.createdAt.toISOString()
    : String(entity.createdAt);

  const eventDate = entity.eventDate instanceof Date
    ? entity.eventDate.toISOString()
    : String(entity.eventDate);

  const updatedAt = entity.updatedAt instanceof Date
    ? (entity.updatedAt as Date).toISOString()
    : String(entity.updatedAt ?? createdAt);

  return {
    id: entity.id as string,
    slug: entity.slug as string,
    groomName: entity.groomName as string,
    groomParents: (entity.groomParents as string | null) ?? null,
    brideName: entity.brideName as string,
    brideParents: (entity.brideParents as string | null) ?? null,
    eventDate,
    eventTime: entity.eventTime as string,
    venueName: entity.venueName as string,
    venueAddress: entity.venueAddress as string,
    greeting: entity.greeting as string,
    mainBody: entity.mainBody as string,
    eventInfo: entity.eventInfo as string,
    closing: entity.closing as string,
    fullText: entity.fullText as string,
    // Reconstructed from normalized tables
    photoUrls,
    schedule,
    loveStory,
    digitalGifts,
    // Role-specific photos remain as direct fields
    headerPhotoUrl: (entity.headerPhotoUrl as string | null) ?? null,
    groomPhotoUrl: (entity.groomPhotoUrl as string | null) ?? null,
    bridePhotoUrl: (entity.bridePhotoUrl as string | null) ?? null,
    tone: entity.tone as string,
    language: entity.language as string,
    musicUrl: (entity.musicUrl as string | null) ?? null,
    videoUrl: (entity.videoUrl as string | null) ?? null,
    layout: (entity.layout as string) ?? 'elegant-cream',
    quotes: (entity.quotes as string | null) ?? null,
    viewCount: (entity.viewCount as number) ?? 0,
    tier: (entity.tier as string) ?? 'DRAFT',
    status: (entity.status as string) ?? 'DRAFT',
    expiresAt: entity.expiresAt ? new Date(entity.expiresAt as string | Date).toISOString() : null,
    deletedAt: entity.deletedAt ? new Date(entity.deletedAt as string | Date).toISOString() : null,
    // v1.2: isPaid REMOVED — derive from: tier !== 'DRAFT'
    aiRegenCount: (entity.aiRegenCount as number) ?? 0,
    createdAt,
    updatedAt,
    transactions: (entity.transactions as Array<{
      id: string;
      status: string;
      paymentUrl?: string | null;
      tier?: string | null;
      amount: number;
      paymentMethod?: string | null;
    }>) ?? [],
  };
}

export const invitationMapper = {
  toResponse(entity: Record<string, unknown> | null): InvitationResponseDto {
    if (!entity) return {} as any;
    const mapped = mapEntity(entity);
    const _count = entity._count as { guests?: number } | undefined;
    return {
      ...mapped,
      guestCount: _count?.guests ?? (entity.guests as unknown[] | undefined)?.length ?? 0,
    };
  },

  toListItem(entity: Record<string, unknown> | null): InvitationListItemDto {
    if (!entity) return {} as any;
    const mapped = mapEntity(entity);
    const _count = entity._count as { guests?: number } | undefined;
    return {
      ...mapped,
      guestCount: _count?.guests ?? 0,
    };
  },
};
