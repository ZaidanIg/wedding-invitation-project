import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { authService } from '@/modules/auth/server/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await authService.resetPassword(body);

    return successResponse(result, result.message, 200);
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
