import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationCodeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing tokens for this email to prevent duplicates
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Save new code
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: code,
        expires,
      },
    });

    // Send email
    const emailSent = await sendVerificationCodeEmail(email, code);

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Verification code sent to your email.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Send Code Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong while sending the code' },
      { status: 500 }
    );
  }
}
