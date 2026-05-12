import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, code } = body;

    if (!name || !email || !password || !code) {
      return NextResponse.json(
        { success: false, error: 'Name, email, password, and verification code are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
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

    // Verify the code
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: email, token: code },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code.' },
        { status: 400 }
      );
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and mark email as verified immediately
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(), // verified!
      },
    });

    // Delete the used token
    await prisma.verificationToken.deleteMany({
      where: { identifier: email, token: code },
    });

    return NextResponse.json(
      { success: true, message: 'Registration successful!', data: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Register Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong during registration' },
      { status: 500 }
    );
  }
}
