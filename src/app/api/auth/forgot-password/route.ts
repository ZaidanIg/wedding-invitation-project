import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { authService } from '@/modules/auth/server/service';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  try {
    // RATE LIMITING
    const ip = getClientIp(request);
    const limiter = checkRateLimit(`forgot-password:${ip}`);
    
    if (!limiter.allowed) {
      return errorResponse(
        `Terlalu banyak permintaan. Silakan coba lagi dalam ${limiter.retryAfter} detik.`,
        429,
        'RATE_LIMIT_ERROR'
      );
    }

    const body = await request.json();
    const result = await authService.forgotPassword(body);

    return successResponse(result, result.message, 200);
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
