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
  const isDemoPage = pathname?.startsWith('/demo/');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDemoPage) return null;

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#fdfcf9]/80 backdrop-blur-xl border-b border-rose-500/10 py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="relative flex items-center justify-start h-16 w-56 group">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative group ${
                  isActive(link.href) 
                    ? 'text-rose-500' 
                    : 'text-[#6b6b6b] hover:text-[#1c1c1c] hover:bg-rose-500/5'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
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

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-rose-500/10 hover:border-rose-500/40 transition-all duration-200 shadow-sm"
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
                    <User className="h-4 w-4 text-rose-500/60" />
                  )}
                  <span className="text-sm text-[#1c1c1c] font-medium max-w-[120px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-52 glass rounded-2xl shadow-2xl shadow-rose-500/10 py-2 animate-slide-up">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6b6b6b] hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4" />
                      My Invitations
                    </Link>
                    <div className="h-px bg-rose-500/5 mx-4 my-1" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-all"
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
                className="inline-flex items-center gap-2 px-8 py-2.5 text-sm font-bold rounded-xl bg-rose-gradient text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl text-[#6b6b6b] hover:text-rose-500 hover:bg-rose-500/5 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-rose-500/5 space-y-1 animate-fade-in bg-[#fdfcf9]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block mx-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive(link.href) 
                    ? 'text-rose-500 bg-rose-500/10 shadow-sm shadow-rose-500/5' 
                    : 'text-[#6b6b6b] hover:text-[#1c1c1c] hover:bg-rose-500/5'
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
                className="block w-[calc(100%-1.5rem)] mx-3 px-5 py-3.5 rounded-2xl text-sm text-rose-500 font-bold hover:bg-rose-50 transition-all text-left"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="block mx-4 mt-4 text-center px-6 py-3 text-sm font-bold rounded-xl bg-rose-gradient text-white shadow-lg shadow-rose-500/20"
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
