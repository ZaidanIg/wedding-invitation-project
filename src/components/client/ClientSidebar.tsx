"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Heart,
  Users,
  X,
  Home,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const links = [
  { name: 'Overview', href: '/client', icon: LayoutDashboard },
  { name: 'Detail Undangan', href: '/client/details', icon: Heart },
  { name: 'Daftar Tamu', href: '/client/guests', icon: Users },
];

interface ClientSidebarProps {
  invitationSlug?: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ClientSidebar({ invitationSlug, isOpen, setIsOpen }: ClientSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-y-auto bg-white border-r border-[#f0ebe1] shadow-sm">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[#f0ebe1] justify-between lg:justify-center">
        <Link href="/" className="flex items-center hover:opacity-85 transition-opacity">
          <span className="text-xl font-bold font-display text-[#2c2a29] tracking-tight">
            Sahinaja<span className="text-rose-400">.</span>
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden text-[#5c5957] hover:text-[#2c2a29] p-1"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Badge */}
      <div className="px-5 py-4 border-b border-[#f0ebe1]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50/70 border border-rose-100">
          <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
          <span className="text-xs font-semibold text-rose-600 tracking-wide">CLIENT PORTAL</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/client' && pathname?.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-rose-50 text-rose-700 shadow-sm'
                  : 'text-[#5c5957] hover:bg-[#faf8f5] hover:text-[#2c2a29]'
              }`}
            >
              <Icon
                className={`mr-3 h-[18px] w-[18px] flex-shrink-0 ${
                  isActive ? 'text-rose-500' : 'text-[#8c8885]'
                }`}
              />
              {link.name}
            </Link>
          );
        })}

        {invitationSlug && (
          <a
            href={`/invitation/${invitationSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-[#5c5957] hover:bg-[#faf8f5] hover:text-[#2c2a29] transition-all duration-200"
          >
            <ExternalLink className="mr-3 h-[18px] w-[18px] flex-shrink-0 text-[#8c8885]" />
            Lihat Undangan
          </a>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-[#f0ebe1] p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-[#5c5957] hover:bg-[#faf8f5] hover:text-[#2c2a29] transition-colors"
        >
          <Home className="mr-3 h-[18px] w-[18px] flex-shrink-0 text-[#8c8885]" />
          Kembali ke Beranda
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/client/login' })}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="mr-3 h-[18px] w-[18px] flex-shrink-0" />
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
              className="fixed inset-0 bg-[#2c2a29]/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 flex"
            >
              <div className="w-full">{sidebarContent}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Using standard hidden lg:flex with left-0 pin for stable positioning */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col z-40">
        {sidebarContent}
      </div>
    </>
  );
}
