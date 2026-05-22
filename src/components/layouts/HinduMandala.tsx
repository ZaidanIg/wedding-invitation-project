'use client';
import { getCoupleSlug } from '@/lib/utils';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, MapPin, Clock, Camera, 
  MessageCircle, Sparkles, ChevronDown, 
  Music, Share2, Users, QrCode, Flower2,
  Home, CalendarDays, Pause
} from 'lucide-react';
import SafeQRCodeSVG from '@/components/SafeQRCodeSVG';
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
  useTier,
  ParallaxSection,
  ParallaxImage,
  DigitalGiftSection,
  IconMapper
} from './shared';

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
        style={{ backgroundColor: '#fffcf5' }}
        className="absolute left-0 top-0 w-1/2 h-full border-r border-amber-200 z-10"
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
      </motion.div>

      {/* Right Door */}
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: '100%', transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
        style={{ backgroundColor: '#fffcf5' }}
        className="absolute right-0 top-0 w-1/2 h-full border-l border-amber-200 z-10"
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
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
          <div className="w-24 h-24 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border-2 border-amber-200 mb-8 relative">
            <Flower2 className="animate-spin-slow drop-shadow-md text-amber-600" size={56} />
          </div>

          <p className="text-amber-700/60 text-[10px] uppercase tracking-[0.6em] mb-8 font-black italic">Om Swastiastu</p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-amber-900 mb-2 leading-tight drop-shadow-sm italic">{groomName}</h1>
          <span className="text-2xl font-serif italic text-amber-600 block my-3">&</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-amber-900 drop-shadow-sm italic">{brideName}</h1>
          
          <div className="flex items-center justify-center gap-4 my-10">
            <div className="h-px w-10 bg-amber-200" />
            <Heart className="h-3 w-3 text-amber-400 animate-heartbeat" fill="currentColor" />
            <div className="h-px w-10 bg-amber-200" />
          </div>
          
          <div className="space-y-1.5 mb-10">
            <p className="text-amber-900/40 text-[10px] uppercase tracking-widest font-black mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="text-2xl font-display font-bold text-amber-800 tracking-wide">{guestName}</p>
          </div>
          
          <motion.button 
            onClick={onOpen} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="px-14 py-5 rounded-full bg-amber-800 text-white font-black text-xs tracking-[0.3em] uppercase transition-all hover:bg-amber-900 shadow-2xl cursor-pointer"
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
    <nav className="fixed bottom-0 left-0 right-0 z-[100] w-full max-w-lg mx-auto pointer-events-none px-4 pb-6">
      <div className="flex items-center justify-around bg-white/90 backdrop-blur-2xl rounded-2xl border border-amber-100 px-2 py-2 shadow-2xl pointer-events-auto ring-1 ring-black/5">
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: 'smooth' }); }}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-500 ${active === i.id ? 'text-amber-600 bg-amber-50 shadow-sm' : 'text-amber-900/40 hover:text-amber-900/70'}`}>
            <i.icon className="h-4 w-4" /><span className="text-[8px] font-black uppercase tracking-widest">{i.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function HinduMandala({ invitation, isPreview = false }: { invitation: Invitation; isPreview?: boolean }) {
  const { tier } = useTier();
  const [matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const { formattedDate, dayName, dayNumber, monthName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, galleryPhotos, photo2 } = resolvePhotos(invitation);
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
      <div className="w-full max-w-lg mx-auto bg-[#fffcf5] text-amber-900 relative shadow-2xl font-sans h-screen overflow-hidden">
        {/* Left Door */}
        <div 
          style={{ zIndex: 9999, backgroundColor: '#fffcf5' }}
          className="absolute left-0 top-0 w-1/2 h-full border-r border-amber-200 z-10"
        >
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
        </div>

        {/* Right Door */}
        <div 
          style={{ zIndex: 9999, backgroundColor: '#fffcf5' }}
          className="absolute right-0 top-0 w-1/2 h-full border-l border-amber-200 z-10"
        >
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
        </div>

        {/* Centered Content overlay inside separate flex wrapper */}
        <div style={{ zIndex: 9999 }} className="absolute inset-0 w-full h-full flex items-center justify-center z-30">
          <div className="flex flex-col items-center px-6 max-w-md text-center">
            <div className="w-24 h-24 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border-2 border-amber-200 mb-8 relative">
              <Flower2 className="animate-spin-slow drop-shadow-md text-amber-600" size={56} />
            </div>

            <p className="text-amber-700/60 text-[10px] uppercase tracking-[0.6em] mb-8 font-black italic">Om Swastiastu</p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-amber-900 mb-2 leading-tight drop-shadow-sm italic">{invitation.groomName}</h1>
            <span className="text-2xl font-serif italic text-amber-600 block my-3">&</span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-amber-900 drop-shadow-sm italic">{invitation.brideName}</h1>
            
            <div className="flex items-center justify-center gap-4 my-10">
              <div className="h-px w-10 bg-amber-200" />
              <div className="h-px w-10 bg-amber-200" />
            </div>
            
            <div className="space-y-1.5 mb-10">
              <p className="text-amber-900/40 text-[10px] uppercase tracking-widest font-black mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="text-2xl font-display font-bold text-amber-800 tracking-wide">{guestName}</p>
            </div>
            
            <button 
              className="px-14 py-5 rounded-full bg-amber-800 text-white font-black text-xs tracking-[0.3em] uppercase transition-all shadow-2xl cursor-pointer"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-lg mx-auto bg-[#fffcf5] text-amber-900 relative shadow-2xl font-sans ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen pb-24'}`}>
      
      <AnimatePresence>
        {!isOpened && <CoverPage groomName={invitation.groomName} brideName={invitation.brideName} guestName={guestName} onOpen={handleOpen} />}
      </AnimatePresence>

      <div className="relative z-0">
        {/* Hero Section */}
        <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
           <div className="absolute inset-0">
             <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom scale-105 opacity-50 grayscale-[0.2]" priority unoptimized />
             <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-[#fffcf5]" />
           </div>
           
           <div className="relative z-10 mt-auto pb-40">
              <AnimatedSection animation="up">
                <Flower2 className="mx-auto text-amber-600 mb-10 animate-spin-slow opacity-80" size={56} />
                <p className="text-amber-700 text-[10px] uppercase tracking-[0.6em] mb-6 font-black italic">The Sacred Union</p>
                <h1 className="text-7xl font-display font-bold text-amber-900 mb-8 drop-shadow-sm leading-tight italic">
                  {invitation.groomName.split(' ')[0]} & {invitation.brideName.split(' ')[0]}
                </h1>
                <div className="h-[1px] w-12 bg-amber-600/30 mx-auto mb-6" />
                <p className="text-amber-700/60 font-black tracking-[0.5em] text-[10px] uppercase">{formattedDate}</p>
              </AnimatedSection>
              
              <TierGate tier={tier} minTier="PREMIUM">
              <div className="mt-16 bg-white/60 backdrop-blur-md p-10 rounded-[4rem] border border-amber-100 shadow-2xl max-w-sm mx-auto ring-1 ring-amber-900/5">
                <CountdownTimer targetDate={invitation.eventDate} textColor="text-amber-900" labelColor="text-amber-700/60" separatorColor="text-amber-600/30" />
              </div>
            </TierGate>
           </div>
        </section>

        {/* Opening Verse */}
        <section className="py-32 px-10 text-center relative overflow-hidden bg-amber-50/40">
           <div className="absolute -right-24 -top-24 text-amber-600/5 rotate-12 pointer-events-none">
              <Flower2 size={320} className="animate-spin-slow" />
           </div>
           <AnimatedSection>
              <Sparkles className="mx-auto text-amber-400 mb-10 opacity-60" size={40} />
              <p className="text-amber-900 text-lg leading-relaxed italic mb-10 font-serif px-6 drop-shadow-sm">
                {invitation.quotes || '"Atmaiva hy atmano bandhur, atmaiva ripur atmanah. The self is the friend of the self, and the self is the enemy of the self."'}
              </p>
              <div className="flex items-center justify-center gap-6">
                 <div className="h-px w-10 bg-amber-300/50" />
                 <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-700">Bhagavad Gita</span>
                 <div className="h-px w-10 bg-amber-300/50" />
              </div>
           </AnimatedSection>
        </section>

        {/* Couple Details */}
        <section id="couple" className="py-40 px-8 bg-white">
           <AnimatedSection className="text-center mb-24">
             <p className="text-[10px] uppercase tracking-[0.5em] text-amber-700 font-black">Divine Couple</p>
           </AnimatedSection>
           <div className="space-y-40">
              <AnimatedSection animation="left" className="text-center">
                 <div className="relative w-64 h-64 mx-auto mb-12">
                    <div className="absolute inset-[-15px] border border-amber-100 rounded-full animate-spin-slow" />
                    <div className="absolute inset-[-8px] border border-amber-200 rounded-full animate-spin-slow [animation-duration:12s]" />
                    <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl ring-1 ring-amber-100">
                      <Image src={invitation.groomPhotoUrl || heroPhoto} alt="G" fill className="object-cover" unoptimized />
                    </div>
                 </div>
                 <h3 className="text-4xl font-display font-bold text-amber-900 mb-3 italic">{invitation.groomName}</h3>
                 <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-6 italic">Mempelai Pria</p>
                 <p className="text-xs text-amber-900/50 leading-relaxed max-w-xs mx-auto italic font-medium">
                   Putra Tercinta dari {invitation.groomParents || 'Bapak & Ibu Parents'}
                 </p>
              </AnimatedSection>

              <AnimatedSection animation="scale" className="flex items-center justify-center py-8">
                 <Heart className="text-amber-300 animate-heartbeat shadow-amber-200" size={40} fill="currentColor" />
              </AnimatedSection>

              <AnimatedSection animation="right" className="text-center">
                 <div className="relative w-64 h-64 mx-auto mb-12">
                    <div className="absolute inset-[-15px] border border-amber-100 rounded-full animate-spin-slow [animation-direction:reverse]" />
                    <div className="absolute inset-[-8px] border border-amber-200 rounded-full animate-spin-slow [animation-duration:12s] [animation-direction:reverse]" />
                    <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl ring-1 ring-amber-100">
                      <Image src={invitation.bridePhotoUrl || heroPhoto} alt="B" fill className="object-cover" unoptimized />
                    </div>
                 </div>
                 <h3 className="text-4xl font-display font-bold text-amber-900 mb-3 italic">{invitation.brideName}</h3>
                 <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-6 italic">Mempelai Wanita</p>
                 <p className="text-xs text-amber-900/50 leading-relaxed max-w-xs mx-auto italic font-medium">
                   Putri Tercinta dari {invitation.brideParents || 'Bapak & Ibu Parents'}
                 </p>
              </AnimatedSection>
           </div>
        </section>

        <ParallaxImage src={photo2} alt="Sacred Portrait" className="h-[60vh]" />

        {/* Love Story */}
        <TierGate 
          tier={invitation.tier} 
          minTier="BASIC"
          
        >
          <LoveStorySection 
            story={invitation.loveStory || []} 
            bgColor="bg-amber-900" 
            accentColor="text-amber-400" 
            textColor="text-white" 
          />
        </TierGate>

        {/* Date for BottomNav */}
        <div id="date" />

        {/* Agenda Section */}
        <section className="py-40 px-8 bg-white relative overflow-hidden">
          <div className="absolute -left-32 bottom-0 text-amber-600/5 rotate-45 pointer-events-none">
              <Flower2 size={400} />
          </div>
          <div className="text-center mb-24">
             <Flower2 className="mx-auto text-amber-600 mb-6 opacity-60 animate-spin-slow" size={48} />
             <p className="text-[10px] uppercase tracking-[0.5em] text-amber-700 font-black mb-4">God's Timing</p>
             <h2 className="text-4xl font-display font-bold text-amber-900 italic">Pawiwahan Acara</h2>
          </div>

          <AnimatedSection animation="scale" className="mb-24">
            <div className="inline-flex items-center gap-12 border-2 border-amber-100 rounded-[4rem] px-16 py-10 shadow-xl bg-[#fffcf5] backdrop-blur-sm mx-auto w-full justify-center ring-1 ring-amber-200/50">
              <span className="text-[10px] uppercase tracking-[0.4em] text-amber-700 font-black italic">{dayName}</span>
              <div className="h-12 w-[1px] bg-amber-200" />
              <span className="text-6xl font-display font-bold text-amber-900">{dayNumber}</span>
              <div className="h-12 w-[1px] bg-amber-200" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-amber-700 font-black italic">{monthName}</span>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 gap-10">
             {(invitation.schedule || [
               { id: '1', label: 'Upacara Adat', time: invitation.eventTime, icon: 'heart' },
               { id: '2', label: 'Resepsi', time: '13:00 - End', icon: 'utensils' }
             ]).map((item: any, idx: number) => (
               <AnimatedSection key={item.id} className="p-12 rounded-[5rem] bg-[#fffcf5] border border-amber-100 hover:shadow-3xl hover:bg-white transition-all duration-700 group ring-1 ring-amber-900/5">
                  <div className="flex justify-between items-start mb-10">
                     <div className="p-6 rounded-[2.5rem] bg-white shadow-xl group-hover:scale-110 transition-transform ring-1 ring-amber-100">
                       <IconMapper name={item.icon} className="text-amber-600" size={32} />
                     </div>
                     <span className="text-[10px] font-black bg-amber-900 text-white px-6 py-2.5 rounded-full uppercase tracking-widest shadow-xl">{item.time}</span>
                  </div>
                  <h4 className="text-3xl font-display font-bold text-amber-900 mb-6 italic leading-tight">{item.label}</h4>
                  <div className="space-y-10">
                    <p className="text-xs text-amber-900/60 leading-relaxed flex items-start gap-4 italic font-medium">
                       <MapPin size={20} className="shrink-0 mt-0.5 text-amber-600" />
                       <span>{invitation.venueName}<br/>{invitation.venueAddress}</span>
                    </p>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      onClick={() => window.open(mapsUrl)}
                      className="w-full py-6 rounded-[2.5rem] bg-white border border-amber-200 text-[10px] font-black uppercase tracking-[0.3em] text-amber-900 hover:bg-amber-900 hover:text-white transition-all shadow-2xl"
                    >
                      Locate Venue
                    </motion.button>
                  </div>
               </AnimatedSection>
             ))}
          </div>
        </section>

        {/* Gallery Section */}
      {/* Video Embed */}
      {(invitation as any).videoUrl && (
        <section className="py-12 px-6 bg-[#fff8f0] relative z-10">
          <AnimatedSection>
            <div className="rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-xl h-[280px]">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }} 
                src={(invitation as any).videoUrl.includes('youtube.com/watch?v=') 
                  ? (invitation as any).videoUrl.replace('watch?v=', 'embed/').split('&')[0] 
                  : (invitation as any).videoUrl.includes('youtu.be/')
                    ? (invitation as any).videoUrl.replace('youtu.be/', 'youtube.com/embed/').split('?')[0]
                    : (invitation as any).videoUrl} 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
                title="Wedding Video" 
              />
            </div>
          </AnimatedSection>
        </section>
      )}

        {galleryPhotos.length > 0 && (
          <section id="gallery" className="py-40 px-4 bg-[#fffcf5] relative">
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
             <AnimatedSection className="text-center mb-24 relative z-10">
               <Camera className="mx-auto text-amber-600 mb-6 opacity-40 animate-pulse" size={48} />
               <p className="text-[10px] uppercase tracking-[0.5em] text-amber-700 font-black italic">Sacred Moments</p>
             </AnimatedSection>
             <div className="grid grid-cols-2 gap-4 relative z-10">
                {galleryPhotos.map((src: string, idx: number) => (
                  <AnimatedSection key={idx} animation="scale" className={idx === 0 ? 'col-span-2' : ''}>
                    <div className={`relative overflow-hidden rounded-[3rem] shadow-3xl border-4 border-white group ${idx === 0 ? 'h-80' : 'h-56'}`}>
                       <Image src={src} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0" unoptimized />
                       <div className="absolute inset-0 bg-amber-900/10 group-hover:opacity-0 transition-opacity" />
                    </div>
                  </AnimatedSection>
                ))}
             </div>
          </section>
        )}

        {/* Ultimate: VIP Mandala Experience */}
        <TierGate 
          tier={invitation.tier} 
          minTier="ULTIMATE"
          
        >
          <section className="py-40 px-8 bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[120px] opacity-60 -mr-64 -mt-64" />
             <div className="max-w-xl mx-auto relative z-10">
                <AnimatedSection className="mb-24 text-center">
                  <div className="inline-flex p-8 rounded-[3rem] bg-amber-50 mb-10 border border-amber-100 shadow-2xl ring-1 ring-amber-900/5">
                    <QrCode className="h-12 w-12 text-amber-600" />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-amber-900 mb-6 italic leading-tight">VIP Digital Mandala</h2>
                  <p className="text-amber-700/60 text-[10px] uppercase tracking-[0.4em] mb-10 font-black">Ultimate Enlightenment</p>
                  <p className="text-amber-900/40 text-xs mx-auto leading-relaxed px-8 italic font-medium">
                    Ensuring every distinguished guest is welcomed with the highest honor through our integrated digital experience.
                  </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 gap-10">
                   <div className="p-12 rounded-[4rem] bg-[#fffcf5] border border-amber-100 flex flex-col items-center text-center shadow-2xl group ring-1 ring-amber-900/5">
                      <QrCode className="h-20 w-20 text-amber-400 mb-12 group-hover:scale-110 transition-transform duration-700" />
                      <h4 className="text-2xl font-display font-bold text-amber-900 mb-4 italic leading-tight">Digital RSVP Pass</h4>
                      <p className="text-xs text-amber-900/50 leading-relaxed mb-12 italic font-medium px-4">Seamless entrance with your unique digital mandala seal.</p>
                      <div className="w-56 h-56 bg-white p-10 rounded-[3.5rem] shadow-inner flex items-center justify-center border border-amber-50 ring-1 ring-amber-900/5">
                         <QrCode className="h-28 w-28 text-stone-100" />
                      </div>
                   </div>

                   <div className="p-12 rounded-[4rem] bg-amber-900 text-white flex flex-col items-center text-center shadow-3xl ring-1 ring-white/10">
                      <Users className="h-14 w-14 text-amber-400 mb-12" />
                      <h4 className="text-2xl font-display font-bold mb-4 italic leading-tight">Exclusive Guest Recognition</h4>
                      <p className="text-xs text-white/50 leading-relaxed mb-12 px-8 italic">Every digital invitation is uniquely crafted to reflect your importance to us.</p>
                      <div className="w-full px-8 py-5 rounded-3xl bg-white/5 border border-white/10 text-[10px] font-mono text-amber-200 truncate shadow-inner">
                         sahinaja.com/u/arya-shanti?to=The+Royal+Family
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </TierGate>

        <DigitalGiftSection gifts={(invitation as any).digitalGifts || []} bgColor="bg-amber-50/30" textColor="text-amber-900" />

        {/* Wishes Section */}
        <section id="wishes" className="py-40 px-8 bg-[#fffcf5]">
           <div className="text-center mb-24">
             <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-amber-100 ring-1 ring-amber-900/5">
               <MessageCircle className="text-amber-600" size={40} />
             </div>
             <h2 className="text-4xl font-display font-bold text-amber-900 italic mb-6 leading-tight">Blessings & Prayers</h2>
             <p className="text-[10px] text-amber-700 uppercase tracking-[0.4em] font-black italic">Doa dari Sahabat & Keluarga</p>
           </div>
           <WishesSection invitation={invitation} />
        </section>

        {/* Footer */}
        <section className="py-56 px-8 text-center bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/fabric-of-the-nation.png')]" />
          <AnimatedSection>
            <Flower2 className="mx-auto text-amber-600 mb-12 animate-spin-slow opacity-80" size={64} />
            <p className="text-lg italic text-amber-900/50 mb-20 max-w-sm mx-auto px-10 font-serif leading-relaxed drop-shadow-sm">
              "When you find a partner who helps you focus on your growth, cherish that person. Marriage is a journey of two souls merging into one divine purpose."
            </p>
            <h3 className="text-6xl font-display font-bold text-amber-900 mb-6 italic leading-tight">
              {invitation.groomName.split(' ')[0]} <br/>
              <span className="text-amber-500 italic font-serif leading-none">&</span> <br/>
              {invitation.brideName.split(' ')[0]}
            </h3>
            <div className="h-[1px] w-24 bg-amber-200 mx-auto mt-16 mb-8" />
            <p className="text-amber-700/60 font-black tracking-[0.7em] uppercase text-[10px] drop-shadow-sm">{formattedDate}</p>
          </AnimatedSection>

          {invitation.tier === 'ULTIMATE' && invitation.qrEnabled !== false && (
            <AnimatedSection delay="delay-500">
              <div className="mt-12 flex flex-col items-center justify-center gap-3 px-6 max-w-sm mx-auto">
                <div className="bg-white p-3.5 rounded-2xl inline-block shadow-lg border border-amber-200">
                  <SafeQRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${getCoupleSlug(invitation.groomName, invitation.brideName)}/${invitation.slug}/attendance`}
                    size={130}
                    level="H"
                    fgColor="#78350f"
                  />
                </div>
                <p className="text-xs text-amber-900 font-semibold mt-1">
                  QR Code Buku Tamu (Attendance)
                </p>
                <p className="text-[9px] text-amber-700/60 leading-relaxed font-sans max-w-[240px] text-center">
                  Pindai QR Code ini untuk melakukan pengisian Buku Tamu secara digital saat menghadiri acara.
                </p>
              </div>
            </AnimatedSection>
          )}
        </section>

        {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} isPlayingProp={isPlaying} onPlayChange={setIsPlaying} />}
        <BottomNav visible={isOpened} hasGallery={galleryPhotos.length > 0} />
      </div>
    </div>
  );
}
