// ============================================================
// Invitation Service — Business logic & orchestration
// ============================================================

import { prisma } from '@/lib/prisma';
import { NotFoundError, ForbiddenError, ValidationError } from '@/lib/errors';
import { invitationRepository } from './repository';
import { createInvitationSchema, updateInvitationSchema } from './validators';
import { invitationMapper } from './mapper';

function formatZodError(error: any): string {
  const issues = error?.issues || error?.errors || [];
  return issues.map((e: any) => e.message).join(', ');
}

/**
 * Validates layout and asset limits based on targeted/active plan tier.
 */
const validateTierConstraints = (tier: 'DRAFT' | 'BASIC' | 'PREMIUM' | 'ULTIMATE', data: any) => {
  if (tier === 'DRAFT') return; // No constraints on draft — payment will set the real tier
  if (tier === 'BASIC') {
    const classicLayouts = ['elegant-cream', 'royal-blue', 'rose-garden', 'islamic-minimalist', 'islamic-midnight', 'islamic-arabesque'];
    if (data.layout && !classicLayouts.includes(data.layout)) {
      throw new ForbiddenError("Paket Basic hanya mendukung tema Klasik/Minimalis.");
    }
    if (data.photoUrls && data.photoUrls.length > 0) {
      throw new ForbiddenError("Paket Basic tidak mendukung galeri foto (hanya foto utama).");
    }
  } else if (tier === 'PREMIUM') {
    if (data.photoUrls && data.photoUrls.length > 3) {
      throw new ForbiddenError("Paket Premium hanya mendukung maksimal 3 foto di galeri.");
    }
    if (data.videoUrl) {
      throw new ForbiddenError("Paket Premium tidak mendukung fitur video. Silakan upgrade ke Paket Ultimate.");
    }
  } else if (tier === 'ULTIMATE') {
    if (data.photoUrls && data.photoUrls.length > 7) {
      throw new ForbiddenError("Paket Ultimate hanya mendukung maksimal 7 foto di galeri.");
    }
    if (data.videoUrl) {
      const isEmbed = /youtube\.com|youtu\.be|tiktok\.com|instagram\.com/.test(data.videoUrl);
      if (!isEmbed) {
        throw new ValidationError("Link video harus berupa embed URL text dari YouTube, TikTok, atau Instagram Reels.");
      }
    }
  }
};

/**
 * Forcefully strip features not allowed for a given tier.
 */
const sanitizeTierFeatures = (tier: 'DRAFT' | 'BASIC' | 'PREMIUM' | 'ULTIMATE', data: any) => {
  if (tier === 'DRAFT') return; // Nothing to strip on a draft
  if (tier === 'BASIC') {
    // BASIC: no music, no video. Digital gift IS included.
    data.musicUrl = null;
    data.videoUrl = null;
  }
  // PREMIUM & ULTIMATE: video is blocked at validation level, everything else allowed
};

export const invitationService = {
  /**
   * Create a new invitation.
   * Restricts features and sets tier status.
   */
  async create(payload: unknown, userId: string) {
    const parsed = createInvitationSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error));
    }
    const data = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const tier = data.tier || 'DRAFT';
    
    // Validate limits
    validateTierConstraints(tier, data);

    // Sanitize feature properties
    sanitizeTierFeatures(tier, data);

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
      videoUrl: data.videoUrl ?? null,
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
      select: { role: true },
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
   * Get a single invitation by slug, with dynamic expiry check and DRAFT protection.
   */
  async getBySlug(slug: string, requestingUserId?: string, requestingUserRole?: string) {
    const entity = await invitationRepository.findBySlug(slug);
    if (!entity) {
      throw new NotFoundError('Invitation not found');
    }

    // DRAFT tier: locked from public access — only owner or ADMIN can view
    // if (entity.tier === 'DRAFT') {
    //   const isOwner = requestingUserId && entity.userId === requestingUserId;
    //   const isAdmin = requestingUserRole === 'ADMIN';
    //   if (!isOwner && !isAdmin) {
    //     throw new ForbiddenError('Undangan ini belum aktif dan tidak dapat diakses secara publik.');
    //   }
    //   return entity; // Owner/ADMIN can preview draft without expiry check
    // }

    // Evaluate dynamic expiration status relative to server date
    const currentDate = new Date();
    const eventDate = new Date(entity.eventDate);
    let thresholdDays = 0;
    
    if (entity.tier === 'BASIC') {
      thresholdDays = 7;  // aktif 7 hari
    } else if (entity.tier === 'PREMIUM') {
      thresholdDays = 14; // aktif 2 minggu
    } else if (entity.tier === 'ULTIMATE') {
      thresholdDays = 30; // aktif 1 bulan
    }

    const expiryTime = eventDate.getTime() + thresholdDays * 24 * 60 * 60 * 1000;
    if (currentDate.getTime() > expiryTime) {
      throw new NotFoundError('Undangan telah kedaluwarsa');
    }

    return entity;
  },

  /**
   * Update an invitation with IDOR protection and tier limits.
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

    const tier = existing.tier as 'BASIC' | 'PREMIUM' | 'ULTIMATE';

    // Strip sensitive fields that should not be updated via user API
    const { tier: _, isPaid, aiRegenCount, userId: __, slug, viewCount, ...safeData } = parsed.data as Record<string, any>;
    
    // Enforce constraints
    validateTierConstraints(tier, safeData);
    sanitizeTierFeatures(tier, safeData);

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

  /**
   * Handle safe view recording with bot filtering, cookie state, and owner bypass check.
   */
  async recordView(
    slug: string,
    userAgent: string,
    requestingUserId?: string,
    requestingUserRole?: string,
    hasViewedCookie?: boolean
  ) {
    const entity = await invitationRepository.findBySlug(slug);
    if (!entity) {
      throw new NotFoundError('Invitation not found');
    }

    const isBot = /bot|crawler|spider|crawling|whatsapp|telegram|facebook|twitter|slack/i.test(userAgent);
    const isOwner = requestingUserId && entity.userId === requestingUserId;
    const isAdmin = requestingUserRole === 'ADMIN';

    if (!isBot && !isOwner && !isAdmin && !hasViewedCookie) {
      await invitationRepository.incrementViewCount(slug);
      return { incremented: true };
    }

    return { incremented: false };
  },
};
