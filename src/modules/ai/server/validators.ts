// ============================================================
// AI Validators — Zod schemas
// ============================================================

import { z } from 'zod';

const VALID_TONES = ['formal', 'romantic', 'modern', 'playful'] as const;
const VALID_LANGUAGES = ['id', 'en'] as const;

export const generateInputSchema = z.object({
  groomName: z.string().min(2, 'Groom name is required (min 2 characters)'),
  brideName: z.string().min(2, 'Bride name is required (min 2 characters)'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().min(1, 'Event time is required'),
  venueName: z.string().min(2, 'Venue name is required (min 2 characters)'),
  venueAddress: z.string().min(5, 'Venue address is required (min 5 characters)'),
  tone: z.enum(VALID_TONES),
  language: z.enum(VALID_LANGUAGES),
  additionalNotes: z.string().optional(),
});

export type GenerateInput = z.infer<typeof generateInputSchema>;
