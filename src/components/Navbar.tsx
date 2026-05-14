'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Menu, X, LogOut, User } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/themes', label: 'Themes' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/create', label: 'Create' },
    { href: '/dashboard', label: 'My Invitations' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#f7f4ed]/80 backdrop-blur-xl border-b border-[#eceae4] py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-lg bg-[#1c1c1c] shadow-inset transition-all duration-300 group-hover:scale-105">
              <Heart className="h-4 w-4 text-highlight" fill="currentColor" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-display text-xl font-bold text-[#1c1c1c] tracking-tight">
                Wedding
              </span>
              <span className="font-handwriting text-lg text-[#1c1c1c]/50">Invitation</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative group ${
                  isActive(link.href) 
                    ? 'text-highlight' 
                    : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#1c1c1c]/5'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-4 right-4 h-0.5 bg-highlight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f7f4ed] border border-[#eceae4] hover:border-[#1c1c1c]/40 transition-all duration-200"
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
                    <User className="h-4 w-4 text-[#5f5f5d]" />
                  )}
                  <span className="text-sm text-[#1c1c1c] font-medium max-w-[120px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#f7f4ed] backdrop-blur-2xl rounded-xl border border-[#eceae4] shadow-focus py-1 animate-slide-up">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#1c1c1c]/5 transition-colors"
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
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-[#1c1c1c] text-[#fcfbf8] shadow-inset hover:opacity-90 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#1c1c1c]/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-[#eceae4] space-y-1 animate-fade-in bg-[#f7f4ed]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                  isActive(link.href) 
                    ? 'text-highlight bg-highlight/5' 
                    : 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#1c1c1c]/5'
                }`}
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
                className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-600 font-medium hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="block mx-4 mt-2 text-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#1c1c1c] text-[#fcfbf8] shadow-inset"
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
