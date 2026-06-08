'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { triggerSessionError } from '@/components/shared/SessionErrorModal';

/**
 * useSessionGuard
 *
 * Registers two detection mechanisms for a broken/expired session:
 *
 * 1. **next-auth polling**: Watches `useSession()` status. When the status
 *    flips to "unauthenticated" while the page had a valid session before,
 *    the modal is shown immediately.
 *
 * 2. **fetch interceptor**: Wraps the global `fetch` to intercept any API
 *    response with status 401 or 403 and trigger the session-expired modal.
 *    This catches cases where next-auth hasn't re-validated yet but an API
 *    route has already detected the broken session token.
 *
 * Mount this hook once inside the root Providers component.
 */
export function useSessionGuard() {
  const { status } = useSession();
  const hadSession = useRef(false);
  const triggered = useRef(false);

  // Track whether the user ever had a valid session
  useEffect(() => {
    if (status === 'authenticated') {
      hadSession.current = true;
      triggered.current = false; // reset so next expiry is caught
    }
  }, [status]);

  // Detect session drop (authenticated → unauthenticated)
  useEffect(() => {
    if (
      status === 'unauthenticated' &&
      hadSession.current &&
      !triggered.current
    ) {
      triggered.current = true;
      triggerSessionError();
    }
  }, [status]);

  // Patch global fetch to catch 401 / 403 from API routes
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (
        (response.status === 401 || response.status === 403) &&
        hadSession.current &&
        !triggered.current
      ) {
        // Clone so the original response body is still consumable downstream
        const cloned = response.clone();
        try {
          const json = await cloned.json();
          // Only trigger for session-related errors, not general permission errors
          const isSessionError =
            json?.error === 'UNAUTHORIZED' ||
            json?.message?.toLowerCase().includes('session') ||
            json?.message?.toLowerCase().includes('unauthorized') ||
            json?.code === 'JWT_SESSION_ERROR';

          if (isSessionError) {
            triggered.current = true;
            triggerSessionError();
          }
        } catch {
          // If the response isn't JSON, trigger unconditionally on 401
          if (response.status === 401) {
            triggered.current = true;
            triggerSessionError();
          }
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);
}
