// ============================================================
// Types — Shared TypeScript interfaces for the entire app
// API Version: 1.2
// ============================================================

// ---- Enums ----
export type Tone = 'formal' | 'romantic' | 'modern' | 'playful';
export type Language = 'id' | 'en';
export type Layout = 'elegant-cream' | 'royal-blue' | 'rose-garden' | 'golden-classic' | 'luxury-emerald' | 'islamic-grace' | 'islamic-minimalist' | 'islamic-midnight' | 'islamic-arabesque' | 'christian-elegant' | 'hindu-mandala' | 'buddhist-zen' | 'confucian-oriental' | 'premium-charcoal' | 'elegant-sundanese' | 'premium-javanese' | 'sand-dunes' | 'midnight-velvet' | 'arabesque-pattern' | 'forest-grace' | 'garden-chapel' | 'mandala-fusion' | 'zen-garden' | 'oriental-luxe' | 'onyx-premium' | 'batik-heritage';
export type RsvpStatus = 'PENDING' | 'ATTENDING' | 'NOT_ATTENDING';
export type Role = 'USER' | 'ADMIN';
export type Tier = 'DRAFT' | 'BASIC' | 'PREMIUM' | 'ULTIMATE';
export type PhotoType = 'GALLERY' | 'PREWEDDING';

/**
 * Extended status enum for v1.2.
 * SETTLEMENT = final success for bank transfer / VA (Midtrans).
 * SUCCESS    = final success for credit card (capture+accept).
 * Both SETTLEMENT and EXPIRED map to "paid" in business logic.
 */
export type TransactionStatus = 'PENDING' | 'SETTLEMENT' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
export type TransactionType = 'INVITATION_UPGRADE' | 'ACCOUNT_UPGRADE';

export interface ScheduleItem {
  id: string;
  time: string;
  label: string;
  icon: string;
}

export interface LoveStoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
  photoUrl?: string;
}

export interface DigitalGiftItem {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  sortOrder?: number;
}

export interface InvitationPhotoItem {
  id: string;
  url: string;
  type: PhotoType;
  altText?: string | null;
  sortOrder: number;
}

// ---- AI Service ----
export interface GenerateInvitationInput {
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  tone: Tone;
  language: Language;
  additionalNotes?: string;
}

export interface GeneratedInvitation {
  greeting: string;
  mainBody: string;
  eventInfo: string;
  closing: string;
  fullText: string;
}

// ---- Database Models (mirrors Prisma, used on the client side) ----
// NOTE v1.2: isPaid is REMOVED.
// Payment status is derived from: invitation.tier !== 'DRAFT'
// (tier is updated atomically when payment SUCCESS is confirmed via webhook)

export interface Invitation {
  stylePreferences?: Record<string, unknown>;
  id: string;
  userId?: string | null;
  groomName: string;
  groomParents?: string | null;
  brideName: string;
  brideParents?: string | null;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  greeting: string;
  mainBody: string;
  eventInfo: string;
  closing: string;
  fullText: string;
  // Flat arrays reconstructed from relational tables by the mapper
  photoUrls: string[];        // gallery photos from InvitationPhoto
  headerPhotoUrl?: string | null;
  groomPhotoUrl?: string | null;
  bridePhotoUrl?: string | null;
  tone: string;
  language: string;
  musicUrl?: string | null;
  layout: string;
  schedule: ScheduleItem[];   // from InvitationEvent
  loveStory?: LoveStoryItem[]; // from InvitationStory
  digitalGifts?: DigitalGiftItem[]; // from InvitationGift
  quotes?: string | null;
  slug: string;
  viewCount: number;
  tier: Tier;
  // isPaid REMOVED — use: tier !== 'DRAFT' to check activation
  aiRegenCount: number;
  videoUrl?: string | null;
  qrEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
  guests?: Guest[];
  rsvpSubmitted?: boolean;
  rsvpGuestId?: string | null;
  rsvpStatus?: RsvpStatus | null;
  rsvpName?: string;
  rsvpPhone?: string;
}

export interface Guest {
  id: string;
  invitationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvpStatus: RsvpStatus;
  message: string | null;
  attendees: number;
  checkedIn: boolean;
  isVip: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionHistory {
  id: string;
  transactionId: string;
  oldStatus: string;
  newStatus: string;
  changedBy: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaymentWebhook {
  id: string;
  transactionId: string;
  rawPayload: Record<string, unknown>;
  midtransNotifId: string;
  processedAt: string;
}

// ---- API Request/Response types ----
export interface CreateInvitationRequest {
  groomName: string;
  groomParents?: string;
  brideName: string;
  brideParents?: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  greeting: string;
  mainBody: string;
  eventInfo: string;
  closing: string;
  fullText: string;
  photoUrls?: string[];
  headerPhotoUrl?: string;
  groomPhotoUrl?: string;
  bridePhotoUrl?: string;
  tone: Tone;
  language: Language;
  musicUrl?: string;
  layout?: Layout;
  schedule?: ScheduleItem[];
  loveStory?: LoveStoryItem[];
  digitalGifts?: DigitalGiftItem[];
  quotes?: string;
}

export interface UpdateInvitationRequest {
  groomName?: string;
  brideName?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  greeting?: string;
  mainBody?: string;
  eventInfo?: string;
  closing?: string;
  fullText?: string;
  tone?: Tone;
  language?: Language;
  loveStory?: LoveStoryItem[];
  digitalGifts?: DigitalGiftItem[];
  quotes?: string;
}

export interface SubmitRsvpRequest {
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: 'ATTENDING' | 'NOT_ATTENDING';
  message?: string;
  attendees?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ---- Form Wizard State ----
export interface FormWizardState {
  step: number;
  coupleDetails: {
    groomName: string;
    groomParents: string;
    brideName: string;
    brideParents: string;
  };
  eventDetails: {
    eventDate: string;
    eventTime: string;
    venueName: string;
    venueAddress: string;
    schedule: ScheduleItem[];
    loveStory: LoveStoryItem[];
    digitalGifts: DigitalGiftItem[];
    quotes: string;
  };
  stylePreferences: {
    tone: Tone;
    language: Language;
    additionalNotes: string;
    musicUrl?: string;
    videoUrl?: string;
    layout: Layout;
  };
  photoUrls: string[];
  headerPhotoUrl?: string;
  groomPhotoUrl?: string;
  bridePhotoUrl?: string;
  generatedInvitation: GeneratedInvitation | null;
  isGenerating: boolean;
  isSaving: boolean;
  qrEnabled: boolean;
  showOnboarding: boolean;
  activeMobileTab: 'form' | 'preview';
}

// ---- NextAuth Module Augmentation ----
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}
