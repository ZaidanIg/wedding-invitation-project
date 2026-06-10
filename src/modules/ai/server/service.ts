import { z } from 'zod';
import { createHash } from 'crypto';
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

function getLocalTemplate(input: {
  groomName: string;
  brideName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
}, tone: string, language: string): GeneratedInvitation {
  const groom = input.groomName;
  const bride = input.brideName;
  const venue = input.venueName;
  const dateStr = input.eventDate;
  const timeStr = input.eventTime;

  if (language === 'id') {
    switch (tone) {
      case 'romantic':
        return {
          greeting: "Dengan penuh rasa syukur dan cinta kasih,",
          mainBody: `Tuhan telah mempersatukan dua hati kami dalam ikatan suci pernikahan. Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir untuk memberikan doa restu pada hari bahagia pernikahan ${groom} & ${bride}.`,
          eventInfo: `Pernikahan diselenggarakan pada hari ${dateStr} pukul ${timeStr} bertempat di ${venue}, ${input.venueAddress}.`,
          closing: "Kehadiran dan doa restu Anda adalah kado terindah dalam perjalanan cinta kami. Terima kasih.",
          fullText: `Dengan penuh rasa syukur dan cinta kasih,\nTuhan telah mempersatukan dua hati kami dalam ikatan suci pernikahan. Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir untuk memberikan doa restu pada hari bahagia pernikahan ${groom} & ${bride}.\nPernikahan diselenggarakan pada hari ${dateStr} pukul ${timeStr} bertempat di ${venue}, ${input.venueAddress}.\nKehadiran dan doa restu Anda adalah kado terindah dalam perjalanan cinta kami. Terima kasih.`
        };
      case 'modern':
        return {
          greeting: "Awal dari sebuah lembaran hidup baru untuk melangkah bersama,",
          mainBody: `Kami mengundang Anda untuk merayakan cinta dan awal komitmen baru kami. Kehadiran Anda pada hari pernikahan ${groom} & ${bride} akan melengkapi kebahagiaan kami.`,
          eventInfo: `Pernikahan diselenggarakan pada hari ${dateStr} pukul ${timeStr} bertempat di ${venue}, ${input.venueAddress}.`,
          closing: "Terima kasih atas segala dukungan hangat dan doa tulus yang Anda berikan.",
          fullText: `Awal dari sebuah lembaran hidup baru untuk melangkah bersama,\nKami mengundang Anda untuk merayakan cinta dan awal komitmen baru kami. Kehadiran Anda pada hari pernikahan ${groom} & ${bride} akan melengkapi kebahagiaan kami.\nPernikahan diselenggarakan pada hari ${dateStr} pukul ${timeStr} bertempat di ${venue}, ${input.venueAddress}.\nTerima kasih atas segala dukungan hangat dan doa tulus yang Anda berikan.`
        };
      case 'playful':
        return {
          greeting: "Kabar gembira! Hari yang ditunggu-tunggu akhirnya tiba,",
          mainBody: `Kami, ${groom} & ${bride}, akan meresmikan ikatan janji suci kami! Kami sangat menantikan kehadiran Anda untuk ikut merayakan, bersenang-senang, dan berbagi tawa bersama di hari istimewa kami.`,
          eventInfo: `Acara diadakan pada hari ${dateStr} pukul ${timeStr} bertempat di ${venue}, ${input.venueAddress}.`,
          closing: "Sampai jumpa di sana! Pastikan Anda membawa senyuman terbaik Anda.",
          fullText: `Kabar gembira! Hari yang ditunggu-tunggu akhirnya tiba,\nKami, ${groom} & ${bride}, akan meresmikan ikatan janji suci kami! Kami sangat menantikan kehadiran Anda untuk ikut merayakan, bersenang-senang, dan berbagi tawa bersama di hari istimewa kami.\nAcara diadakan pada hari ${dateStr} pukul ${timeStr} bertempat di ${venue}, ${input.venueAddress}.\nSampai jumpa di sana! Pastikan Anda membawa senyuman terbaik Anda.`
        };
      case 'formal':
      default:
        return {
          greeting: "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa,",
          mainBody: `Kami bermaksud menyelenggarakan resepsi pernikahan putra-putri kami. Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai ${groom} & ${bride}.`,
          eventInfo: `Acara diselenggarakan pada hari ${dateStr} pukul ${timeStr} bertempat di ${venue}, ${input.venueAddress}.`,
          closing: "Atas kehadiran serta doa restunya, kami ucapkan terima kasih yang sebesar-besarnya.",
          fullText: `Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa,\nKami bermaksud menyelenggarakan resepsi pernikahan putra-putri kami. Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai ${groom} & ${bride}.\nAcara diselenggarakan pada hari ${dateStr} pukul ${timeStr} bertempat di ${venue}, ${input.venueAddress}.\nAtas kehadiran serta doa restunya, kami ucapkan terima kasih yang sebesar-besarnya.`
        };
    }
  } else {
    switch (tone) {
      case 'romantic':
        return {
          greeting: "Love has united our hearts into a sacred promise,",
          mainBody: `We invite you to share our joy as we exchange our vows. Your presence at the wedding ceremony of ${groom} & ${bride} will make our day truly unforgettable.`,
          eventInfo: `The wedding will be held on ${dateStr} at ${timeStr} at ${venue}, ${input.venueAddress}.`,
          closing: "Your blessings and warm wishes are the greatest gift we could ask for.",
          fullText: `Love has united our hearts into a sacred promise,\nWe invite you to share our joy as we exchange our vows. Your presence at the wedding ceremony of ${groom} & ${bride} will make our day truly unforgettable.\nThe wedding will be held on ${dateStr} at ${timeStr} at ${venue}, ${input.venueAddress}.\nYour blessings and warm wishes are the greatest gift we could ask for.`
        };
      case 'modern':
        return {
          greeting: "A new beginning, a lifetime journey together,",
          mainBody: `Please join us as we, ${groom} & ${bride}, celebrate our love and commitment. Your support and presence on our special day would mean the world to us.`,
          eventInfo: `To be held on ${dateStr} at ${timeStr} at ${venue}, ${input.venueAddress}.`,
          closing: "We look forward to celebrating this joyful beginning with you.",
          fullText: `A new beginning, a lifetime journey together,\nPlease join us as we, ${groom} & ${bride}, celebrate our love and commitment. Your support and presence on our special day would mean the world to us.\nTo be held on ${dateStr} at ${timeStr} at ${venue}, ${input.venueAddress}.\nWe look forward to celebrating this joyful beginning with you.`
        };
      case 'playful':
        return {
          greeting: "The wait is over, we are finally tying the knot!",
          mainBody: `Get ready to celebrate with us as ${groom} & ${bride} start our grand adventure! We can't wait to share laughs, drinks, and happy memories with you on our big day.`,
          eventInfo: `Join the celebration on ${dateStr} at ${timeStr} at ${venue}, ${input.venueAddress}.`,
          closing: "See you there! Make sure to put on your dancing shoes.",
          fullText: `The wait is over, we are finally tying the knot!\nGet ready to celebrate with us as ${groom} & ${bride} start our grand adventure! We can't wait to share laughs, drinks, and happy memories with you on our big day.\nJoin the celebration on ${dateStr} at ${timeStr} at ${venue}, ${input.venueAddress}.\nSee you there! Make sure to put on your dancing shoes.`
        };
      case 'formal':
      default:
        return {
          greeting: "Together with our families, we cordially invite you,",
          mainBody: `To celebrate the marriage of ${groom} & ${bride}. We would be honored by your presence and blessings as we embark on this new chapter of our lives.`,
          eventInfo: `The ceremony will commence on ${dateStr} at ${timeStr} at ${venue}, ${input.venueAddress}.`,
          closing: "Thank you for your kind support and wishes. We hope to see you there.",
          fullText: `Together with our families, we cordially invite you,\nTo celebrate the marriage of ${groom} & ${bride}. We would be honored by your presence and blessings as we embark on this new chapter of our lives.\nThe ceremony will commence on ${dateStr} at ${timeStr} at ${venue}, ${input.venueAddress}.\nThank you for your kind support and wishes. We hope to see you there.`
        };
    }
  }
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
    ? 'Bahasa Indonesia, culturally appropriate. Use Indonesian wedding terms like "Mempelai Pria", "Mempelai Wanita", "Kedua Mempelai", "Akad Nikah", "Resepsi", etc. Do NOT use English terms like "Groom", "Bride", "Wedding", "Save the Date", "Rundown" in the Indonesian text.' 
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
}, language: string): string {
  const note = input.additionalNotes ? `\nInstructions: ${input.additionalNotes}` : '';
  if (language === 'id') {
    return `Pasangan: Mempelai Pria ${input.groomName} & Mempelai Wanita ${input.brideName}.
Acara: Tanggal ${input.eventDate} pukul ${input.eventTime}.
Lokasi: ${input.venueName}, ${input.venueAddress}.${note}

Output JSON only.`;
  }
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

    // 1. Calculate input hash for caching
    const hashData = `${input.tone}:${input.language}:${input.groomName}:${input.brideName}:${input.eventDate}:${input.eventTime}:${input.venueName}:${input.venueAddress}:${input.additionalNotes || ''}`;
    const hash = createHash('sha256').update(hashData).digest('hex');

    // 2. Check cache first
    try {
      const cached = await prisma.aiCache.findUnique({
        where: { hash },
      });
      if (cached) {
        console.log(`[AI Service] Cache hit for hash: ${hash}`);
        return cached.response as unknown as GeneratedInvitation;
      }
    } catch (cacheError) {
      console.error('[AI Service] Failed to read from cache:', cacheError);
    }

    // 3. Check user limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    let quotaExhausted = false;

    // Check user limits if not an admin
    if (user.role !== 'ADMIN') {
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
            quotaExhausted = true;
          }
        }
      } else {
        // Unsaved invitation: limit to 2 per day globally for the user
        if (!checkUserDailyAiLimit(userId, 2)) {
          quotaExhausted = true;
        }
      }
    }

    // If quota is exhausted, serve local template instead of blocking
    if (quotaExhausted) {
      console.log(`[AI Service] Quota exhausted for user ${userId}, serving local template.`);
      const generated = getLocalTemplate(input, input.tone, input.language);
      
      try {
        await prisma.aiCache.create({
          data: { hash, response: generated as any },
        });
      } catch (cacheWriteError) {
        console.error('[AI Service] Failed to write local template to cache:', cacheWriteError);
      }

      return generated;
    }

    // 4. Call AI with Fallback
    const systemPrompt = buildSystemPrompt(input.tone, input.language);
    const userPrompt = buildUserPrompt(input, input.language);

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

      // Save to cache
      try {
        await prisma.aiCache.create({
          data: { hash, response: generated as any },
        });
      } catch (cacheWriteError) {
        console.error('[AI Service] Failed to write response to cache:', cacheWriteError);
      }
    } catch (error) {
      console.error('[AI Service] Groq API failed, using fallback:', error);
      generated = getLocalTemplate(input, input.tone, input.language);

      // Save fallback to cache
      try {
        await prisma.aiCache.create({
          data: { hash, response: generated as any },
        });
      } catch (cacheWriteError) {
        console.error('[AI Service] Failed to write fallback to cache:', cacheWriteError);
      }
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
