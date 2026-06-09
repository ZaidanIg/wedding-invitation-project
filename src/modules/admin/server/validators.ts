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
  status: z.enum(['PENDING', 'WAITING_PAYMENT', 'PAID', 'FAILED', 'EXPIRED', 'REFUNDED']).optional(),
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

export const createExpenseSchema = z.object({
  category: z.enum(['INFRASTRUCTURE', 'MARKETING', 'PAYROLL', 'SOFTWARE', 'OPERATIONAL', 'OTHER']),
  amount: z.number().int().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().optional(),
});

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  source: z.enum(['INSTAGRAM', 'TIKTOK', 'GOOGLE', 'REFERRAL', 'WHATSAPP', 'ORGANIC']),
  status: z.enum(['NEW', 'CONTACTED', 'DEMO', 'NEGOTIATION', 'WON', 'LOST']).optional().default('NEW'),
  date: z.string().optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'DEMO', 'NEGOTIATION', 'WON', 'LOST']),
});

export const createMarketingSpendSchema = z.object({
  channel: z.enum(['INSTAGRAM', 'TIKTOK', 'GOOGLE', 'REFERRAL', 'WHATSAPP', 'ORGANIC']),
  amount: z.number().int().positive('Amount must be positive'),
  date: z.string().optional(),
});

