// ============================================================
// Billing Repository — Database access only
// ============================================================

import { prisma } from '@/lib/prisma';

export const billingRepository = {
  async createTransaction(data: {
    userId: string;
    invitationId: string | null;
    amount: number;
    type: string;
    tier: string | null;
    accountType: string | null;
    status: string;
  }) {
    return prisma.transaction.create({ data: data as any });
  },

  async updateTransaction(id: string, data: Record<string, unknown>) {
    return prisma.transaction.update({ where: { id }, data });
  },

  async findInvitationForCheckout(invitationId: string) {
    return prisma.invitation.findUnique({
      where: { id: invitationId },
      select: { userId: true, tier: true },
    });
  },
};
