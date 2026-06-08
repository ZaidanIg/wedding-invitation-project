'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, Bell, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Map routes → human-readable breadcrumbs
const PAGE_LABELS: Record<string, string> = {
  '/admin': 'Executive Summary',
  '/admin/business-profile': 'Business Profile',
  '/admin/sales': 'Sales Dashboard',
  '/admin/transactions': 'Transactions',
  '/admin/profit-loss': 'Profit & Loss',
  '/admin/expenses': 'Monthly Expenses',
  '/admin/customers': 'Customer Database',
  '/admin/leads': 'Lead Tracking',
  '/admin/marketing': 'Marketing Dashboard',
  '/admin/promos': 'Voucher & Promo',
  '/admin/themes': 'Theme Performance',
  '/admin/subscriptions': 'Subscriptions',
  '/admin/roadmap': 'Product Roadmap',
};

function getInitials(name?: string | null) {
  if (!name) return 'A';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const pageTitle = PAGE_LABELS[pathname ?? ''] ?? 'Dashboard';
  const userName = session?.user?.name ?? 'Admin';
  const userEmail = session?.user?.email ?? '';
  const initials = getInitials(session?.user?.name);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    if (window.location.hostname.startsWith('admin.')) {
      window.location.href = '/login';
    } else {
      router.push('/admin/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-[#eceae4] flex items-center justify-between px-6 gap-4 shrink-0">
      {/* Left — breadcrumb + page title */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-medium text-[#1c1c1c]/40 hidden sm:block">Sahinaja ERP</span>
        <ChevronRight className="h-3.5 w-3.5 text-[#1c1c1c]/30 hidden sm:block shrink-0" />
        <h1 className="text-sm font-semibold text-[#1c1c1c] truncate">{pageTitle}</h1>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Back to website */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#6b6b6b] hover:text-[#1c1c1c] hover:bg-stone-100 transition-all duration-200"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Lihat Website
        </Link>

        {/* Notification bell (placeholder) */}
        <button
          id="admin-header-notification-btn"
          className="relative p-2 rounded-lg text-[#6b6b6b] hover:bg-stone-100 hover:text-[#1c1c1c] transition-all duration-200"
          aria-label="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-[#eceae4]" />

        {/* User identity */}
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            {initials}
          </div>
          {/* Name + email */}
          <div className="hidden lg:block leading-none">
            <p className="text-xs font-semibold text-[#1c1c1c]">{userName}</p>
            <p className="text-[10px] text-[#1c1c1c]/40 mt-0.5 truncate max-w-[160px]">{userEmail}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-[#eceae4]" />

        {/* Sign out */}
        <button
          id="admin-header-signout-btn"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 group"
          aria-label="Sign out"
        >
          <LogOut className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
