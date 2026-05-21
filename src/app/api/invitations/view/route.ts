import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { invitationService } from '@/modules/invitation/server/service';
import { recordViewSchema } from '@/modules/invitation/server/validators';
import { auth } from '@/lib/auth';
import { cookies, headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Zod validation
    const parsed = recordViewSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Invalid input parameter', 400, 'VALIDATION_ERROR');
    }

    const { slug } = parsed.data;

    // Get auth session
    const session = await auth();
    const requestingUserId = session?.user?.id;
    const requestingUserRole = session?.user?.role;

    // Headers & cookies
    const headerList = await headers();
    const userAgent = headerList.get('user-agent') || '';
    
    const cookieStore = await cookies();
    const cookieName = `viewed_${slug}`;
    const hasViewedCookie = cookieStore.has(cookieName);

    // Call service layer business logic
    const result = await invitationService.recordView(
      slug,
      userAgent,
      requestingUserId,
      requestingUserRole,
      hasViewedCookie
    );

    // If incremented, set the viewed cookie
    if (result.incremented) {
      cookieStore.set(cookieName, 'true', {
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return successResponse(result, 'View recording checked');
  } catch (error) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
