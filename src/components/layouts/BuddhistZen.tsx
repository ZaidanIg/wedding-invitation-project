'use client';
import { getCoupleSlug } from '@/lib/utils';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, MapPin, Clock, Camera, 
  MessageCircle, Sparkles, ChevronDown, 
  Users, QrCode, Leaf, Wind, Home, CalendarDays, Pause
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Invitation, Guest } from '@/types';
import { 
  formatEventDate, 
  getMapsUrl, 
  resolvePhotos, 
  AnimatedSection, 
  CountdownTimer, 
  LoveStorySection, 
  WishesSection, 
  AudioPlayer,
  TierGate,
  LockedSection
} from './shared';
const LotusIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s-8-4.5-8-11.5S7.5 3 12 3s8 4.5 8 7.5-8 11.5-8 11.5Z" />
    <path d="M12 22s8-4.5 8-11.5S16.5 3 12 3" />
    <path d="M12 22c-2-4-2-4-2-4" />
    <path d="M12 22c2-4 2-4 2-4" />
    <circle cx="12" cy="11" r="1" />
  </svg>
);


function CoverPage({ groomName, brideName, guestName, onOpen }: {
  groomName: string; brideName: string; guestName: string; onOpen: () => void;
}) {
  return (
    <motion.div 
      style={{ zIndex: 9999 }}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto z-[9999]"
    >
      {/* Left Door */}
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: '-100%', transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
        style={{ backgroundColor: '#fdfbf7' }}
        className="absolute left-0 top-0 w-1/2 h-full border-r border-[#a3b18a]/20 z-10"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </motion.div>

      {/* Right Door */}
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: '100%', transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
        style={{ backgroundColor: '#fdfbf7' }}
        className="absolute right-0 top-0 w-1/2 h-full border-l border-[#a3b18a]/20 z-10"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </motion.div>

      {/* Centered Content overlay (z-30) inside separate flex wrapper to avoid Safari flexbug */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.6 } }} 
          transition={{ delay: 0.2, duration: 0.8 }} 
          className="flex flex-col items-center px-6 max-w-md text-center pointer-events-auto"
        >
          <div className="w-24 h-24 rounded-full bg-stone-50 text-[#a3b18a] flex items-center justify-center border-2 border-[#a3b18a]/20 mb-8 relative">
            <LotusIcon className="animate-pulse drop-shadow-md text-[#a3b18a]" size={48} />
          </div>

          <p className="text-[#a3b18a] text-[10px] uppercase tracking-[0.5em] mb-6 font-bold">Namo Buddhaya</p>
          <h1 className="text-4xl font-display font-bold text-[#3d4432] mb-1 leading-tight">{groomName}</h1>
          <span className="text-xl font-serif italic text-[#a3b18a] block my-2">&</span>
          <h1 className="text-4xl font-display font-bold text-[#3d4432]">{brideName}</h1>
          
          <div className="flex items-center justify-center gap-3 my-10">
            <div className="h-px w-10 bg-[#a3b18a]/20" />
            <Leaf className="h-3 w-3 text-[#a3b18a]" />
            <div className="h-px w-10 bg-[#a3b18a]/20" />
          </div>
          
          <div className="space-y-1.5 mb-10">
            <p className="text-[9px] text-[#3d4432]/40 uppercase tracking-[0.2em] font-sans">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="text-2xl font-display font-bold text-[#3d4432] tracking-wide">{guestName}</p>
          </div>
          
          <motion.button 
            onClick={onOpen} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="px-14 py-5 rounded-full bg-[#3d4432] text-white font-bold text-xs tracking-widest uppercase transition-all hover:bg-[#a3b18a] shadow-xl cursor-pointer"
          >
            Buka Undangan
          </motion.button>
        </motion.div>
      </div>
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
    <nav className="fixed bottom-0 left-0 right-0 z-[100] w-full max-w-lg mx-auto pointer-events-none">
      <div className="mx-4 mb-6 flex items-center justify-around bg-white/80 backdrop-blur-xl rounded-2xl border border-[#a3b18a]/20 px-2 py-2 shadow-2xl pointer-events-auto">
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: 'smooth' }); }}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${active === i.id ? 'text-[#a3b18a] bg-[#a3b18a]/10' : 'text-[#3d4432]/40 hover:text-[#3d4432]/70'}`}>
            <i.icon className="h-4 w-4" /><span className="text-[8px] font-bold uppercase tracking-tighter">{i.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function BuddhistZen({ invitation, isPreview = false }: { invitation: Invitation; isPreview?: boolean }) {
  const [matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const { formattedDate } = formatEventDate(invitation.eventDate);
  const { heroPhoto, galleryPhotos } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPreview) {
      const p = new URLSearchParams(window.location.search);
      const to = p.get('to');
      if (to) {
        setGuestName(decodeURIComponent(to));
        if (invitation.guests) {
          const decodedTo = decodeURIComponent(to).trim().toLowerCase();
          const guest = invitation.guests.find(
            (g) => g.name.trim().toLowerCase() === decodedTo
          );
          if (guest) {
            setMatchedGuest(guest);
          }
        }
      }
    }
  }, [isPreview, invitation.guests]);

  const handleOpen = () => {
    setIsOpened(true);
    setIsPlaying(true);
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-lg mx-auto bg-[#fdfbf7] text-[#3d4432] relative shadow-2xl font-sans h-screen overflow-hidden">
        {/* Left Door */}
        <div 
          style={{ zIndex: 9999, backgroundColor: '#fdfbf7' }}
          className="absolute left-0 top-0 w-1/2 h-full border-r border-[#a3b18a]/20 z-10"
        >
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        </div>

        {/* Right Door */}
        <div 
          style={{ zIndex: 9999, backgroundColor: '#fdfbf7' }}
          className="absolute right-0 top-0 w-1/2 h-full border-l border-[#a3b18a]/20 z-10"
        >
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        </div>

        {/* Centered Content overlay inside separate flex wrapper */}
        <div style={{ zIndex: 9999 }} className="absolute inset-0 w-full h-full flex items-center justify-center z-30">
          <div className="flex flex-col items-center px-6 max-w-md text-center">
            <div className="w-24 h-24 rounded-full bg-stone-50 text-[#a3b18a] flex items-center justify-center border-2 border-[#a3b18a]/20 mb-8 relative">
              <LotusIcon className="animate-pulse drop-shadow-md text-[#a3b18a]" size={48} />
            </div>

            <p className="text-[#a3b18a] text-[10px] uppercase tracking-[0.5em] mb-6 font-bold">Namo Buddhaya</p>
            <h1 className="text-4xl font-display font-bold text-[#3d4432] mb-1 leading-tight">{invitation.groomName}</h1>
            <span className="text-xl font-serif italic text-[#a3b18a] block my-2">&</span>
            <h1 className="text-4xl font-display font-bold text-[#3d4432]">{invitation.brideName}</h1>
            
            <div className="flex items-center justify-center gap-3 my-10">
              <div className="h-px w-10 bg-[#a3b18a]/20" />
              <div className="h-px w-10 bg-[#a3b18a]/20" />
            </div>
            
            <div className="space-y-1.5 mb-10">
              <p className="text-[9px] text-[#3d4432]/40 uppercase tracking-[0.2em] font-sans">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="text-2xl font-display font-bold text-[#3d4432] tracking-wide">{guestName}</p>
            </div>
            
            <button 
              className="px-14 py-5 rounded-full bg-[#3d4432] text-white font-bold text-xs tracking-widest uppercase transition-all shadow-xl cursor-pointer"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-lg mx-auto bg-[#fdfbf7] text-[#3d4432] relative shadow-2xl font-sans ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      <AnimatePresence>
        {!isOpened && <CoverPage groomName={invitation.groomName} brideName={invitation.brideName} guestName={guestName} onOpen={handleOpen} />}
      </AnimatePresence>

      <div className="relative z-0">
        {/* Hero Section */}
        <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
           <div className="absolute inset-0">
             <Image src={heroPhoto} alt="Couple" fill className="object-cover opacity-30 animate-gentle-zoom grayscale-[0.3]" priority unoptimized />
             <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/50 via-transparent to-[#fdfbf7]" />
           </div>
           
           <div className="relative z-10 mt-auto pb-32">
              <AnimatedSection animation="up">
                <div className="mb-8 opacity-40">
                  <LotusIcon className="mx-auto text-[#3d4432]" size={32} />
                </div>
                <p className="text-[#a3b18a] text-[10px] uppercase tracking-[0.5em] mb-4 font-bold italic">Namo Buddhaya</p>
                <h1 className="text-6xl font-display font-bold text-[#3d4432] mb-6 drop-shadow-sm">
                  {invitation.groomName.split(' ')[0]} & {invitation.brideName.split(' ')[0]}
                </h1>
                <p className="text-[#a3b18a] font-bold tracking-[0.4em] text-[10px] uppercase">{formattedDate}</p>
              </AnimatedSection>
              
              <div className="mt-16 bg-white/40 backdrop-blur-sm p-8 rounded-[3rem] border border-white/60 shadow-sm max-w-sm mx-auto">
                 <CountdownTimer targetDate={invitation.eventDate} textColor="text-[#3d4432]" labelColor="text-[#a3b18a]" separatorColor="text-[#a3b18a]/30" />
              </div>
              <div className="mt-16 animate-bounce"><ChevronDown className="h-6 w-6 text-[#a3b18a]/50 mx-auto" /></div>
           </div>
        </section>

        {/* Opening Quote */}
        <section className="py-24 px-10 text-center relative overflow-hidden bg-white/50">
           <div className="absolute -left-10 top-0 text-[#a3b18a]/5 rotate-12">
              <LotusIcon size={200} />
           </div>
           <AnimatedSection>
              <Leaf className="mx-auto text-[#a3b18a] mb-8 opacity-30" size={24} />
              <p className="text-[#3d4432]/70 text-sm leading-relaxed italic mb-8 font-serif px-6">
                {invitation.quotes || '"In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go of things not meant for you."'}
              </p>
              <div className="flex items-center justify-center gap-4">
                 <div className="h-px w-8 bg-[#a3b18a]/20" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3b18a]">Buddha</span>
                 <div className="h-px w-8 bg-[#a3b18a]/20" />
              </div>
           </AnimatedSection>
        </section>

        {/* Couple Section */}
        <section id="couple" className="py-32 px-8">
           <AnimatedSection className="text-center mb-16">
             <p className="text-[10px] uppercase tracking-[0.3em] text-[#a3b18a] font-bold">The Groom & Bride</p>
           </AnimatedSection>
           <div className="space-y-32">
              <AnimatedSection animation="left" className="text-center relative">
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[120px] font-display font-bold text-[#a3b18a]/5 select-none uppercase tracking-tighter">
                   Groom
                 </div>
                 <div className="relative w-52 h-52 mx-auto mb-10">
                    <div className="absolute inset-0 rounded-full border border-[#a3b18a]/20 animate-spin-slow" />
                    <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <Image src={invitation.groomPhotoUrl || heroPhoto} alt="G" fill className="object-cover" unoptimized />
                    </div>
                 </div>
                 <h3 className="text-3xl font-display font-bold text-[#3d4432] mb-2">{invitation.groomName}</h3>
                 <p className="text-[10px] font-bold text-[#a3b18a] uppercase tracking-[0.3em] mb-4">Mempelai Pria</p>
                 <p className="text-xs text-[#3d4432]/50 leading-relaxed max-w-xs mx-auto">
                   Putra Tercinta dari {invitation.groomParents || 'Bapak & Ibu Parents'}
                 </p>
              </AnimatedSection>

              <div className="flex items-center justify-center py-4">
                 <Wind className="text-[#a3b18a]/20 animate-pulse" size={32} />
              </div>

              <AnimatedSection animation="right" className="text-center relative">
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[120px] font-display font-bold text-[#a3b18a]/5 select-none uppercase tracking-tighter">
                   Bride
                 </div>
                 <div className="relative w-52 h-52 mx-auto mb-10">
                    <div className="absolute inset-0 rounded-full border border-[#a3b18a]/20 animate-spin-slow [animation-direction:reverse]" />
                    <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <Image src={invitation.bridePhotoUrl || heroPhoto} alt="B" fill className="object-cover" unoptimized />
                    </div>
                 </div>
                 <h3 className="text-3xl font-display font-bold text-[#3d4432] mb-2">{invitation.brideName}</h3>
                 <p className="text-[10px] font-bold text-[#a3b18a] uppercase tracking-[0.3em] mb-4">Mempelai Wanita</p>
                 <p className="text-xs text-[#3d4432]/50 leading-relaxed max-w-xs mx-auto">
                   Putri Tercinta dari {invitation.brideParents || 'Bapak & Ibu Parents'}
                 </p>
              </AnimatedSection>
           </div>
        </section>

        {/* Love Story */}
        <LoveStorySection 
          story={invitation.loveStory || []} 
          bgColor="bg-[#3d4432]" 
          accentColor="text-[#a3b18a]" 
          textColor="text-white" 
        />

        {/* Date for BottomNav */}
        <div id="date" />

        {/* Agenda Section */}
        <section className="py-24 px-8 bg-white">
          <div className="text-center mb-16">
             <LotusIcon className="mx-auto text-[#a3b18a] mb-4 opacity-40" size={32} />
             <p className="text-[10px] uppercase tracking-[0.3em] text-[#a3b18a] font-bold mb-2">Save the Date</p>
             <h2 className="text-3xl font-display font-bold text-[#3d4432]">Sacred Union</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
             {(invitation.schedule || [
               { id: '1', label: 'Pemberkatan', time: invitation.eventTime, icon: 'heart' },
               { id: '2', label: 'Resepsi', time: '13:00 - 15:00', icon: 'utensils' }
             ]).map((item: any, idx: number) => (
               <AnimatedSection key={item.id} className="p-8 rounded-[3rem] bg-[#fdfbf7] border border-[#a3b18a]/10 hover:border-[#a3b18a]/30 transition-all duration-700">
                  <div className="flex justify-between items-center mb-8">
                     <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                        <Clock className="text-[#a3b18a]" size={20} />
                     </div>
                     <span className="text-[10px] font-bold bg-[#3d4432] text-white px-4 py-1.5 rounded-full uppercase tracking-widest">{item.time}</span>
                  </div>
                  <h4 className="text-2xl font-display font-bold text-[#3d4432] mb-4">{item.label}</h4>
                  <div className="space-y-6">
                     <p className="text-xs text-[#3d4432]/60 leading-relaxed flex items-start gap-3">
                        <MapPin size={16} className="shrink-0 text-[#a3b18a]" />
                        <span>{invitation.venueName}<br/>{invitation.venueAddress}</span>
                     </p>
                     <button 
                       onClick={() => window.open(mapsUrl)}
                       className="w-full py-4 rounded-2xl bg-white border border-[#a3b18a]/20 text-[10px] font-bold uppercase tracking-widest text-[#3d4432] hover:bg-[#3d4432] hover:text-white transition-all shadow-sm"
                     >
                       View Location
                     </button>
                  </div>
               </AnimatedSection>
             ))}
          </div>
        </section>

        {/* Gallery Section */}
        {galleryPhotos.length > 0 && (
          <section id="gallery" className="py-32 px-4 bg-[#fdfbf7]">
             <AnimatedSection className="text-center mb-12">
               <Camera className="mx-auto text-[#a3b18a] mb-4 opacity-40" size={32} />
               <p className="text-[10px] uppercase tracking-[0.3em] text-[#a3b18a] font-bold">Zen Gallery</p>
             </AnimatedSection>
             <div className="columns-2 gap-3 space-y-3">
                {galleryPhotos.map((src: string, idx: number) => (
                  <AnimatedSection key={idx} animation="scale" className="break-inside-avoid">
                    <div className="relative overflow-hidden rounded-[2rem] shadow-sm grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                       <img src={src} alt="Gallery" className="w-full" />
                    </div>
                  </AnimatedSection>
                ))}
             </div>
          </section>
        )}

        {/* Ultimate: VIP Zen Management */}
        <TierGate 
          tier={invitation.tier} 
          minTier="ULTIMATE"
          fallback={isPreview ? (
            <section className="py-24 px-6 bg-white text-center">
              <LockedSection 
                title="VIP Zen Management" 
                requiredTier="Ultimate" 
                className="max-w-xl mx-auto border-[#a3b18a]/10 bg-[#fdfbf7]/50"
              />
            </section>
          ) : null}
        >
          <section className="py-32 px-8 bg-white relative">
             <div className="max-w-xl mx-auto">
                <AnimatedSection className="mb-20 text-center">
                  <div className="w-16 h-16 rounded-[2rem] bg-[#3d4432] flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <QrCode className="h-8 w-8 text-[#a3b18a]" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-[#3d4432] mb-6">VIP Digital Experience</h2>
                  <p className="text-[#a3b18a] text-[10px] uppercase tracking-widest mb-6">Ultimate Access</p>
                  <p className="text-[#3d4432]/40 text-xs leading-relaxed max-w-xs mx-auto px-4">
                    Seamless digital integration for our most distinguished guests.
                  </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 gap-6">
                   <div className="p-10 rounded-[3rem] bg-[#fdfbf7] border border-[#a3b18a]/10 flex flex-col items-center text-center">
                      <div className="w-48 h-48 bg-white p-8 rounded-[3rem] shadow-sm mb-10 flex items-center justify-center border border-[#a3b18a]/5">
                         <QrCode className="h-24 w-24 text-[#a3b18a]/20" />
                      </div>
                      <h4 className="text-xl font-bold text-[#3d4432] mb-3 italic">Zen Check-in</h4>
                      <p className="text-[10px] text-[#a3b18a] font-bold uppercase tracking-widest mb-2">Digital Pass System</p>
                      <p className="text-xs text-[#3d4432]/40 leading-relaxed">Present your unique code for an effortless welcoming experience.</p>
                   </div>

                   <div className="p-10 rounded-[3rem] bg-[#3d4432] text-white flex flex-col items-center text-center shadow-2xl">
                      <Users className="h-12 w-12 text-[#a3b18a] mb-8" />
                      <h4 className="text-xl font-bold mb-3 italic">Personal Recognition</h4>
                      <p className="text-xs text-white/40 mb-10 leading-relaxed px-4">Each invitation link is individually tailored for every guest.</p>
                      <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-mono text-[#a3b18a] truncate">
                         sahinaja.com/u/siddharta-vasanti?to=Bodhi+Family
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </TierGate>

        {/* Wishes Section */}
        <section id="wishes" className="py-24 px-8 bg-[#fdfbf7]">
           <div className="text-center mb-16">
             <div className="opacity-20 mb-6">
               <MessageCircle className="mx-auto text-[#3d4432]" size={32} />
             </div>
             <h2 className="text-3xl font-display font-bold text-[#3d4432]">Wishes & Blessings</h2>
             <p className="text-[10px] uppercase tracking-[0.3em] text-[#a3b18a] font-bold">Prayers from Friends</p>
           </div>
           <WishesSection invitation={invitation} />
        </section>

        {/* Footer */}
        <section className="py-40 px-8 text-center bg-white relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-[#a3b18a]/20" />
          <AnimatedSection>
            <LotusIcon className="mx-auto text-[#a3b18a] mb-12" size={40} />
            <p className="text-sm italic text-[#3d4432]/50 mb-16 max-w-xs mx-auto font-serif leading-relaxed px-4">
              "Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared."
            </p>
            <h3 className="text-5xl font-display font-bold text-[#3d4432] mb-6 leading-tight">
              {invitation.groomName.split(' ')[0]} <br/>
              <span className="text-[#a3b18a] font-serif italic">&</span> <br/>
              {invitation.brideName.split(' ')[0]}
            </h3>
            <p className="text-[#a3b18a] font-bold tracking-[0.6em] uppercase text-[10px] mt-12">{formattedDate}</p>
          </AnimatedSection>

          {invitation.tier === 'ULTIMATE' && invitation.qrEnabled !== false && (
            <AnimatedSection delay="delay-500">
              <div className="mt-12 flex flex-col items-center justify-center gap-3 px-6 max-w-sm mx-auto">
                <div className="bg-white p-3.5 rounded-[2rem] inline-block shadow-lg border border-[#a3b18a]/30">
                  <QRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${getCoupleSlug(invitation.groomName, invitation.brideName)}/${invitation.slug}/attendance`}
                    size={130}
                    level="H"
                    fgColor="#3d4432"
                  />
                </div>
                <p className="text-xs text-[#3d4432] font-semibold mt-1">
                  QR Code Buku Tamu (Attendance)
                </p>
                <p className="text-[9px] text-[#3d4432]/60 leading-relaxed font-sans max-w-[240px] text-center">
                  Pindai QR Code ini untuk melakukan pengisian Buku Tamu secara digital saat menghadiri acara.
                </p>
              </div>
            </AnimatedSection>
          )}
        </section>

        <div className="h-24 bg-white" />
        {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} isPlayingProp={isPlaying} onPlayChange={setIsPlaying} />}
        <BottomNav visible={isOpened} hasGallery={galleryPhotos.length > 0} />
      </div>
    </div>
  );
}
