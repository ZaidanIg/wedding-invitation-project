// ============================================================
// Guest DTOs
// ============================================================

export interface GuestResponseDto {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvpStatus: string;
  message: string | null;
  attendees: number;
  checkedIn: boolean;
  createdAt: string;
}
