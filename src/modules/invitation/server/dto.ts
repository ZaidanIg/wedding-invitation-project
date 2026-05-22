// ============================================================
// Invitation DTOs — Response types exposed to clients
// API Version: 1.2
// ============================================================

import type { ScheduleItem, LoveStoryItem, DigitalGiftItem } from '@/types';

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
  // Reconstructed from normalized tables by the mapper
  photoUrls: string[];
  schedule: ScheduleItem[];
  loveStory: LoveStoryItem[];
  digitalGifts: DigitalGiftItem[];
  // Role-specific photos
  headerPhotoUrl: string | null;
  groomPhotoUrl: string | null;
  bridePhotoUrl: string | null;
  tone: string;
  language: string;
  musicUrl: string | null;
  videoUrl: string | null;
  layout: string;
  quotes: string | null;
  viewCount: number;
  tier: string;
  // v1.2: isPaid REMOVED — use tier !== 'DRAFT' for activation check
  aiRegenCount: number;
  guestCount: number;
  createdAt: string;
  updatedAt: string;
  transactions?: Array<{
    id: string;
    status: string;
    paymentUrl?: string | null;
    tier?: string | null;
    amount: number;
    paymentMethod?: string | null;
  }>;
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
  schedule: ScheduleItem[];
  loveStory: LoveStoryItem[];
  digitalGifts: DigitalGiftItem[];
  headerPhotoUrl: string | null;
  groomPhotoUrl: string | null;
  bridePhotoUrl: string | null;
  tone: string;
  language: string;
  musicUrl: string | null;
  videoUrl: string | null;
  layout: string;
  quotes: string | null;
  viewCount: number;
  tier: string;
  // v1.2: isPaid REMOVED
  aiRegenCount: number;
  guestCount: number;
  createdAt: string;
  updatedAt: string;
  transactions?: Array<{
    id: string;
    status: string;
    paymentUrl?: string | null;
    tier?: string | null;
    amount: number;
    paymentMethod?: string | null;
  }>;
}
