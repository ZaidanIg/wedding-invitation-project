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

    const baseData: any = {
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
      ...overrides,
      user: { connect: { id: userId } },
    };

    // Remove userId from baseData to prevent Prisma errors since we used connect
    delete (baseData as any).userId;

    return prisma.invitation.create({
      data: baseData,
    });
  },

  async createPublished(overrides?: Partial<Prisma.InvitationCreateInput> & { userId?: string }) {
    return this.create({
      ...overrides,
      status: 'PUBLISHED',
      tier: 'PREMIUM',
    } as any);
  },
};
