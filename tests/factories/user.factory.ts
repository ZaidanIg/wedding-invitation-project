import { prisma } from '../../src/lib/prisma';
import { Prisma } from '@prisma/client';

export const UserFactory = {
  async create(overrides?: Partial<Prisma.UserCreateInput>) {
    const defaultUser: Prisma.UserCreateInput = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'hashed-password',
      role: 'USER',
    };

    return prisma.user.create({
      data: {
        ...defaultUser,
        ...overrides,
      },
    });
  },

  async createAdmin(overrides?: Partial<Prisma.UserCreateInput>) {
    return this.create({
      ...overrides,
      role: 'ADMIN',
      email: `admin-${Date.now()}@example.com`,
    });
  },
};
