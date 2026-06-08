'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import SessionErrorModal from '@/components/shared/SessionErrorModal';
import { useSessionGuard } from '@/hooks/useSessionGuard';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Inner wrapper that can safely use hooks that depend on SessionProvider context.
 */
function SessionGuardInner({ children }: { children: ReactNode }) {
  useSessionGuard();
  return (
    <>
      {children}
      <SessionErrorModal />
    </>
  );
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SessionGuardInner>{children}</SessionGuardInner>
    </SessionProvider>
  );
}
