'use client';

import { useEffect, useState } from 'react';
import { Home, Heart, Calendar, Image as ImageIcon, Send } from 'lucide-react';

export default function ThemeNavbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show navbar after a slight delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);

    const sections = ['home', 'couple', 'date', 'gallery', 'rsvp'];
    
    const handleScroll = () => {
      // Find the section currently in view
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the section is near the top of the viewport
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'HOME' },
    { id: 'couple', icon: Heart, label: 'COUPLE' },
    { id: 'date', icon: Calendar, label: 'EVENT' },
    { id: 'gallery', icon: ImageIcon, label: 'GALLERY' },
    { id: 'rsvp', icon: Send, label: 'RSVP' },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-[90] animate-fade-in w-full max-w-[340px] px-4 pointer-events-none">
      <div className="bg-[#1c1c1c]/85 backdrop-blur-xl shadow-2xl shadow-black/40 border border-white/10 rounded-full px-4 py-2.5 flex items-center justify-between pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-[42px] relative group cursor-pointer"
            >
              <div 
                className={`transition-all duration-500 ease-out flex items-center justify-center ${
                  isActive 
                    ? 'text-[#d4af37] -translate-y-2.5 scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' 
                    : 'text-white/40 hover:text-white/80 hover:-translate-y-1'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
              </div>
              <span 
                className={`absolute bottom-0 text-[8px] sm:text-[9px] font-bold tracking-widest transition-all duration-500 ease-out whitespace-nowrap ${
                  isActive ? 'text-[#d4af37] opacity-100 translate-y-0' : 'opacity-0 translate-y-2 text-white/40'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[#d4af37] shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
