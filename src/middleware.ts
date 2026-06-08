import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

const LAUNCH_DATE = new Date('2026-06-11T17:00:00Z');

// Edge-compatible auth instance — only uses JWT, no Prisma
const { auth } = NextAuth(authConfig);

/**
 * Global middleware (Edge Runtime compatible).
 * - Protects /admin/* routes: only ADMIN role can access (redirects others to /admin/login)
 * - Injects X-API-Version: 1.2 header on all /api/* responses.
 */
export async function middleware(request: NextRequest) {
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

  // 2. Admin Route Protection
  // All /admin/* paths EXCEPT /admin/login require a valid ADMIN session.
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminLoginPath = pathname === '/admin/login';

  if (isAdminPath && !isAdminLoginPath) {
    // auth() from the Edge-compatible config reads the JWT cookie without DB calls
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Route Protection / Redirects
  if (pathname === '/create') {
    const plan = url.searchParams.get('plan') || request.cookies.get('selected_plan')?.value;
    if (!plan) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  // 4. Global Headers
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
