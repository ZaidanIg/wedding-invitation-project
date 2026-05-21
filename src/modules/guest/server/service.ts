// ============================================================
// Guest Service — Business logic for RSVP & Check-in
// ============================================================

import { NotFoundError, ValidationError, ConflictError } from '@/lib/errors';
import { invitationRepository } from '@/modules/invitation/server/repository';
import { prisma } from '@/lib/prisma';
import { guestRepository } from './repository';
import { submitRsvpSchema, checkinSchema, submitAttendanceSchema } from './validators';
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

    // Enforce tier-based guest count limits
    const GUEST_LIMITS: Record<string, number> = {
      DRAFT:    0,   // draft can't accept RSVPs
      BASIC:    150,
      PREMIUM:  300,
      ULTIMATE: Infinity,
    };

    const tierLimit = GUEST_LIMITS[invitation.tier as string] ?? 0;

    if (tierLimit === 0) {
      throw new ValidationError('Undangan ini belum aktif dan tidak dapat menerima RSVP.');
    }

    if (tierLimit !== Infinity) {
      const currentCount = await prisma.guest.count({
        where: { invitationId: invitation.id },
      });
      if (currentCount >= tierLimit) {
        throw new ValidationError(
          `Batas maksimal tamu (${tierLimit} orang) untuk paket ini telah tercapai.`
        );
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
      isVip: parsed.data.isVip,
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
      prisma.user.findUnique({ where: { id: invitation.userId } }),
    ]);

    return {
      guests: guests.map(guestMapper.toResponse),
      stats,
      tier: invitation.tier,
      qrEnabled: invitation.qrEnabled,
      role: owner?.role || 'USER',
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

  /**
   * Submit guest attendance (public buku tamu).
   */
  async submitAttendance(slugOrId: string, payload: unknown) {
    const parsed = submitAttendanceSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }

    const invitation = await invitationRepository.findBySlug(slugOrId);
    if (!invitation) {
      throw new NotFoundError('Undangan tidak ditemukan');
    }

    const { name, phone, attendees, message } = parsed.data;

    // Search if there is an existing guest with the same name or phone under this invitation
    const existingGuest = await prisma.guest.findFirst({
      where: {
        invitationId: invitation.id,
        OR: [
          { name: { equals: name.trim(), mode: 'insensitive' } },
          { phone: phone.trim() }
        ]
      }
    });

    if (existingGuest) {
      if (existingGuest.checkedIn) {
        throw new ConflictError(
          `Tamu sudah check-in pada ${existingGuest.updatedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
        );
      }

      // Mark them as checked in
      const updated = await prisma.guest.update({
        where: { id: existingGuest.id },
        data: {
          checkedIn: true,
          rsvpStatus: 'ATTENDING',
          attendees: attendees ?? existingGuest.attendees,
          message: message?.trim() || existingGuest.message,
        }
      });

      return guestMapper.toResponse(updated);
    }

    // Auto-register as regular guest (Biasa)
    const newGuest = await prisma.guest.create({
      data: {
        invitationId: invitation.id,
        name: name.trim(),
        phone: phone.trim(),
        rsvpStatus: 'ATTENDING',
        checkedIn: true,
        isVip: false, // Regular
        attendees: attendees ?? 1,
        message: message?.trim() || null,
      }
    });

    return guestMapper.toResponse(newGuest);
  },
};
