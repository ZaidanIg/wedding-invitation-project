import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  try {
    // RATE LIMITING
    const ip = getClientIp(request);
    const limiter = checkRateLimit(`forgot-password:${ip}`);
    
    if (!limiter.allowed) {
      return NextResponse.json(
        { success: false, error: `Terlalu banyak permintaan. Silakan coba lagi dalam ${limiter.retryAfter} detik.` },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // We return success even if user not found for security reasons (don't leak emails)
    if (!user || !user.password) {
      return NextResponse.json({ success: true, message: 'Jika email terdaftar, instruksi reset akan dikirim.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    const emailSent = await sendPasswordResetEmail(email, token);

    if (!emailSent) {
      return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email reset kata sandi telah dikirim.' });
  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
