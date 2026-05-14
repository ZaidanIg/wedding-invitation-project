// POST /api/invitations/generate — AI-powered invitation text generation
import { NextResponse } from 'next/server';
import { generateInvitation } from '@/services/ai.service';
import { validateGenerateInput, parseGenerateInput } from '@/lib/validations';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.` },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfter) },
        },
      );
    }

    // Parse and validate input
    const body = await request.json();
    const validation = validateGenerateInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 },
      );
    }

    const input = parseGenerateInput(body);
    if (!input) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 },
      );
    }

    // Get Session and Check Limits
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { accountType: true, freeGeneratesUsed: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.accountType === 'B2C_FREE') {
      if (user.freeGeneratesUsed >= 3) {
        return NextResponse.json(
          { success: false, error: 'Free generation limit reached (3/3). Please upgrade to publish and unlock more generates.' },
          { status: 403 }
        );
      }
    }

    // Generate invitation text via AI
    const generated = await generateInvitation(input);

    // Increment free usage if applicable
    if (user.accountType === 'B2C_FREE') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { freeGeneratesUsed: { increment: 1 } },
      });
    }

    return NextResponse.json(
      { success: true, data: generated },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': String(rateCheck.remaining),
        },
      },
    );
  } catch (error) {
    console.error('[AI Generate Error]:', error);

    // Don't leak internal error details
    const message = error instanceof Error && error.message.includes('API')
      ? 'AI service is temporarily unavailable. Please try again.'
      : 'Failed to generate invitation. Please try again.';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
