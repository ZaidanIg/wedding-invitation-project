// Server component wrapper for /admin/login
// - Forces noindex so search engines never crawl this page
// - Redirects to /admin if already authenticated as ADMIN
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLoginPage from './AdminLoginPage';

// ── SEO: Block all indexing ───────────────────────────────────
export const metadata: Metadata = {
  title: 'Admin — Sahinaja',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function AdminLoginServerPage() {
  // If already logged in as ADMIN, skip login and go straight to dashboard
  const session = await auth();
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin');
  }

  return <AdminLoginPage />;
}
