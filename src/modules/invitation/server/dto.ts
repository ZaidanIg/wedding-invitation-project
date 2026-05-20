// ============================================================
// Invitation DTOs — Response types exposed to clients
// ============================================================

export interface InvitationResponseDto {
  id: string;
  slug: string;
  groomName: string;
  groomParents: string | null;
  brideName: string;
  brideParents: string | null;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  greeting: string;
  mainBody: string;
  eventInfo: string;
  closing: string;
  fullText: string;
  photoUrls: string[];
  headerPhotoUrl: string | null;
  groomPhotoUrl: string | null;
  bridePhotoUrl: string | null;
  tone: string;
  language: string;
  musicUrl: string | null;
  layout: string;
  schedule: unknown[];
  loveStory: unknown[];
  digitalGifts: unknown[];
  quotes: string | null;
  viewCount: number;
  tier: string;
  guestCount: number;
  createdAt: string;
  transactions?: any[];
  project?: { id: string; name: string; status: string } | null;
}

export interface InvitationListItemDto {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  greeting: string;
  mainBody: string;
  eventInfo: string;
  closing: string;
  fullText: string;
  photoUrls: string[];
  headerPhotoUrl: string | null;
  groomPhotoUrl: string | null;
  bridePhotoUrl: string | null;
  tone: string;
  language: string;
  musicUrl: string | null;
  layout: string;
  schedule: unknown[];
  loveStory: unknown[];
  digitalGifts: unknown[];
  quotes: string | null;
  viewCount: number;
  tier: string;
  guestCount: number;
  createdAt: string;
  transactions?: any[];
  project?: { id: string; name: string; status: string } | null;
}
