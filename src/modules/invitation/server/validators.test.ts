import { createInvitationSchema } from './validators';
import { Tier } from '@prisma/client';

describe('Invitation Validators', () => {
  describe('createInvitationSchema', () => {
    it('should reject basic tier with more than 3 photos', () => {
      const data = {
        groomName: 'Romeo',
        brideName: 'Juliet',
        eventDate: '2026-10-10',
        eventTime: '10:00',
        venueName: 'Hotel',
        venueAddress: 'Jalan',
        greeting: 'Hello',
        mainBody: 'Body',
        eventInfo: 'Info',
        closing: 'Close',
        fullText: 'Text',
        tier: Tier.BASIC,
        photoUrls: ['url1', 'url2', 'url3', 'url4'], // 4 photos
      };

      const result = createInvitationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Maksimal 3 foto');
      }
    });

    it('should allow premium tier with up to 10 photos', () => {
      const data = {
        groomName: 'Romeo',
        brideName: 'Juliet',
        eventDate: '2026-10-10',
        eventTime: '10:00',
        venueName: 'Hotel',
        venueAddress: 'Jalan',
        greeting: 'Hello',
        mainBody: 'Body',
        eventInfo: 'Info',
        closing: 'Close',
        fullText: 'Text',
        tier: Tier.PREMIUM,
        photoUrls: Array(10).fill('url'),
      };

      const result = createInvitationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should allow ultimate tier with unlimited photos', () => {
      const data = {
        groomName: 'Romeo',
        brideName: 'Juliet',
        eventDate: '2026-10-10',
        eventTime: '10:00',
        venueName: 'Hotel',
        venueAddress: 'Jalan',
        greeting: 'Hello',
        mainBody: 'Body',
        eventInfo: 'Info',
        closing: 'Close',
        fullText: 'Text',
        tier: Tier.ULTIMATE,
        photoUrls: Array(35).fill('url'),
      };

      const result = createInvitationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
