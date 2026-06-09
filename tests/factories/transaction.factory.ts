import { prisma } from '../../src/lib/prisma';
import { Prisma } from '@prisma/client';
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

    const baseData: any = {
      id: `ORD-${Date.now()}`,
      idempotencyKey: `idempotency-${Date.now()}`,
      amount: 150000,
      type: 'INVITATION_UPGRADE',
      status: 'PENDING',
      tier: 'PREMIUM',
      midtransId: `midtrans-${Date.now()}`,
      ...overrides,
      user: { connect: { id: userId } },
      invitation: { connect: { id: invitationId } },
    };

    delete (baseData as any).userId;
    delete (baseData as any).invitationId;

    return prisma.transaction.create({
      data: baseData,
    });
  },

  async createPaid(overrides?: Partial<Prisma.TransactionCreateInput> & { userId?: string; invitationId?: string }) {
    return this.create({
      ...overrides,
      status: 'PAID',
    });
  },
};
