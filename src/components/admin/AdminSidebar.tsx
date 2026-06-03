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
  Map
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/admin', label: 'Executive Summary', icon: LayoutDashboard },
  { href: '/admin/business-profile', label: 'Business Profile', icon: Building2 },
  { href: '/admin/sales', label: 'Sales Dashboard', icon: TrendingUp },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/admin/profit-loss', label: 'Profit & Loss', icon: Calculator },
  { href: '/admin/expenses', label: 'Monthly Expenses', icon: Receipt },
  { href: '/admin/customers', label: 'Customer Database', icon: Users },
  { href: '/admin/leads', label: 'Lead Tracking', icon: Magnet },
  { href: '/admin/marketing', label: 'Marketing Dashboard', icon: Megaphone },
  { href: '/admin/themes', label: 'Theme Performance', icon: Palette },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: Repeat },
  { href: '/admin/roadmap', label: 'Product Roadmap', icon: Map },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[#eceae4] h-screen fixed top-0 left-0 overflow-y-auto flex flex-col z-50">
      <div className="p-6 sticky top-0 bg-white z-10 border-b border-[#eceae4]/50">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center text-white font-bold font-display">
            S
          </div>
          <span className="font-display font-bold text-lg text-[#1c1c1c] tracking-tight">Sahinaja ERP</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? 'bg-rose-50 text-rose-600 font-bold'
                  : 'text-[#6b6b6b] hover:bg-stone-50 hover:text-[#1c1c1c]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500' : 'text-[#a1a1aa]'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#eceae4]">
        <Link href="/" className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#6b6b6b] hover:text-[#1c1c1c] bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
          Kembali ke Web
        </Link>
      </div>
    </aside>
  );
}
