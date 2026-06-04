'use client';
import { getCoupleSlug } from '@/lib/utils';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Heart, MapPin, Camera, ChevronDown, MessageCircle, Send, Home, Users, CalendarDays, Music, Pause, Check, QrCode } from 'lucide-react';
import SafeQRCodeSVG from '@/components/dashboard/SafeQRCodeSVG';
import type { Invitation, Guest } from '@/types';
import { getEmbedUrl } from '@/lib/utils';
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
  DigitalGiftSection, 
  QuotesSection,
  TIER_RANK,
  TierGate,
  useTier,
  EventActionButtons,
  OpeningPhraseSection,
  GallerySection,
  VideoEmbedSection,
} from './shared';

/* ── Falling Gold Dust Particles ── */
function GoldDustParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: 8 + Math.random() * 12,
      size: 2 + Math.random() * 5,
      drift: (Math.random() * 60) - 30, // left-right drift distance
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: ['0vh', '115vh'],
            x: [0, p.drift, 0],
            opacity: [0, 0.9, 0.9, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: parseFloat(p.delay),
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f5f0eb] shadow-[0_0_8px_#d4af37]"
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

/* ── Cover Page Component with Convex Curved Frame ── */
function CoverPage({ groomName, brideName, guestName, onOpen }: {
  groomName: string; brideName: string; guestName: string; onOpen: () => void;
}) {
  return (
    <motion.div 
      exit={{ y: '-100%', opacity: 0, transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-[#111111] overflow-hidden text-white py-16 px-6"
    >
      {/* Curved Framing Elements */}
      <div className="absolute inset-6 border border-[#d4af37]/35 pointer-events-none rounded-[2rem]" />
      <div className="absolute inset-8 border border-[#d4af37]/15 pointer-events-none rounded-[1.8rem]" />
      
      {/* Corner Ornaments */}
      {['top-8 left-8', 'top-8 right-8 rotate-90', 'bottom-8 right-8 rotate-180', 'bottom-8 left-8 -rotate-90'].map((pos, i) => (
        <svg key={i} className={`absolute ${pos} w-14 h-14 text-[#d4af37]/50`} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0,0 L25,0 M0,0 L0,25" />
          <path d="M6,0 Q0,0 0,6" />
          <circle cx="10" cy="10" r="2.5" fill="currentColor" opacity="0.6" />
        </svg>
      ))}

      {/* Gold Dust for Cover */}
      <GoldDustParticles />

      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2, duration: 0.8 }} 
        className="text-center relative z-10"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37]/80 font-semibold mb-2">The Wedding of</p>
        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />
      </motion.div>

      {/* Names Display with Calligraphy Vibes */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }} 
        className="text-center relative z-10 my-auto flex flex-col items-center"
      >
        <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white mb-2 leading-none" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          {groomName}
        </h1>
        <div className="flex items-center gap-3 my-4">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
          <Heart className="h-5 w-5 text-[#d4af37] animate-heartbeat" fill="currentColor" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white leading-none" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          {brideName}
        </h1>
      </motion.div>

      {/* Guest Card & Open Button */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6, duration: 0.8 }} 
        className="text-center w-full max-w-sm relative z-10"
      >
        <div className="bg-[#1a1a1a]/95 backdrop-blur-md border border-[#d4af37]/25 p-6 rounded-2xl mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <h2 className="text-xl font-display font-semibold text-[#d4af37] mb-1" style={{ fontFamily: 'var(--font-playfair), serif' }}>
            {guestName}
          </h2>
          <div className="h-px w-24 bg-white/10 mx-auto mt-3" />
        </div>

        <motion.button 
          onClick={onOpen} 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }}
          className="relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#d4af37] to-[#aa8010] text-[#111111] text-xs font-bold uppercase tracking-[0.25em] rounded-full shadow-[0_10px_25px_-5px_rgba(212,175,55,0.4)] group overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Buka Undangan
            <Heart className="h-3.5 w-3.5 fill-[#111111]" />
          </span>
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ── Interactive Spinning Gold Vinyl Player ── */
function SpinningGoldVinyl({ src, isPreview }: { src: string; isPreview?: boolean }) {
    const { tier } = useTier();
    const currentRank = TIER_RANK[tier] || 0;
  const requiredRank = TIER_RANK['PREMIUM'];

  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);

  if (currentRank < requiredRank || !src) {
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
          console.error('Audio play blocked:', err);
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
          .catch(() => setPlaying(false));
      };
      
      attemptPlay();
      
      const handleEnded = () => setPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [src, isPreview]);

  return (
    <div className="fixed bottom-24 right-4 z-[99] flex justify-end">
      <audio ref={ref} src={src} loop preload="auto">
        <source src={src} type="audio/mpeg" />
      </audio>
      <button 
        onClick={toggle} 
        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-3xl border border-[#d4af37]/40 backdrop-blur-lg transition-all duration-500 relative overflow-hidden bg-[#111111]`}
      >
        {/* Golden Vinyl Groove Lines */}
        <div className={`absolute inset-1 rounded-full border border-[#d4af37]/15 transition-transform duration-[6000ms] ease-linear ${playing ? 'animate-spin' : ''}`}>
          <div className="absolute inset-1 rounded-full border border-[#d4af37]/10" />
          <div className="absolute inset-2 rounded-full border border-[#d4af37]/5" />
          {/* Gold Center Label */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f5f0eb] flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
          </div>
        </div>

        {/* Music Icons Overlay */}
        <span className="relative z-10 text-[#d4af37]">
          {playing ? <Pause className="h-3.5 w-3.5 stroke-[2.5]" /> : <Music className="h-3.5 w-3.5 stroke-[2.5]" />}
        </span>
      </button>
    </div>
  );
}

/* ── Custom Wishes (RSVP) Section ── */
function WishesSection({ invitation }: { invitation: Invitation }) {
  const { tier, isPreview } = useTier();
  const currentRank = TIER_RANK[tier] || 0;
  const requiredRank = TIER_RANK['PREMIUM'];

  const [wishes, setWishes] = useState<Guest[]>(invitation.guests || []);
  const [name, setName] = useState(invitation.rsvpName || '');
  const [phone, setPhone] = useState(invitation.rsvpPhone || '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'ATTENDING' | 'NOT_ATTENDING'>(invitation.rsvpStatus === 'NOT_ATTENDING' ? 'NOT_ATTENDING' : 'ATTENDING');
  const [sending, setSending] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(invitation.rsvpGuestId || null);
  const [isSubmitted, setIsSubmitted] = useState(invitation.rsvpSubmitted || false);

  if (currentRank < requiredRank) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invitation.rsvpSubmitted) {
      if (!message.trim()) return;
    } else {
      if (!name.trim() || !phone.trim() || !message.trim()) return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/invitations/${invitation.slug}/rsvp`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: invitation.rsvpSubmitted ? invitation.rsvpName : name.trim(), 
          phone: invitation.rsvpSubmitted ? invitation.rsvpPhone : phone.trim(),
          message: message.trim(), 
          rsvpStatus: invitation.rsvpSubmitted ? invitation.rsvpStatus : status, 
          attendees: 1 
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWishes(prev => [data.data, ...prev]);
        setGuestId(data.data.id);
        setIsSubmitted(true);
        setName(data.data.name); 
        setPhone(data.data.phone);
        setMessage('');
      }
    } catch { /* silent */ } finally { setSending(false); }
  };

  const isQrAvailable = (invitation.tier === 'PREMIUM' || invitation.tier === 'ULTIMATE') && invitation.qrEnabled !== false;

  if (isSubmitted && isQrAvailable && status === 'ATTENDING' && guestId) {
    return (
      <div className="max-w-md mx-auto px-4 animate-fade-in">
        <div className="bg-[#1a1a1a] border border-[#d4af37]/35 p-8 rounded-3xl shadow-xl text-center relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#d4af37]/5 blur-2xl rounded-full" />
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-emerald-500 animate-bounce" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Terima Kasih!</h3>
          <p className="text-xs text-white/60 mb-6 px-4">Kehadiran Anda sangat berarti bagi kami. Berikut QR Code untuk check-in:</p>
          
          <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border border-white/10">
            <SafeQRCodeSVG value={guestId} size={160} level="H" />
          </div>
          
          <p className="mt-6 text-[10px] text-white/40 uppercase tracking-widest leading-loose">
            Simpan QR Code ini untuk<br />ditunjukkan pada saat acara
          </p>
          
          <button 
            onClick={() => setIsSubmitted(false)}
            className="mt-8 text-xs font-bold text-[#d4af37] uppercase tracking-widest hover:opacity-75 transition-opacity cursor-pointer"
          >
            Lihat Ucapan Lainnya
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4">
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-[#d4af37]/35 p-6 rounded-3xl shadow-xl space-y-4 text-left relative overflow-hidden">
        {/* Subtle Accent Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#d4af37]/5 blur-2xl rounded-full" />
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-widest text-center border-b border-white/5 pb-3">Kirim Doa Restu & RSVP</h3>
        
        {invitation.rsvpSubmitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-center mb-4">
            <p className="text-xs font-bold text-emerald-400 mb-1">✓ Anda Telah Mengisi RSVP</p>
            <p className="text-[10px] text-white/60 font-medium">
              Nama: <span className="font-bold text-white/90">{invitation.rsvpName}</span> • Kehadiran: <span className="font-bold text-white/90">{invitation.rsvpStatus === 'ATTENDING' ? 'Hadir' : 'Absen'}</span>
            </p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-1.5 ml-1">Nama Lengkap</label>
              <input 
                type="text"
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Nama Lengkap Anda" 
                required
                className="w-full px-4 py-3 bg-[#111111] border border-white/10 text-sm text-white placeholder:text-white/30 rounded-xl focus:border-[#d4af37] focus:outline-none transition-colors" 
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-1.5 ml-1">Nomor WhatsApp *</label>
              <input 
                type="tel"
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="Contoh: 08123456789" 
                required
                className="w-full px-4 py-3 bg-[#111111] border border-white/10 text-sm text-white placeholder:text-white/30 rounded-xl focus:border-[#d4af37] focus:outline-none transition-colors" 
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-1.5 ml-1">Konfirmasi Kehadiran</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'ATTENDING', label: 'Hadir', icon: '😊' },
                  { id: 'NOT_ATTENDING', label: 'Absen', icon: '😔' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id as any)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      status === opt.id 
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8010] text-[#111111] border-[#d4af37]' 
                        : 'bg-[#111111] text-white/50 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-1.5 ml-1">Ucapan & Doa</label>
          <textarea 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Tulis ucapan selamat & doa restu..." 
            rows={3} 
            required
            className="w-full px-4 py-3 bg-[#111111] border border-white/10 text-sm text-white placeholder:text-white/30 rounded-xl focus:border-[#d4af37] focus:outline-none transition-colors resize-none" 
          />
        </div>
        
        <button 
          type="submit"
          disabled={sending || (!invitation.rsvpSubmitted && !name.trim()) || !message.trim() || (!invitation.rsvpSubmitted && !phone.trim())}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#aa8010] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5 fill-current" />
          {sending ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </form>

      {wishes.filter(w => w.message).length > 0 && (
        <div className="mt-8 space-y-4 max-h-[350px] overflow-y-auto pr-1 no-scrollbar text-left">
          {wishes.filter(w => w.message).map((w: Guest, i: number) => (
            <div key={w.id || i} className="bg-[#1a1a1a]/40 border border-[#d4af37]/10 p-5 rounded-2xl relative shadow-md">
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                  w.rsvpStatus === 'ATTENDING' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/35'
                }`}>
                  {w.rsvpStatus === 'ATTENDING' ? 'Hadir' : 'Absen'}
                </span>
              </div>
              <p className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">{w.name}</p>
              <p className="text-sm text-white/70 mt-2 leading-relaxed font-sans">{w.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




/* ── MAIN COMPONENT: PremiumCharcoal ── */
interface LayoutProps {
  invitation: Invitation;
  isPreview?: boolean;
}

export default function PremiumCharcoal({ invitation, isPreview = false }: LayoutProps) {
  const { tier } = useTier();
  const [isOpened, setIsOpened] = useState(isPreview);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const { formattedDate, dayNumber, monthName, dayName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, photo2, photo3, galleryPhotos, groomPhoto, bridePhoto } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const to = p.get('to');
    if (to) {
      const decoded = decodeURIComponent(to);
      setGuestName(decoded);
      if (invitation.guests) {
        const decodedTo = decoded.trim().toLowerCase();
        const guest = invitation.guests.find(
          (g) => g.name.trim().toLowerCase() === decodedTo
        );
        if (guest) {
          setMatchedGuest(guest);
        }
      }
    }
  }, [invitation.guests]);

  const handleOpen = () => {
    setIsOpened(true);
  };

  return (
    <div className={`w-full max-w-lg mx-auto bg-[#111111] text-white font-sans relative shadow-2xl overflow-hidden ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <AnimatePresence>
        {!isOpened && (
          <CoverPage 
            groomName={invitation.groomName} 
            brideName={invitation.brideName} 
            guestName={guestName} 
            onOpen={handleOpen} 
          />
        )}
      </AnimatePresence>

      {/* Gold Dust background particles when invitation is opened */}
      {isOpened && <GoldDustParticles />}

      {isOpened && (
        <OpeningPhraseSection
          phrase={invitation.openingPhrase}
          style={invitation.openingStyle}
          textColorClass="text-[#d4af37]"
          bgClass="bg-[#111111] border-b border-[#d4af37]/20"
        />
      )}

      {/* Section 1: Hero Cover */}
      <section id="home" className="relative w-full h-[100dvh] min-h-[600px] flex flex-col items-center justify-end overflow-hidden pb-20">
        <div className="absolute inset-0">
          <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-3 font-semibold">The Wedding of</p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={isOpened ? { opacity: 1, y: 0 } : {}} 
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="block text-4xl sm:text-5xl font-display font-bold text-white drop-shadow-xl" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              {invitation.groomName}
            </span>
            <span className="block text-xl font-display italic text-[#d4af37] my-3 drop-shadow-lg">&amp;</span>
            <span className="block text-4xl sm:text-5xl font-display font-bold text-white drop-shadow-xl" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              {invitation.brideName}
            </span>
          </motion.h1>
          <p className="text-xs text-[#d4af37]/80 mt-6 tracking-[0.25em] font-semibold border-y border-[#d4af37]/20 py-2.5 px-4 inline-block">{formattedDate}</p>
          
          <div className="mt-14 animate-bounce">
            <ChevronDown className="h-6 w-6 text-[#d4af37] mx-auto" />
          </div>
        </div>
      </section>

      {/* Section 2: Opening Greeting */}
      <section className="py-20 px-8 bg-[#111111] text-center relative">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        
        <AnimatedSection>
          <p className="text-sm text-[#d4af37] tracking-[0.25em] font-semibold mb-4 uppercase">Dengan Penuh Rasa Syukur & Bahagia</p>
          <p className="text-xs text-white/60 leading-relaxed max-w-sm mx-auto font-sans">
            Kami mengundang Anda, Bapak/Ibu/Saudara/i, untuk menghadiri dan memberikan doa restu pada perayaan pernikahan kami:
          </p>
        </AnimatedSection>
      </section>

      {/* Section 3: Mempelai (The Groom & Bride) */}
      <section id="couple" className="py-16 px-8 bg-[#161616] relative text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_0.5px,transparent_0.5px)] opacity-[0.03] pointer-events-none" style={{ backgroundSize: '24px 24px' }} />
        
        <AnimatedSection>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2 font-bold">The Happy Couple</p>
          <h2 className="text-2xl font-display font-bold text-white mb-12" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Mempelai Pengantin</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-14 relative z-10">
          {/* Groom Block */}
          <AnimatedSection animation="left">
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#d4af37]/50 shadow-2xl mb-5 relative">
                <Image src={groomPhoto} alt="Groom" fill className="object-cover scale-105 hover:scale-110 transition-transform duration-500" unoptimized />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#d4af37] tracking-tight" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                {invitation.groomName}
              </h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2 font-semibold">Putra Tercinta Dari:</p>
              <p className="text-sm text-white/75 mt-1 font-semibold leading-relaxed">
                {invitation.groomParents || 'Bapak & Ibu'}
              </p>
            </div>
          </AnimatedSection>

          {/* Golden Heart Divider */}
          <AnimatedSection animation="scale" className="my-2">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
              <Heart className="h-6 w-6 text-[#d4af37]" fill="currentColor" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
            </div>
          </AnimatedSection>

          {/* Bride Block */}
          <AnimatedSection animation="right">
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#d4af37]/50 shadow-2xl mb-5 relative">
                <Image src={bridePhoto} alt="Bride" fill className="object-cover scale-105 hover:scale-110 transition-transform duration-500" unoptimized />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#d4af37] tracking-tight" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                {invitation.brideName}
              </h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2 font-semibold">Putri Tercinta Dari:</p>
              <p className="text-sm text-white/75 mt-1 font-semibold leading-relaxed">
                {invitation.brideParents || 'Bapak & Ibu'}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 🛑 MONOTONY-BREAKING 3-PART CUSTOM SECTION (Mockup reference) 🛑 */}
      {invitation.loveStory && invitation.loveStory.length > 0 && (
        <section id="custom-love-story" className="relative w-full bg-[#111111]">
          {/* PART 1: Top Convex Portrait Photo */}
          <div className="relative w-full h-[380px] overflow-hidden">
            <Image 
              src={photo2} 
              alt="Story Cover Top" 
              fill 
              className="object-cover" 
              unoptimized 
            />
            {/* Dark Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
            
            {/* Convex Curved Shape Cut bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fdfbf7] pointer-events-none" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
          </div>

          {/* PART 2: Middle Love Story block in clean Warm Cream */}
          <div className="bg-[#fdfbf7] text-[#111111] px-8 pb-16 pt-2 text-center relative z-10">
            <AnimatedSection>
              <div className="inline-flex p-3 rounded-full bg-[#111111]/5 mb-3 border border-[#111111]/10">
                <Heart className="h-5 w-5 text-[#d4af37]" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Kisah Cinta Kami</h2>
              <p className="text-[9px] uppercase tracking-[0.30em] text-stone-500 font-bold mb-14">The Chapters of Our Hearts</p>
            </AnimatedSection>

            {/* Vertical timeline inside warm cream block */}
            <div className="max-w-md mx-auto relative">
              {/* Timeline Dotted vertical Line */}
              <div className="absolute left-1/2 top-2 bottom-2 w-[2px] bg-dashed border-l-2 border-dashed border-[#d4af37]/50 -translate-x-1/2" />

              {invitation.loveStory.map((storyItem: any, idx: number) => (
                <div key={storyItem.id || idx} className={`relative mb-14 last:mb-0 ${idx % 2 === 0 ? 'text-right pr-[54%] mr-4' : 'text-left pl-[54%] ml-4'}`}>
                  <AnimatedSection animation={idx % 2 === 0 ? 'left' : 'right'}>
                    {/* Year Round Bubble */}
                    <div className={`absolute top-1.5 w-9 h-9 rounded-full bg-[#111111] text-[#d4af37] border-2 border-[#d4af37] flex items-center justify-center z-25 ${idx % 2 === 0 ? '-right-10' : '-left-10'}`}>
                      <span className="text-[8px] font-bold tracking-wider">{storyItem.year}</span>
                    </div>

                    <div className="bg-white border border-[#eceae4] p-4.5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                      <h3 className="text-sm font-display font-bold text-[#111111] mb-1.5" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                        {storyItem.title}
                      </h3>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-sans font-medium italic">
                        "{storyItem.description}"
                      </p>
                    </div>
                  </AnimatedSection>
                </div>
              ))}
            </div>
            
            {/* Convex shape transition at bottom of cream block */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#111111] pointer-events-none" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />
          </div>

          {/* PART 3: Bottom Concave Landscape Photo */}
          <div className="relative w-full h-[280px] overflow-hidden bg-[#111111]">
            <div className="absolute inset-0">
              <Image 
                src={photo3} 
                alt="Story Cover Bottom" 
                fill 
                className="object-cover scale-105" 
                unoptimized 
              />
              <div className="absolute inset-0 bg-[#111111]/45" />
            </div>
            
            {/* Convex mask to complete the curved block flow */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-transparent pointer-events-none" />
            
            <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
          </div>
        </section>
      )}

      {/* Section 4: Narrative Main Body & Quotes */}
      <section className="py-24 px-8 bg-[#111111] text-center relative">
        <AnimatedSection>
          <p className="text-xs text-white/70 italic leading-relaxed max-w-sm mx-auto font-sans mb-8">
            &ldquo;Dua jiwa namun satu pikiran, dua hati yang berdetak sebagai satu. Pernikahan adalah awal dari kisah perjalanan panjang yang penuh dengan cinta dan harapan.&rdquo;
          </p>
          <p className="text-[10px] text-[#d4af37] tracking-[0.2em] font-bold">— Kisah Dua Hati —</p>
        </AnimatedSection>
        
        <div className="h-px w-24 bg-[#d4af37]/20 mx-auto my-12" />
        
        <AnimatedSection delay="delay-200">
          <p className="text-xs text-white/60 leading-relaxed max-w-sm mx-auto font-sans italic">
            &ldquo;{invitation.greeting || 'Pertemuan dua insan dalam sebuah ikatan suci yang dipenuhi dengan ketulusan dan kasih sayang.'}&rdquo;
          </p>
        </AnimatedSection>
      </section>

      {/* Section 5: Countdown & Date Box */}
      <section id="date" className="py-20 px-6 bg-[#161616] text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_0.5px,transparent_0.5px)] opacity-[0.03] pointer-events-none" style={{ backgroundSize: '24px 24px' }} />
        
        <AnimatedSection>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2 font-bold">Countdown</p>
          <h2 className="text-2xl font-display font-bold text-white mb-10" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Momen Spesial</h2>
        </AnimatedSection>

        {/* Countdown timer widget */}
        <AnimatedSection delay="delay-200" className="mb-10">
          <div className="bg-[#111111] border border-[#d4af37]/35 py-8 px-4 rounded-3xl shadow-xl inline-block w-full max-w-sm">
            <CountdownTimer 
              targetDate={invitation.eventDate} 
              textColor="text-[#d4af37]" 
              labelColor="text-white/40" 
              separatorColor="text-[#d4af37]" 
            />
          </div>
        </AnimatedSection>

        {/* Date Calendar badge */}
        <AnimatedSection animation="scale" delay="delay-300">
          <div className="inline-flex items-center gap-6 border border-[#d4af37]/45 rounded-2xl px-8 py-5 shadow-2xl bg-[#111111] backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#d4af37]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-bold">{dayName}</span>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-display font-bold text-white leading-none">{dayNumber}</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-bold">{monthName}</span>
          </div>
        </AnimatedSection>
      </section>

      {/* Video Embed */}
      <VideoEmbedSection videoUrl={invitation.videoUrl} bgColor="bg-[#161616]" textColor="text-[#d4af37]" title="Wedding Video" />

      {/* Gallery Section */}
      <GallerySection
        photos={galleryPhotos}
        bgColor="bg-[#111111]"
        textColor="text-[#d4af37]"
        borderColor="border-[#d4af37]"
        title="Our Gallery"
      />

      {/* Section 7: Ceremony & Reception Details */}
      <section className="py-24 px-8 bg-[#161616] text-center relative overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        
        <AnimatedSection>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2 font-bold">The Ceremony</p>
          <h2 className="text-2xl font-display font-bold text-white mb-10" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Akad & Resepsi</h2>
        </AnimatedSection>

        <div className="space-y-8 max-w-sm mx-auto">
          {/* Card Event details */}
          <AnimatedSection delay="delay-200">
            <div className="bg-[#111111] border border-[#d4af37]/30 p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />
              <p className="text-[10px] uppercase tracking-widest text-[#d4af37] mb-4 font-bold">Acara Pernikahan</p>
              
              <div className="flex items-center justify-center gap-2 mb-3">
                <CalendarDays className="h-4 w-4 text-[#d4af37]" />
                <p className="text-sm font-semibold text-white/95">{dayName}, {dayNumber} {monthName}</p>
              </div>

              <p className="text-2xl font-display font-bold text-[#d4af37] mb-4" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                {invitation.eventTime}
              </p>

              <div className="h-px w-16 bg-white/10 mx-auto my-4" />
              
              <p className="text-sm text-white font-semibold mb-1">{invitation.venueName}</p>
              <p className="text-xs text-white/50 mb-6">{invitation.venueAddress}</p>
                  <EventActionButtons eventName="Acara Pernikahan" eventDate={invitation.eventDate} eventTime={invitation.eventTime} venueName={invitation.venueName} venueAddress={invitation.venueAddress} />
              
              <a 
                href={mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#d4af37] text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:bg-[#d4af37] hover:text-[#111111] rounded-xl transition-all duration-300"
              >
                <MapPin className="h-4 w-4" />
                Buka Peta Lokasi
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 8: Schedule / Rundown Acara */}
      {invitation.schedule && invitation.schedule.length > 0 && (
        <section className="py-20 px-8 bg-[#111111] relative text-center">
          <AnimatedSection>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2 font-bold">Schedule</p>
            <h2 className="text-2xl font-display font-bold text-white mb-12" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Rangkaian Acara</h2>
          </AnimatedSection>

          <div className="max-w-sm mx-auto relative text-left pl-6">
            {/* Left timeline bar */}
            <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#d4af37] via-[#d4af37]/35 to-transparent" />
            
            {invitation.schedule.map((item: any, idx: number) => (
              <AnimatedSection 
                key={item.id || idx} 
                animation={idx % 2 === 0 ? 'left' : 'right'} 
                delay={`delay-${(idx + 1) * 100}`}
                className="mb-8 last:mb-0"
              >
                <div className="flex items-start gap-5 relative">
                  {/* Timeline bubble */}
                  <div className="w-10 h-10 rounded-full bg-[#161616] border-2 border-[#d4af37] flex items-center justify-center shrink-0 z-10 shadow-lg">
                    <IconMapper name={item.icon} className="h-4 w-4 text-[#d4af37]" />
                  </div>
                  
                  <div className="pt-1">
                    {item.time && (
                      <p className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">{item.time}</p>
                    )}
                    <h4 className="text-sm font-semibold text-white/90 mt-0.5">{item.label}</h4>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Section 9: Integrated Google Map Frame */}
      <section className="py-16 px-6 bg-[#161616]">
        <AnimatedSection>
          <div className="rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-2xl h-[280px]">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }} 
              src={`https://www.google.com/maps?q=${encodeURIComponent(invitation.venueName + ', ' + invitation.venueAddress)}&output=embed`} 
              allowFullScreen 
              title="Interactive Location Map" 
            />
          </div>
        </AnimatedSection>
      </section>

      {/* Section 10: Angpao / Digital Gift */}
      <DigitalGiftSection 
        gifts={(invitation as any).digitalGifts || []} 
        bgColor="bg-[#111111]" 
        textColor="text-[#d4af37]" 
      />

      {/* Section 11: Wishes (RSVP & Doa) */}
      <section id="wishes" className="py-24 px-8 bg-[#161616] text-center relative overflow-hidden">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        
        <AnimatedSection>
          <MessageCircle className="h-5 w-5 text-[#d4af37] mx-auto mb-3" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2 font-bold">Wishes & RSVP</p>
          <h2 className="text-2xl font-display font-bold text-white mb-3" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Ucapan & Konfirmasi</h2>
          <p className="text-xs text-white/50 mb-10 max-w-xs mx-auto font-sans">Sampaikan restu indah Anda dan berikan konfirmasi kehadiran kepada kami.</p>
        </AnimatedSection>

        <AnimatedSection delay="delay-200">
          <WishesSection invitation={invitation} />
        </AnimatedSection>
      </section>

      {/* Section 12: Extra Quotes */}
      <QuotesSection 
        text={invitation.quotes || ''} 
        bgColor="bg-[#111111]" 
        textColor="text-[#d4af37]" 
      />

      {/* Section 13: Closing & Thank you */}
      <section className="py-24 px-8 bg-[#111111] text-center relative overflow-hidden border-t border-[#d4af37]/10">
        <div className="absolute inset-6 border border-[#d4af37]/15 pointer-events-none rounded-2xl" />
        
        <AnimatedSection>
          <Heart className="h-6 w-6 text-[#d4af37] mx-auto mb-6" fill="currentColor" />
        </AnimatedSection>
        
        <AnimatedSection delay="delay-200">
          <p className="text-xs text-white/60 leading-relaxed max-w-sm mx-auto font-sans italic">
            &ldquo;{invitation.closing || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.'}&rdquo;
          </p>
        </AnimatedSection>

        <AnimatedSection delay="delay-400">
          <div className="mt-14">
            <h3 className="text-3xl font-display font-bold text-[#d4af37]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              {invitation.groomName} & {invitation.brideName}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-4 font-semibold">Kami yang berbahagia</p>
            <p className="text-xs text-white/30 mt-1">Serta seluruh keluarga besar kedua mempelai</p>
          </div>
        </AnimatedSection>

        {invitation.tier === 'ULTIMATE' && invitation.qrEnabled !== false && (
          <AnimatedSection delay="delay-500">
            <div className="mt-12 flex flex-col items-center justify-center gap-3 px-6 max-w-sm mx-auto">
              <div className="bg-white p-3.5 rounded-2xl inline-block shadow-lg border border-[#d4af37]/40">
                <SafeQRCodeSVG
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${getCoupleSlug(invitation.groomName, invitation.brideName)}/${invitation.slug}/attendance`}
                  size={130}
                  level="H"
                />
              </div>
              <p className="text-xs text-[#d4af37] font-semibold mt-1">
                QR Code Buku Tamu (Attendance)
              </p>
              <p className="text-[9px] text-white/50 leading-relaxed font-sans max-w-[240px] text-center">
                Pindai QR Code ini untuk melakukan pengisian Buku Tamu secara digital saat menghadiri acara.
              </p>
            </div>
          </AnimatedSection>
        )}
      </section>

      {/* Sticky music widget & Bottom navigation bar when opened */}
      {isOpened && invitation.musicUrl && (
        <SpinningGoldVinyl src={invitation.musicUrl} isPreview={isPreview} />
      )}
      
      
      {/* Decorative safety spacer */}
      <div className="h-12 bg-[#111111]" />
    </div>
  );
}
