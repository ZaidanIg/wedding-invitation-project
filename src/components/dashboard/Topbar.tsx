"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Bell, User, LogOut, Settings, ChevronDown, Home } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/projects': 'Projects',
  '/dashboard/scanner': 'D-Day Scanner',
  '/dashboard/leads': 'Leads',
  '/dashboard/settings': 'Settings',
};

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const [key, value] of Object.entries(PAGE_TITLES)) {
    if (key !== '/dashboard' && pathname.startsWith(key)) return value;
  }
  return 'Dashboard';
}

export function Topbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleToggleSidebar = () => {
    window.dispatchEvent(new Event('toggle-sidebar'));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pageTitle = getPageTitle(pathname || '/dashboard');

  return (
    <header className="sticky top-0 z-30 flex h-14 lg:h-16 w-full items-center justify-between bg-white px-3 lg:px-6 border-b border-zinc-200 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile: Hamburger + Logo + Title */}
        <button
          onClick={handleToggleSidebar}
          className="text-zinc-500 hover:text-zinc-900 lg:hidden p-1"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center">
          <span className="text-base font-bold font-display text-zinc-900 tracking-tight">Sahinaja<span className="text-rose-500">.</span></span>
        </Link>

        {/* Mobile page title separator */}
        <span className="text-zinc-300 lg:hidden">/</span>
        <span className="text-sm font-medium text-zinc-600 lg:hidden truncate max-w-[140px]">{pageTitle}</span>

        {/* Desktop page title */}
        <h1 className="text-lg font-semibold text-zinc-900 hidden lg:block">{pageTitle}</h1>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-3">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className="text-zinc-500 hover:text-zinc-900 relative p-1.5 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-900">Notifikasi</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                <div className="px-4 py-8 text-center">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-zinc-200" />
                  <p className="text-sm text-zinc-400">Belum ada notifikasi</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className="flex items-center gap-2 px-1.5 lg:px-2 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden shrink-0">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-zinc-600" />
              )}
            </div>
            <span className="hidden lg:block text-sm font-medium text-zinc-700 max-w-[120px] truncate">
              {session?.user?.name || session?.user?.email || 'User'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400 hidden lg:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-100">
                <p className="text-sm font-medium text-zinc-900 truncate">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-zinc-400 truncate">{session?.user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                >
                  <Home className="h-4 w-4 text-zinc-400" />
                  Kembali ke Beranda
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                >
                  <Settings className="h-4 w-4 text-zinc-400" />
                  Settings
                </Link>
                <button
                  onClick={() => { setIsProfileOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
