'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Heart, Menu, X, LogOut, User } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/create', label: 'Create' },
    { href: '/dashboard', label: 'My Invitations' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 group-hover:shadow-lg group-hover:shadow-rose-500/25 transition-shadow duration-300">
              <Heart className="h-4 w-4 text-white" fill="white" />
            </div>
            <span className="font-display text-lg font-semibold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              WeddingAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-foreground/60" />
                  )}
                  <span className="text-sm text-foreground/80 max-w-[120px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background/95 backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl py-1 animate-slide-up">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4" />
                      My Invitations
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105"
              >
                <Heart className="h-3.5 w-3.5" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-white/5 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session?.user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="block mx-4 mt-2 text-center px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
