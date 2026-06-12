'use client';
import { getCoupleSlug } from '@/lib/utils';

import { useState, useEffect, useMemo } from 'react';
import { Heart, MapPin, Camera, ChevronDown, MessageCircle, Send, Check } from 'lucide-react';
import SafeQRCodeSVG from '@/components/dashboard/SafeQRCodeSVG';
import type { Invitation, Guest, ScheduleItem } from '@/types';
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
  LoveStorySection, 
  DigitalGiftSection, 
  QuotesSection,
  TIER_RANK,
  TierGate,
  useTier,
  EventActionButtons,
  AudioPlayer
} from './shared';

/* ── Specific Parts for LuxuryEmerald ── */

function GoldParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => { setMounted(true); }, 0);
  }, []);

  const items = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: 10 + Math.random() * 15,
      size: 2 + Math.random() * 4,
    }));
  }, []);

  if (!mounted) return null;

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
    setTimeout(() => { setMounted(true); }, 0);
  }, []);

  const birds = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      startPos: { x: -50, y: 15 + Math.random() * 60 },
      endPos: { x: 450, y: 10 + Math.random() * 80 },
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10,
      scale: 0.4 + Math.random() * 0.4,
    }));
  }, []);

  if (!mounted) return null;

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
  const items = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 20,
      size: `${20 + Math.random() * 40}px`,
      rotate: Math.random() * 360,
    }));
  }, []);
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-20">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: '100dvh', x: item.left, rotate: 0 }}
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
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37]/60 mb-6">Pernikahan</p>
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

function WishesSection({ invitation }: { invitation: Invitation }) {
  const { tier } = useTier();
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
      <div className="max-w-sm mx-auto animate-fade-in">
        <div className="bg-white border-2 border-[#d4af37] p-8 rounded-[2rem] shadow-xl text-center relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-emerald-600 animate-bounce" />
          </div>
          <h3 className="text-lg font-bold text-[#042f2e] mb-2 font-display">Terima Kasih!</h3>
          <p className="text-xs text-stone-500 mb-6 px-2">Kehadiran Anda sangat berarti bagi kami. Berikut QR Code untuk check-in:</p>
          
          <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border border-[#d4af37]/20">
            <SafeQRCodeSVG value={guestId} size={150} level="H" />
          </div>
          
          <p className="mt-6 text-[9px] text-[#042f2e]/60 uppercase tracking-widest leading-loose">
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
    <div className="max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 mb-6 text-left">
        {invitation.rsvpSubmitted ? (
          <div className="p-4 bg-[#042f2e]/10 border border-[#d4af37]/35 rounded-2xl text-center mb-4">
            <p className="text-xs font-bold text-[#042f2e] mb-1">✓ Anda Telah Mengisi RSVP</p>
            <p className="text-[10px] text-[#042f2e]/85 font-semibold">
              Nama: <span className="font-bold text-[#042f2e]">{invitation.rsvpName}</span> • Kehadiran: <span className="font-bold text-[#042f2e]">{invitation.rsvpStatus === 'ATTENDING' ? 'Hadir' : 'Absen'}</span>
            </p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#042f2e] mb-1.5 ml-1">Nama Lengkap</label>
              <input 
                type="text"
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Nama Anda" 
                required
                className="w-full px-4 py-3 bg-white border border-[#d4af37]/20 text-sm text-[#042f2e] placeholder:text-[#042f2e]/30 focus:border-[#d4af37] focus:outline-none transition-colors" 
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#042f2e] mb-1.5 ml-1">Nomor WhatsApp *</label>
              <input 
                type="tel"
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="Contoh: 08123456789" 
                required
                className="w-full px-4 py-3 bg-white border border-[#d4af37]/20 text-sm text-[#042f2e] placeholder:text-[#042f2e]/30 focus:border-[#d4af37] focus:outline-none transition-colors" 
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-[#042f2e] mb-1.5 ml-1">Konfirmasi Kehadiran</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'ATTENDING', label: 'Hadir', icon: '😊' },
                  { id: 'NOT_ATTENDING', label: 'Absen', icon: '😔' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id as any)}
                    className={`py-2.5 rounded-none text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      status === opt.id 
                        ? 'bg-[#042f2e] text-[#d4af37] border-[#042f2e]' 
                        : 'bg-white text-[#042f2e]/75 border-[#d4af37]/35 hover:border-[#d4af37]'
                    }`}
                  >
                    <span className="text-sm">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-[#042f2e] mb-1.5 ml-1">Ucapan & Doa</label>
          <textarea 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Tulis ucapan & doa..." 
            rows={3} 
            required
            className="w-full px-4 py-3 bg-white border border-[#d4af37]/20 text-sm text-[#042f2e] placeholder:text-[#042f2e]/30 focus:border-[#d4af37] focus:outline-none transition-colors resize-none" 
          />
        </div>
        
        <button 
          type="submit"
          disabled={sending || (!invitation.rsvpSubmitted && !name.trim()) || !message.trim() || (!invitation.rsvpSubmitted && !phone.trim())}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#042f2e] text-[#d4af37] text-xs font-bold uppercase tracking-widest hover:bg-[#064e3b] transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          {sending ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </form>

      {wishes.filter(w => w.message).length > 0 && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
          {wishes.filter(w => w.message).map((w: Guest, i: number) => (
            <div key={w.id || i} className="bg-white border border-[#d4af37]/10 p-4 text-left relative">
              <div className="absolute top-3 right-3">
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                  w.rsvpStatus === 'ATTENDING' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-50 text-stone-400'
                }`}>
                  {w.rsvpStatus === 'ATTENDING' ? 'Hadir' : 'Absen'}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#042f2e]">{w.name}</p>
              <p className="text-sm text-[#042f2e]/85 mt-1.5 leading-relaxed">{w.message}</p>
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
  const { tier } = useTier();
  const [isOpened, setIsOpened] = useState(isPreview);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [_matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const { formattedDate, dayNumber, monthName, dayName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, photo2, photo3, galleryPhotos, groomPhoto, bridePhoto } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const to = p.get('to');
    if (to) {
      const decoded = decodeURIComponent(to);
      setTimeout(() => { setGuestName(decoded); }, 0);
      if (invitation.guests) {
        const decodedTo = decoded.trim().toLowerCase();
        const guest = invitation.guests.find(
          (g) => g.name.trim().toLowerCase() === decodedTo
        );
        if (guest) {
          setTimeout(() => setMatchedGuest(guest), 0);
        }
      }
    }
  }, [invitation.guests]);

  const handleOpen = () => {
    setIsOpened(true);
    setIsPlaying(true);
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

      <section id="home" className="relative w-full h-[100dvh] min-h-[600px] flex flex-col items-center justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#042f2e]/80 via-[#042f2e]/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center pb-16 px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37]/70 mb-3">Pernikahan</p>
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
        <AnimatedSection><p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-8">Mempelai Pria & Wanita</p></AnimatedSection>
        <div className="grid grid-cols-1 gap-10">
          <AnimatedSection animation="left">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#d4af37]/30 shadow-lg mb-4 relative">
                <Image src={groomPhoto} alt="Groom" fill className="object-cover" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#042f2e]">{invitation.groomName}</h3>
              <p className="text-xs text-[#042f2e]/70 mt-1">Putra dari</p>
              <p className="text-sm text-[#042f2e]/85">{invitation.groomParents || 'Bapak & Ibu'}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="scale"><Heart className="h-6 w-6 text-[#d4af37] mx-auto" fill="currentColor" /></AnimatedSection>
          <AnimatedSection animation="right">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#d4af37]/30 shadow-lg mb-4 relative">
                <Image src={bridePhoto} alt="Bride" fill className="object-cover" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#042f2e]">{invitation.brideName}</h3>
              <p className="text-xs text-[#042f2e]/70 mt-1">Putri dari</p>
              <p className="text-sm text-[#042f2e]/85">{invitation.brideParents || 'Bapak & Ibu'}</p>
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
          <TierGate tier={tier} minTier="PREMIUM">
          <AnimatedSection><p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-8">Hitung Mundur</p></AnimatedSection>
          <AnimatedSection delay="delay-200">
            <CountdownTimer targetDate={invitation.eventDate} textColor="text-[#042f2e]" labelColor="text-[#042f2e]/40" separatorColor="text-[#d4af37]" />
          </AnimatedSection>
        </TierGate>
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
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2">Acara Pernikahan</p>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Akad & Resepsi</h2>
          </AnimatedSection>
          <AnimatedSection delay="delay-200">
            <div className="bg-white/5 backdrop-blur-sm border border-[#d4af37]/20 p-6 max-w-sm mx-auto">
              <p className="text-lg text-white font-display font-bold">{invitation.eventTime}</p>
              <p className="text-sm text-white/80 mt-2 font-medium">{invitation.venueName}</p>
              <p className="text-xs text-white/50 mt-1">{invitation.venueAddress}</p>
                  <EventActionButtons eventName="Acara Pernikahan" eventDate={invitation.eventDate} eventTime={invitation.eventTime} venueName={invitation.venueName} venueAddress={invitation.venueAddress} />
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
            {invitation.schedule.map((item: ScheduleItem, idx: number) => (
              <AnimatedSection key={item.id || idx} animation={idx % 2 === 0 ? 'left' : 'right'} delay={`delay-${(idx + 1) * 100}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#042f2e] border-2 border-[#d4af37]/40 flex items-center justify-center shrink-0 z-10">
                    <IconMapper name={item.icon} className="h-4 w-4 text-[#d4af37]" />
                  </div>
                  <div className="pt-2">
                    {item.time && <p className="text-xs font-bold text-[#042f2e] uppercase tracking-wider">{item.time}</p>}
                    <p className="text-sm text-[#042f2e]/85">{item.label}</p>
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

      {(invitation as any).videoUrl && (
        <section className="py-12 px-6 bg-[#042f2e]">
          <AnimatedSection>
            <div className="rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-2xl h-[280px]">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }} 
                src={getEmbedUrl((invitation as any).videoUrl)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
                title="Video Pernikahan" 
              />
            </div>
          </AnimatedSection>
        </section>
      )}

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
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-8">Momen Indah Kami</p>
            </AnimatedSection>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {galleryPhotos.map((src: string, idx: number) => (
              <AnimatedSection key={idx} animation="scale" delay={`delay-${(idx + 1) * 100}`} className={idx === 0 ? 'col-span-2' : ''}>
                <div className={`relative overflow-hidden group border border-[#d4af37]/20 ${idx === 0 ? 'h-[250px]' : 'h-[180px]'}`}>
                  <Image src={src} alt={`Gallery ${idx + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
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
          <p className="text-sm text-[#042f2e]/75 mb-6">Sampaikan ucapan dan doa untuk kedua mempelai</p>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <WishesSection invitation={invitation} />
        </AnimatedSection>
      </section>

      <QuotesSection text={invitation.quotes || ''} bgColor="bg-[#faf7f0]" textColor="text-[#042f2e]" />

      <section className="py-24 px-8 bg-[#042f2e] text-center relative overflow-hidden">
        <WaveDivider fill="#faf7f0" position="top" />
        <div className="absolute inset-6 border border-[#d4af37]/15 pointer-events-none" />
        <AnimatedSection><Heart className="h-6 w-6 text-[#d4af37] mx-auto mb-6" fill="currentColor" /></AnimatedSection>
        <AnimatedSection delay="delay-200"><p className="text-base font-serif italic text-white/90 leading-relaxed max-w-sm mx-auto">{invitation.closing}</p></AnimatedSection>
        <AnimatedSection delay="delay-400">
          <div className="mt-10">
            <h3 className="text-3xl font-display font-bold text-white">{invitation.groomName} & {invitation.brideName}</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mt-4">{formattedDate}</p>
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
        <AnimatedSection delay="delay-500"><p className="text-xs text-white/60">Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir</p></AnimatedSection>
      </section>

      <div className="h-20 bg-[#042f2e]" />
      {isOpened && invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} isPlayingProp={isPlaying} onPlayChange={setIsPlaying} activeColor="bg-[#d4af37] text-[#042f2e]" inactiveColor="bg-[#042f2e]/80 text-[#d4af37]" />}
      
    </div>
  );
}
