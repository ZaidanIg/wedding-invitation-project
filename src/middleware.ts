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

  // 0. Coming Soon Header (Production & Staging Domains Only)
  const isProductionDomain = (
    hostname === 'sahinaja.com' ||
    hostname === 'www.sahinaja.com' ||
    hostname === 'staging.sahinaja.com' ||
    hostname.includes('satging') ||
    hostname.includes('staging')
  ) && !hostname.startsWith('admin.');

  const isLaunchReady = new Date() >= LAUNCH_DATE;
  
  if (isProductionDomain && !isLaunchReady) {
    request.headers.set('x-is-coming-soon', 'true');
  }

  // 1. Subdomain Detection & Target Path Calculation
  // Match any subdomain starting with 'admin.' (e.g. admin.sahinaja.com, admin.staging.sahinaja.com, admin.localhost, admin.satging.com)
  const isAdminSubdomain = hostname.startsWith('admin.');
  let targetPathname = pathname;
  if (isAdminSubdomain && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    targetPathname = `/admin${pathname === '/' ? '' : pathname}`;
  }

  // 2. Admin Route Protection
  // All /admin/* paths EXCEPT /admin/login require a valid ADMIN session.
  const targetIsAdminPath = targetPathname.startsWith('/admin');
  const targetIsAdminLoginPath = targetPathname === '/admin/login';

  if (targetIsAdminPath && !targetIsAdminLoginPath && !targetPathname.startsWith('/api')) {
    // auth() from the Edge-compatible config reads the JWT cookie without DB calls
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      // If we are on the admin subdomain, redirect to /login
      // If we are on the main domain, redirect to /admin/login
      const redirectPath = isAdminSubdomain ? '/login' : '/admin/login';
      const loginUrl = new URL(redirectPath, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Perform the Subdomain Rewrite for Authorized Requests
  if (isAdminSubdomain && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return NextResponse.rewrite(new URL(targetPathname, request.url));
  }

  // 4. Route Protection / Redirects
  if (pathname === '/create') {
    const isComingSoon = request.headers.get('x-is-coming-soon') === 'true' || (!isLaunchReady && isProductionDomain);
    if (!isComingSoon) {
      const plan = url.searchParams.get('plan') || request.cookies.get('selected_plan')?.value;
      if (!plan) {
        return NextResponse.redirect(new URL('/pricing', request.url));
      }
    }
  }

  // 5. Global Headers
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
