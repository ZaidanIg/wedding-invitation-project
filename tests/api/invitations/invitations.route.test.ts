import '../../helpers/contract.helper';
import { testClient } from '../../setup/testClient';
import { GET, POST } from '../../../src/app/api/invitations/route';
import { GET as getById, PUT, DELETE } from '../../../src/app/api/invitations/[id]/route';
import { UserFactory } from '../../factories/user.factory';
import { InvitationFactory } from '../../factories/invitation.factory';
import { prisma } from '../../../src/lib/prisma';

describe('Invitations Module Route Tests', () => {
  describe('POST /api/invitations', () => {
    it('✓ Create invitation', async () => {
      const user = await UserFactory.create();
      
      const payload = {
        slug: 'john-and-jane',
        groomName: 'John',
        brideName: 'Jane',
        eventDate: new Date().toISOString(),
        eventTime: '08:00',
        venueName: 'Gedung Resepsi',
        venueAddress: 'Jl. Resepsi No. 1',
        greeting: 'Assalamu alaikum',
        mainBody: 'Dengan memohon rahmat Allah...',
        eventInfo: 'Acara akan diselenggarakan pada...',
        closing: 'Wassalamu alaikum',
        fullText: 'Full generated text...',
      };

      const res = await testClient.asUser(user.id, user.email).post(POST, 'http://localhost/api/invitations', payload);
      
      expect(res.status).toBe(201);
      expect(res.body).toMatchApiContract();
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe(payload.slug);
      expect(res.body.data.status).toBe('DRAFT');
    });

    it('✓ Slug conflict', async () => {
      const user = await UserFactory.create();
      await InvitationFactory.create({ slug: 'taken-slug', userId: user.id });

      const res = await testClient.asUser(user.id, user.email).post(POST, 'http://localhost/api/invitations', {
        slug: 'taken-slug',
        groomName: 'John',
        brideName: 'Jane',
        eventDate: new Date().toISOString(),
        eventTime: '08:00',
        venueName: 'Gedung Resepsi',
        venueAddress: 'Jl. Resepsi No. 1',
        greeting: 'Assalamu alaikum',
        mainBody: 'Dengan memohon rahmat Allah...',
        eventInfo: 'Acara akan diselenggarakan pada...',
        closing: 'Wassalamu alaikum',
        fullText: 'Full generated text...',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('SLUG_EXISTS');
    });

    it('✓ Unauthorized', async () => {
      const res = await testClient.asGuest().post(POST, 'http://localhost/api/invitations', { slug: 'test' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/invitations', () => {
    it('✓ Get paginated invitations', async () => {
      const user = await UserFactory.create();
      await InvitationFactory.create({ userId: user.id });
      await InvitationFactory.create({ userId: user.id });

      const res = await testClient.asUser(user.id, user.email).get(GET, 'http://localhost/api/invitations?page=1&limit=10');
      
      expect(res.status).toBe(200);
      expect(res.body).toMatchApiContract();
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta).toMatchObject({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });
  });

  describe('GET /api/invitations/:id', () => {
    it('✓ Existing invitation', async () => {
      const user = await UserFactory.create();
      const inv = await InvitationFactory.create({ userId: user.id });

      const res = await testClient.asUser(user.id, user.email).get(getById, `http://localhost/api/invitations/${inv.id}`, { id: inv.id });
      
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(inv.id);
    });

    it('✓ Not found', async () => {
      const user = await UserFactory.create();
      const res = await testClient.asUser(user.id, user.email).get(getById, `http://localhost/api/invitations/fake-id`, { id: 'fake-id' });
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/invitations/:id', () => {
    it('✓ Update invitation', async () => {
      const user = await UserFactory.create();
      const inv = await InvitationFactory.create({ userId: user.id, groomName: 'Old' });

      const res = await testClient.asUser(user.id, user.email).patch(PUT, `http://localhost/api/invitations/${inv.id}`, { groomName: 'New' }, { id: inv.id });
      
      expect(res.status).toBe(200);
      expect(res.body.data.groomName).toBe('New');
    });

    it('✓ Ownership validation', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const inv = await InvitationFactory.create({ userId: user1.id });

      const res = await testClient.asUser(user2.id, user2.email).patch(PUT, `http://localhost/api/invitations/${inv.id}`, { groomName: 'Hacker' }, { id: inv.id });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/invitations/:id', () => {
    it('✓ Soft delete', async () => {
      const user = await UserFactory.create();
      const inv = await InvitationFactory.create({ userId: user.id });

      const res = await testClient.asUser(user.id, user.email).delete(DELETE, `http://localhost/api/invitations/${inv.id}`, { id: inv.id });
      expect(res.status).toBe(200);
      expect(res.body.data.deletedAt).toBeDefined();

      const dbInv = await prisma.invitation.findUnique({ where: { id: inv.id } });
      expect((dbInv as unknown)?.status).toBe('DELETED');
    });
  });
});
