import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Global middleware.
 * Injects X-API-Version: 1.2 header on all /api/* responses.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // 1. Subdomain Routing (admin.sahinaja.com)
  // Rewrite everything on the admin subdomain to the `/admin` folder internally.
  if (
    hostname === 'admin.sahinaja.com' ||
    hostname.startsWith('admin.localhost')
  ) {
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      return NextResponse.rewrite(new URL(`/admin${pathname === '/' ? '' : pathname}`, request.url));
    }
  }

  // 2. Global Headers
  const response = NextResponse.next();
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-API-Version', '1.2');
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static assets
    '/((?!_next/static|_next/image|images|favicon.ico|robots.txt).*)',
  ],
};
