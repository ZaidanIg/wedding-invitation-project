// ============================================================
// Types — Shared TypeScript interfaces for the entire app
// ============================================================

// ---- Enums ----
export type Tone = 'formal' | 'romantic' | 'modern' | 'playful';
export type Language = 'id' | 'en';
export type Layout = 'elegant-cream' | 'royal-blue' | 'rose-garden' | 'golden-classic' | 'luxury-emerald';
export type RsvpStatus = 'PENDING' | 'ATTENDING' | 'NOT_ATTENDING';
export type AccountType = 'B2C_FREE' | 'B2B_PRO' | 'B2B_ALL_TIME';
export type InvitationTier = 'DRAFT' | 'BASIC' | 'PREMIUM' | 'ULTIMATE' | 'B2B_GENERATED';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
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
export interface Invitation {
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
  photoUrls: string[];
  tone: string;
  language: string;
  musicUrl?: string | null;
  layout: string;
  schedule: ScheduleItem[];
  loveStory?: LoveStoryItem[];
  digitalGifts?: any[];
  slug: string;
  viewCount: number;
  tier: InvitationTier;
  createdAt: string;
  updatedAt: string;
  guests?: Guest[];
}

export interface Guest {
  id: string;
  invitationId: string;
  name: string;
  email: string | null;
  rsvpStatus: RsvpStatus;
  message: string | null;
  attendees: number;
  createdAt: string;
  updatedAt: string;
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
  tone: Tone;
  language: Language;
  musicUrl?: string;
  layout?: Layout;
  schedule?: ScheduleItem[];
  loveStory?: LoveStoryItem[];
  digitalGifts?: any[];
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
  digitalGifts?: any[];
  quotes?: string;
}

export interface SubmitRsvpRequest {
  name: string;
  email?: string;
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
    digitalGifts: any[];
  };
  stylePreferences: {
    tone: Tone;
    language: Language;
    additionalNotes: string;
    musicUrl?: string;
    layout: Layout;
  };
  photoUrls: string[];
  generatedInvitation: GeneratedInvitation | null;
  isGenerating: boolean;
  isSaving: boolean;
}
