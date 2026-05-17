import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendInvoiceEmail } from '@/lib/email';

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
      const { userEmail, coupleNames } = await prisma.$transaction(async (tx) => {
        // 1. Update Transaction
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { 
            status: 'SUCCESS',
            midtransId: transaction_id
          },
        });

        // 2. Fetch User Email
        const user = await tx.user.findUnique({
          where: { id: transaction.userId },
          select: { email: true }
        });
        const email = user?.email || '';

        // 3. Apply Upgrades
        let names = 'Upgrade Paket Layanan';
        if (transaction.type === 'INVITATION_UPGRADE' && transaction.invitationId && transaction.tier) {
          const inv = await tx.invitation.update({
            where: { id: transaction.invitationId },
            data: { tier: transaction.tier },
            select: { groomName: true, brideName: true }
          });
          if (inv) {
            names = `${inv.groomName} & ${inv.brideName}`;
          }
        } else if (transaction.type === 'ACCOUNT_UPGRADE' && transaction.accountType) {
          await tx.user.update({
            where: { id: transaction.userId },
            data: { accountType: transaction.accountType },
          });
          names = `Akun WO (${transaction.accountType})`;
        }

        return { userEmail: email, coupleNames: names };
      });

      // Send Invoice/Receipt Email outside of transaction block to avoid SMTP latency holding database locks
      if (userEmail) {
        let planName = 'Premium Plan';
        if (transaction.tier === 'BASIC') planName = 'Minimalist Plan';
        if (transaction.tier === 'PREMIUM') planName = 'Premium Plan';
        if (transaction.tier === 'ULTIMATE') planName = 'Ultimate Plan';

        const subtotal = transaction.amount;
        const ppn = Math.round(subtotal * 0.11);
        const adminFee = 2500;
        const total = subtotal + ppn + adminFee;

        try {
          await sendInvoiceEmail(userEmail, {
            orderId: transaction.id,
            planName: planName,
            subtotal,
            ppn,
            adminFee,
            total,
            coupleNames
          });
        } catch (mailError) {
          console.error('[Mail Webhook Error]:', mailError);
        }
      }
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
