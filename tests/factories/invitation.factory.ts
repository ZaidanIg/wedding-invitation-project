import { prisma } from '../../src/lib/prisma';
import { Prisma } from '@prisma/client';
import { UserFactory } from './user.factory';

export const InvitationFactory = {
  async create(overrides?: Partial<Prisma.InvitationCreateInput> & { userId?: string }) {
    let userId = overrides?.userId;

    if (!userId) {
      const user = await UserFactory.create();
      userId = user.id;
    }

    const { userId: _, ...restOverrides } = overrides || {};

    const baseData: Prisma.InvitationCreateInput = {
      slug: `slug-${Date.now()}`,
      groomName: 'Groom',
      brideName: 'Bride',
      venueName: 'Gedung Resepsi',
      venueAddress: 'Jl. Resepsi No. 1',
      greeting: 'Assalamu alaikum',
      mainBody: 'Dengan memohon rahmat Allah...',
      eventInfo: 'Acara akan diselenggarakan pada...',
      closing: 'Wassalamu alaikum',
      fullText: 'Full generated text...',
      eventDate: new Date(),
      eventTime: '08:00',
      status: 'DRAFT',
      tier: 'BASIC',
      layout: 'ElegantSundanese',
      ...restOverrides,
      user: { connect: { id: userId } },
    };

    return prisma.invitation.create({
      data: baseData,
    });
  },

  async createPublished(overrides?: Partial<Prisma.InvitationCreateInput> & { userId?: string }) {
    const { userId: _, ...restOverrides } = overrides || {};
    return this.create({
      ...restOverrides,
      status: 'PUBLISHED',
      tier: 'PREMIUM',
    } as Prisma.InvitationCreateInput);
  },
};
