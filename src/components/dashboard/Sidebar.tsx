"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderKanban, ScanLine, Users, Settings, X, Home, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const links = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'D-Day Scanner', href: '/dashboard/scanner', icon: ScanLine },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  // Close sidebar on navigation in mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-y-auto bg-white border-r border-zinc-200 shadow-sm">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-200 justify-between lg:justify-center">
        <Link href="/" className="flex items-center hover:opacity-85 transition-opacity">
          <span className="text-xl font-bold font-display text-zinc-900 tracking-tight">Sahinaja<span className="text-rose-500">.</span></span>
        </Link>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-500 hover:text-zinc-900 p-1">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-rose-50 text-rose-700'
                  : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-rose-600' : 'text-zinc-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions — mobile only */}
      <div className="lg:hidden border-t border-zinc-200 p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
        >
          <Home className="mr-3 h-5 w-5 flex-shrink-0 text-zinc-400" />
          Kembali ke Beranda
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="relative z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 flex"
            >
              <div className="w-full">
                {sidebarContent}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-40">
        {sidebarContent}
      </div>
    </>
  );
}
