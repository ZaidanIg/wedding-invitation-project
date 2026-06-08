import { ValidationError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import type { Promo } from '@prisma/client';

export interface PromoValidationResult {
  promo: Promo;
  discountAmount: number;
  finalPrice: number;
}

export const promoService = {
  /**
   * Validate a promo code against constraints (expiry, limits)
   * and calculate the final discounted price.
   * 
   * @param code The promo code string
   * @param baseAmount The original price before discount
   * @param userId The ID of the user trying to apply the promo
   * @param ipAddress The IP address of the user
   */
  async validateAndCalculatePromo(
    code: string,
    baseAmount: number,
    userId: string,
    ipAddress: string
  ): Promise<PromoValidationResult> {
    const promo = await prisma.promo.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      throw new ValidationError('Kode voucher tidak ditemukan');
    }

    if (!promo.isActive) {
      throw new ValidationError('Kode voucher ini sudah tidak aktif');
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      throw new ValidationError('Kode voucher sudah kedaluwarsa');
    }

    // Check Global Limit
    if (promo.maxGlobalUsage > 0 && promo.usageCount >= promo.maxGlobalUsage) {
      throw new ValidationError('Kuota penggunaan voucher ini sudah habis');
    }

    // Check User Limit
    if (promo.usageLimitPerUser > 0) {
      const userUsageCount = await prisma.promoUsage.count({
        where: { promoCode: promo.code, userId },
      });
      if (userUsageCount >= promo.usageLimitPerUser) {
        throw new ValidationError('Anda telah mencapai batas penggunaan untuk voucher ini');
      }
    }

    // Check IP Limit
    if (promo.usageLimitPerIp > 0) {
      const ipUsageCount = await prisma.promoUsage.count({
        where: { promoCode: promo.code, ipAddress },
      });
      if (ipUsageCount >= promo.usageLimitPerIp) {
        throw new ValidationError('Voucher ini telah mencapai batas penggunaan pada perangkat/jaringan Anda');
      }
    }

    // Calculate Discount
    let discountAmount = Math.round((baseAmount * promo.discountPercent) / 100);

    // Apply max cap if defined
    if (promo.maxDiscountAmount && promo.maxDiscountAmount > 0) {
      discountAmount = Math.min(discountAmount, promo.maxDiscountAmount);
    }

    // Discount cannot exceed base amount
    discountAmount = Math.min(discountAmount, baseAmount);

    const finalPrice = baseAmount - discountAmount;

    return {
      promo,
      discountAmount,
      finalPrice,
    };
  },

  /**
   * Records promo usage when a transaction is created (PENDING).
   */
  async recordUsage(
    promoCode: string,
    userId: string,
    transactionId: string,
    ipAddress: string
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.promoUsage.create({
        data: {
          promoCode,
          userId,
          transactionId,
          ipAddress,
        },
      });

      await tx.promo.update({
        where: { code: promoCode },
        data: {
          usageCount: { increment: 1 },
        },
      });
    });
  },

  /**
   * Restores promo usage if a transaction fails, expires, or cancels.
   */
  async restoreUsage(transactionId: string) {
    const usage = await prisma.promoUsage.findUnique({
      where: { transactionId },
    });

    if (usage) {
      return prisma.$transaction(async (tx) => {
        // Decrement usage count
        await tx.promo.update({
          where: { code: usage.promoCode },
          data: {
            usageCount: { decrement: 1 },
          },
        });
        
        // Remove the usage record so they can use it again
        await tx.promoUsage.delete({
          where: { transactionId },
        });
      });
    }
  },
};
