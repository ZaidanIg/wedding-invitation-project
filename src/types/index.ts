// ============================================================
// Types — Shared TypeScript interfaces for the entire app
// ============================================================

// ---- Enums ----
export type Tone = 'formal' | 'romantic' | 'modern' | 'playful';
export type Language = 'id' | 'en';
export type Layout = 'elegant-cream' | 'royal-blue' | 'rose-garden' | 'golden-classic';
export type RsvpStatus = 'PENDING' | 'ATTENDING' | 'NOT_ATTENDING';

export interface ScheduleItem {
  id: string;
  time: string;
  label: string;
  icon: string;
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
  tone: string;
  language: string;
  musicUrl?: string | null;
  layout: string;
  schedule: ScheduleItem[];
  slug: string;
  viewCount: number;
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
  photoUrls?: string[];
  tone: Tone;
  language: Language;
  musicUrl?: string;
  layout?: Layout;
  schedule?: ScheduleItem[];
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
    brideName: string;
  };
  eventDetails: {
    eventDate: string;
    eventTime: string;
    venueName: string;
    venueAddress: string;
    schedule: ScheduleItem[];
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
