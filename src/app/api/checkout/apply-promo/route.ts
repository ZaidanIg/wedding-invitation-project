import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { promoService } from '@/modules/billing/server/promoService';
import { PRICING, type PlanKey } from '@/modules/billing/server/constants';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { code, plan } = body;

    if (!code || !plan || !PRICING[plan as PlanKey]) {
      return errorResponse('Invalid payload', 400, 'BAD_REQUEST');
    }

    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const baseAmount = PRICING[plan as PlanKey];

    const result = await promoService.validateAndCalculatePromo(
      code,
      baseAmount,
      session.user.id,
      clientIp.split(',')[0].trim()
    );

    return successResponse({
      promoCode: result.promo.code,
      discountAmount: result.discountAmount,
      finalPrice: result.finalPrice,
      description: result.promo.description,
    }, 'Promo applied successfully');
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
