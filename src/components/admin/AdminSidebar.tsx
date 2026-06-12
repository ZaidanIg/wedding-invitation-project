'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  CreditCard,
  Calculator,
  Receipt,
  Users,
  Magnet,
  Megaphone,
  Palette,
  Repeat,
  Map,
  Ticket,
  Sparkles,
} from 'lucide-react';

const MENU_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Executive Summary', icon: LayoutDashboard },
      { href: '/admin/business-profile', label: 'Business Profile', icon: Building2 },
    ],
  },
  {
    label: 'Keuangan',
    items: [
      { href: '/admin/sales', label: 'Sales Dashboard', icon: TrendingUp },
      { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
      { href: '/admin/profit-loss', label: 'Profit & Loss', icon: Calculator },
      { href: '/admin/expenses', label: 'Monthly Expenses', icon: Receipt },
    ],
  },
  {
    label: 'Pelanggan',
    items: [
      { href: '/admin/customers', label: 'Customer Database', icon: Users },
      { href: '/admin/leads', label: 'Lead Tracking', icon: Magnet },
      { href: '/admin/subscriptions', label: 'Subscriptions', icon: Repeat },
    ],
  },
  {
    label: 'Marketing & Produk',
    items: [
      { href: '/admin/marketing', label: 'Marketing Dashboard', icon: Megaphone },
      { href: '/admin/promos', label: 'Voucher & Promo', icon: Ticket },
      { href: '/admin/themes', label: 'Theme Performance', icon: Palette },
      { href: '/admin/themes/builder', label: 'Theme Builder', icon: Sparkles },
      { href: '/admin/roadmap', label: 'Product Roadmap', icon: Map },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[#eceae4] h-screen fixed top-0 left-0 flex flex-col z-50 overflow-hidden">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center border-b border-[#eceae4] shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-rose-200 transition-transform duration-200 group-hover:scale-110">
            S
          </div>
          <div className="leading-none">
            <span className="font-bold text-sm text-[#1c1c1c] tracking-tight block">Sahinaja</span>
            <span className="text-[10px] text-[#1c1c1c]/40 font-medium tracking-widest uppercase">ERP Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin scrollbar-thumb-[#eceae4]">
        {MENU_GROUPS.map((group) => (
          <div key={group.label}>
            {/* Group label */}
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-[#1c1c1c]/35 uppercase tracking-widest">
              {group.label}
            </p>
            {/* Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                // Exact match for dashboard, prefix match for sub-pages
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-150 font-medium text-sm
                      ${
                        isActive
                          ? 'bg-rose-50 text-rose-600'
                          : 'text-[#6b6b6b] hover:bg-stone-50 hover:text-[#1c1c1c]'
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-rose-500 rounded-full" />
                    )}
                    <Icon
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-500' : 'text-[#a1a1aa]'}`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#eceae4] shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#fafaf9]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-[#1c1c1c]/40 font-medium">System online</span>
        </div>
      </div>
    </aside>
  );
}
