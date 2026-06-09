import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export const authRepository = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  },

  async updateUserPassword(email: string, passwordHash: string) {
    return prisma.user.update({
      where: { email },
      data: { password: passwordHash },
    });
  },

  async findVerificationToken(email: string, token: string) {
    return prisma.verificationToken.findFirst({
      where: { identifier: email, token },
    });
  },

  async deleteVerificationTokens(email: string) {
    return prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });
  },

  async deleteVerificationToken(email: string, token: string) {
    return prisma.verificationToken.deleteMany({
      where: { identifier: email, token },
    });
  },

  async createVerificationToken(data: { identifier: string; token: string; expires: Date }) {
    return prisma.verificationToken.create({
      data,
    });
  },

  async createPasswordResetToken(data: { email: string; token: string; expires: Date }) {
    return prisma.passwordResetToken.create({
      data,
    });
  },

  async findPasswordResetToken(token: string) {
    return prisma.passwordResetToken.findUnique({
      where: { token },
    });
  },

  async deletePasswordResetToken(id: string) {
    return prisma.passwordResetToken.delete({
      where: { id },
    });
  },
};
