// ============================================================
// Billing Repository — Database access only
// API Version: 1.2
// ============================================================

import { prisma } from '@/lib/prisma';
import type { TransactionType, Tier, TransactionStatus } from '@prisma/client';

export const billingRepository = {
  async createTransaction(data: {
    id: string;                 // ORD-YYYYMMDD-XXXX (also serves as orderNumber)
    idempotencyKey: string;     // prevents duplicate checkout sessions
    userId: string;
    invitationId: string | null;
    amount: number;
    type: TransactionType;
    tier: Tier | null;
    status: TransactionStatus;
    promoCode?: string | null;
    discountAmount?: number;
  }) {
    return prisma.transaction.create({
      data: {
        id: data.id,
        idempotencyKey: data.idempotencyKey,
        userId: data.userId,
        invitationId: data.invitationId,
        amount: data.amount,
        type: data.type,
        tier: data.tier,
        status: data.status,
        promoCode: data.promoCode,
        discountAmount: data.discountAmount,
      },
    });
  },

  async updateTransaction(id: string, data: Record<string, unknown>) {
    return prisma.transaction.update({ where: { id }, data });
  },

  async findInvitationForCheckout(invitationId: string) {
    return prisma.invitation.findUnique({
      where: { id: invitationId },
      // v1.2: isPaid removed — tier is the single source of truth
      select: { userId: true, tier: true },
    });
  },

  async findTransactionByIdempotencyKey(key: string) {
    return prisma.transaction.findUnique({
      where: { idempotencyKey: key },
    });
  },

  async findLatestTransactionByBaseIdempotencyKey(baseKey: string) {
    return prisma.transaction.findFirst({
      where: { idempotencyKey: { startsWith: baseKey } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async countTransactionsByBaseIdempotencyKey(baseKey: string) {
    return prisma.transaction.count({
      where: { idempotencyKey: { startsWith: baseKey } },
    });
  },
};
