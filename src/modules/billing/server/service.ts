// ============================================================
// Billing Service — Checkout business logic
// API Version: 1.2
// ============================================================

import { ValidationError, NotFoundError } from '@/lib/errors';
import { billingRepository } from './repository';
import { PRICING, type PlanKey } from './constants';
import type { Tier, TransactionType, TransactionStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { promoService } from './promoService';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

/**
 * Generate a stable idempotency key for a checkout session.
 * Ensures the same user+invitation+plan combo doesn't create duplicate transactions.
 */
function generateIdempotencyKey(userId: string, invitationId: string | null, plan: string): string {
  const raw = `${userId}:${invitationId ?? 'account'}:${plan}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export const billingService = {
  /**
   * Create a checkout session with Midtrans.
   * Idempotent: returns existing PENDING transaction if the same intent already exists.
   */
  async createCheckout(
    payload: { plan: string; invitationId?: string; promoCode?: string; clientIp?: string },
    user: { id: string; name?: string | null; email?: string | null }
  ) {
    const { plan, invitationId, promoCode, clientIp = '0.0.0.0' } = payload;

    // Validate plan
    if (!PRICING[plan as PlanKey]) {
      throw new ValidationError('Invalid plan selected');
    }

    let subtotal: number = PRICING[plan as PlanKey];
    let discountAmount = 0;

    // Validate and Apply Promo Code
    if (promoCode) {
      const promoResult = await promoService.validateAndCalculatePromo(
        promoCode,
        subtotal,
        user.id,
        clientIp
      );
      discountAmount = promoResult.discountAmount;
      subtotal = promoResult.finalPrice;
    }

    const ppn = Math.round(subtotal * 0.11);
    const adminFee = 2500;
    const amount = subtotal + ppn + adminFee;

    let type: TransactionType;
    let targetTier: Tier | null = null;

    if (plan === 'PRO_PLAN' || plan === 'ENTERPRISE') {
      type = 'ACCOUNT_UPGRADE';
    } else {
      if (!invitationId) {
        throw new ValidationError('Invitation ID is required for this plan');
      }
      type = 'INVITATION_UPGRADE';
      targetTier = plan as Tier;

      // Verify ownership
      const invitation = await billingRepository.findInvitationForCheckout(invitationId);
      if (!invitation || invitation.userId !== user.id) {
        throw new NotFoundError('Invitation not found');
      }

    }

    // --- Idempotency Check ---
    const baseIdempotencyKey = generateIdempotencyKey(user.id, invitationId ?? null, plan);
    const existingTx = await billingRepository.findLatestTransactionByBaseIdempotencyKey(baseIdempotencyKey);

    if (existingTx && existingTx.status === 'PENDING' && existingTx.paymentUrl) {
      const token = existingTx.paymentUrl.split('/').pop();
      if (token) {
        return {
          token,
          midtransToken: token,
          redirect_url: existingTx.paymentUrl,
          orderId: existingTx.id,
          status: 'PENDING',
        };
      }
    }

    const attemptCount = await billingRepository.countTransactionsByBaseIdempotencyKey(baseIdempotencyKey);
    const idempotencyKey = attemptCount > 0 ? `${baseIdempotencyKey}-${attemptCount}` : baseIdempotencyKey;

    // Generate custom Order ID format: ORD-YYYYMMDD-XXXX
    const now = new Date();
    const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const yyyy = jakartaTime.getFullYear().toString();
    const mm = String(jakartaTime.getMonth() + 1).padStart(2, '0');
    const dd = String(jakartaTime.getDate()).padStart(2, '0');
    const datePrefix = `${yyyy}${mm}${dd}`;

    const todayTxCount = await prisma.transaction.count({
      where: { id: { startsWith: `ORD-${datePrefix}` } },
    });

    const orderId = `ORD-${datePrefix}-${String(todayTxCount + 1).padStart(4, '0')}`;

    // Create pending transaction
    const transaction = await billingRepository.createTransaction({
      id: orderId,
      idempotencyKey,
      userId: user.id,
      invitationId: invitationId || null,
      amount,
      type,
      tier: targetTier,
      status: 'PENDING',
      promoCode: promoCode ? promoCode.toUpperCase() : null,
      discountAmount,
    });

    // Record Promo Usage (Reserve quota)
    if (promoCode) {
      await promoService.recordUsage(promoCode.toUpperCase(), user.id, transaction.id, clientIp);
    }

    // Create Midtrans Snap payload
    const parameter = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: amount,
      },
      enabled_payments: ['gopay', 'other_qris'],
      credit_card: { secure: true },
      customer_details: {
        first_name: user.name || 'User',
        ...(user.email ? { email: user.email } : {}),
      },
      item_details: [
        {
          id: plan,
          price: PRICING[plan as PlanKey],
          quantity: 1,
          name: `${plan.replace('_', ' ')} Upgrade`,
        },
        ...(discountAmount > 0
          ? [
              {
                id: 'PROMO_DISCOUNT',
                price: -discountAmount,
                quantity: 1,
                name: `Discount (${promoCode?.toUpperCase()})`,
              },
            ]
          : []),
        {
          id: 'PPN_11',
          price: ppn,
          quantity: 1,
          name: 'PPN / Pajak (11%)',
        },
        {
          id: 'ADMIN_FEE',
          price: adminFee,
          quantity: 1,
          name: 'Biaya Admin & Layanan',
        },
      ],
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`,
        unfinish: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout`,
        error: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout`,
      },
      custom_expiry: {
        order_time:
          `${yyyy}-${mm}-${dd} ${String(jakartaTime.getHours()).padStart(2, '0')}:${String(jakartaTime.getMinutes()).padStart(2, '0')}:${String(jakartaTime.getSeconds()).padStart(2, '0')} +0700`,
        expiry_duration: 24,
        unit: 'hour',
      },
    };

    const snapTransaction = await snap.createTransaction(parameter);

    // Save payment URL
    await billingRepository.updateTransaction(transaction.id, {
      paymentUrl: snapTransaction.redirect_url,
    });

    return {
      token: snapTransaction.token,
      midtransToken: snapTransaction.token,
      redirect_url: snapTransaction.redirect_url,
      orderId: transaction.id,
      status: 'PENDING',
    };
  },

  /**
   * Reconcile any pending transactions for the user by checking status directly with Midtrans.
   * Writes to TransactionHistory for full audit trail.
   */
  async reconcilePendingTransactions(userId: string) {
    try {
      // Auto-expire PENDING transactions older than 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const expiredTxs = await prisma.transaction.findMany({
        where: {
          userId,
          status: 'PENDING',
          createdAt: { lt: twentyFourHoursAgo },
        },
        select: { id: true, status: true },
      });

      if (expiredTxs.length > 0) {
        await prisma.$transaction(async (dbTx) => {
          await dbTx.transaction.updateMany({
            where: { id: { in: expiredTxs.map((t) => t.id) } },
            data: { status: 'EXPIRED' },
          });
            await dbTx.transactionHistory.createMany({
            data: expiredTxs.map((t) => ({
              transactionId: t.id,
              oldStatus: t.status,
              newStatus: 'EXPIRED',
              changedBy: 'SYSTEM',
              metadata: { reason: 'Auto-expired after 24h' },
            })),
          });
        });
        
        // Restore promo usage for all expired
        for (const t of expiredTxs) {
          await promoService.restoreUsage(t.id);
        }
      }

      // Find remaining PENDING transactions
      const pendingTransactions = await prisma.transaction.findMany({
        where: { userId, status: 'PENDING' },
      });

      if (pendingTransactions.length === 0) return;

      for (const tx of pendingTransactions) {
        try {
          const midtransStatus = await snap.transaction.status(tx.id);
          const transactionStatus = midtransStatus.transaction_status;
          const fraudStatus = midtransStatus.fraud_status;

          let newStatus: TransactionStatus = 'PENDING';

          if (transactionStatus === 'capture') {
            newStatus = fraudStatus === 'accept' ? 'PAID' : 'PENDING';
          } else if (transactionStatus === 'settlement') {
            newStatus = 'PAID';
          } else if (['cancel', 'deny', 'failure', 'reject'].includes(transactionStatus)) {
            newStatus = 'FAILED';
          } else if (transactionStatus === 'expire') {
            newStatus = 'EXPIRED';
          } else if (['refund', 'partial_refund'].includes(transactionStatus)) {
            newStatus = 'REFUNDED';
          } else if (transactionStatus === 'pending') {
            newStatus = 'WAITING_PAYMENT';
          }

          const isPaidStatus = newStatus === 'PAID';

          if (isPaidStatus) {
            await prisma.$transaction(async (dbTx) => {
              await dbTx.transaction.update({
                where: { id: tx.id },
                data: {
                  status: newStatus,
                  midtransId: midtransStatus.transaction_id,
                  paymentMethod: midtransStatus.payment_type,
                },
              });

              await dbTx.transactionHistory.create({
                data: {
                  transactionId: tx.id,
                  oldStatus: tx.status,
                  newStatus,
                  changedBy: 'RECONCILER',
                  metadata: {
                    midtransId: midtransStatus.transaction_id,
                    paymentType: midtransStatus.payment_type,
                  },
                },
              });

              if (tx.type === 'INVITATION_UPGRADE' && tx.invitationId && tx.tier) {
                await dbTx.invitation.update({
                  where: { id: tx.invitationId },
                  data: { tier: tx.tier },
                  // v1.2: isPaid removed — tier update IS the single source of truth
                });
              }
            });
            console.log(`[Reconciler Success]: Transaction ${tx.id} → ${newStatus}`);
          } else if (newStatus !== 'PENDING') {
            await prisma.$transaction(async (dbTx) => {
              await dbTx.transaction.update({
                where: { id: tx.id },
                data: { status: newStatus },
              });
              await dbTx.transactionHistory.create({
                data: {
                  transactionId: tx.id,
                  oldStatus: tx.status,
                  newStatus,
                  changedBy: 'RECONCILER',
                },
              });
            });
            
            // If failed, canceled or expired, restore the promo quota
            if (['FAILED', 'EXPIRED', 'REFUNDED'].includes(newStatus)) {
              await promoService.restoreUsage(tx.id);
            }
            
            console.log(`[Reconciler]: Transaction ${tx.id} → ${newStatus}`);
          }
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn(`[Reconciler Warning] Failed checking tx ${tx.id}:`, errMsg);
        }
      }
    } catch (error) {
      console.error('[Reconciler Error]:', error);
    }
  },
};
