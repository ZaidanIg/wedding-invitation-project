'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, User, Building2 } from 'lucide-react';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/demo/luxury-emerald', label: 'Fitur Demo', matchPrefix: '/demo' },
  { href: '/pricing', label: 'Harga Paket', matchPrefix: '/pricing' },
  { href: '/panduan', label: 'Panduan', matchPrefix: '/panduan' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isDemoPage = pathname?.startsWith('/demo/');
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isClientPage = pathname?.startsWith('/client') && pathname !== '/client/login';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const close = () => setIsUserMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [isUserMenuOpen]);

  if (isDemoPage || isDashboardPage || isClientPage) return null;

  const isActive = (prefix: string) => {
    if (prefix === '/' && pathname === '/') return true;
    if (prefix !== '/') return pathname.startsWith(prefix);
    return false;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#fdfcf9]/80 backdrop-blur-xl border-b border-rose-500/10 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/" className="relative flex items-center justify-start h-16 w-56 group shrink-0">
            <Image
              src="/images/logo.png"
              alt="Sahinaja Logo"
              width={1000}
              height={1000}
              className="absolute w-[220px] h-[220px] max-w-none object-contain left-0 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-105"
              priority
              unoptimized
            />
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative group ${
                  isActive(link.matchPrefix)
                    ? 'text-rose-500'
                    : 'text-[#6b6b6b] hover:text-[#1c1c1c] hover:bg-rose-500/5'
                }`}
              >
                {link.label}
                {isActive(link.matchPrefix) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-4 right-4 h-0.5 bg-rose-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right: Auth Actions */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {!session?.user ? (
              <>
                {/* Portal Pengantin */}
                <Link
                  href="/client/login"
                  className="px-5 py-2.5 text-sm font-bold rounded-xl border border-[#1c1c1c]/10 text-[#4a4745] hover:border-rose-500/30 hover:text-rose-500 transition-all duration-300"
                >
                  Portal Pengantin
                </Link>

                {/* Login Mitra */}
                <Link
                  href="/auth/signin"
                  className={
                    pathname === '/client/login'
                      ? 'px-6 py-2.5 text-sm font-bold rounded-xl border border-[#1c1c1c]/10 text-[#4a4745] hover:border-rose-500/30 hover:text-rose-500 transition-all duration-300'
                      : 'inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl bg-rose-gradient text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105'
                  }
                >
                  Login Mitra
                </Link>
              </>
            ) : session.user.role === 'CLIENT' ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/client"
                  className="px-5 py-2.5 text-sm font-bold rounded-xl bg-rose-gradient text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105"
                >
                  Dasbor Pengantin
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2.5 rounded-xl border border-rose-500/10 text-rose-500 hover:bg-rose-50 transition-all duration-300 cursor-pointer flex items-center justify-center"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 text-sm font-bold rounded-xl bg-rose-gradient text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105"
                >
                  Dasbor Agensi
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2.5 rounded-xl border border-rose-500/10 text-rose-500 hover:bg-rose-50 transition-all duration-300 cursor-pointer flex items-center justify-center"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-[#6b6b6b] hover:text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-rose-500/5 space-y-1 animate-fade-in bg-[#fdfcf9]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block mx-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive(link.matchPrefix)
                    ? 'text-rose-500 bg-rose-500/10 shadow-sm shadow-rose-500/5'
                    : 'text-[#6b6b6b] hover:text-[#1c1c1c] hover:bg-rose-500/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-rose-500/5 mx-6 my-2" />

            {!session?.user ? (
              <div className="mx-4 mt-3 space-y-2">
                <Link
                  href="/client/login"
                  className="block text-center px-6 py-3 text-sm font-bold rounded-xl border border-[#1c1c1c]/10 text-[#4a4745] hover:border-rose-500/30 hover:text-rose-500 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Portal Pengantin
                </Link>
                <Link
                  href="/auth/signin"
                  className="block text-center px-6 py-3 text-sm font-bold rounded-xl bg-rose-gradient text-white shadow-lg shadow-rose-500/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login Mitra
                </Link>
              </div>
            ) : session.user.role === 'CLIENT' ? (
              <div className="mx-4 mt-3 space-y-2">
                <Link
                  href="/client"
                  className="block text-center px-6 py-3 text-sm font-bold rounded-xl bg-rose-gradient text-white shadow-lg shadow-rose-500/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dasbor Pengantin
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-[calc(100%-2rem)] mx-4 flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl border border-rose-500/10 text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="mx-4 mt-3 space-y-2">
                <Link
                  href="/dashboard"
                  className="block text-center px-6 py-3 text-sm font-bold rounded-xl bg-rose-gradient text-white shadow-lg shadow-rose-500/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dasbor Agensi
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-[calc(100%-2rem)] mx-4 flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl border border-rose-500/10 text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
