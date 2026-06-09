import { z } from 'zod';
// ============================================================
// AI Service — Groq LLM integration for invitation generation
// ============================================================

import Groq from 'groq-sdk';
import { prisma } from '@/lib/prisma';
import { ValidationError, NotFoundError } from '@/lib/errors';
import { generateInputSchema } from './validators';
import { checkUserDailyAiLimit } from '@/lib/rate-limiter';
import type { GeneratedInvitation } from '@/types';

const AI_LIMITS = {
  DRAFT: 2,
  BASIC: 3,
  PREMIUM: 10,
  ULTIMATE: 30,
};

function getFallbackTemplate(groom: string, bride: string): GeneratedInvitation {
  return {
    greeting: "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa,",
    mainBody: `Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir untuk memberikan doa restu pada pernikahan ${groom} & ${bride}.`,
    eventInfo: "Detail waktu dan lokasi tercantum pada bagian informasi acara.",
    closing: "Atas kehadiran dan doa restunya, kami ucapkan terima kasih.",
    fullText: `Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa,\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir untuk memberikan doa restu pada pernikahan ${groom} & ${bride}.\nDetail waktu dan lokasi tercantum pada bagian informasi acara.\nAtas kehadiran dan doa restunya, kami ucapkan terima kasih.`
  };
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

function formatZodError(error: z.ZodError | Error | unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map((e: z.ZodIssue) => e.message).join(', ');
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Data tidak valid';
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

      if (invitation) {
        const tier = invitation.tier as keyof typeof AI_LIMITS;
        const maxLimit = AI_LIMITS[tier] || AI_LIMITS.DRAFT;
        
        if (invitation.aiRegenCount >= maxLimit) {
          throw new ValidationError(`Batas regenerasi teks AI untuk paket ${tier} telah habis (Maks ${maxLimit}x). Silakan upgrade paket Anda.`);
        }
      }
    } else {
      // Unsaved invitation: limit to 2 per day globally for the user
      if (!checkUserDailyAiLimit(userId, 2)) {
        throw new ValidationError("Batas uji coba AI tanpa menyimpan (2x/hari) telah habis. Silakan simpan undangan ini sebagai Draf terlebih dahulu.");
      }
    }

    // Call AI with Fallback
    const systemPrompt = buildSystemPrompt(input.tone, input.language);
    const userPrompt = buildUserPrompt(input);

    let generated: GeneratedInvitation;

    try {
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

      generated = parseAiResponse(content);
    } catch (error) {
      console.error('[AI Service] Groq API failed, using fallback:', error);
      generated = getFallbackTemplate(input.groomName, input.brideName);
      // We also add a special flag so frontend knows it's a fallback, though optional.
      // (generated as any)._isFallback = true;
    }

    // On successful generation (including fallback), increment AI count
    if (input.invitationId) {
      await prisma.invitation.update({
        where: { id: input.invitationId },
        data: { aiRegenCount: { increment: 1 } },
      });
    }

    return generated;
  },
};
