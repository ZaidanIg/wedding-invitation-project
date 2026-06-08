'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, RefreshCw, LogIn } from 'lucide-react';

// ── Global event emitter ──────────────────────────────────────────────────────
// Call `triggerSessionError()` from anywhere (e.g., fetch interceptors) to show the modal.
let sessionErrorListeners: Array<() => void> = [];

export function triggerSessionError() {
  sessionErrorListeners.forEach((fn) => fn());
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SessionErrorModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPath = pathname?.startsWith('/admin');

  const loginPath = isAdminPath ? '/admin/login' : '/auth/signin';

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    sessionErrorListeners.push(show);
    return () => {
      sessionErrorListeners = sessionErrorListeners.filter((fn) => fn !== show);
    };
  }, [show]);

  const handleRedirect = async () => {
    setIsRedirecting(true);
    try {
      await signOut({ redirect: false });
    } catch {
      // Ignore signOut errors — session is already broken
    }
    
    if (window.location.hostname.startsWith('admin.')) {
      window.location.href = '/login';
    } else {
      router.push(loginPath);
    }
    
    setIsVisible(false);
    setIsRedirecting(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="session-error-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="session-error-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="session-error-title"
            aria-describedby="session-error-desc"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#eceae4]">

              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400" />

              {/* Body */}
              <div className="p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl" />
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-200">
                      <ShieldAlert className="h-8 w-8 text-rose-500" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2
                  id="session-error-title"
                  className="text-center text-xl font-semibold text-[#1c1c1c] mb-2"
                >
                  Sesi Anda Telah Berakhir
                </h2>

                {/* Description */}
                <p
                  id="session-error-desc"
                  className="text-center text-sm text-[#1c1c1c]/60 leading-relaxed mb-2"
                >
                  Koneksi ke server terputus atau masa berlaku sesi Anda telah habis.
                  Silakan masuk kembali untuk melanjutkan.
                </p>

                {isAdminPath && (
                  <p className="text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
                    Anda akan diarahkan ke halaman login <strong>Admin</strong>.
                  </p>
                )}

                {/* Divider */}
                <div className="h-px w-full bg-[#eceae4] my-6" />

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    id="session-error-login-btn"
                    onClick={handleRedirect}
                    disabled={isRedirecting}
                    className="
                      w-full flex items-center justify-center gap-2.5
                      px-5 py-3 rounded-xl text-sm font-semibold text-white
                      bg-gradient-to-r from-rose-500 to-pink-600
                      hover:shadow-lg hover:shadow-rose-500/30
                      hover:scale-[1.01] active:scale-[0.99]
                      transition-all duration-200
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                  >
                    {isRedirecting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn className="h-4 w-4" />
                    )}
                    {isRedirecting ? 'Mengalihkan…' : 'Masuk Kembali'}
                  </button>

                  <button
                    id="session-error-refresh-btn"
                    onClick={handleRefresh}
                    className="
                      w-full flex items-center justify-center gap-2.5
                      px-5 py-3 rounded-xl text-sm font-medium text-[#1c1c1c]/70
                      bg-[#fcfbf8] border border-[#eceae4]
                      hover:bg-[#f5f3ee] hover:text-[#1c1c1c]
                      transition-all duration-200
                    "
                  >
                    <RefreshCw className="h-4 w-4" />
                    Coba Muat Ulang
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
