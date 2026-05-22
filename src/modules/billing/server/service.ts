// ============================================================
// Billing Service — Checkout business logic
// ============================================================

import { ValidationError, NotFoundError, ConflictError } from '@/lib/errors';
import { billingRepository } from './repository';
import { PRICING, type PlanKey } from './constants';
import type { Tier, TransactionType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export const billingService = {
  /**
   * Create a checkout session with Midtrans.
   */
  async createCheckout(payload: { plan: string; invitationId?: string }, user: { id: string; name?: string | null; email?: string | null }) {
    const { plan, invitationId } = payload;

    // Validate plan
    if (!PRICING[plan as PlanKey]) {
      throw new ValidationError('Invalid plan selected');
    }

    const subtotal = PRICING[plan as PlanKey];
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

      if (invitation.tier === targetTier && (invitation as any).isPaid) {
        throw new ConflictError('Invitation is already on this tier and activated');
      }

      // Check for existing pending transaction for this invitation and plan
      const existingTx = await prisma.transaction.findFirst({
        where: {
          invitationId,
          userId: user.id,
          status: 'PENDING',
          tier: targetTier,
        }
      });

      if (existingTx && existingTx.paymentUrl) {
        const token = existingTx.paymentUrl.split('/').pop();
        if (token) {
          return {
            token,
            redirect_url: existingTx.paymentUrl,
          };
        }
      }
    }

    // Generate custom Order ID format: ORD-YYYYMMDD-XXXX
    const now = new Date();
    const jakartaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
    const yyyy = jakartaTime.getFullYear().toString();
    const mm = String(jakartaTime.getMonth() + 1).padStart(2, '0');
    const dd = String(jakartaTime.getDate()).padStart(2, '0');
    const datePrefix = `${yyyy}${mm}${dd}`;

    const todayTxCount = await prisma.transaction.count({
      where: {
        id: { startsWith: `ORD-${datePrefix}` }
      }
    });

    const orderId = `ORD-${datePrefix}-${String(todayTxCount + 1).padStart(4, '0')}`;

    // Create pending transaction
    const transaction = await billingRepository.createTransaction({
      id: orderId,
      userId: user.id,
      invitationId: invitationId || null,
      amount,
      type,
      tier: targetTier,
      status: 'PENDING',
    });

    // Create Midtrans Snap payload
    const parameter = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: amount,
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: user.name || 'User',
        email: user.email || '',
      },
      item_details: [
        {
          id: plan,
          price: subtotal,
          quantity: 1,
          name: `${plan.replace('_', ' ')} Upgrade`,
        },
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
        order_time: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' +0700',
        expiry_duration: 24,
        unit: 'hour'
      }
    };

    const snapTransaction = await snap.createTransaction(parameter);

    // Save payment URL
    await billingRepository.updateTransaction(transaction.id, {
      paymentUrl: snapTransaction.redirect_url,
    });

    return {
      token: snapTransaction.token,
      redirect_url: snapTransaction.redirect_url,
    };
  },

  /**
   * Reconcile any pending transactions for the user by checking status directly with Midtrans.
   */
  async reconcilePendingTransactions(userId: string) {
    try {
      // First, automatically expire any PENDING transactions older than 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await prisma.transaction.updateMany({
        where: {
          userId,
          status: 'PENDING',
          createdAt: { lt: twentyFourHoursAgo },
        },
        data: { status: 'FAILED' },
      });

      // Find remaining PENDING transactions for the user
      const pendingTransactions = await prisma.transaction.findMany({
        where: {
          userId,
          status: 'PENDING',
        },
      });

      if (pendingTransactions.length === 0) return;

      for (const tx of pendingTransactions) {
        try {
          const midtransStatus = await snap.transaction.status(tx.id);
          const transactionStatus = midtransStatus.transaction_status;
          const fraudStatus = midtransStatus.fraud_status;

          let newStatus: 'PENDING' | 'SUCCESS' | 'FAILED' = 'PENDING';

          if (transactionStatus === 'capture') {
            if (fraudStatus === 'challenge') {
              newStatus = 'PENDING';
            } else if (fraudStatus === 'accept') {
              newStatus = 'SUCCESS';
            }
          } else if (transactionStatus === 'settlement') {
            newStatus = 'SUCCESS';
          } else if (
            transactionStatus === 'cancel' ||
            transactionStatus === 'deny' ||
            transactionStatus === 'expire'
          ) {
            newStatus = 'FAILED';
          }

          if (newStatus === 'SUCCESS') {
            // Apply upgrades
            await prisma.$transaction(async (dbTx) => {
              await dbTx.transaction.update({
                where: { id: tx.id },
                data: { 
                  status: 'SUCCESS',
                  midtransId: midtransStatus.transaction_id
                },
              });

              if (tx.type === 'INVITATION_UPGRADE' && tx.invitationId && tx.tier) {
                await dbTx.invitation.update({
                  where: { id: tx.invitationId },
                  data: { 
                    tier: tx.tier,
                    isPaid: true
                  },
                });
              }
            });
            console.log(`[Reconciler Success]: Transaction ${tx.id} upgraded successfully!`);
          } else if (newStatus === 'FAILED') {
            await prisma.transaction.update({
              where: { id: tx.id },
              data: { status: 'FAILED' },
            });
            console.log(`[Reconciler Failed]: Transaction ${tx.id} set to FAILED.`);
          }
        } catch (err: any) {
          // If transaction is not found on Midtrans yet, it throws an error (e.g. 404), which is normal for created but unpaid/unattempted tokens
          console.warn(`[Reconciler Warning] Failed checking status for tx ${tx.id}:`, err.message || err);
        }
      }
    } catch (error) {
      console.error('[Reconciler Error] Error running reconciler:', error);
    }
  },
};
