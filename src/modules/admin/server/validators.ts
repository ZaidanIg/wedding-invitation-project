// ============================================================
// Admin Module — Validators (Zod Schemas)
// ============================================================

import { z } from 'zod';

export const updateInvitationTierSchema = z.object({
  tier: z.enum(['DRAFT', 'BASIC', 'PREMIUM', 'ULTIMATE']),
  resetAiCount: z.boolean().optional().default(false),
});

export const updateUserRoleSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  role: z.enum(['USER', 'ADMIN']),
});

export const transactionFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['PENDING', 'SETTLEMENT', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED']).optional(),
  type: z.enum(['INVITATION_UPGRADE', 'ACCOUNT_UPGRADE']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const chartQuerySchema = z.object({
  days: z.coerce.number().int().positive().default(30),
});

export type UpdateInvitationTierInput = z.infer<typeof updateInvitationTierSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
export type ChartQueryInput = z.infer<typeof chartQuerySchema>;
