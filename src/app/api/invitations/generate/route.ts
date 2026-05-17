// POST /api/invitations/generate — AI-powered invitation text generation

import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { aiService } from '@/modules/ai/server/service';

export async function POST(request: Request) {
  try {
    // Rate limiting (infrastructure concern, stays in handler)
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return errorResponse(
        `Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.`,
        429,
        'RATE_LIMITED',
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const result = await aiService.generate(body, session.user.id);

    return successResponse(result, 'Invitation generated', 200, {
      'X-RateLimit-Remaining': String(rateCheck.remaining),
    });
  } catch (error) {
    // Special handling for AI errors — don't leak internal details
    if (error instanceof Error && error.message.includes('API')) {
      return errorResponse(
        'AI service is temporarily unavailable. Please try again.',
        500,
        'AI_SERVICE_ERROR',
      );
    }

    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
