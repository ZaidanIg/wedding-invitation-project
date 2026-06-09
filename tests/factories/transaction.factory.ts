import { prisma } from '../../src/lib/prisma';
import { Prisma, TransactionStatus, TransactionType, Tier } from '@prisma/client';
import { UserFactory } from './user.factory';
import { InvitationFactory } from './invitation.factory';

export const TransactionFactory = {
  async create(overrides?: Partial<Prisma.TransactionCreateInput> & { userId?: string; invitationId?: string }) {
    let userId = overrides?.userId;
    let invitationId = overrides?.invitationId;

    if (!userId) {
      const user = await UserFactory.create();
      userId = user.id;
    }

    if (!invitationId) {
      const invitation = await InvitationFactory.create({ userId });
      invitationId = invitation.id;
    }

    const { userId: _, invitationId: __, ...restOverrides } = overrides || {};

    const baseData: Prisma.TransactionCreateInput = {
      id: `ORD-${Date.now()}`,
      idempotencyKey: `idempotency-${Date.now()}`,
      amount: 150000,
      type: TransactionType.INVITATION_UPGRADE,
      status: TransactionStatus.PENDING,
      tier: Tier.PREMIUM,
      midtransId: `midtrans-${Date.now()}`,
      ...restOverrides,
      user: { connect: { id: userId } },
      invitation: { connect: { id: invitationId } },
    };

    return prisma.transaction.create({
      data: baseData,
    });
  },

  async createPaid(overrides?: Partial<Prisma.TransactionCreateInput> & { userId?: string; invitationId?: string }) {
    return this.create({
      ...overrides,
      status: TransactionStatus.PAID,
    });
  },
};
