import { invitationService } from './service';
import { invitationRepository } from './repository';
import { ForbiddenError, NotFoundError } from '../../../lib/errors';
import { prisma } from '../../../lib/prisma';

jest.mock('./repository');
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    }
  }
}));

describe('Invitation Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('TC-INV-S1: Should ignore tier payload and force DRAFT upon creation', async () => {
      // Mock user exists
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user123' });
      
      const payload = {
        groomName: 'Romeo',
        brideName: 'Juliet',
        eventDate: '2027-01-01',
        eventTime: '08:00',
        venueName: 'Gedung Pernikahan',
        venueAddress: 'Jl. Jendral Sudirman',
        greeting: 'Assalamualaikum',
        mainBody: 'Dengan memohon rahmat',
        eventInfo: 'Acara akan diselenggarakan pada',
        closing: 'Wassalamualaikum',
        fullText: 'Full text',
        tier: 'ULTIMATE' // User tries to bypass
      };

      (invitationRepository.create as jest.Mock).mockResolvedValue({
        ...payload,
        tier: 'DRAFT', // It should save as DRAFT
        id: 'inv_1',
      });

      const result = await invitationService.create(payload, 'user123');

      expect(invitationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ tier: 'DRAFT' })
      );
      expect(result.tier).toBe('DRAFT');
    });
  });

  describe('update', () => {
    it('TC-INV-S2: Should throw ForbiddenError if user tries to update another user invitation', async () => {
      (invitationRepository.findById as jest.Mock).mockResolvedValue({
        id: 'inv_b',
        userId: 'userB',
        tier: 'BASIC',
      });

      const payload = { groomName: 'Hacker' };
      
      await expect(invitationService.update('inv_b', payload, 'userA'))
        .rejects.toThrow(ForbiddenError);
    });

    it('TC-INV-T1: Should throw ForbiddenError if PREMIUM user bypasses photo limits (6 photos)', async () => {
      (invitationRepository.findById as jest.Mock).mockResolvedValue({
        id: 'inv_1',
        userId: 'user123',
        tier: 'PREMIUM', // User has premium
      });

      const payload = {
        // limit is 6, sending 7
        photoUrls: ['url1', 'url2', 'url3', 'url4', 'url5', 'url6', 'url7']
      };
      
      await expect(invitationService.update('inv_1', payload, 'user123'))
        .rejects.toThrow('Paket Premium hanya mendukung maksimal 6 foto di galeri.');
    });

    it('TC-INV-T2: Should throw ForbiddenError if PREMIUM user tries to use videoUrl', async () => {
      (invitationRepository.findById as jest.Mock).mockResolvedValue({
        id: 'inv_1',
        userId: 'user123',
        tier: 'PREMIUM', // User has premium
      });

      const payload = {
        videoUrl: 'https://youtube.com/watch?v=123'
      };
      
      await expect(invitationService.update('inv_1', payload, 'user123'))
        .rejects.toThrow('Paket Premium tidak mendukung fitur video');
    });
  });

  describe('delete', () => {
    it('TC-INV-S3: Should throw ForbiddenError if user tries to delete another user invitation', async () => {
      (invitationRepository.findById as jest.Mock).mockResolvedValue({
        id: 'inv_b',
        userId: 'userB',
        tier: 'BASIC',
      });

      await expect(invitationService.delete('inv_b', 'userA'))
        .rejects.toThrow(ForbiddenError);
    });
  });

  describe('getBySlug', () => {
    it('TC-INV-E2: Should block public access to DRAFT invitation', async () => {
      (invitationRepository.findBySlug as jest.Mock).mockResolvedValue({
        id: 'inv_draft',
        userId: 'userA',
        tier: 'DRAFT',
      });

      // Requesting as public (no userId)
      await expect(invitationService.getBySlug('draft-slug'))
        .rejects.toThrow('Undangan ini belum aktif dan tidak dapat diakses secara publik.');
        
      // Requesting as Owner should succeed
      const ownerResult = await invitationService.getBySlug('draft-slug', 'userA');
      expect(ownerResult.id).toBe('inv_draft');
    });

    it('TC-INV-E1: Should throw NotFoundError if BASIC invitation is accessed > 7 days after event', async () => {
      const pastEventDate = new Date();
      pastEventDate.setDate(pastEventDate.getDate() - 10); // 10 days ago (Basic limit is 7 days)

      (invitationRepository.findBySlug as jest.Mock).mockResolvedValue({
        id: 'inv_expired',
        userId: 'userA',
        tier: 'BASIC',
        eventDate: pastEventDate,
      });

      await expect(invitationService.getBySlug('expired-slug'))
        .rejects.toThrow('Undangan telah kedaluwarsa');
    });
    
    it('Should NOT throw NotFoundError if BASIC invitation is accessed within 7 days', async () => {
      const pastEventDate = new Date();
      pastEventDate.setDate(pastEventDate.getDate() - 3); // 3 days ago

      (invitationRepository.findBySlug as jest.Mock).mockResolvedValue({
        id: 'inv_active',
        userId: 'userA',
        tier: 'BASIC',
        eventDate: pastEventDate,
      });

      const result = await invitationService.getBySlug('active-slug');
      expect(result.id).toBe('inv_active');
    });
  });
});
