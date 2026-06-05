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
  
  const isDemoRoute = pathname?.startsWith('/demo/');
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isComingSoonRoute = pathname === '/coming-soon';

  if (isDemoRoute || isComingSoonRoute) return null;

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
        <div className="flex items-center justify-between min-h-16">
          {/* Logo */}
          <Link href={isAdminRoute ? '/admin' : '/'} className="flex items-center group">
            <div className="relative overflow-hidden w-52 h-16 flex-shrink-0">
              <Image 
                src="/images/logo.png" 
                alt="Sahinaja Logo" 
                fill
                className="object-contain scale-[3.5] transition-transform duration-300 group-hover:scale-[3.65]"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on Admin routes */}
          {!isAdminRoute && (
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
          )}

          {/* Desktop Auth - Always visible */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <div className="relative">
                <button
                  popoverTarget="user-menu-popover"
                  style={{ anchorName: '--user-menu-anchor' } as React.CSSProperties}
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

                <div 
                  id="user-menu-popover" 
                  popover="auto"
                  className="w-52 glass rounded-2xl shadow-2xl shadow-rose-500/10 py-2 animate-slide-up"
                  style={{
                    positionAnchor: '--user-menu-anchor',
                    bottom: 'auto',
                    left: 'auto',
                    top: 'anchor(bottom)',
                    right: 'anchor(right)',
                    margin: 0,
                    marginTop: '12px'
                  } as React.CSSProperties}
                >
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6b6b6b] hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                    onClick={() => {
                      const popover = document.getElementById('user-menu-popover');
                      if (popover && (popover as any).hidePopover) (popover as any).hidePopover();
                    }}
                  >
                    <Heart className="h-4 w-4" />
                    My Invitations
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6b6b6b] hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                      onClick={() => {
                        const popover = document.getElementById('user-menu-popover');
                        if (popover && (popover as any).hidePopover) (popover as any).hidePopover();
                      }}
                    >
                      <User className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="h-px bg-rose-500/5 mx-4 my-1" />
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
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
            popoverTarget="mobile-menu-popover"
            style={{ anchorName: '--mobile-menu-anchor' } as React.CSSProperties}
            className="md:hidden p-2 rounded-xl text-[#6b6b6b] hover:text-rose-500 hover:bg-rose-500/5 transition-all"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Popover */}
        <div 
          id="mobile-menu-popover" 
          popover="auto"
          onToggle={(e: any) => setIsMobileMenuOpen(e.newState === 'open')}
          className="md:hidden w-[calc(100vw-2rem)] max-w-[320px] rounded-[2rem] shadow-2xl shadow-rose-500/20 py-4 animate-fade-in bg-[#fdfcf9] border border-rose-500/10 backdrop-blur-2xl"
          style={{
            positionAnchor: '--mobile-menu-anchor',
            bottom: 'auto',
            left: 'auto',
            top: 'anchor(bottom)',
            right: 'anchor(right)',
            margin: 0,
            marginTop: '16px'
          } as React.CSSProperties}
        >
          <div className="space-y-1">
            {!isAdminRoute && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block mx-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive(link.href) 
                    ? 'text-rose-500 bg-rose-500/10 shadow-sm shadow-rose-500/5' 
                    : 'text-[#6b6b6b] hover:text-[#1c1c1c] hover:bg-rose-500/5'
                }`}
                onClick={() => {
                  const popover = document.getElementById('mobile-menu-popover');
                  if (popover && (popover as any).hidePopover) (popover as any).hidePopover();
                }}
              >
                {link.label}
              </Link>
            ))}
            {session?.user ? (
              <>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="block mx-3 px-5 py-3.5 rounded-2xl text-sm font-bold text-[#6b6b6b] hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                    onClick={() => {
                      const popover = document.getElementById('mobile-menu-popover');
                      if (popover && (popover as any).hidePopover) (popover as any).hidePopover();
                    }}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                  }}
                  className="block w-[calc(100%-1.5rem)] mx-3 px-5 py-3.5 rounded-2xl text-sm text-rose-500 font-bold hover:bg-rose-50 transition-all text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="block mx-4 mt-4 text-center px-6 py-3 text-sm font-bold rounded-xl bg-rose-gradient text-white shadow-lg shadow-rose-500/20"
                onClick={() => {
                  const popover = document.getElementById('mobile-menu-popover');
                  if (popover && (popover as any).hidePopover) (popover as any).hidePopover();
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
