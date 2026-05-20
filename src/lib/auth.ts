import NextAuth, { CredentialsSignin, DefaultSession } from 'next-auth';
import { AccountType } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      accountType: AccountType;
      role: 'AGENCY' | 'CLIENT';
      projectId?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    accountType?: AccountType;
    role?: 'AGENCY' | 'CLIENT';
    projectId?: string | null;
  }
}


import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { headers } from 'next/headers';

class CustomAuthError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  basePath: '/api/auth',
  providers: [

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        loginType: { label: 'Login Type', type: 'text' },
        email: { label: 'Email or Username', type: 'text', placeholder: 'you@example.com or username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CustomAuthError('EMAIL_PASSWORD_REQUIRED');
        }

        const loginType = credentials.loginType as string || 'AGENCY';
        const identifier = credentials.email as string;

        // Rate Limiting by IP to prevent automated credential stuffing
        const headersList = await headers();
        const forwarded = headersList.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

        const ipLimiter = checkRateLimit(`login:ip:${ip}`);
        if (!ipLimiter.allowed) {
          throw new CustomAuthError('TOO_MANY_REQUESTS');
        }

        // Rate Limiting by Email/Username to prevent targeted brute-forcing
        const emailLimiter = checkRateLimit(`login:email:${identifier}`);
        if (!emailLimiter.allowed) {
          throw new CustomAuthError('TOO_MANY_REQUESTS');
        }

        if (loginType === 'CLIENT') {
          const clientAccount = await prisma.clientAccount.findUnique({
            where: { username: identifier }
          });

          if (!clientAccount) {
            throw new CustomAuthError('INVALID_EMAIL_OR_PASSWORD');
          }

          const isValid = await bcrypt.compare(credentials.password as string, clientAccount.passwordHash);

          if (!isValid) {
            throw new CustomAuthError('INVALID_EMAIL_OR_PASSWORD');
          }

          return {
            id: clientAccount.id,
            name: clientAccount.username,
            email: `${clientAccount.username}@client.local`,
            accountType: 'B2C_FREE' as AccountType,
            role: 'CLIENT',
            projectId: clientAccount.projectId,
          };
        }

        // AGENCY logic
        const user = await prisma.user.findUnique({
          where: { email: identifier },
        });

        // Prevention of User Enumeration: return same error for user-not-found vs wrong-password
        if (!user || !user.password) {
          throw new CustomAuthError('INVALID_EMAIL_OR_PASSWORD');
        }

        if (!user.emailVerified) {
          throw new CustomAuthError('EMAIL_NOT_VERIFIED');
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isValid) {
          throw new CustomAuthError('INVALID_EMAIL_OR_PASSWORD');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          accountType: user.accountType,
          role: 'AGENCY',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 hours
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.projectId = user.projectId;
        
        // Explicitly set role for OAuth logins or fallback
        token.role = user.role || 'AGENCY';
        
        if (user.accountType) {
          token.accountType = user.accountType;
        } else if (user.id && token.role !== 'CLIENT') {
          const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
          token.accountType = dbUser?.accountType || 'B2C_FREE';
        } else {
          token.accountType = 'B2C_FREE';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.accountType = (token.accountType as AccountType) || 'B2C_FREE';
        session.user.role = (token.role as 'AGENCY' | 'CLIENT') || 'AGENCY';
        session.user.projectId = token.projectId as string | null;
      }
      return session;
    },
  },
});
