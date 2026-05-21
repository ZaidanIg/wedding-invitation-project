import NextAuth, { CredentialsSignin } from 'next-auth';
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
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CustomAuthError('EMAIL_PASSWORD_REQUIRED');
        }

        const email = credentials.email as string;

        // Rate Limiting by IP to prevent automated credential stuffing
        const headersList = await headers();
        const forwarded = headersList.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

        const ipLimiter = checkRateLimit(`login:ip:${ip}`);
        if (!ipLimiter.allowed) {
          throw new CustomAuthError('TOO_MANY_REQUESTS');
        }

        // Rate Limiting by Email to prevent targeted brute-forcing
        const emailLimiter = checkRateLimit(`login:email:${email}`);
        if (!emailLimiter.allowed) {
          throw new CustomAuthError('TOO_MANY_REQUESTS');
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Prevention of User Enumeration disabled per product requirement:
        // show distinct messages for user-not-found vs wrong-password
        if (!user || !user.password) {
          throw new CustomAuthError('USER_NOT_FOUND');
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
          role: user.role,
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
});
