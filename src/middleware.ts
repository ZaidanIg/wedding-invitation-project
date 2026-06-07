import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LAUNCH_DATE = new Date('2026-06-11T17:00:00Z');

/**
 * Global middleware.
 * Injects X-API-Version: 1.2 header on all /api/* responses.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // 0. Coming Soon Header (Production Domain Only)
  const isProductionDomain = hostname === 'sahinaja.com' || hostname === 'www.sahinaja.com';
  const isLaunchReady = new Date() >= LAUNCH_DATE;
  
  if (isProductionDomain && !isLaunchReady) {
    request.headers.set('x-is-coming-soon', 'true');
  }

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

  // 2. Route Protection / Redirects
  if (pathname === '/create') {
    const plan = url.searchParams.get('plan') || request.cookies.get('selected_plan')?.value;
    if (!plan) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  // 3. Global Headers
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
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
