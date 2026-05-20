import NextAuth from "next-auth";

import { NextResponse } from "next/server";

const { auth } = NextAuth({
  providers: [],
  pages: { signIn: "/auth/signin" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accountType = user.accountType;
        token.projectId = user.projectId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as any;
        session.user.accountType = token.accountType as any;
        session.user.projectId = token.projectId as any;
      }
      return session;
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const role = session?.user?.role;

      const isDemoRoute = nextUrl.pathname.startsWith('/demo');
      const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');
      const isClientRoute = nextUrl.pathname.startsWith('/client');
      const isClientLogin = nextUrl.pathname === '/client/login';
      const isSignInPage = nextUrl.pathname === '/auth/signin';

      if (isDemoRoute) return true;

      // Automatically redirect logged-in users away from auth pages
      if (session?.user) {
        if (isSignInPage && role === 'AGENCY') {
          return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
        }
        if (isClientLogin && role === 'CLIENT') {
          return NextResponse.redirect(new URL('/client', nextUrl.origin));
        }
      }

      if (isDashboardRoute) {
        if (role === 'AGENCY') return true;
        return NextResponse.redirect(new URL('/auth/signin', nextUrl.origin));
      }

      if (isClientRoute && !isClientLogin) {
        if (role === 'CLIENT') return true;
        return NextResponse.redirect(new URL('/client/login', nextUrl.origin));
      }

      return true;
    },
  },
});

export default auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
