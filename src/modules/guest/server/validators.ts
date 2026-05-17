// ============================================================
// Guest Validators — Zod schemas
// ============================================================

import { z } from 'zod';

export const submitRsvpSchema = z.object({
  name: z.string().min(2, 'Name is required (min 2 characters)'),
  email: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[0-9+\-\s]{7,15}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  rsvpStatus: z.enum(['ATTENDING', 'NOT_ATTENDING']),
  message: z.string().optional(),
  attendees: z.coerce
    .number()
    .int()
    .min(1, 'Attendees must be at least 1')
    .max(10, 'Attendees must be at most 10')
    .optional()
    .default(1),
});

export const checkinSchema = z.object({
  guestId: z.string().min(1, 'Guest ID is required'),
});

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;
export type CheckinInput = z.infer<typeof checkinSchema>;
