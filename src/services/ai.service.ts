// ============================================================
// AI Service — Groq LLM integration for invitation generation
// ============================================================

import Groq from 'groq-sdk';
import type { GenerateInvitationInput, GeneratedInvitation } from '@/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Build the system prompt based on tone and language.
 */
function buildSystemPrompt(tone: string, language: string): string {
  const langInstruction = language === 'id'
    ? 'Respond entirely in Bahasa Indonesia. Use culturally appropriate Indonesian wedding invitation phrasing.'
    : 'Respond entirely in English. Use elegant wedding invitation phrasing.';

  const toneMap: Record<string, string> = {
    formal: 'Use formal, dignified, and respectful language. The tone should feel traditional and prestigious.',
    romantic: 'Use romantic, heartfelt, and emotional language. Emphasize love, togetherness, and joy.',
    modern: 'Use modern, clean, and contemporary language. Keep it fresh and stylish but still warm.',
    playful: 'Use playful, fun, and lighthearted language. Make it feel joyful and celebratory without being too casual.',
  };

  const toneInstruction = toneMap[tone] || toneMap.formal;

  return `You are an expert wedding invitation copywriter who creates beautiful, heartfelt wedding invitation text.

${langInstruction}

${toneInstruction}

You MUST respond with a valid JSON object with these exact keys:
- "greeting": The opening greeting/salutation (1-2 sentences)
- "mainBody": The main invitation body explaining the joyous occasion (2-4 sentences)
- "eventInfo": A beautifully formatted section with the event details (date, time, venue, address)
- "closing": A warm closing message with well-wishes (1-2 sentences)
- "fullText": The complete invitation text combining all sections above, nicely formatted with line breaks

Important rules:
1. Do NOT include any text outside the JSON object
2. Use the couple's names naturally throughout
3. Make the invitation feel personal and special
4. Include proper formatting with newlines (\\n) in the fullText field
5. The eventInfo should present the details in an elegant format, not a plain list`;
}

/**
 * Build the user prompt with the event details.
 */
function buildUserPrompt(input: GenerateInvitationInput): string {
  const additionalContext = input.additionalNotes
    ? `\nAdditional notes from the couple: ${input.additionalNotes}`
    : '';

  return `Generate a wedding invitation with these details:

- Groom's name: ${input.groomName}
- Bride's name: ${input.brideName}
- Event date: ${input.eventDate}
- Event time: ${input.eventTime}
- Venue name: ${input.venueName}
- Venue address: ${input.venueAddress}${additionalContext}

Remember to respond ONLY with a valid JSON object.`;
}

/**
 * Parse and validate the AI response into a GeneratedInvitation.
 */
function parseAiResponse(content: string): GeneratedInvitation {
  // Try to extract JSON from the response (handle markdown code blocks)
  let jsonStr = content.trim();

  // Remove markdown code block wrapper if present
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);

  // Validate required fields
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

/**
 * Generate a wedding invitation using Groq LLM.
 */
export async function generateInvitation(
  input: GenerateInvitationInput,
): Promise<GeneratedInvitation> {
  const systemPrompt = buildSystemPrompt(input.tone, input.language);
  const userPrompt = buildUserPrompt(input);

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    model: MODEL,
    temperature: 0.7,
    max_tokens: 1024,
    response_format: { type: 'json_object' },
  });

  const content = chatCompletion.choices[0]?.message?.content;

  if (!content) {
    throw new Error('AI returned an empty response');
  }

  return parseAiResponse(content);
}
