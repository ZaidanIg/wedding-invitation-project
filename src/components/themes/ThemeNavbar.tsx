'use client';

import { useEffect, useState, useRef } from 'react';
import { Home, Heart, CalendarDays, Image as ImageIcon, Send, Gift } from 'lucide-react';

const ITEM_DEFS = [
  { type: 'home', icon: Home, label: 'Home', possibleIds: ['home', 'hero', 'hero-section', 'header'] },
  { type: 'couple', icon: Heart, label: 'Couple', possibleIds: ['couple', 'bride-groom', 'groom-section', 'profiles'] },
  { type: 'date', icon: CalendarDays, label: 'Date', possibleIds: ['date', 'event', 'events', 'date-section', 'ceremony'] },
  { type: 'gallery', icon: ImageIcon, label: 'Gallery', possibleIds: ['gallery', 'gallery-section', 'photos'] },
  { type: 'rsvp', icon: Send, label: 'RSVP', possibleIds: ['rsvp', 'wishes', 'rsvp-section', 'guestbook'] },
  { type: 'gift', icon: Gift, label: 'Gift', isButton: true, possibleIds: ['gift', 'digital-gift', 'gift-section', 'angpao', 'envelope-section'] },
];

export default function ThemeNavbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [navItems, setNavItems] = useState<(typeof ITEM_DEFS[number] & { id: string; isButton?: boolean })[]>([]);

  // Ref to the navbar container — gives us correct ownerDocument (works inside iframe too)
  const containerRef = useRef<HTMLDivElement>(null);
  // Lock scroll-driven updates while a programmatic scroll is in progress
  const isScrollingRef = useRef(false);
  const scrollLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const getDoc = (): Document => containerRef.current?.ownerDocument ?? document;
  const getWin = (): Window => (getDoc().defaultView ?? window) as Window;

  // ── 1. Scan DOM for known section IDs ───────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      const doc = getDoc();
      const elements = Array.from(doc.querySelectorAll('[id]'));
      const foundItems: (typeof ITEM_DEFS[number] & { id: string; isButton?: boolean })[] = [];
      const addedTypes = new Set<string>();

      elements.forEach((el) => {
        const id = el.id.toLowerCase();
        for (const def of ITEM_DEFS) {
          if (!addedTypes.has(def.type) && def.possibleIds.includes(id)) {
            foundItems.push({ ...def, id: el.id });
            addedTypes.add(def.type);
            break;
          }
        }
      });

      // Keep gift button at the end
      const giftIndex = foundItems.findIndex(item => item.isButton);
      if (giftIndex !== -1 && giftIndex !== foundItems.length - 1) {
        const giftItem = foundItems.splice(giftIndex, 1)[0];
        foundItems.push(giftItem);
      }

      setNavItems(foundItems);
      if (foundItems.length > 0) setActiveSection(foundItems[0].id);
      setIsVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
     
  }, []);

  // ── 2. Scroll spy ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (navItems.length === 0) return;

    const handleScroll = () => {
      // If we triggered the scroll programmatically, ignore scroll events
      if (isScrollingRef.current) return;

      const doc = getDoc();
      const win = getWin();
      const viewH = win.innerHeight;
      let current = navItems[0].id;

      for (const item of navItems) {
        const el = doc.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewH / 2 && rect.bottom >= viewH / 2) {
            current = item.id;
          } else if (rect.top <= 150 && rect.bottom >= 150) {
            current = item.id;
          }
        }
      }
      setActiveSection(current);
    };

    const win = getWin();
    win.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => win.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navItems]);

  // ── 3. Click → scroll ────────────────────────────────────────────────────────
  const scrollTo = (id: string) => {
    const doc = getDoc();
    const win = getWin();
    const el = doc.getElementById(id);
    if (!el) return;

    // Lock scroll spy so it doesn't fight with our setActiveSection
    isScrollingRef.current = true;
    if (scrollLockTimer.current) clearTimeout(scrollLockTimer.current);

    setActiveSection(id);
    win.scrollTo({ top: el.offsetTop, behavior: 'smooth' });

    // Release lock after smooth scroll animation (~800 ms)
    scrollLockTimer.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 900);
  };

  if (!isVisible || navItems.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-[90] w-full max-w-[360px] px-4 pointer-events-none"
      style={{ animation: 'fadeIn 0.4s ease-out forwards' }}
    >
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 rounded-full px-3 py-2 flex items-center justify-between pointer-events-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          if (item.isButton) {
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="flex items-center gap-1.5 bg-[#111111] hover:bg-black text-white px-3.5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ml-1 active:scale-95 whitespace-nowrap flex-shrink-0"
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-[42px] min-w-[48px] relative group cursor-pointer active:scale-95 transition-transform flex-shrink-0"
            >
              <div
                className={`transition-all duration-300 ease-out flex items-center justify-center ${
                  isActive ? 'text-black -translate-y-1' : 'text-gray-400 hover:text-black'
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              {isActive && (
                <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-black shadow-[0_0_4px_rgba(0,0,0,0.3)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
