import { promoService } from './promoService';
import { prisma } from '@/lib/prisma';
import { ValidationError } from '@/lib/errors';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    promo: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    promoUsage: {
      count: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
    $queryRaw: jest.fn().mockResolvedValue([]),
    $executeRawUnsafe: jest.fn().mockResolvedValue(true),
  },
}));

describe('promoService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateAndCalculatePromo', () => {
    const baseAmount = 100000;
    const userId = 'user-1';
    const ipAddress = '192.168.1.1';

    it('should throw ValidationError if promo code is not found', async () => {
      (prisma.promo.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        promoService.validateAndCalculatePromo('INVALID', baseAmount, userId, ipAddress)
      ).rejects.toThrow(ValidationError);
      await expect(
        promoService.validateAndCalculatePromo('INVALID', baseAmount, userId, ipAddress)
      ).rejects.toThrow('Kode voucher tidak ditemukan');
    });

    it('should throw ValidationError if promo is inactive', async () => {
      (prisma.promo.findUnique as jest.Mock).mockResolvedValue({
        code: 'TEST',
        isActive: false,
      });

      await expect(
        promoService.validateAndCalculatePromo('TEST', baseAmount, userId, ipAddress)
      ).rejects.toThrow('Kode voucher ini sudah tidak aktif');
    });

    it('should throw ValidationError if promo is expired', async () => {
      (prisma.promo.findUnique as jest.Mock).mockResolvedValue({
        code: 'EXPIRED',
        isActive: true,
        expiresAt: new Date(Date.now() - 10000), // Past
      });

      await expect(
        promoService.validateAndCalculatePromo('EXPIRED', baseAmount, userId, ipAddress)
      ).rejects.toThrow('Kode voucher sudah kedaluwarsa');
    });

    it('should throw ValidationError if global usage limit is reached', async () => {
      (prisma.promo.findUnique as jest.Mock).mockResolvedValue({
        code: 'LIMIT10',
        isActive: true,
        maxGlobalUsage: 10,
        usageCount: 10,
      });

      await expect(
        promoService.validateAndCalculatePromo('LIMIT10', baseAmount, userId, ipAddress)
      ).rejects.toThrow('Kuota penggunaan voucher ini sudah habis');
    });

    it('should throw ValidationError if user limit is reached', async () => {
      (prisma.promo.findUnique as jest.Mock).mockResolvedValue({
        code: 'USERLIMIT',
        isActive: true,
        maxGlobalUsage: 0,
        usageLimitPerUser: 1,
        usageLimitPerIp: 0,
      });

      // Mock user has used it once
      (prisma.promoUsage.count as jest.Mock).mockResolvedValue(1);

      await expect(
        promoService.validateAndCalculatePromo('USERLIMIT', baseAmount, userId, ipAddress)
      ).rejects.toThrow('Anda telah mencapai batas penggunaan untuk voucher ini');
    });

    it('should throw ValidationError if IP limit is reached (Anti-Tuyul)', async () => {
      (prisma.promo.findUnique as jest.Mock).mockResolvedValue({
        code: 'IPLIMIT',
        isActive: true,
        maxGlobalUsage: 0,
        usageLimitPerUser: 0,
        usageLimitPerIp: 1,
        discountPercent: 10,
      });

      // Since usageLimitPerUser is 0, the first count call will be for IP limit
      (prisma.promoUsage.count as jest.Mock).mockResolvedValueOnce(1);

      await expect(
        promoService.validateAndCalculatePromo('IPLIMIT', baseAmount, 'new-user', ipAddress)
      ).rejects.toThrow('Voucher ini telah mencapai batas penggunaan pada perangkat/jaringan Anda');
    });

    it('should calculate 10% discount correctly', async () => {
      (prisma.promo.findUnique as jest.Mock).mockResolvedValue({
        code: 'DISC10',
        isActive: true,
        maxGlobalUsage: 0,
        usageLimitPerUser: 0,
        usageLimitPerIp: 0,
        discountPercent: 10,
        maxDiscountAmount: null,
      });

      const result = await promoService.validateAndCalculatePromo('DISC10', baseAmount, userId, ipAddress);

      expect(result.discountAmount).toBe(10000);
      expect(result.finalPrice).toBe(90000);
    });

    it('should calculate 50% discount but cap at maxDiscountAmount', async () => {
      (prisma.promo.findUnique as jest.Mock).mockResolvedValue({
        code: 'DISC50',
        isActive: true,
        maxGlobalUsage: 0,
        usageLimitPerUser: 0,
        usageLimitPerIp: 0,
        discountPercent: 50,
        maxDiscountAmount: 30000, // Capped at 30k
      });

      const result = await promoService.validateAndCalculatePromo('DISC50', baseAmount, userId, ipAddress);

      // 50% of 100k is 50k, but cap is 30k
      expect(result.discountAmount).toBe(30000);
      expect(result.finalPrice).toBe(70000);
    });

    it('should not allow discount to exceed base amount (100% discount)', async () => {
      (prisma.promo.findUnique as jest.Mock).mockResolvedValue({
        code: 'FREE',
        isActive: true,
        maxGlobalUsage: 0,
        usageLimitPerUser: 0,
        usageLimitPerIp: 0,
        discountPercent: 100, // 100%
        maxDiscountAmount: null,
      });

      const result = await promoService.validateAndCalculatePromo('FREE', baseAmount, userId, ipAddress);

      expect(result.discountAmount).toBe(100000);
      expect(result.finalPrice).toBe(0);
    });
  });

  describe('recordUsage', () => {
    it('should create usage record and increment usage count within a transaction', async () => {
      await promoService.recordUsage('TEST', 'user-1', 'tx-1', '1.1.1.1');

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.promoUsage.create).toHaveBeenCalledWith({
        data: {
          promoCode: 'TEST',
          userId: 'user-1',
          transactionId: 'tx-1',
          ipAddress: '1.1.1.1',
        },
      });
      expect(prisma.promo.update).toHaveBeenCalledWith({
        where: { code: 'TEST' },
        data: { usageCount: { increment: 1 } },
      });
    });
  });

  describe('restoreUsage', () => {
    it('should delete usage record and decrement usage count if usage exists', async () => {
      (prisma.promoUsage.findUnique as jest.Mock).mockResolvedValue({
        id: 'u-1',
        promoCode: 'TEST',
        transactionId: 'tx-1',
      });

      await promoService.restoreUsage('tx-1');

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.promo.update).toHaveBeenCalledWith({
        where: { code: 'TEST' },
        data: { usageCount: { decrement: 1 } },
      });
      expect(prisma.promoUsage.delete).toHaveBeenCalledWith({
        where: { transactionId: 'tx-1' },
      });
    });

    it('should do nothing if usage does not exist', async () => {
      (prisma.promoUsage.findUnique as jest.Mock).mockResolvedValue(null);

      await promoService.restoreUsage('tx-2');

      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(prisma.promo.update).not.toHaveBeenCalled();
    });
  });
});
