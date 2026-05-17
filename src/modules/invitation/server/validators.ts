// ============================================================
// Invitation Validators — Zod schemas
// ============================================================

import { z } from 'zod';

const VALID_TONES = ['formal', 'romantic', 'modern', 'playful'] as const;
const VALID_LANGUAGES = ['id', 'en'] as const;

export const createInvitationSchema = z.object({
  groomName: z.string().min(2, 'Groom name is required (min 2 characters)'),
  groomParents: z.string().optional(),
  brideName: z.string().min(2, 'Bride name is required (min 2 characters)'),
  brideParents: z.string().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().min(1, 'Event time is required'),
  venueName: z.string().min(2, 'Venue name is required (min 2 characters)'),
  venueAddress: z.string().min(5, 'Venue address is required (min 5 characters)'),
  greeting: z.string().min(1, 'Greeting is required'),
  mainBody: z.string().min(1, 'Main body is required'),
  eventInfo: z.string().min(1, 'Event info is required'),
  closing: z.string().min(1, 'Closing is required'),
  fullText: z.string().min(1, 'Full text is required'),
  photoUrls: z.array(z.string()).optional().default([]),
  headerPhotoUrl: z.string().optional(),
  groomPhotoUrl: z.string().optional(),
  bridePhotoUrl: z.string().optional(),
  tone: z.enum(VALID_TONES).default('formal'),
  language: z.enum(VALID_LANGUAGES).default('id'),
  musicUrl: z.string().optional(),
  layout: z.string().optional().default('elegant-cream'),
  schedule: z.array(z.object({
    id: z.string(),
    time: z.string(),
    label: z.string(),
    icon: z.string(),
  })).optional().default([]),
  loveStory: z.array(z.object({
    id: z.string(),
    year: z.string(),
    title: z.string(),
    description: z.string(),
    photoUrl: z.string().optional(),
  })).optional().default([]),
  digitalGifts: z.array(z.object({
    id: z.string().optional(),
    bankName: z.string(),
    accountNumber: z.string(),
    accountHolder: z.string(),
  })).optional().default([]),
  quotes: z.string().optional(),
  qrEnabled: z.boolean().optional().default(true),
});

export const updateInvitationSchema = createInvitationSchema.partial();

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
