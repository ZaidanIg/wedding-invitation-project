import { cache } from 'react';
import { prisma } from '@/lib/prisma';

/**
 * Centralized cached helper to retrieve the client account by userId (session.user.id).
 * Uses React's `cache` function to guarantee duplicate raw query calls within the same
 * Next.js request lifecycle are deduped into a single atomic database hit.
 */
export const getCachedClientAccount = cache(async (userId: string) => {
  return prisma.clientAccount.findUnique({
    where: { id: userId },
  });
});
