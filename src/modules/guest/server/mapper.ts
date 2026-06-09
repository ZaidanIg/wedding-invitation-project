// ============================================================
// Guest Mapper — Entity to DTO
// ============================================================

import type { GuestResponseDto } from './dto';

type GuestEntity = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  rsvpStatus: string;
  message?: string | null;
  attendees?: number;
  checkedIn?: boolean;
  isVip?: boolean;
  createdAt: Date | string;
};

export const guestMapper = {
  toResponse(entity: GuestEntity): GuestResponseDto {
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
