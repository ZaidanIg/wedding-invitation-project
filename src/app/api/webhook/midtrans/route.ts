import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Midtrans notification fields
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id
    } = body;

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const hash = crypto.createHash('sha512');
    hash.update(`${order_id}${status_code}${gross_amount}${serverKey}`);
    const calculatedSignature = hash.digest('hex');

    if (calculatedSignature !== signature_key) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 403 });
    }

    // Determine new status
    let newStatus: 'PENDING' | 'SUCCESS' | 'FAILED' = 'PENDING';

    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        newStatus = 'PENDING'; // Still needs manual verification on Midtrans dashboard
      } else if (fraud_status === 'accept') {
        newStatus = 'SUCCESS';
      }
    } else if (transaction_status === 'settlement') {
      newStatus = 'SUCCESS';
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      newStatus = 'FAILED';
    } else if (transaction_status === 'pending') {
      newStatus = 'PENDING';
    }

    // Fetch transaction from DB
    const transaction = await prisma.transaction.findUnique({
      where: { id: order_id },
    });

    if (!transaction) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }

    // If status changed to SUCCESS, apply the upgrades
    if (newStatus === 'SUCCESS' && transaction.status !== 'SUCCESS') {
      // Execute within a database transaction to ensure atomicity
      await prisma.$transaction(async (tx) => {
        // 1. Update Transaction
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { 
            status: 'SUCCESS',
            midtransId: transaction_id
          },
        });

        // 2. Apply Upgrades
        if (transaction.type === 'INVITATION_UPGRADE' && transaction.invitationId && transaction.tier) {
          await tx.invitation.update({
            where: { id: transaction.invitationId },
            data: { tier: transaction.tier },
          });
        } else if (transaction.type === 'ACCOUNT_UPGRADE' && transaction.accountType) {
          await tx.user.update({
            where: { id: transaction.userId },
            data: { accountType: transaction.accountType },
          });
        }
      });
    } else if (newStatus !== transaction.status) {
      // Just update status (e.g., FAILED)
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { 
          status: newStatus,
          midtransId: transaction_id 
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Midtrans Webhook Error]:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}
