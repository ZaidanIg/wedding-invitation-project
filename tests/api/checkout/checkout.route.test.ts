import { testClient } from '../../setup/testClient';
import { POST } from '../../../src/app/api/checkout/route';
import { UserFactory } from '../../factories/user.factory';
import { InvitationFactory } from '../../factories/invitation.factory';

// Mock midtrans
jest.mock('midtrans-client', () => {
  return {
    Snap: jest.fn().mockImplementation(() => {
      return {
        createTransaction: jest.fn().mockResolvedValue({
          token: 'mock-token',
          redirect_url: 'https://app.midtrans.com/snap/v2/vtweb/mock-token'
        })
      };
    })
  };
});

describe('Checkout Module Route Tests', () => {
  describe('POST /api/checkout', () => {
    it('✓ Checkout success', async () => {
      const user = await UserFactory.create();
      const inv = await InvitationFactory.create({ userId: user.id, tier: 'BASIC' });
      
      const payload = {
        invitationId: inv.id,
        plan: 'PREMIUM',
      };

      const res = await testClient.asUser(user.id, user.email).post(POST, 'http://localhost/api/checkout', payload);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.midtransToken).toBe('mock-token');

      // Verify transaction is in DB
      // const tx = await prisma.transaction.findFirst({ where: { invitationId: inv.id } });
      // expect(tx).not.toBeNull();
      // expect(tx?.status).toBe('PENDING');
    });



    it('✓ Plan tidak valid', async () => {
      const user = await UserFactory.create();
      const inv = await InvitationFactory.create({ userId: user.id, tier: 'DRAFT' });
      
      const res = await testClient.asUser(user.id, user.email).post(POST, 'http://localhost/api/checkout', {
        invitationId: inv.id,
        plan: 'UNKNOWN_PLAN',
      });
      
      expect(res.status).toBe(422);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.message).toContain('Invalid plan selected');
    });

    it('✓ Gagal checkout karena Invitation ID tidak dikirim', async () => {
      const user = await UserFactory.create();
      
      const res = await testClient.asUser(user.id, user.email).post(POST, 'http://localhost/api/checkout', {
        plan: 'PREMIUM',
      });
      
      expect(res.status).toBe(422);
      expect(res.body.message).toContain('Invitation ID is required for this plan');
    });

    it('✓ Gagal checkout invitation milik orang lain (IDOR)', async () => {
      const hacker = await UserFactory.create();
      const victim = await UserFactory.create();
      const victimInv = await InvitationFactory.create({ userId: victim.id, tier: 'DRAFT' });
      
      const res = await testClient.asUser(hacker.id, hacker.email).post(POST, 'http://localhost/api/checkout', {
        invitationId: victimInv.id,
        plan: 'PREMIUM',
      });
      
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
      expect(res.body.message).toContain('Invitation not found');
    });
  });
});
