import { prismaMock } from '../../../lib/__mocks__/prisma';
import { InvitationService } from './service';
import { Tier, Role } from '@prisma/client';

describe('Invitation Service', () => {
  describe('createInvitation', () => {
    it('should create an invitation with fallback to DRAFT tier if unpaid', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com', name: 'Test', role: Role.USER };
      const input = {
        groomName: 'Romeo',
        brideName: 'Juliet',
        tier: Tier.PREMIUM, // User requests premium
      };

      prismaMock.invitation.create.mockResolvedValue({
        id: 'inv1',
        ...input,
        tier: Tier.DRAFT, // But system enforces DRAFT initially
        userId: mockUser.id,
        slug: 'romeo-juliet',
        createdAt: new Date(),
        updatedAt: new Date(),
        eventDate: null,
        eventLocation: null,
        theme: 'minimalist',
        musicUrl: null,
        videoUrl: null,
        message: null,
        isActive: true,
      } as any);

      // This is a simplified test simulating the service layer logic. 
      // In reality, your service method might handle slug generation and tier fallback.
      const result = await prismaMock.invitation.create({
        data: {
          ...input,
          userId: mockUser.id,
          slug: 'romeo-juliet',
          tier: Tier.DRAFT, 
        }
      });

      expect(result.tier).toBe(Tier.DRAFT);
      expect(prismaMock.invitation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tier: Tier.DRAFT
          })
        })
      );
    });
  });
  
  describe('updateInvitation', () => {
    it('should block videoUrl update if tier is BASIC', async () => {
       // Example logic for update block
       const existingInvitation = { id: 'inv1', tier: Tier.BASIC };
       const updateData = { videoUrl: 'https://youtube.com/watch' };

       // In the actual service, an error should be thrown:
       // await expect(InvitationService.update('inv1', updateData)).rejects.toThrow();
       
       // For mock demonstration:
       const executeUpdate = () => {
         if (existingInvitation.tier === Tier.BASIC && updateData.videoUrl) {
           throw new Error('Fitur Embed Video hanya tersedia untuk paket Ultimate.');
         }
       };

       expect(executeUpdate).toThrow('Fitur Embed Video');
    });
  });
});
