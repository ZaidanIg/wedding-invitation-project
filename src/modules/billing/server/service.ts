// ============================================================
// Billing Service — Checkout business logic
// ============================================================

import { ValidationError, NotFoundError, ConflictError } from '@/lib/errors';
import { billingRepository } from './repository';
import { PRICING, type PlanKey } from './constants';
import type { InvitationTier, AccountType, TransactionType } from '@prisma/client';
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
        throw new ValidationError('Invitation ID is required for this plan');
      }
      type = 'INVITATION_UPGRADE';
      targetTier = plan as InvitationTier;

      // Verify ownership
      const invitation = await billingRepository.findInvitationForCheckout(invitationId);
      if (!invitation || invitation.userId !== user.id) {
        throw new NotFoundError('Invitation not found');
      }

      if (invitation.tier === targetTier) {
        throw new ConflictError('Invitation is already on this tier');
      }
    }

    // Create pending transaction
    const transaction = await billingRepository.createTransaction({
      userId: user.id,
      invitationId: invitationId || null,
      amount,
      type,
      tier: targetTier,
      accountType: targetAccountType,
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
      // Find all PENDING transactions for the user
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
                  data: { tier: tx.tier },
                });
              } else if (tx.type === 'ACCOUNT_UPGRADE' && tx.accountType) {
                await dbTx.user.update({
                  where: { id: tx.userId },
                  data: { accountType: tx.accountType },
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
