'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import type { ReactNode } from 'react';

/**
 * PublicShell
 *
 * Conditionally renders the public Navbar, Footer, and WhatsApp float button.
 * On admin routes (/admin/*) these chrome elements are suppressed so the
 * admin layout's own sidebar + header take full control of the viewport.
 */
export default function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Admin pages: render children directly — no Navbar / Footer / WhatsApp
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-clip relative">
      <Navbar />
      <main className="flex-1 w-full overflow-x-clip">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
