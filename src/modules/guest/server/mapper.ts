// ============================================================
// Guest Mapper — Entity to DTO
// ============================================================

import type { GuestResponseDto } from './dto';

export const guestMapper = {
  toResponse(entity: Record<string, any>): GuestResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email ?? null,
      phone: entity.phone ?? null,
      rsvpStatus: entity.rsvpStatus,
      message: entity.message ?? null,
      attendees: entity.attendees ?? 1,
      checkedIn: entity.checkedIn ?? false,
      isVip: entity.isVip ?? false,
      createdAt: entity.createdAt instanceof Date
        ? entity.createdAt.toISOString()
        : String(entity.createdAt),
    };
  },
};
