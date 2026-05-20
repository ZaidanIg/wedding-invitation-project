"use client";

import React from 'react';
import { Menu, Heart } from 'lucide-react';

interface ClientTopbarProps {
  userName?: string | null;
  onToggleSidebar: () => void;
}

export function ClientTopbar({ userName, onToggleSidebar }: ClientTopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-[#f0ebe1]">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-[#5c5957] hover:bg-[#faf8f5] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50/80 border border-rose-100">
            <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
            <span className="text-xs font-medium text-rose-600">Client</span>
          </div>
          {userName && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-[#2c2a29] hidden sm:block">
                {userName}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
