'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex p-4 rounded-full bg-red-500/10 mb-4">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-sm text-foreground/40 mb-6">An unexpected error occurred. Please try again.</p>
        <Button onClick={reset} size="lg">Try Again</Button>
      </div>
    </div>
  );
}
