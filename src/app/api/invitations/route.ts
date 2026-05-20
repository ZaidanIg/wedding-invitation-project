// POST /api/invitations — Save invitation (authenticated)
// GET  /api/invitations — List user's invitations (authenticated)

import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { invitationService } from '@/modules/invitation/server/service';
import { billingService } from '@/modules/billing/server/service';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const result = await invitationService.create(body, session.user.id);

    return successResponse(result, 'Invitation created', 201);
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('Authentication required', 401, 'UNAUTHORIZED');
    }

    // Automatically reconcile pending payments in the background!
    billingService.reconcilePendingTransactions(session.user.id).catch((err) => {
      console.error('[Reconciliation Error]:', err);
    });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

    const result = await invitationService.list(session.user.id, page, limit);

    return successResponse({
      data: result.invitations,
      meta: result.meta,
      user: result.user,
    }, 'Invitations fetched');
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
