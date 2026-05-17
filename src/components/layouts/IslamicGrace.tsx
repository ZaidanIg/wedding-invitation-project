'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  ChevronDown,
  MessageCircle,
  QrCode,
  Users,
  Link as LinkIcon,
  Send,
  Sparkles
} from 'lucide-react';

const Lantern = ({ className, size = 24 }: { className?: string; size?: number }) => (
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
    <path d="M12 2v2M7 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M8 8l4-4 4 4M9 8v10M15 8v10M12 8v10M7 18l5 4 5-4" />
    <path d="M11 12h2M12 11v2" />
  </svg>
);
import type { Invitation, Guest } from '@/types';
import {
  AnimatedSection,
  LoveStorySection,
  AudioPlayer,
  DetailItem,
  formatEventDate,
  resolvePhotos,
  getMapsUrl,
  Snowfall,
  WaveDivider,
  CountdownTimer,
  DigitalGiftSection,
  QuotesSection,
  GuestWelcome,
  IconMapper,
  TierGate,
  LockedSection,
  WishesSection
} from './shared';
import Button from '@/components/ui/Button';

interface LayoutProps {
  invitation: Invitation;
  isPreview?: boolean;
}

/* ── Decorative Components ── */

function IslamicPattern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`opacity-5 pointer-events-none ${className}`} fill="currentColor">
      <path d="M50 0 L61.8 38.2 L100 50 L61.8 61.8 L50 100 L38.2 61.8 L0 50 L38.2 38.2 Z" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M50 20 L55 35 L70 35 L58 45 L62 60 L50 50 L38 60 L42 45 L30 35 L45 35 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

function IslamicDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-12 opacity-20">
      <div className="h-px w-12 bg-[#c5a059]" />
      <Lantern size={20} className="text-[#c5a059]" />
      <div className="h-px w-12 bg-[#c5a059]" />
    </div>
  );
}

function ArchDivider({ color = "#fcfaf5", flip = false }: { color?: string; flip?: boolean }) {
  return (
    <div className={`w-full h-24 relative z-20 ${flip ? '-mb-1' : '-mt-1'}`} style={{ transform: flip ? 'rotate(180deg)' : 'none' }}>
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full" fill={color}>
        <path d="M0,160 C120,60 360,0 720,0 C1080,0 1320,60 1440,160 L1440,320 L0,320 Z" />
      </svg>
    </div>
  );
}

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
        style={{ backgroundColor: '#1a2b23' }}
        className="absolute left-0 top-0 w-1/2 h-full border-r border-[#c5a059]/30 z-10"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        <div className="absolute inset-6 border-r-0 border border-[#c5a059]/20 pointer-events-none rounded-l-[2.5rem]" />
      </motion.div>

      {/* Right Door */}
      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: '100%', transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
        style={{ backgroundColor: '#1a2b23' }}
        className="absolute right-0 top-0 w-1/2 h-full border-l border-[#c5a059]/30 z-10"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        <div className="absolute inset-6 border-l-0 border border-[#c5a059]/20 pointer-events-none rounded-r-[2.5rem]" />
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
          <div className="w-24 h-24 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center border-2 border-[#c5a059]/30 mb-8 relative animate-pulse-slow">
            <span className="text-5xl font-bold select-none">﷽</span>
          </div>

          <h2 className="text-[#c5a059] uppercase tracking-[0.4em] text-[10px] mb-6 font-sans font-bold">Walimatul Ursy</h2>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 leading-tight">
            {groomName.split(' ')[0]} <br/> <span className="text-2xl font-serif italic text-[#c5a059]/70">&</span> <br/> {brideName.split(' ')[0]}
          </h1>
          
          <div className="flex items-center justify-center gap-3 my-10">
            <div className="h-px w-10 bg-[#c5a059]/40" />
            <Heart className="h-3 w-3 text-[#c5a059] animate-heartbeat" fill="currentColor" />
            <div className="h-px w-10 bg-[#c5a059]/40" />
          </div>
          
          <div className="space-y-1.5 mb-10">
            <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-sans">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="text-2xl font-display font-bold text-[#c5a059] tracking-wide">{guestName}</p>
          </div>
          
          <motion.button 
            onClick={onOpen} 
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(197, 160, 89, 0.4)' }} 
            whileTap={{ scale: 0.95 }}
            className="px-14 py-5 rounded-full bg-[#c5a059] text-[#1a2b23] font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)] cursor-pointer"
          >
            Buka Undangan
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function BottomNav({ visible }: { visible: boolean }) {
  const [active, setActive] = useState('home');
  const items = [
    { id: 'home', icon: 'Home', label: 'Home' },
    { id: 'couple', icon: 'Users', label: 'Mempelai' },
    { id: 'date', icon: 'Calendar', label: 'Tanggal' },
    { id: 'gallery', icon: 'Camera', label: 'Galeri' },
    { id: 'wishes', icon: 'MessageCircle', label: 'Ucapan' },
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
    <nav className="fixed bottom-0 left-0 right-0 z-[500] w-full max-w-lg mx-auto pointer-events-none">
      <div className="mx-3 mb-6 flex items-center justify-around bg-[#1a2b23]/90 backdrop-blur-xl rounded-2xl border border-[#c5a059]/20 px-2 py-2 shadow-2xl pointer-events-auto">
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} onClick={(e: React.MouseEvent) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: 'smooth' }); }}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${active === i.id ? 'text-[#c5a059] bg-[#c5a059]/10' : 'text-white/40 hover:text-white/70'}`}>
            <IconMapper name={i.icon as any} className="h-4 w-4" /><span className="text-[9px] font-medium uppercase tracking-tighter">{i.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function IslamicGrace({ invitation, isPreview = false }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const { formattedDate, dayNumber, monthName, dayName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, photo2, photo3, galleryPhotos, groomPhoto, bridePhoto } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isPreview) {
      const p = new URLSearchParams(window.location.search);
      const to = p.get('to');
      if (to) setGuestName(decodeURIComponent(to));
    }
  }, [isPreview]);

  const handleOpen = () => {
    setIsOpened(true);
    setIsPlaying(true);
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-lg mx-auto bg-[#fdfcf9] text-[#1a2b23] relative shadow-2xl font-serif h-screen overflow-hidden">
        {/* Left Door */}
        <div 
          style={{ zIndex: 9999, backgroundColor: '#1a2b23' }}
          className="absolute left-0 top-0 w-1/2 h-full border-r border-[#c5a059]/30 z-10"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
          <div className="absolute inset-6 border-r-0 border border-[#c5a059]/20 rounded-l-[2.5rem]" />
        </div>

        {/* Right Door */}
        <div 
          style={{ zIndex: 9999, backgroundColor: '#1a2b23' }}
          className="absolute right-0 top-0 w-1/2 h-full border-l border-[#c5a059]/30 z-10"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
          <div className="absolute inset-6 border-l-0 border border-[#c5a059]/20 rounded-r-[2.5rem]" />
        </div>

        {/* Centered Content overlay inside separate flex wrapper */}
        <div style={{ zIndex: 9999 }} className="absolute inset-0 w-full h-full flex items-center justify-center z-30">
          <div className="flex flex-col items-center px-6 max-w-md text-center">
            <div className="w-24 h-24 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center border-2 border-[#c5a059]/30 mb-8 relative animate-pulse-slow">
              <span className="text-5xl font-bold select-none">﷽</span>
            </div>

            <h2 className="text-[#c5a059] uppercase tracking-[0.4em] text-[10px] mb-6 font-sans font-bold">Walimatul Ursy</h2>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 leading-tight">
              {invitation.groomName.split(' ')[0]} <br/> <span className="text-2xl font-serif italic text-[#c5a059]/70">&</span> <br/> {invitation.brideName.split(' ')[0]}
            </h1>
            
            <div className="flex items-center justify-center gap-3 my-10">
              <div className="h-px w-10 bg-[#c5a059]/40" />
              <div className="h-px w-10 bg-[#c5a059]/40" />
            </div>
            
            <div className="space-y-1.5 mb-10">
              <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-sans">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="text-2xl font-display font-bold text-[#c5a059] tracking-wide">{guestName}</p>
            </div>
            
            <button 
              className="px-14 py-5 rounded-full bg-[#c5a059] text-[#1a2b23] font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-[0_10px_20px_rgba(197,160,89,0.2)]"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-lg mx-auto bg-[#fdfcf9] text-[#1a2b23] relative shadow-2xl font-serif ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Snowfall />

      <AnimatePresence>
        {!isOpened && <CoverPage groomName={invitation.groomName} brideName={invitation.brideName} guestName={guestName} onOpen={handleOpen} />}
      </AnimatePresence>

      <div className="relative z-0">
        {/* Hero Section */}
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
             <Image src={heroPhoto} alt="Couple" fill className="object-cover brightness-[0.7]" priority unoptimized />
             <div className="absolute inset-0 bg-gradient-to-b from-[#1a2b23]/40 via-transparent to-[#fdfcf9]" />
          </div>
          
          <div className="relative z-10 text-center px-4">
             <AnimatedSection animation="up">
                <span className="text-white text-6xl mb-8 block drop-shadow-lg">﷽</span>
                <p className="text-white/90 uppercase tracking-[0.5em] text-[10px] mb-8 font-sans font-bold">Walimatul Ursy</p>
                <h2 className="text-5xl font-display font-bold text-white mb-8 drop-shadow-2xl tracking-tighter text-balance">
                  {invitation.groomName.split(' ')[0]} <span className="text-[#c5a059] italic">&</span> {invitation.brideName.split(' ')[0]}
                </h2>
                <div className="inline-flex items-center gap-4 px-10 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-sans tracking-[0.3em] text-xs uppercase font-bold">
                  {formattedDate}
                </div>
             </AnimatedSection>
          </div>
          
          <motion.div animate={{ y: [0, 15, 0], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#c5a059]">
            <ChevronDown size={40} strokeWidth={1} />
          </motion.div>
        </section>

        {/* Intro */}
        <section className="py-24 px-8 text-center bg-[#fdfcf9]">
           <AnimatedSection>
             <p className="text-[#1a2b23] text-4xl mb-6 block">﷽</p>
             <p className="text-sm font-sans tracking-widest uppercase mb-6 text-[#c5a059] font-bold">Assalamu&apos;alaikum WR. WB.</p>
             <p className="text-base text-[#1a2b23]/70 leading-relaxed max-w-sm mx-auto italic">
               {invitation.greeting || '"Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami merangkai kasih sayang dalam ikatan suci pernikahan..."'}
             </p>
           </AnimatedSection>
           <IslamicDivider />
        </section>

        {/* The Couple */}
        <section id="couple" className="py-24 px-8 bg-[#1a2b23] text-white relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/islamic-art.png")' }} />
           
           <div className="max-w-4xl mx-auto relative z-10">
              <AnimatedSection className="text-center mb-16">
                 <h2 className="text-3xl font-display font-bold mb-4">Mempelai</h2>
                 <div className="flex items-center justify-center gap-3">
                   <div className="h-px w-8 bg-[#c5a059]" /><Heart size={16} className="text-[#c5a059]" fill="currentColor" /><div className="h-px w-8 bg-[#c5a059]" />
                 </div>
              </AnimatedSection>

              <div className="space-y-24">
                 <div className="flex flex-col items-center text-center">
                    <AnimatedSection animation="scale" className="relative mb-8">
                       <div className="w-48 h-64 rounded-[3rem] overflow-hidden border-8 border-[#c5a059]/10 shadow-2xl">
                          <Image src={groomPhoto} alt="Groom" fill className="object-cover" unoptimized />
                       </div>
                       <IslamicPattern className="absolute -bottom-6 -left-6 w-24 h-24 text-[#c5a059]" />
                    </AnimatedSection>
                    <AnimatedSection animation="up">
                       <h3 className="text-3xl font-display font-bold mb-2">{invitation.groomName}</h3>
                       <p className="text-xs uppercase tracking-widest text-[#c5a059] mb-4">Putra Dari</p>
                       <p className="text-lg text-white/70 italic">{invitation.groomParents || 'Bapak & Ibu'}</p>
                    </AnimatedSection>
                 </div>

                 <div className="flex flex-col items-center text-center">
                    <AnimatedSection animation="scale" className="relative mb-8">
                       <div className="w-48 h-64 rounded-[3rem] overflow-hidden border-8 border-[#c5a059]/10 shadow-2xl">
                          <Image src={bridePhoto} alt="Bride" fill className="object-cover" unoptimized />
                       </div>
                       <IslamicPattern className="absolute -top-6 -right-6 w-24 h-24 text-[#c5a059] rotate-90" />
                    </AnimatedSection>
                    <AnimatedSection animation="up">
                       <h3 className="text-3xl font-display font-bold mb-2">{invitation.brideName}</h3>
                       <p className="text-xs uppercase tracking-widest text-[#c5a059] mb-4">Putri Dari</p>
                       <p className="text-lg text-white/70 italic">{invitation.brideParents || 'Bapak & Ibu'}</p>
                    </AnimatedSection>
                 </div>
              </div>
           </div>
        </section>

        {/* Love Story */}
        <TierGate 
          tier={invitation.tier} 
          minTier="PREMIUM"
          fallback={isPreview ? <LockedSection title="Love Story Timeline" requiredTier="Premium" className="my-24 mx-6" /> : null}
        >
          <LoveStorySection 
            story={invitation.loveStory || []} 
            bgColor="bg-[#fdfcf9]" 
            accentColor="text-[#c5a059]" 
            textColor="text-[#1a2b23]" 
          />
        </TierGate>

        {/* Agenda */}
        <section id="date" className="py-24 px-8 bg-[#1a2b23] relative">
           <div className="max-w-md mx-auto text-center relative z-10 text-white">
              <AnimatedSection>
                <h2 className="text-3xl font-display font-bold mb-12">Agenda Acara</h2>
                <div className="mb-16">
                   <CountdownTimer targetDate={invitation.eventDate} textColor="text-white" labelColor="text-white/40" separatorColor="text-[#c5a059]" />
                </div>
              </AnimatedSection>
              
              <div className="space-y-12">
                 {(invitation.schedule || [
                   { id: '1', label: 'Akad Nikah', time: invitation.eventTime, icon: 'heart' },
                   { id: '2', label: 'Resepsi', time: '11:00 - Selesai', icon: 'utensils' }
                 ]).map((item, idx) => (
                   <AnimatedSection key={item.id} delay={`delay-${idx * 200}`} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                      <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 flex items-center justify-center mb-6 mx-auto">
                        <IconMapper name={item.icon} size={24} className="text-[#c5a059]" />
                      </div>
                      <h4 className="text-2xl font-display font-bold text-white mb-2">{item.label}</h4>
                      <p className="text-sm font-bold text-[#c5a059] mb-4 uppercase tracking-[0.2em]">{item.time}</p>
                      <p className="text-xs text-white/50 mb-8 italic">{invitation.venueName}<br/>{invitation.venueAddress}</p>
                      <Button onClick={() => window.open(mapsUrl)} className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full py-4 text-[10px] tracking-widest uppercase">
                        Buka Google Maps
                      </Button>
                   </AnimatedSection>
                 ))}
              </div>
           </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="py-24 px-4 bg-[#fdfcf9]">
           <AnimatedSection className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-[#1a2b23] mb-4">Galeri Momen</h2>
              <div className="h-px w-16 bg-[#c5a059] mx-auto" />
           </AnimatedSection>
           
           <div className="grid grid-cols-2 gap-2">
              {galleryPhotos.map((src: string, idx: number) => (
                <AnimatedSection key={idx} animation="scale" className={idx === 0 ? 'col-span-2' : ''}>
                  <div className={`relative overflow-hidden rounded-3xl ${idx === 0 ? 'h-72' : 'h-48'} border-4 border-white shadow-xl`}>
                     <Image src={src} alt="Gallery" fill className="object-cover" unoptimized />
                  </div>
                </AnimatedSection>
              ))}
           </div>
        </section>

        {/* VIP Section */}
        <TierGate 
          tier={invitation.tier} 
          minTier="ULTIMATE"
          fallback={isPreview ? <LockedSection title="VIP Guest Features" requiredTier="Ultimate" className="my-24 mx-6" /> : null}
        >
          <section className="py-24 px-8 bg-white text-center">
             <AnimatedSection className="mb-12">
                <Sparkles className="h-10 w-10 text-[#c5a059] mx-auto mb-6" />
                <h2 className="text-3xl font-display font-bold text-[#1a2b23] mb-4">VIP Guest Experience</h2>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">Sistem manajemen tamu eksklusif untuk kemudahan registrasi dan personalisasi undangan Anda.</p>
             </AnimatedSection>
             
             <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                <div className="p-8 rounded-[2.5rem] bg-stone-50 border border-stone-100 text-left">
                   <QrCode className="h-8 w-8 text-[#c5a059] mb-4" />
                   <h4 className="text-lg font-bold text-[#1a2b23] mb-2">Digital Check-in</h4>
                   <p className="text-xs text-stone-500 leading-relaxed">Gunakan QR Code eksklusif Anda untuk registrasi cepat di lokasi acara. Praktis, modern, dan tanpa antrean buku tamu fisik.</p>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-stone-50 border border-stone-100 text-left">
                   <Users className="h-8 w-8 text-[#c5a059] mb-4" />
                   <h4 className="text-lg font-bold text-[#1a2b23] mb-2">Personalized Greeting</h4>
                   <p className="text-xs text-stone-500 leading-relaxed">Nama tamu Anda akan muncul secara personal di halaman pembuka, memberikan kesan penyambutan yang hangat dan eksklusif.</p>
                </div>
             </div>
          </section>
        </TierGate>

        {/* Gift */}
        <DigitalGiftSection gifts={(invitation as any).digitalGifts || []} bgColor="bg-[#fdfcf9]" textColor="text-[#1a2b23]" />

        {/* Wishes */}
        <section id="wishes" className="py-24 px-8 bg-stone-50">
           <div className="text-center mb-16">
             <MessageCircle className="h-10 w-10 text-[#c5a059] mx-auto mb-6 opacity-30" />
             <h2 className="text-3xl font-display font-bold text-[#1a2b23] mb-4">RSVP & Wishes</h2>
             <p className="text-xs text-stone-400">Kehadiran dan doa restu Anda adalah kado terindah bagi kami.</p>
           </div>
           <WishesSection invitation={invitation} />
        </section>

        {/* Footer */}
        <section className="py-32 px-8 bg-[#1a2b23] text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/islamic-art.png")' }} />
          
          <AnimatedSection>
            <span className="text-white text-6xl mb-12 block drop-shadow-lg">﷽</span>
            <p className="text-lg italic opacity-80 max-w-sm mx-auto leading-relaxed mb-16">
              {invitation.closing || '"Tiada kata yang dapat kami ungkapkan selain terima kasih atas kehadiran dan doa restu Anda semua..."'}
            </p>
            
            <div className="flex items-center justify-center gap-6 mb-16">
              <div className="h-px w-16 bg-[#c5a059]/30" />
              <Heart size={24} className="text-[#c5a059]" fill="currentColor" />
              <div className="h-px w-16 bg-[#c5a059]/30" />
            </div>

            <h3 className="text-4xl font-display font-bold mb-4">
              {invitation.groomName.split(' ')[0]} <span className="text-[#c5a059]">&</span> {invitation.brideName.split(' ')[0]}
            </h3>
            <p className="text-[#c5a059] font-sans font-bold tracking-[0.5em] uppercase text-xs">{formattedDate}</p>
          </AnimatedSection>
        </section>

        <BottomNav visible={isOpened} />
        {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} isPlayingProp={isPlaying} onPlayChange={setIsPlaying} activeColor="bg-[#c5a059] text-[#1a2b23]" inactiveColor="bg-white/10 text-white backdrop-blur-sm" />}
      </div>
    </div>
  );
}
