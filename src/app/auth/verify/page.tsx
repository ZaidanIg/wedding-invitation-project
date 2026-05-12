import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string | undefined;

  let isSuccess = false;
  let message = 'Verifying your email...';

  if (!token) {
    message = 'Invalid or missing verification token.';
  } else {
    try {
      const verificationToken = await prisma.verificationToken.findFirst({
        where: { token },
      });

      if (!verificationToken) {
        message = 'Invalid or expired verification token.';
      } else if (verificationToken.expires < new Date()) {
        message = 'Your verification link has expired. Please request a new one.';
        // Optional: Delete expired token
        await prisma.verificationToken.deleteMany({ where: { token } });
      } else {
        // Valid token, update user
        const user = await prisma.user.findUnique({
          where: { email: verificationToken.identifier },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
          });

          // Delete token after successful use
          await prisma.verificationToken.deleteMany({
            where: { token },
          });

          isSuccess = true;
          message = 'Your email has been successfully verified!';
        } else {
          message = 'User account not found.';
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      message = 'An unexpected error occurred during verification.';
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#fdf2f4]">
      <div className="w-full max-w-md">
        <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-xl text-center border border-pink-100">
          <div className="flex justify-center mb-6">
            {isSuccess ? (
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            ) : (
              <XCircle className="w-16 h-16 text-rose-500" />
            )}
          </div>
          
          <h1 className="text-2xl font-display font-bold text-rose-950 mb-4">
            {isSuccess ? 'Verification Successful' : 'Verification Failed'}
          </h1>
          
          <p className="text-rose-700/80 mb-8 leading-relaxed">
            {message}
          </p>

          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium hover:opacity-90 transition-all duration-200 shadow-md w-full"
          >
            {isSuccess ? 'Continue to Sign In' : 'Back to Sign In'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
