// ============================================================
// AI Service — Groq LLM integration for invitation generation
// ============================================================

import Groq from 'groq-sdk';
import { prisma } from '@/lib/prisma';
import { ValidationError, ForbiddenError, NotFoundError } from '@/lib/errors';
import { generateInputSchema } from './validators';
import type { GeneratedInvitation } from '@/types';
import type { ZodError } from 'zod';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

function formatZodError(error: any): string {
  return error.errors.map((e: any) => e.message).join(', ');
}

function buildSystemPrompt(tone: string, language: string): string {
  const lang = language === 'id' 
    ? 'Bahasa Indonesia, culturally appropriate.' 
    : 'English, elegant/modern.';
  
  const tones: Record<string, string> = {
    formal: 'respectful, traditional, prestigious.',
    romantic: 'heartfelt, romantic, emotional.',
    modern: 'clean, contemporary, stylish.',
    playful: 'joyful, fun, celebratory.',
  };

  return `You are an expert wedding copywriter. Return ONLY a valid JSON object.
Language: ${lang}
Tone: ${tones[tone] || tones.formal}

Required JSON keys (values must be strings):
- "greeting": Opening, max 2 sentences.
- "mainBody": Invitation body explaining event, max 3 sentences.
- "eventInfo": Beautifully formatted date, time, venue, address.
- "closing": Warm wishes, max 2 sentences.
- "fullText": Combined sections above with line breaks (\\n).

Rules:
- Respond with pure JSON, no markdown codeblocks, no intro/outro text.
- Be highly concise, poetic, and avoid verbose filler.`;
}

function buildUserPrompt(input: {
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  additionalNotes?: string;
}): string {
  const note = input.additionalNotes ? `\nInstructions: ${input.additionalNotes}` : '';
  return `Couple: Groom ${input.groomName} & Bride ${input.brideName}.
Event: ${input.eventDate} @ ${input.eventTime}.
Venue: ${input.venueName}, ${input.venueAddress}.${note}

Output JSON only.`;
}

function parseAiResponse(content: string): GeneratedInvitation {
  let jsonStr = content.trim();

  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);

  const requiredKeys: (keyof GeneratedInvitation)[] = [
    'greeting', 'mainBody', 'eventInfo', 'closing', 'fullText',
  ];

  for (const key of requiredKeys) {
    if (typeof parsed[key] !== 'string' || parsed[key].trim().length === 0) {
      throw new Error(`AI response missing or empty field: ${key}`);
    }
  }

  return {
    greeting: parsed.greeting,
    mainBody: parsed.mainBody,
    eventInfo: parsed.eventInfo,
    closing: parsed.closing,
    fullText: parsed.fullText,
  };
}

export const aiService = {
  /**
   * Generate a wedding invitation with quota enforcement.
   */
  async generate(payload: unknown, userId: string) {
    // Validate input
    const parsed = generateInputSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }
    const input = parsed.data;

    // Check user limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check invitation AI regen count if invitationId is provided
    if (input.invitationId) {
      const invitation = await prisma.invitation.findUnique({
        where: { id: input.invitationId },
        select: { tier: true, aiRegenCount: true },
      });

      if (invitation && invitation.tier === 'BASIC' && invitation.aiRegenCount >= 3) {
        throw new ValidationError("Batas regenerasi teks AI untuk Paket Basic telah habis. Silakan upgrade.");
      }
    }

    // Call AI
    const systemPrompt = buildSystemPrompt(input.tone, input.language);
    const userPrompt = buildUserPrompt(input);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 512,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI returned an empty response');
    }

    const generated = parseAiResponse(content);

    // On successful generation, increment AI count
    if (input.invitationId) {
      await prisma.invitation.update({
        where: { id: input.invitationId },
        data: { aiRegenCount: { increment: 1 } },
      });
    }

    return generated;
  },
};
