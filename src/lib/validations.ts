// ============================================================
// Validations — Input validation helpers
// ============================================================

import type {
  GenerateInvitationInput,
  CreateInvitationRequest,
  SubmitRsvpRequest,
  Tone,
  Language,
} from '@/types';

const VALID_TONES: Tone[] = ['formal', 'romantic', 'modern', 'playful'];
const VALID_LANGUAGES: Language[] = ['id', 'en'];

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate the AI generation input.
 */
export function validateGenerateInput(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Request body is required'] };
  }

  const input = data as Record<string, unknown>;

  if (!input.groomName || typeof input.groomName !== 'string' || input.groomName.trim().length < 2) {
    errors.push('Groom name is required (min 2 characters)');
  }

  if (!input.brideName || typeof input.brideName !== 'string' || input.brideName.trim().length < 2) {
    errors.push('Bride name is required (min 2 characters)');
  }

  if (!input.eventDate || typeof input.eventDate !== 'string') {
    errors.push('Event date is required');
  }

  if (!input.eventTime || typeof input.eventTime !== 'string') {
    errors.push('Event time is required');
  }

  if (!input.venueName || typeof input.venueName !== 'string' || input.venueName.trim().length < 2) {
    errors.push('Venue name is required (min 2 characters)');
  }

  if (!input.venueAddress || typeof input.venueAddress !== 'string' || input.venueAddress.trim().length < 5) {
    errors.push('Venue address is required (min 5 characters)');
  }

  if (!input.tone || !VALID_TONES.includes(input.tone as Tone)) {
    errors.push(`Tone must be one of: ${VALID_TONES.join(', ')}`);
  }

  if (!input.language || !VALID_LANGUAGES.includes(input.language as Language)) {
    errors.push(`Language must be one of: ${VALID_LANGUAGES.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate the invitation creation request (saving to DB).
 */
export function validateCreateInvitation(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Request body is required'] };
  }

  const input = data as Record<string, unknown>;

  // Validate all required string fields
  const requiredStringFields = [
    'groomName', 'brideName', 'eventDate', 'eventTime',
    'venueName', 'venueAddress', 'greeting', 'mainBody',
    'eventInfo', 'closing', 'fullText',
  ];

  for (const field of requiredStringFields) {
    if (!input[field] || typeof input[field] !== 'string') {
      errors.push(`${field} is required`);
    }
  }

  if (input.tone && !VALID_TONES.includes(input.tone as Tone)) {
    errors.push(`Tone must be one of: ${VALID_TONES.join(', ')}`);
  }

  if (input.language && !VALID_LANGUAGES.includes(input.language as Language)) {
    errors.push(`Language must be one of: ${VALID_LANGUAGES.join(', ')}`);
  }

  if (input.schedule && !Array.isArray(input.schedule)) {
    errors.push('Schedule must be an array of schedule items');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate RSVP submission.
 */
export function validateRsvp(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Request body is required'] };
  }

  const input = data as Record<string, unknown>;

  if (!input.name || typeof input.name !== 'string' || input.name.trim().length < 2) {
    errors.push('Name is required (min 2 characters)');
  }

  if (input.email && typeof input.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      errors.push('Invalid email format');
    }
  }

  const validStatuses = ['ATTENDING', 'NOT_ATTENDING'];
  if (!input.rsvpStatus || !validStatuses.includes(input.rsvpStatus as string)) {
    errors.push(`RSVP status must be one of: ${validStatuses.join(', ')}`);
  }

  if (input.phone && typeof input.phone === 'string') {
    const phoneRegex = /^[0-9+-\s]{7,15}$/;
    if (!phoneRegex.test(input.phone.replace(/\D/g, ''))) {
      errors.push('Invalid phone number format');
    }
  }

  if (input.attendees !== undefined) {
    const attendees = Number(input.attendees);
    if (isNaN(attendees) || attendees < 1 || attendees > 10) {
      errors.push('Attendees must be between 1 and 10');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Type-safe parser — returns typed data if validation passes.
 */
export function parseGenerateInput(data: unknown): GenerateInvitationInput | null {
  const result = validateGenerateInput(data);
  if (!result.valid) return null;

  const input = data as Record<string, unknown>;
  return {
    groomName: (input.groomName as string).trim(),
    brideName: (input.brideName as string).trim(),
    eventDate: (input.eventDate as string).trim(),
    eventTime: (input.eventTime as string).trim(),
    venueName: (input.venueName as string).trim(),
    venueAddress: (input.venueAddress as string).trim(),
    tone: input.tone as Tone,
    language: input.language as Language,
    additionalNotes: input.additionalNotes
      ? (input.additionalNotes as string).trim()
      : undefined,
  };
}
