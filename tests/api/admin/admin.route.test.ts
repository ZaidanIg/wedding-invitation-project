import { testClient } from '../../setup/testClient';
import { GET as getUsers } from '../../../src/app/api/admin/users/route';
import { GET as getMetrics } from '../../../src/app/api/admin/metrics/route';
import { UserFactory } from '../../factories/user.factory';
import { InvitationFactory } from '../../factories/invitation.factory';

describe('Admin Module Route Tests', () => {
  describe('GET /api/admin/users', () => {
    it('✓ ADMIN access', async () => {
      const admin = await UserFactory.createAdmin();
      await UserFactory.create(); // Create a regular user
      
      const res = await testClient.asAdmin(admin.id, admin.email).get(getUsers, 'http://localhost/api/admin/users');
      console.log('Admin route users response:', JSON.stringify(res.body, null, 2));
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('✓ USER forbidden', async () => {
      const user = await UserFactory.create();
      
      const res = await testClient.asUser(user.id, user.email).get(getUsers, 'http://localhost/api/admin/users');
      
      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('✓ Pagination', async () => {
      const admin = await UserFactory.createAdmin();
      // Ensure we have at least 3 users
      await UserFactory.create();
      await UserFactory.create();

      const res = await testClient.asAdmin(admin.id, admin.email).get(getUsers, 'http://localhost/api/admin/users?page=1&limit=1');
      
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.meta.limit).toBe(1);
    });
  });

  describe('GET /api/admin/metrics', () => {
    it('✓ Get Dashboard Metrics', async () => {
      const admin = await UserFactory.createAdmin();
      await InvitationFactory.create({ tier: 'PREMIUM' });
      await InvitationFactory.create({ tier: 'DRAFT' });

      const res = await testClient.asAdmin(admin.id, admin.email).get(getMetrics, 'http://localhost/api/admin/metrics');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalInvitations');
      expect(res.body.data).toHaveProperty('paidInvitations');
    });
  });
});
