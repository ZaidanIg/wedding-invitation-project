// ============================================================
// Rate Limiter — In-memory sliding window rate limiting
// ============================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;      // 5 requests per window

/**
 * Check if a request from the given identifier is allowed.
 * Returns { allowed: true } if within limits, or { allowed: false, retryAfter } if exceeded.
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  retryAfter?: number;
  remaining: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // No existing entry or window expired — allow and start new window
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  // Within window but under limit
  if (entry.count < MAX_REQUESTS) {
    entry.count += 1;
    return { allowed: true, remaining: MAX_REQUESTS - entry.count };
  }

  // Rate limit exceeded
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
  return { allowed: false, retryAfter, remaining: 0 };
}

/**
 * Extract client IP from request headers.
 * Handles X-Forwarded-For (from load balancers / Vercel) and falls back to 'unknown'.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

const dailyAiMap = new Map<string, { count: number; date: string }>();

/**
 * Check if user exceeded daily limit for unsaved AI generation (in-memory fallback).
 */
export function checkUserDailyAiLimit(userId: string, limit: number): boolean {
  const today = new Date().toISOString().split('T')[0];
  const entry = dailyAiMap.get(userId);

  if (!entry || entry.date !== today) {
    dailyAiMap.set(userId, { count: 1, date: today });
    return true;
  }

  if (entry.count < limit) {
    entry.count += 1;
    return true;
  }

  return false;
}
