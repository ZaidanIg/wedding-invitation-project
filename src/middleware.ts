import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Global middleware.
 * Injects X-API-Version: 1.2 header on all /api/* responses.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Inject API version header on all API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-API-Version', '1.2');
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
