// ============================================================
// Midtrans Webhook Handler
// API Version: 1.2
//
// Idempotency: Every notification is stored in PaymentWebhook
// using midtransNotifId as a unique key. Duplicate notifications
// are silently acknowledged without reprocessing.
//
// Atomicity: Transaction status update + Invitation tier upgrade
// happen in a single PostgreSQL transaction ($transaction).
// TransactionHistory is also written atomically for full audit trail.
// ============================================================

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendInvoiceEmail } from '@/lib/email';
import { PRICING } from '@/modules/billing/server/constants';

// Helper: map Midtrans transaction_status + fraud_status to internal TransactionStatus
function resolveStatus(
  transactionStatus: string,
  fraudStatus: string | undefined
): 'PENDING' | 'WAITING_PAYMENT' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED' {
  if (transactionStatus === 'capture') {
    return fraudStatus === 'accept' ? 'PAID' : 'PENDING';
  }
  if (transactionStatus === 'settlement') return 'PAID';
  if (transactionStatus === 'cancel' || transactionStatus === 'deny') return 'FAILED';
  if (transactionStatus === 'expire') return 'EXPIRED';
  if (transactionStatus === 'failure' || transactionStatus === 'reject') return 'FAILED';
  if (transactionStatus === 'refund' || transactionStatus === 'partial_refund') return 'REFUNDED';
  if (transactionStatus === 'pending') return 'WAITING_PAYMENT';
  return 'PENDING';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id,
      payment_type,
    } = body;

    // ── 1. Verify Midtrans Signature ────────────────────────
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const calculatedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (calculatedSignature !== signature_key) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 403, headers: { 'X-API-Version': '1.2' } }
      );
    }

    // ── 2. Idempotency Check ────────────────────────────────
    // Build a unique notification ID from order_id + transaction_status
    // so the same notification can be retried safely.
    const midtransNotifId = `${order_id}:${transaction_status}:${transaction_id ?? 'unknown'}`;
    const existingWebhook = await prisma.paymentWebhook.findUnique({
      where: { midtransNotifId },
    });

    if (existingWebhook) {
      // Already processed — return 200 OK without reprocessing
      console.log(`[Webhook] Duplicate notification ignored: ${midtransNotifId}`);
      return NextResponse.json(
        { success: true, duplicate: true },
        { headers: { 'X-API-Version': '1.2' } }
      );
    }

    // ── 3. Fetch Transaction ────────────────────────────────
    const transaction = await prisma.transaction.findUnique({
      where: { id: order_id },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404, headers: { 'X-API-Version': '1.2' } }
      );
    }

    const newStatus = resolveStatus(transaction_status, fraud_status);
    const isPaidStatus = newStatus === 'PAID';

    // ── 4. Process in Atomic PostgreSQL Transaction ─────────
    let userEmail = '';
    let coupleNames = 'Upgrade Paket Layanan';

    if (isPaidStatus && transaction.status !== 'PAID') {
      const result = await prisma.$transaction(async (tx) => {
        // a. Log raw webhook payload (idempotency record)
        await tx.paymentWebhook.create({
          data: {
            transactionId: transaction.id,
            rawPayload: body,
            midtransNotifId,
          },
        });

        // b. Update transaction status
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: newStatus,
            midtransId: transaction_id,
            paymentMethod: payment_type ?? null,
          },
        });

        // c. Write audit history
        await tx.transactionHistory.create({
          data: {
            transactionId: transaction.id,
            oldStatus: transaction.status,
            newStatus,
            changedBy: 'WEBHOOK',
            metadata: {
              midtransId: transaction_id,
              paymentType: payment_type,
              fraudStatus: fraud_status,
              transactionStatus: transaction_status,
            },
          },
        });

        // d. Upgrade invitation tier (atomic with above)
        let names = 'Upgrade Paket Layanan';
        if (transaction.type === 'INVITATION_UPGRADE' && transaction.invitationId && transaction.tier) {
          const invData = await tx.invitation.findUnique({
            where: { id: transaction.invitationId },
            select: { eventDate: true, groomName: true, brideName: true },
          });

          let expiresAt: Date | null = null;
          if (invData?.eventDate) {
            const eventDate = new Date(invData.eventDate);
            const addedDays =
              transaction.tier === 'BASIC' ? 7
              : transaction.tier === 'PREMIUM' ? 14
              : transaction.tier === 'ULTIMATE' ? 30
              : 0;
            if (addedDays > 0) {
              expiresAt = new Date(eventDate.getTime() + addedDays * 24 * 60 * 60 * 1000);
            }
          }

          await tx.invitation.update({
            where: { id: transaction.invitationId },
            data: {
              tier: transaction.tier,
              // v1.2: isPaid REMOVED — tier update IS the single source of truth
              ...(expiresAt ? { expiresAt } : {}),
            },
          });

          if (invData) {
            names = `${invData.groomName} & ${invData.brideName}`;
          }
        }

        // e. Fetch user email (within transaction for consistency)
        const user = await tx.user.findUnique({
          where: { id: transaction.userId },
          select: { email: true },
        });

        return { email: user?.email ?? '', coupleNames: names };
      });

      userEmail = result.email;
      coupleNames = result.coupleNames;

    } else if (newStatus !== transaction.status) {
      // Non-success status change (CANCELLED, EXPIRED, FAILED, PENDING)
      await prisma.$transaction(async (tx) => {
        await tx.paymentWebhook.create({
          data: {
            transactionId: transaction.id,
            rawPayload: body,
            midtransNotifId,
          },
        });

        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: newStatus,
            ...(transaction_id ? { midtransId: transaction_id } : {}),
          },
        });

        await tx.transactionHistory.create({
          data: {
            transactionId: transaction.id,
            oldStatus: transaction.status,
            newStatus,
            changedBy: 'WEBHOOK',
            metadata: { transactionStatus: transaction_status, fraudStatus: fraud_status },
          },
        });
      });
    } else {
      // Status unchanged — still log the webhook for traceability
      await prisma.paymentWebhook.create({
        data: {
          transactionId: transaction.id,
          rawPayload: body,
          midtransNotifId,
        },
      }).catch(() => {
        // Silently ignore if somehow unique constraint fires
      });
    }

    // ── 5. Send Invoice Email (outside DB transaction to avoid SMTP latency holding locks) ─
    if (userEmail && isPaidStatus) {
      const tierKey = transaction.tier ?? 'PREMIUM';
      let planName = 'Premium Plan';
      let subtotal: number = PRICING.PREMIUM;

      if (tierKey === 'BASIC') { planName = 'Minimalist Plan'; subtotal = PRICING.BASIC; }
      else if (tierKey === 'ULTIMATE') { planName = 'Ultimate Plan'; subtotal = PRICING.ULTIMATE; }

      const ppn = Math.round(subtotal * 0.11);
      const adminFee = 2500;

      try {
        await sendInvoiceEmail(userEmail, {
          orderId: transaction.id,
          planName,
          subtotal,
          ppn,
          adminFee,
          total: transaction.amount,
          coupleNames,
        });
      } catch (mailError) {
        console.error('[Webhook Mail Error]:', mailError);
      }
    }

    return NextResponse.json(
      { success: true },
      { headers: { 'X-API-Version': '1.2' } }
    );
  } catch (error) {
    console.error('[Midtrans Webhook Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500, headers: { 'X-API-Version': '1.2' } }
    );
  }
}
