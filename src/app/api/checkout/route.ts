import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { InvitationTier, AccountType, TransactionType } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

const PRICING = {
  PREMIUM: 50000,
  ULTIMATE: 100000,
  PRO_PLAN: 200000,
  ENTERPRISE: 2500000,
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { plan, invitationId } = body; // plan: 'PREMIUM' | 'ULTIMATE' | 'PRO_PLAN' | 'ENTERPRISE'

    if (!PRICING[plan as keyof typeof PRICING]) {
      return NextResponse.json({ success: false, error: 'Invalid plan selected' }, { status: 400 });
    }

    const amount = PRICING[plan as keyof typeof PRICING];
    let type: TransactionType;
    let targetTier: InvitationTier | null = null;
    let targetAccountType: AccountType | null = null;

    if (plan === 'PRO_PLAN') {
      type = 'ACCOUNT_UPGRADE';
      targetAccountType = 'B2B_PRO';
    } else if (plan === 'ENTERPRISE') {
      type = 'ACCOUNT_UPGRADE';
      targetAccountType = 'B2B_ALL_TIME';
    } else {
      if (!invitationId) {
        return NextResponse.json({ success: false, error: 'Invitation ID is required for this plan' }, { status: 400 });
      }
      type = 'INVITATION_UPGRADE';
      targetTier = plan as InvitationTier; // 'PREMIUM' | 'ULTIMATE'

      // Verify invitation belongs to user
      const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
        select: { userId: true, tier: true },
      });

      if (!invitation || invitation.userId !== session.user.id) {
        return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
      }
      
      if (invitation.tier === targetTier) {
         return NextResponse.json({ success: false, error: 'Invitation is already on this tier' }, { status: 400 });
      }
    }

    // Create a Pending Transaction in DB
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        invitationId: invitationId || null,
        amount,
        type,
        tier: targetTier,
        accountType: targetAccountType,
        status: 'PENDING',
      },
    });

    // Create Midtrans Snap Payload
    const parameter = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: session.user.name || 'User',
        email: session.user.email || '',
      },
      item_details: [
        {
          id: plan,
          price: amount,
          quantity: 1,
          name: `${plan.replace('_', ' ')} Upgrade`,
        },
      ],
    };

    // Generate Token
    const snapTransaction = await snap.createTransaction(parameter);

    // Save payment URL and midtrans token to DB (optional, but good for tracking)
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentUrl: snapTransaction.redirect_url,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        token: snapTransaction.token,
        redirect_url: snapTransaction.redirect_url,
      },
    });
  } catch (error) {
    console.error('[Checkout Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
