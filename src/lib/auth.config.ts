/**
 * auth.config.ts — Lightweight auth config for Edge Runtime (middleware).
 * 
 * MUST NOT import Prisma, bcrypt, or any Node.js-only modules.
 * Only reads/validates the JWT — no DB calls.
 */
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  basePath: '/api/auth',
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 hours
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
      }
      return session;
    },
  },
};
