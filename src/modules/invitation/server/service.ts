// ============================================================
// Invitation Service — Business logic & orchestration
// ============================================================

import { prisma } from '@/lib/prisma';
import { NotFoundError, ForbiddenError, ValidationError } from '@/lib/errors';
import { invitationRepository } from './repository';
import { createInvitationSchema, updateInvitationSchema } from './validators';
import { invitationMapper } from './mapper';
import type { ZodError } from 'zod';

function formatZodError(error: any): string {
  const issues = error?.issues || error?.errors || [];
  console.log('Zod validation issues:', issues);
  return issues.map((e: any) => e.message).join(', ');
}

export const invitationService = {
  /**
   * Create a new invitation.
   * Determines tier and enforces photo limits based on account type.
   */
  async create(payload: unknown, userId: string) {
    // Validate input
    const parsed = createInvitationSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }
    const data = parsed.data;

    // Determine tier and photo limits from user account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accountType: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    let tier = 'DRAFT';
    let maxPhotos = 99;

    if (user.accountType === 'B2B_PRO') {
      tier = 'B2B_GENERATED';
      maxPhotos = 6;
    } else if (user.accountType === 'B2B_ALL_TIME') {
      tier = 'B2B_GENERATED';
      maxPhotos = 99;
    }

    if (data.photoUrls && data.photoUrls.length > maxPhotos) {
      throw new ForbiddenError(
        `Your current plan allows a maximum of ${maxPhotos} photo(s). Please upgrade to add more.`,
      );
    }

    const entity = await invitationRepository.create({
      ...data,
      eventDate: new Date(data.eventDate),
      photoUrls: data.photoUrls ?? [],
      headerPhotoUrl: data.headerPhotoUrl ?? null,
      groomPhotoUrl: data.groomPhotoUrl ?? null,
      bridePhotoUrl: data.bridePhotoUrl ?? null,
      groomParents: data.groomParents ?? null,
      brideParents: data.brideParents ?? null,
      musicUrl: data.musicUrl ?? null,
      quotes: data.quotes ?? null,
      schedule: data.schedule ?? [],
      loveStory: data.loveStory ?? [],
      digitalGifts: data.digitalGifts ?? [],
      userId,
      tier,
    });

    return invitationMapper.toResponse(entity);
  },

  /**
   * List paginated invitations for a user.
   */
  async list(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { invitations, total } = await invitationRepository.findMany({
      userId,
      skip,
      take: limit,
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accountType: true, freeGeneratesUsed: true },
    });

    return {
      invitations: invitations.map(invitationMapper.toListItem),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      user,
    };
  },

  /**
   * Get a single invitation by ID.
   */
  async getById(id: string) {
    const entity = await invitationRepository.findById(id);
    if (!entity) {
      throw new NotFoundError('Invitation not found');
    }
    return invitationMapper.toResponse(entity);
  },

  /**
   * Get a single invitation by slug.
   */
  async getBySlug(slug: string) {
    const entity = await invitationRepository.findBySlug(slug);
    if (!entity) {
      throw new NotFoundError('Invitation not found');
    }
    return entity;
  },

  /**
   * Update an invitation with IDOR protection.
   */
  async update(id: string, payload: unknown, userId: string) {
    const parsed = updateInvitationSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }

    const existing = await invitationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Invitation not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError('Unauthorized to edit this invitation');
    }

    // Strip sensitive fields that should not be updated via API
    const { tier, userId: _, slug, viewCount, ...safeData } = parsed.data as Record<string, unknown>;
    
    if (safeData.eventDate && typeof safeData.eventDate === 'string') {
      safeData.eventDate = new Date(safeData.eventDate as string) as any;
    }

    const updated = await invitationRepository.update(id, safeData);
    return invitationMapper.toResponse(updated);
  },

  /**
   * Delete an invitation with IDOR protection.
   */
  async delete(id: string, userId: string) {
    const existing = await invitationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Invitation not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenError('Unauthorized to delete this invitation');
    }

    await invitationRepository.delete(id);
    return { message: 'Invitation deleted' };
  },

  /**
   * Increment view count for a slug.
   */
  async incrementViewCount(slug: string) {
    return invitationRepository.incrementViewCount(slug);
  },
};
