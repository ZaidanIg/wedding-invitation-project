// ============================================================
// Billing Constants
// ============================================================

export const PRICING = {
  BASIC: 75_000,
  PREMIUM: 150_000,
  ULTIMATE: 250_000,
  PRO_PLAN: 500_000,
  ENTERPRISE: 2_500_000,
} as const;

export type PlanKey = keyof typeof PRICING;
