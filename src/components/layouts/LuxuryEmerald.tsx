'use client';

import { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, Camera, ChevronDown, MessageCircle, Send, Home, Users, CalendarDays, Music, Pause } from 'lucide-react';
import type { Invitation, Guest } from '@/types';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  AnimatedSection, 
  CountdownTimer, 
  resolvePhotos, 
  formatEventDate, 
  getMapsUrl, 
  IconMapper, 
  WaveDivider, 
  ParallaxImage, 
  ParallaxSection, 
  PhotoCarousel, 
  LoveStorySection, 
  DigitalGiftSection, 
  QuotesSection,
  useTier,
  TIER_RANK,
  LockedSection
} from './shared';

/* ── Specific Parts for LuxuryEmerald ── */

function GoldParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const items = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: 10 + Math.random() * 15,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: ['0vh', '110vh'],
            opacity: [0, 0.8, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: parseFloat(p.delay),
            ease: "linear"
          }}
          className="absolute rounded-full bg-[#d4af37]/30 blur-[1px]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

function FlyingBirds() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const birds = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    startPos: { x: -50, y: 15 + Math.random() * 60 },
    endPos: { x: 450, y: 10 + Math.random() * 80 },
    delay: Math.random() * 15,
    duration: 15 + Math.random() * 10,
    scale: 0.4 + Math.random() * 0.4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {birds.map((b) => (
        <motion.div
          key={b.id}
          initial={{ x: b.startPos.x, y: `${b.startPos.y}%`, opacity: 0 }}
          animate={{
            x: b.endPos.x,
            y: [`${b.startPos.y}%`, `${b.startPos.y - 5}%`, `${b.startPos.y + 5}%`, `${b.endPos.y}%`],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{ scale: b.scale }}
        >
          <svg width="40" height="30" viewBox="0 0 40 30" className="text-[#d4af37]/40 fill-current">
            <path d="M0,15 C5,10 15,0 20,15 C25,0 35,10 40,15 C35,20 25,30 20,15 C15,30 5,20 0,15 Z">
              <animate 
                attributeName="d" 
                dur="0.6s" 
                repeatCount="indefinite"
                values="
                  M0,15 C5,10 15,0 20,15 C25,0 35,10 40,15 C35,20 25,30 20,15 C15,30 5,20 0,15 Z;
                  M0,15 C5,5 15,-10 20,15 C25,-10 35,5 40,15 C35,10 25,20 20,15 C15,20 5,10 0,15 Z;
                  M0,15 C5,10 15,0 20,15 C25,0 35,10 40,15 C35,20 25,30 20,15 C15,30 5,20 0,15 Z
                "
              />
            </path>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function FloatingFlowers() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 20,
    duration: 15 + Math.random() * 20,
    size: `${20 + Math.random() * 40}px`,
    rotate: Math.random() * 360,
  }));
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-20">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: '100vh', x: item.left, rotate: 0 }}
          animate={{
            y: '-20vh',
            x: [item.left, `${parseFloat(item.left) + 10}%`, `${parseFloat(item.left) - 10}%`, item.left],
            rotate: item.rotate + 360,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{ width: item.size, height: item.size }}
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="#d4af37" strokeWidth="2" className="w-full h-full">
            <path d="M50 50 Q70 20 50 10 Q30 20 50 50 Z" />
            <path d="M50 50 Q80 70 90 50 Q80 30 50 50 Z" />
            <path d="M50 50 Q70 80 50 90 Q30 80 50 50 Z" />
            <path d="M50 50 Q20 70 10 50 Q20 30 50 50 Z" />
            <circle cx="50" cy="50" r="5" fill="#d4af37" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CoverPage({ groomName, brideName, guestName, onOpen }: {
  groomName: string; brideName: string; guestName: string; onOpen: () => void;
}) {
  return (
    <motion.div exit={{ y: '-100%', opacity: 0, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#042f2e] overflow-hidden">
      <div className="absolute inset-6 border border-[#d4af37]/30 pointer-events-none" />
      <div className="absolute inset-8 border border-[#d4af37]/15 pointer-events-none" />
      {['top-6 left-6','top-6 right-6 rotate-90','bottom-6 right-6 rotate-180','bottom-6 left-6 -rotate-90'].map((pos,i) => (
        <svg key={i} className={`absolute ${pos} w-12 h-12 text-[#d4af37]/40`} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0,0 L20,0 M0,0 L0,20" /><path d="M5,0 Q0,0 0,5" /><circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.5" />
        </svg>
      ))}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-center px-8 relative z-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37]/60 mb-6">The Wedding of</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-1">{groomName}</h1>
        <span className="text-2xl font-display italic text-[#d4af37]/70 block my-2">&amp;</span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white">{brideName}</h1>
        <div className="flex items-center justify-center gap-3 my-8">
          <div className="h-px w-12 bg-[#d4af37]/40" /><Heart className="h-4 w-4 text-[#d4af37] animate-heartbeat" fill="currentColor" /><div className="h-px w-12 bg-[#d4af37]/40" />
        </div>
        <p className="text-xs text-white/50 mb-1">Kepada Yth.</p>
        <p className="text-xs text-white/40 mb-1">Bapak/Ibu/Saudara/i</p>
        <p className="text-lg font-display font-semibold text-[#d4af37] mb-10">{guestName}</p>
        <motion.button onClick={onOpen} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-8 py-3 border border-[#d4af37] text-[#d4af37] text-xs font-semibold uppercase tracking-[0.3em] hover:bg-[#d4af37] hover:text-[#042f2e] transition-all duration-500">
          Buka Undangan
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function BottomNav({ visible, hasGallery }: { visible: boolean; hasGallery: boolean }) {
  const [active, setActive] = useState('home');
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'couple', icon: Users, label: 'Mempelai' },
    { id: 'date', icon: CalendarDays, label: 'Tanggal' },
    ...(hasGallery ? [{ id: 'gallery', icon: Camera, label: 'Galeri' }] : []),
    { id: 'wishes', icon: MessageCircle, label: 'Ucapan' },
  ];

  useEffect(() => {
    if (!visible) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.3 });
    items.forEach(i => { const el = document.getElementById(i.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [visible]);

  if (!visible) return null;
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-[100] w-full max-w-lg mx-auto">
      <div className="mx-3 mb-3 flex items-center justify-around bg-[#042f2e]/90 backdrop-blur-xl rounded-2xl border border-[#d4af37]/20 px-2 py-2 shadow-2xl">
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: 'smooth' }); }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${active === i.id ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-white/40 hover:text-white/70'}`}>
            <i.icon className="h-4 w-4" /><span className="text-[9px] font-medium">{i.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function EmeraldAudio({ src, isPreview }: { src: string; isPreview?: boolean }) {
  const { tier } = useTier();
  const currentRank = TIER_RANK[tier] || 0;
  const requiredRank = TIER_RANK['PREMIUM'];

  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);

  if (currentRank < requiredRank) {
    return null;
  }

  const toggle = () => {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
      setPlaying(false);
    } else {
      ref.current.play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.error('Audio playback error:', err);
          setPlaying(false);
        });
    }
  };

  useEffect(() => {
    const audio = ref.current;
    if (audio && !isPreview) {
      const attemptPlay = () => {
        audio.play()
          .then(() => setPlaying(true))
          .catch(() => {
            setPlaying(false);
          });
      };
      
      attemptPlay();
      
      const handleEnded = () => setPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [src, isPreview]);

  const positionClass = isPreview ? 'sticky' : 'fixed';
  return (
    <div className={`${positionClass} bottom-20 right-4 z-[100] flex justify-end`}>
      <audio ref={ref} src={src} loop preload="auto">
        <source src={src} type="audio/mpeg" />
      </audio>
      <button 
        onClick={toggle} 
        className={`w-11 h-11 flex items-center justify-center rounded-full shadow-2xl border border-[#d4af37]/30 backdrop-blur-md transition-all duration-300 ${playing ? 'bg-[#d4af37] text-[#042f2e]' : 'bg-[#042f2e]/80 text-[#d4af37] animate-pulse-slow'}`}>
        {playing ? <Pause className="h-4 w-4 fill-current" /> : <Music className="h-4 w-4" />}
      </button>
    </div>
  );
}

function IslamicDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 max-w-xs mx-auto">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
      <svg viewBox="0 0 40 40" className="w-8 h-8 text-[#d4af37]/50" fill="currentColor">
        <path d="M20 2l3 8h8l-6.5 5 2.5 8L20 18l-7 5 2.5-8L9 10h8z" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
    </div>
  );
}

function WishesSection({ slug, guests: initialGuests }: { slug: string; guests: Guest[] }) {
  const { tier, isPreview } = useTier();
  const currentRank = TIER_RANK[tier] || 0;
  const requiredRank = TIER_RANK['PREMIUM'];

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [wishes, setWishes] = useState(initialGuests.filter(g => g.message));

  if (currentRank < requiredRank) {
    if (isPreview) {
      return (
        <div className="max-w-md mx-auto my-6 px-4">
          <LockedSection title="RSVP & Wishes" requiredTier="Premium" className="bg-[#042f2e]/10 border border-[#d4af37]/20 rounded-3xl p-6 text-center text-stone-300" />
        </div>
      );
    }
    return null;
  }

  const submit = async () => {
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/invitations/${slug}/rsvp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, rsvpStatus: 'ATTENDING', attendees: 1 }),
      });
      if (res.ok) {
        const data = await res.json();
        setWishes(prev => [data.data, ...prev]);
        setName(''); setMessage('');
      }
    } catch { /* silent */ } finally { setSending(false); }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="space-y-3 mb-6 text-left">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama Anda" className="w-full px-4 py-3 bg-white border border-[#d4af37]/20 text-sm text-[#042f2e] placeholder:text-[#042f2e]/30 focus:border-[#d4af37] focus:outline-none transition-colors" />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tulis ucapan & doa..." rows={3} className="w-full px-4 py-3 bg-white border border-[#d4af37]/20 text-sm text-[#042f2e] placeholder:text-[#042f2e]/30 focus:border-[#d4af37] focus:outline-none transition-colors resize-none" />
        <button onClick={submit} disabled={sending || !name.trim() || !message.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#042f2e] text-[#d4af37] text-xs font-semibold uppercase tracking-widest hover:bg-[#064e3b] transition-all disabled:opacity-50">
          <Send className="h-3.5 w-3.5" />{sending ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </div>
      {wishes.length > 0 && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
          {wishes.map((w: Guest, i: number) => (
            <div key={w.id || i} className="bg-white border border-[#d4af37]/10 p-4 text-left">
              <p className="text-xs font-semibold text-[#042f2e]">{w.name}</p>
              <p className="text-sm text-[#042f2e]/70 mt-1">{w.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Layout Component ── */

interface LayoutProps {
  invitation: Invitation;
  isPreview?: boolean;
}

export default function LuxuryEmerald({ invitation, isPreview = false }: LayoutProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const { formattedDate, dayNumber, monthName, dayName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, photo2, photo3, galleryPhotos, groomPhoto, bridePhoto } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const to = p.get('to');
    if (to) setGuestName(decodeURIComponent(to));
  }, []);

  const handleOpen = () => {
    setIsOpened(true);
  };

  return (
    <div className={`w-full max-w-lg mx-auto bg-[#faf7f0] text-[#1a1a2e] font-sans relative shadow-2xl ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <AnimatePresence>{!isOpened && <CoverPage groomName={invitation.groomName} brideName={invitation.brideName} guestName={guestName} onOpen={handleOpen} />}</AnimatePresence>

      {isOpened && (
        <>
          <GoldParticles />
          <FlyingBirds />
          <ParallaxSection speed={-0.2}>
            <FloatingFlowers />
          </ParallaxSection>
        </>
      )}

      <section id="home" className="relative w-full h-[100vh] min-h-[600px] flex flex-col items-center justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-[#042f2e]/80 via-[#042f2e]/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center pb-16 px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37]/70 mb-3">The Wedding of</p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={isOpened ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.8 }}>
            <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.groomName}</span>
            <span className="block text-2xl font-display italic text-[#d4af37] my-2">&amp;</span>
            <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.brideName}</span>
          </motion.h1>
          <p className="text-sm text-white/50 mt-6 tracking-widest">{formattedDate}</p>
          <div className="mt-10 animate-bounce"><ChevronDown className="h-6 w-6 text-[#d4af37]/50 mx-auto" /></div>
        </div>
      </section>

      <section className="py-14 px-8 bg-[#042f2e] text-center">
        <AnimatedSection>
          <p className="text-2xl font-display text-[#d4af37] mb-4" style={{ fontFamily: 'serif' }}>﷽</p>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto">Assalamualaikum Warahmatullahi Wabarakatuh</p>
          <p className="text-xs text-white/40 mt-4 leading-relaxed max-w-sm mx-auto">Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:</p>
        </AnimatedSection>
        <IslamicDivider />
      </section>

      <section id="couple" className="py-14 px-8 bg-[#faf7f0] text-center">
        <AnimatedSection><p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-8">The Groom & Bride</p></AnimatedSection>
        <div className="grid grid-cols-1 gap-10">
          <AnimatedSection animation="left">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#d4af37]/30 shadow-lg mb-4 relative">
                <Image src={groomPhoto} alt="Groom" fill className="object-cover" unoptimized />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#042f2e]">{invitation.groomName}</h3>
              <p className="text-xs text-[#042f2e]/50 mt-1">Putra dari</p>
              <p className="text-sm text-[#042f2e]/70">{invitation.groomParents || 'Bapak & Ibu'}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="scale"><Heart className="h-6 w-6 text-[#d4af37] mx-auto" fill="currentColor" /></AnimatedSection>
          <AnimatedSection animation="right">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#d4af37]/30 shadow-lg mb-4 relative">
                <Image src={bridePhoto} alt="Bride" fill className="object-cover" unoptimized />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#042f2e]">{invitation.brideName}</h3>
              <p className="text-xs text-[#042f2e]/50 mt-1">Putri dari</p>
              <p className="text-sm text-[#042f2e]/70">{invitation.brideParents || 'Bapak & Ibu'}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 px-8 bg-[#042f2e] text-center relative overflow-hidden">
        <WaveDivider fill="#faf7f0" position="top" />
        <div className="absolute inset-6 border border-[#d4af37]/10 pointer-events-none" />
        <AnimatedSection>
          <p className="text-base font-serif italic text-white/70 leading-relaxed max-w-sm mx-auto">&ldquo;Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).&rdquo;</p>
          <p className="text-xs text-[#d4af37]/60 mt-4 tracking-wider">— QS. Adh-Dhariyat: 49</p>
        </AnimatedSection>
        <IslamicDivider />
        <AnimatedSection delay="delay-200">
          <p className="text-base font-serif italic text-white/70 leading-relaxed max-w-sm mx-auto">&ldquo;{invitation.greeting}&rdquo;</p>
        </AnimatedSection>
      </section>

      <section id="date" className="py-20 px-6 text-center bg-[#faf7f0] relative">
        <WaveDivider fill="#042f2e" position="top" />
        <div className="mt-12">
          <AnimatedSection><p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-8">Counting Down</p></AnimatedSection>
          <AnimatedSection delay="delay-200">
            <CountdownTimer targetDate={invitation.eventDate} textColor="text-[#042f2e]" labelColor="text-[#042f2e]/40" separatorColor="text-[#d4af37]" />
          </AnimatedSection>
          <AnimatedSection animation="scale" delay="delay-300">
            <div className="mt-8 inline-flex items-center gap-6 border border-[#042f2e]/30 rounded-[0.5rem] px-8 py-4 shadow-sm bg-white/40 backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#042f2e]/60 font-semibold">{dayName}</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-display font-bold text-[#042f2e]">{dayNumber}</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#042f2e]/60 font-semibold">{monthName}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 bg-[#faf7f0]">
        <PhotoCarousel 
          photos={[photo2, photo3, galleryPhotos[0] || heroPhoto]} 
          className="h-[400px] sm:h-[500px]" 
        />
      </section>

      <section className="py-20 px-8 bg-[#042f2e] text-center relative">
        <WaveDivider fill="#faf7f0" position="top" />
        <div className="mt-12">
          <AnimatedSection>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2">The Ceremony</p>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Akad & Resepsi</h2>
          </AnimatedSection>
          <AnimatedSection delay="delay-200">
            <div className="bg-white/5 backdrop-blur-sm border border-[#d4af37]/20 p-6 max-w-sm mx-auto">
              <p className="text-lg text-white font-display font-bold">{invitation.eventTime}</p>
              <p className="text-sm text-white/80 mt-2 font-medium">{invitation.venueName}</p>
              <p className="text-xs text-white/50 mt-1">{invitation.venueAddress}</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 border border-[#d4af37] text-[#d4af37] text-xs font-semibold uppercase tracking-widest hover:bg-[#d4af37] hover:text-[#042f2e] transition-all duration-300">
                <MapPin className="h-3.5 w-3.5" />Lihat Lokasi
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {invitation.schedule && invitation.schedule.length > 0 && (
        <section className="py-20 px-8 bg-[#faf7f0] relative">
          <WaveDivider fill="#042f2e" position="top" />
          <AnimatedSection><h2 className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] text-center mb-10">Rundown Acara</h2></AnimatedSection>
          <div className="max-w-xs mx-auto relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[#d4af37]/40 via-[#d4af37]/20 to-transparent" />
            {invitation.schedule.map((item: any, idx: number) => (
              <AnimatedSection key={item.id || idx} animation={idx % 2 === 0 ? 'left' : 'right'} delay={`delay-${(idx + 1) * 100}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#042f2e] border-2 border-[#d4af37]/40 flex items-center justify-center shrink-0 z-10">
                    <IconMapper name={item.icon} className="h-4 w-4 text-[#d4af37]" />
                  </div>
                  <div className="pt-2">
                    {item.time && <p className="text-xs font-bold text-[#042f2e] uppercase tracking-wider">{item.time}</p>}
                    <p className="text-sm text-[#042f2e]/70">{item.label}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      <section className="py-12 bg-[#faf7f0]">
        <ParallaxImage src={photo3} alt="Photo" className="h-[350px] sm:h-[450px]" />
      </section>

      <section className="py-20 px-8 bg-[#faf7f0] text-center relative">
        <div className="mt-12">
          <AnimatedSection><p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-6">Lokasi Acara</p></AnimatedSection>
          <AnimatedSection delay="delay-200">
            <div className="overflow-hidden border border-[#d4af37]/20 shadow-sm h-[280px]">
              <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://www.google.com/maps?q=${encodeURIComponent(invitation.venueName + ', ' + invitation.venueAddress)}&output=embed`} allowFullScreen title="Location" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <DigitalGiftSection gifts={(invitation as any).digitalGifts || []} bgColor="bg-[#faf7f0]" textColor="text-[#042f2e]" />
      <LoveStorySection story={invitation.loveStory || []} />

      {galleryPhotos.length > 0 && (
        <section id="gallery" className="pb-24 pt-12 px-8 bg-[#042f2e] text-center relative">
          <div className="relative z-10">
            <AnimatedSection>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-8 bg-[#d4af37]/30" />
                <Heart className="h-4 w-4 text-[#d4af37]" fill="currentColor" />
                <div className="h-px w-8 bg-[#d4af37]/30" />
              </div>
              <Camera className="h-5 w-5 text-[#d4af37] mx-auto mb-3" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-8">Our Moments</p>
            </AnimatedSection>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {galleryPhotos.map((src: string, idx: number) => (
              <AnimatedSection key={idx} animation="scale" delay={`delay-${(idx + 1) * 100}`} className={idx === 0 ? 'col-span-2' : ''}>
                <div className={`relative overflow-hidden group border border-[#d4af37]/20 ${idx === 0 ? 'h-[250px]' : 'h-[180px]'}`}>
                  <Image src={src} alt={`Gallery ${idx + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      <section id="wishes" className="py-20 px-8 bg-[#faf7f0] text-center relative">
        <WaveDivider fill="#042f2e" position="top" />
        <AnimatedSection>
          <MessageCircle className="h-5 w-5 text-[#d4af37] mx-auto mb-3" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2">Ucapan & Doa</p>
          <p className="text-sm text-[#042f2e]/50 mb-6">Sampaikan ucapan dan doa untuk kedua mempelai</p>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <WishesSection slug={invitation.slug} guests={invitation.guests || []} />
        </AnimatedSection>
      </section>

      <QuotesSection text={invitation.quotes || ''} bgColor="bg-[#faf7f0]" textColor="text-[#042f2e]" />

      <section className="py-24 px-8 bg-[#042f2e] text-center relative overflow-hidden">
        <WaveDivider fill="#faf7f0" position="top" />
        <div className="absolute inset-6 border border-[#d4af37]/15 pointer-events-none" />
        <AnimatedSection><Heart className="h-6 w-6 text-[#d4af37] mx-auto mb-6" fill="currentColor" /></AnimatedSection>
        <AnimatedSection delay="delay-200"><p className="text-base font-serif italic text-white/70 leading-relaxed max-w-sm mx-auto">{invitation.closing}</p></AnimatedSection>
        <AnimatedSection delay="delay-400">
          <div className="mt-10">
            <h3 className="text-3xl font-display font-bold">{invitation.groomName} & {invitation.brideName}</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mt-4">{formattedDate}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay="delay-500"><p className="text-xs text-white/30">Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir</p></AnimatedSection>
      </section>

      <div className="h-20 bg-[#042f2e]" />
      {isOpened && invitation.musicUrl && <EmeraldAudio src={invitation.musicUrl} isPreview={isPreview} />}
      <BottomNav visible={isOpened} hasGallery={galleryPhotos.length > 0} />
    </div>
  );
}
