// POST /api/checkout — Create Midtrans checkout session

import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { billingService } from '@/modules/billing/server/service';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    const payload = {
      ...body,
      clientIp: clientIp.split(',')[0].trim()
    };

    const result = await billingService.createCheckout(payload, {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    });

    return successResponse(result, 'Checkout session created');
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
