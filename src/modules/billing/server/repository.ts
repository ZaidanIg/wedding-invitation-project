// ============================================================
// Billing Repository — Database access only
// ============================================================

import { prisma } from '@/lib/prisma';

export const billingRepository = {
  async createTransaction(data: {
    id?: string;
    userId: string;
    invitationId: string | null;
    amount: number;
    type: any;
    tier: any | null;
    status: any;
  }) {
    return prisma.transaction.create({
      data: {
        id: data.id,
        userId: data.userId,
        invitationId: data.invitationId,
        amount: data.amount,
        type: data.type,
        tier: data.tier,
        status: data.status,
      }
    });
  },

  async updateTransaction(id: string, data: Record<string, unknown>) {
    return prisma.transaction.update({ where: { id }, data });
  },

  async findInvitationForCheckout(invitationId: string) {
    return prisma.invitation.findUnique({
      where: { id: invitationId },
      select: { userId: true, tier: true, isPaid: true },
    });
  },
};
