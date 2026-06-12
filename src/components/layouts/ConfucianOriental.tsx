'use client';
import { getCoupleSlug } from '@/lib/utils';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPin, 
  MessageCircle, Users, QrCode, Scroll
} from 'lucide-react';
import SafeQRCodeSVG from '@/components/dashboard/SafeQRCodeSVG';
import type { Invitation, Guest, ScheduleItem } from '@/types';
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
  useTier,
  ParallaxImage,
  DigitalGiftSection,
  IconMapper,
  EventActionButtons,
  
  GallerySection,
  VideoEmbedSection,
} from './shared';

function GoldPeonyCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`fill-current text-[#FFD700]/30 absolute ${className}`} width="40" height="40">
      <path d="M0 0 C 15 5, 20 25, 25 35 C 30 20, 50 15, 60 0 C 45 10, 40 30, 35 45 C 50 35, 75 40, 100 30 C 80 40, 60 50, 45 55 C 55 70, 70 85, 90 100 C 70 95, 60 80, 50 65 C 40 80, 20 90, 0 100 C 15 85, 25 70, 30 55 C 15 60, 5 80, 0 100 C 5 75, 20 50, 35 35 C 20 40, 5 30, 0 0 Z" />
    </svg>
  );
}

function CoverPage({ groomName, brideName, guestName, onOpen }: {
  groomName: string; brideName: string; guestName: string; onOpen: () => void;
}) {
  return (
    <motion.div 
      style={{ zIndex: 9999 }}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto "
    >
      {/* Left Door */}
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: '-100%', transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
        style={{ backgroundColor: '#8B0000' }}
        className="absolute left-0 top-0 w-1/2 h-full border-r border-[#FFD700]/30 z-10"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/chinese-lanterns.png')]" />
        <GoldPeonyCorner className="top-8 left-8" />
        <GoldPeonyCorner className="bottom-8 left-8 rotate-270" />
      </motion.div>

      {/* Right Door */}
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: '100%', transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
        style={{ backgroundColor: '#8B0000' }}
        className="absolute right-0 top-0 w-1/2 h-full border-l border-[#FFD700]/30 z-10"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/chinese-lanterns.png')]" />
        <GoldPeonyCorner className="top-8 right-8 rotate-90" />
        <GoldPeonyCorner className="bottom-8 right-8 rotate-180" />
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
          {/* Glowing Double Happiness Crest */}
          <div className="w-28 h-28 rounded-full bg-[#FFD700] text-[#8B0000] flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.5)] border-4 border-[#FFD700] mb-8 relative">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#8B0000]/40 animate-spin-slow" />
            <span className="text-5xl font-display font-bold select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">囍</span>
          </div>

          <p className="text-[#FFD700] text-[10px] uppercase tracking-[0.6em] mb-6 font-black italic drop-shadow-md">Wei De Dong Tian</p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 leading-tight drop-shadow-2xl">{groomName}</h1>
          <span className="text-2xl font-serif italic text-[#FFD700] block my-3 drop-shadow-md">&</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white drop-shadow-2xl">{brideName}</h1>
          
          <div className="flex items-center justify-center gap-4 my-10">
            <div className="h-px w-10 bg-[#FFD700]/30" />
            <Heart className="h-4 w-4 text-[#FFD700] animate-heartbeat" fill="currentColor" />
            <div className="h-px w-10 bg-[#FFD700]/30" />
          </div>
          
          <div className="space-y-1.5 mb-10">
            <p className="text-[9px] text-[#FFD700]/60 uppercase tracking-[0.25em] font-black drop-shadow-sm">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="text-2xl font-display font-semibold text-white drop-shadow-md italic">{guestName}</p>
          </div>
          
          <motion.button 
            onClick={onOpen} 
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' }} 
            whileTap={{ scale: 0.95 }}
            className="px-14 py-5 rounded-full bg-[#FFD700] text-[#8B0000] font-black text-xs tracking-[0.3em] uppercase transition-all shadow-[0_0_30px_rgba(255,215,0,0.35)] cursor-pointer"
          >
            Buka Undangan
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}



export default function ConfucianOriental({ invitation, isPreview = false }: { invitation: Invitation; isPreview?: boolean }) {
  const { tier } = useTier();
  const [_matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpened, setIsOpened] = useState(isPreview);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const { formattedDate, dayName, dayNumber, monthName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, galleryPhotos, photo2 } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  useEffect(() => {
    setTimeout(() => { setMounted(true); }, 0);
  }, []);

  useEffect(() => {
    if (!isPreview) {
      const p = new URLSearchParams(window.location.search);
      const to = p.get('to');
      if (to) {
        setTimeout(() => { setGuestName(decodeURIComponent(to)); }, 0);
        if (invitation.guests) {
          const decodedTo = decodeURIComponent(to).trim().toLowerCase();
          const guest = invitation.guests.find(
            (g) => g.name.trim().toLowerCase() === decodedTo
          );
          if (guest) {
            setTimeout(() => setMatchedGuest(guest), 0);
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
      <div className="w-full max-w-lg mx-auto bg-[#fffcf5] text-[#8B0000] relative shadow-2xl font-sans h-screen overflow-hidden">
        {/* Left Door */}
        <div 
          style={{ zIndex: 9999, backgroundColor: '#8B0000' }}
          className="absolute left-0 top-0 w-1/2 h-full border-r border-[#FFD700]/30 z-10"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/chinese-lanterns.png')]" />
        </div>

        {/* Right Door */}
        <div 
          style={{ zIndex: 9999, backgroundColor: '#8B0000' }}
          className="absolute right-0 top-0 w-1/2 h-full border-l border-[#FFD700]/30 z-10"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/chinese-lanterns.png')]" />
        </div>

        {/* Centered Content overlay inside separate flex wrapper */}
        <div style={{ zIndex: 9999 }} className="absolute inset-0 w-full h-full flex items-center justify-center z-30">
          <div className="flex flex-col items-center px-6 max-w-md text-center">
            {/* Medallion */}
            <div className="w-28 h-28 rounded-full bg-[#FFD700] text-[#8B0000] flex items-center justify-center border-4 border-[#FFD700] mb-8 relative">
              <span className="text-5xl font-display font-bold select-none">囍</span>
            </div>

            <p className="text-[#FFD700] text-[10px] uppercase tracking-[0.6em] mb-6 font-black italic">Wei De Dong Tian</p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 leading-tight">{invitation.groomName.split(' ')[0]}</h1>
            <span className="text-2xl font-serif italic text-[#FFD700] block my-3">&</span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white">{invitation.brideName.split(' ')[0]}</h1>
            
            <div className="flex items-center justify-center gap-4 my-10">
              <div className="h-px w-10 bg-[#FFD700]/30" />
              <div className="h-px w-10 bg-[#FFD700]/30" />
            </div>
            
            <div className="space-y-1.5 mb-10">
              <p className="text-[9px] text-[#FFD700]/60 uppercase tracking-[0.25em] font-black">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="text-2xl font-display font-semibold text-white italic">{guestName}</p>
            </div>
            
            <button 
              className="px-14 py-5 rounded-full bg-[#FFD700] text-[#8B0000] font-black text-xs tracking-[0.3em] uppercase transition-all shadow-[0_0_30px_rgba(255,215,0,0.35)]"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-lg mx-auto bg-[#fffcf5] text-[#8B0000] relative shadow-2xl font-sans ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen pb-24'}`}>
      
      <AnimatePresence>
        {!isOpened && <CoverPage groomName={invitation.groomName} brideName={invitation.brideName} guestName={guestName} onOpen={handleOpen} />}
      </AnimatePresence>

      <div className="relative z-0">
        {/* Hero Section */}
        <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
           <div className="absolute inset-0">
             <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom scale-105 opacity-60 grayscale-[0.1]" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
             <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000]/50 via-transparent to-[#fffcf5]" />
           </div>
           
           <div className="relative z-10 mt-auto pb-40 text-[#8B0000]">
              <AnimatedSection animation="up">
                <Scroll className="mx-auto text-[#8B0000] mb-8 opacity-60" size={56} />
                <p className="text-[10px] uppercase tracking-[0.6em] mb-6 font-black italic">Perayaan Pernikahan</p>
                <h1 className="text-7xl font-display font-bold mb-8 drop-shadow-sm leading-tight italic">
                  {invitation.groomName.split(' ')[0]} & {invitation.brideName.split(' ')[0]}
                </h1>
                <div className="h-[1px] w-12 bg-[#8B0000]/30 mx-auto mb-6" />
                <p className="font-black tracking-[0.5em] text-[10px] uppercase opacity-70">{formattedDate}</p>
              </AnimatedSection>
              
              <TierGate tier={tier} minTier="PREMIUM">
              <div className="mt-16 bg-white/60 backdrop-blur-md p-10 rounded-[4rem] border border-[#8B0000]/10 shadow-2xl max-w-sm mx-auto ring-1 ring-[#8B0000]/5">
                <CountdownTimer targetDate={invitation.eventDate} textColor="text-[#8B0000]" labelColor="text-[#8B0000]/60" separatorColor="text-[#FFD700]" />
              </div>
            </TierGate>
           </div>
        </section>

        {/* Parchment Scroll Letter Section */}
        <section className="py-32 px-6 text-center relative overflow-hidden bg-[#fffcf5]">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/chinese-lanterns.png')]" />
          <AnimatedSection className="max-w-md mx-auto">
            <div className="border-4 border-double border-[#8B0000]/25 rounded-[3.5rem] py-16 px-8 relative bg-white/40 shadow-xl backdrop-blur-sm">
              <GoldPeonyCorner className="top-4 left-4" />
              <GoldPeonyCorner className="top-4 right-4 rotate-90" />
              <GoldPeonyCorner className="bottom-4 left-4 rotate-270" />
              <GoldPeonyCorner className="bottom-4 right-4 rotate-180" />

              <div className="text-center mb-4">
                <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-[#8B0000]/70 font-bold border-b border-[#FFD700]/40 pb-2.5 inline-block uppercase">
                  {invitation.groomName.trim().charAt(0)} & {invitation.brideName.trim().charAt(0)}
                </span>
              </div>

              <span className="text-5xl text-[#FFD700] mb-8 block drop-shadow-md animate-pulse">囍</span>

              {/* Salam Pembuka / Greeting */}
              <div className="mb-10 px-2">
                <p className="text-[#8B0000] text-lg font-serif italic leading-relaxed drop-shadow-sm">
                  {invitation.greeting || 'Dengan penuh hormat dan ucapan syukur, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri perayaan penyatuan cinta kasih kami.'}
                </p>
              </div>

              {/* Decorative Vector Divider */}
              <div className="flex items-center justify-center gap-3 my-8 opacity-40">
                <div className="h-px w-10 bg-[#8B0000]" />
                <Heart size={14} className="text-[#FFD700] animate-heartbeat" fill="currentColor" />
                <div className="h-px w-10 bg-[#8B0000]" />
              </div>

              {/* Isi Undangan / Main Body */}
              <div className="mb-10 px-2">
                <p className="text-sm text-[#8B0000]/95 font-medium leading-relaxed">
                  {invitation.mainBody || 'Penyatuan dua jiwa menjadi satu, melangkah bersama dalam mahligai rumah tangga yang harmonis. Kehadiran Anda adalah berkah dan kehormatan yang tak terhingga bagi kami.'}
                </p>
              </div>

              {/* Elegant Quote (if any) */}
              {(invitation.quotes || invitation.fullText) && (
                <div className="my-10 p-6 rounded-3xl bg-[#8B0000]/5 border border-[#8B0000]/10 italic text-xs text-[#8B0000]/80 font-serif leading-relaxed px-6">
                  {invitation.quotes || invitation.fullText}
                </div>
              )}

              {/* Decorative Vector Divider */}
              <div className="flex items-center justify-center gap-3 my-8 opacity-40">
                <div className="h-px w-10 bg-[#8B0000]" />
                <Heart size={14} className="text-[#FFD700]" fill="currentColor" />
                <div className="h-px w-10 bg-[#8B0000]" />
              </div>

              {/* Salam Penutup / Closing */}
              <div className="px-2">
                <p className="text-sm text-[#8B0000]/80 font-serif italic leading-relaxed">
                  {invitation.closing || 'Atas kehadiran dan doa restu yang tulus dari Anda semua, kami mengucapkan terima kasih yang sebesar-besarnya. Semoga kebahagiaan dan keharmonisan selalu menyertai kita semua.'}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Couple Section */}
        <section id="couple" className="py-40 px-8 bg-white">
           <AnimatedSection className="text-center mb-24">
             <p className="text-[10px] uppercase tracking-[0.5em] text-[#8B0000] font-black">Penyatuan Kedua Keluarga</p>
           </AnimatedSection>
           <div className="space-y-40">
              <AnimatedSection animation="left" className="text-center relative">
                 <div className="relative w-64 h-80 mx-auto mb-12">
                    <div className="absolute inset-[-15px] border-2 border-[#FFD700]/20 rounded-[4rem] rotate-[-6deg]" />
                    <div className="absolute inset-[-8px] border-2 border-[#8B0000]/10 rounded-[3.5rem] rotate-[-3deg]" />
                    <div className="absolute inset-0 rounded-[3rem] overflow-hidden border-8 border-white shadow-3xl ring-1 ring-amber-100">
                      <Image src={invitation.groomPhotoUrl || heroPhoto} alt="G" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                 </div>
                 <h3 className="text-4xl font-display font-bold text-[#8B0000] mb-3 italic">{invitation.groomName}</h3>
                 <p className="text-[10px] font-black text-[#FFD700] bg-[#8B0000] px-6 py-2 inline-block rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl">Mempelai Pria</p>
                 <p className="text-xs text-[#8B0000]/50 leading-relaxed max-w-xs mx-auto italic font-medium">
                   Putra Tercinta dari {invitation.groomParents || 'Bapak & Ibu Parents'}
                 </p>
              </AnimatedSection>

              <AnimatedSection animation="scale" className="flex items-center justify-center py-8">
                 <Heart className="text-[#FFD700] animate-heartbeat drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" size={40} fill="currentColor" />
              </AnimatedSection>

              <AnimatedSection animation="right" className="text-center relative">
                 <div className="relative w-64 h-80 mx-auto mb-12">
                    <div className="absolute inset-[-15px] border-2 border-[#FFD700]/20 rounded-[4rem] rotate-[6deg]" />
                    <div className="absolute inset-[-8px] border-2 border-[#8B0000]/10 rounded-[3.5rem] rotate-[3deg]" />
                    <div className="absolute inset-0 rounded-[3rem] overflow-hidden border-8 border-white shadow-3xl ring-1 ring-amber-100">
                      <Image src={invitation.bridePhotoUrl || heroPhoto} alt="B" fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                 </div>
                 <h3 className="text-4xl font-display font-bold text-[#8B0000] mb-3 italic">{invitation.brideName}</h3>
                 <p className="text-[10px] font-black text-[#FFD700] bg-[#8B0000] px-6 py-2 inline-block rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl">Mempelai Wanita</p>
                 <p className="text-xs text-[#8B0000]/50 leading-relaxed max-w-xs mx-auto italic font-medium">
                   Putri Tercinta dari {invitation.brideParents || 'Bapak & Ibu Parents'}
                 </p>
              </AnimatedSection>
           </div>
        </section>

        <ParallaxImage src={photo2} alt="Wedding Portrait" className="h-[60vh] mb-20" />

        {/* Love Story */}
        <TierGate 
          tier={invitation.tier} 
          minTier="BASIC"
          
        >
          <LoveStorySection 
            story={invitation.loveStory || []} 
            bgColor="bg-[#8B0000]" 
            accentColor="text-[#FFD700]" 
            textColor="text-white" 
          />
        </TierGate>

        {/* Date for BottomNav */}
        <div id="date" />

        {/* Agenda Section */}
        <section className="py-40 px-8 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/chinese-lanterns.png')]" />
          <div className="text-center mb-24 relative z-10">
             <Scroll className="mx-auto text-[#FFD700] mb-8 drop-shadow-md animate-pulse" size={56} />
             <p className="text-[10px] uppercase tracking-[0.5em] text-[#8B0000] font-black mb-4">Rencana Indah Surga</p>
             <h2 className="text-4xl font-display font-bold text-[#8B0000] italic leading-tight">Agenda Pernikahan</h2>
          </div>

          <AnimatedSection animation="scale" className="mb-24 relative z-10">
            <div className="inline-flex items-center gap-12 border-2 border-[#8B0000]/10 rounded-[4rem] px-16 py-10 shadow-2xl bg-[#fffcf5] backdrop-blur-sm mx-auto w-full justify-center ring-1 ring-[#8B0000]/5">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#8B0000] font-black italic">{dayName}</span>
              <div className="h-12 w-[1px] bg-[#FFD700]/30" />
              <span className="text-6xl font-display font-bold text-[#8B0000]">{dayNumber}</span>
              <div className="h-12 w-[1px] bg-[#FFD700]/30" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#8B0000] font-black italic">{monthName}</span>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 gap-10 relative z-10">
             {(invitation.schedule || [
               { id: '1', label: 'Pemberkatan Nikah', time: invitation.eventTime, icon: 'heart' },
               { id: '2', label: 'Resepsi Pernikahan', time: '18:00 - Selesai', icon: 'utensils' }
             ]).map((item: ScheduleItem, _idx: number) => (
               <AnimatedSection key={item.id} className="p-12 rounded-[4rem] bg-[#fffcf5] border border-[#8B0000]/5 hover:border-[#FFD700]/30 transition-all duration-700 group ring-1 ring-[#8B0000]/5">
                  <div className="flex justify-between items-start mb-12">
                     <div className="p-6 rounded-[2.5rem] bg-white shadow-xl group-hover:bg-[#8B0000] transition-all group-hover:text-[#FFD700] ring-1 ring-[#8B0000]/5">
                       <IconMapper name={item.icon} size={32} />
                     </div>
                     <span className="text-[10px] font-black bg-[#8B0000] text-[#FFD700] px-6 py-2.5 rounded-full uppercase tracking-widest shadow-[0_10px_20px_rgba(139,0,0,0.2)]">{item.time}</span>
                  </div>
                  <h4 className="text-3xl font-display font-bold text-[#8B0000] mb-6 italic leading-tight">{item.label}</h4>
                  <div className="space-y-10">
                     <p className="text-xs text-[#8B0000]/60 leading-relaxed flex items-start gap-4 italic font-medium">
                        <MapPin size={20} className="shrink-0 text-[#FFD700]" />
                        <span>{invitation.venueName}<br/>{invitation.venueAddress}</span>
                  <EventActionButtons eventName="Acara Pernikahan" eventDate={invitation.eventDate} eventTime={invitation.eventTime} venueName={invitation.venueName} venueAddress={invitation.venueAddress} />
                     </p>
                     <motion.button 
                       whileHover={{ scale: 1.02 }}
                       onClick={() => window.open(mapsUrl)}
                       className="w-full py-6 rounded-3xl bg-[#8B0000] text-[#FFD700] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-[#8B0000] border border-[#8B0000]/10 transition-all shadow-3xl"
                     >
                       Petunjuk Lokasi
                     </motion.button>
                  </div>
               </AnimatedSection>
             ))}
          </div>
        </section>

        {/* Video Embed */}
        <VideoEmbedSection videoUrl={invitation.videoUrl} bgColor="bg-[#fffcf9]" textColor="text-[#8B0000]" title="Video Pernikahan" />

        {/* Gallery Section */}
        <GallerySection
          photos={galleryPhotos}
          bgColor="bg-[#fffcf5]"
          textColor="text-[#8B0000]"
          borderColor="border-[#FFD700]"
          title="Momen Bahagia"
        />

        {/* Ultimate: VIP Oriental Management */}
        <TierGate 
          tier={invitation.tier} 
          minTier="ULTIMATE"
          
        >
          <section className="py-40 px-8 bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B0000]/5 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60" />
             <div className="max-w-xl mx-auto relative z-10">
                <AnimatedSection className="mb-24 text-center">
                  <div className="inline-flex p-8 rounded-[3rem] bg-[#8B0000] shadow-3xl mb-10 border border-[#FFD700]/20 ring-4 ring-[#8B0000]/5">
                    <QrCode className="h-12 w-12 text-[#FFD700]" />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-[#8B0000] mb-6 italic leading-tight">Akses Digital VIP</h2>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#8B0000]/40 font-black mb-10">Akses Eksklusif</p>
                  <p className="text-[#8B0000]/50 text-xs mx-auto leading-relaxed px-8 italic font-medium">
                    Memastikan sambutan yang khidmat dan mudah bagi para tamu kehormatan melalui layanan digital kami.
                  </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 gap-10">
                   <div className="p-12 rounded-[4rem] bg-[#fffcf5] border border-[#8B0000]/5 flex flex-col items-center text-center shadow-2xl group ring-1 ring-[#8B0000]/5">
                      <div className="w-56 h-56 bg-white p-10 rounded-[4rem] shadow-inner mb-12 flex items-center justify-center border border-[#8B0000]/5 group-hover:scale-105 transition-transform duration-700">
                         <QrCode className="h-28 w-28 text-[#8B0000]/10" />
                      </div>
                      <h4 className="text-2xl font-display font-bold text-[#8B0000] mb-4 italic leading-tight">Buku Tamu Digital</h4>
                      <p className="text-xs text-[#8B0000]/50 leading-relaxed italic font-medium">Tunjukkan kode QR Anda untuk proses penerimaan tamu yang mudah.</p>
                   </div>

                   <div className="p-12 rounded-[4rem] bg-[#8B0000] text-white flex flex-col items-center text-center shadow-3xl ring-1 ring-white/10">
                      <Users className="h-14 w-14 text-[#FFD700] mb-12 drop-shadow-md" />
                      <h4 className="text-2xl font-display font-bold mb-4 italic leading-tight">Undangan Personal</h4>
                      <p className="text-xs text-white/40 mb-12 leading-relaxed px-8 italic">Tautan undangan digital yang dirancang secara khusus untuk setiap tamu kehormatan.</p>
                      <div className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/10 text-[10px] font-mono text-[#FFD700] truncate shadow-inner text-center">
                         sahinaja.com/u/li-wei-meiling?to=The+Chen+Family
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </TierGate>

        <DigitalGiftSection gifts={(invitation as any).digitalGifts || []} bgColor="bg-white/50" textColor="text-[#8B0000]" />

        {/* Wishes Section */}
        <section id="wishes" className="py-40 px-8 bg-[#fffcf5]">
           <div className="text-center mb-24">
             <div className="w-24 h-24 bg-[#8B0000] rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-3xl border border-[#FFD700]/20 rotate-45 group">
               <MessageCircle className="text-[#FFD700] -rotate-45 group-hover:scale-110 transition-transform" size={40} />
             </div>
             <h2 className="text-4xl font-display font-bold text-[#8B0000] italic mb-6 leading-tight">Doa & Ucapan</h2>
             <p className="text-[10px] text-[#8B0000]/40 uppercase tracking-[0.4em] font-black italic">Doa Restu dari Hati</p>
           </div>
           <WishesSection invitation={invitation} />
        </section>

        {/* Footer */}
        <section className="py- px-8 text-center bg-[#8B0000] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/chinese-lanterns.png')]" />
          <AnimatedSection>
            <Scroll className="mx-auto text-[#FFD700] mb-16 opacity-60 animate-pulse" size={64} />
            <p className="text-lg italic text-white/60 mb-20 max-w-sm mx-auto px-10 font-serif leading-relaxed drop-shadow-lg">
              "Saling seia sekata adalah awal dari segala kebaikan. Semoga perjalanan hidup bersama ini diberkahi dengan keharmonisan dan kebahagiaan yang tiada akhir."
            </p>
            <h3 className="text-7xl font-display font-bold text-white mb-6 italic leading-tight drop-shadow-2xl">
              {invitation.groomName.split(' ')[0]} <br/>
              <span className="text-[#FFD700] italic font-serif leading-none">&</span> <br/>
              {invitation.brideName.split(' ')[0]}
            </h3>
            <div className="h-[1px] w-24 bg-[#FFD700]/30 mx-auto mt-16 mb-8" />
            <p className="text-[#FFD700]/70 font-black tracking-[0.7em] uppercase text-[10px] drop-shadow-md">{formattedDate}</p>
          </AnimatedSection>

          {invitation.tier === 'ULTIMATE' && invitation.qrEnabled !== false && (
            <AnimatedSection delay="delay-500">
              <div className="mt-12 flex flex-col items-center justify-center gap-3 px-6 max-w-sm mx-auto">
                <div className="bg-white p-3.5 rounded-3xl inline-block shadow-2xl border-4 border-[#FFD700]">
                  <SafeQRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${getCoupleSlug(invitation.groomName, invitation.brideName)}/${invitation.slug}/attendance`}
                    size={130}
                    level="H"
                    fgColor="#8B0000"
                  />
                </div>
                <p className="text-xs text-[#FFD700] font-semibold mt-1">
                  QR Code Buku Tamu (Attendance)
                </p>
                <p className="text-[9px] text-white/60 leading-relaxed font-sans max-w-[240px] text-center">
                  Pindai QR Code ini untuk melakukan pengisian Buku Tamu secara digital saat menghadiri acara.
                </p>
              </div>
            </AnimatedSection>
          )}
        </section>

        <div className="relative h-24 bg-[#8B0000]" />
        {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} isPlayingProp={isPlaying} onPlayChange={setIsPlaying} />}
        
      </div>
    </div>
  );
}
