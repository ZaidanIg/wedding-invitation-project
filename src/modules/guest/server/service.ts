// ============================================================
// Guest Service — Business logic for RSVP & Check-in
// ============================================================

import { NotFoundError, ValidationError, ConflictError } from '@/lib/errors';
import { invitationRepository } from '@/modules/invitation/server/repository';
import { prisma } from '@/lib/prisma';
import { guestRepository } from './repository';
import { submitRsvpSchema, checkinSchema } from './validators';
import { guestMapper } from './mapper';
import type { ZodError } from 'zod';

function formatZodError(error: any): string {
  return error.errors.map((e: any) => e.message).join(', ');
}

export const guestService = {
  /**
   * Submit an RSVP for an invitation (identified by slug).
   */
  async submitRsvp(slugOrId: string, payload: unknown) {
    const parsed = submitRsvpSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }

    const invitation = await invitationRepository.findBySlug(slugOrId);
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    if (invitation.tier === 'BASIC') {
      const stats = await guestRepository.getStats(invitation.id);
      if (stats.estimatedGuests >= 150) {
        throw new ConflictError('Batas maksimal RSVP (150 tamu) untuk tier BASIC telah tercapai.');
      }
    }

    const guest = await guestRepository.create({
      invitationId: invitation.id,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      rsvpStatus: parsed.data.rsvpStatus,
      message: parsed.data.message || null,
      attendees: parsed.data.attendees,
    });

    return guestMapper.toResponse(guest);
  },

  /**
   * List all guests and stats for an invitation (by slug).
   */
  async listByInvitation(slugOrId: string) {
    const invitation = await invitationRepository.findBySlug(slugOrId);
    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    const [guests, stats, owner] = await Promise.all([
      guestRepository.findManyByInvitation(invitation.id),
      guestRepository.getStats(invitation.id),
      invitation.project?.agency?.ownerId
        ? prisma.user.findUnique({ where: { id: invitation.project.agency.ownerId } })
        : null,
    ]);

    return {
      guests: guests.map(guestMapper.toResponse),
      stats,
      tier: invitation.tier,
      qrEnabled: invitation.qrEnabled,
      accountType: owner?.accountType || 'B2C_FREE',
    };
  },

  /**
   * Check in a guest with ownership verification.
   */
  async checkin(invitationIdOrSlug: string, payload: unknown, userId: string) {
    const parsed = checkinSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }

    const guest = await guestRepository.findForCheckin(
      parsed.data.guestId,
      invitationIdOrSlug,
      userId,
    );

    if (!guest) {
      throw new NotFoundError('Guest not found or unauthorized');
    }

    if (guest.checkedIn) {
      throw new ConflictError(
        `Tamu sudah check-in pada ${guest.updatedAt.toLocaleTimeString()}`,
      );
    }

    const updated = await guestRepository.markCheckedIn(parsed.data.guestId);
    return guestMapper.toResponse(updated);
  },
};
