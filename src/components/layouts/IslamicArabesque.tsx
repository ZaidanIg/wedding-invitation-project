'use client';
import { getCoupleSlug } from '@/lib/utils';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import type { Invitation, Guest } from '@/types';
import SafeQRCodeSVG from '@/components/dashboard/SafeQRCodeSVG';
import {
  AnimatedSection,
  LoveStorySection,
  AudioPlayer,
  formatEventDate,
  resolvePhotos,
  getMapsUrl,
  IconMapper,
  CountdownTimer,
  TierGate,
  WishesSection,
  EventActionButtons,
  
  GallerySection,
  VideoEmbedSection,
} from './shared';

const ArabesquePattern = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 0 C60 20 80 20 100 20 C80 40 80 60 100 80 C80 80 60 80 50 100 C40 80 20 80 0 80 C20 60 20 40 0 20 C20 20 40 20 50 0 Z" opacity="0.1" />
  </svg>
);

function CoverPage({ groomName, brideName, guestName, onOpen }: {
  groomName: string; brideName: string; guestName: string; onOpen: () => void;
}) {
  return (
    <motion.div exit={{ y: '-100%', opacity: 0, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
      className="absolute inset-0 z-[600] bg-[#0f766e] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
          <ArabesquePattern className="absolute top-0 left-0 w-64 h-64" />
          <ArabesquePattern className="absolute bottom-0 right-0 w-64 h-64 rotate-180" />
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative z-10">
        <div className="w-20 h-20 rounded-full border border-[#2dd4bf]/20 flex items-center justify-center mb-10 mx-auto">
           <Sparkles className="text-[#2dd4bf] opacity-40" size={32} />
        </div>
        <h2 className="text-[#2dd4bf] uppercase tracking-[0.4em] text-[10px] mb-8 font-bold">Walimatul Ursy</h2>
        <div className="flex items-center justify-center gap-6 mb-12">
            <div className="w-px h-12 bg-[#2dd4bf]/30" />
            <h1 className="text-5xl font-display font-bold text-white leading-tight">
              {groomName.split(' ')[0]} <br/>
              <span className="text-[#2dd4bf] font-serif text-3xl font-normal">&</span> <br/>
              {brideName.split(' ')[0]}
            </h1>
            <div className="w-px h-12 bg-[#2dd4bf]/30" />
        </div>
        <p className="text-[#2dd4bf]/60 text-xs mb-2">Kepada Yth.</p>
        <p className="text-xl font-display font-semibold text-white mb-10 italic">{guestName}</p>
        <button onClick={onOpen}
          className="group relative px-10 py-4 bg-white text-[#0f766e] rounded-2xl font-bold text-xs tracking-widest uppercase overflow-hidden transition-all hover:pr-14">
          <span className="relative z-10">Buka Undangan</span>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={16} />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function IslamicArabesque({ invitation, isPreview = false }: { invitation: Invitation; isPreview?: boolean }) {
  const [isOpened, setIsOpened] = useState(isPreview);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [_matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const { formattedDate } = formatEventDate(invitation.eventDate);
  const { heroPhoto, galleryPhotos } = resolvePhotos(invitation);
  const _mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

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

  return (
    <div className={`w-full max-w-lg mx-auto bg-[#f0fdfa] text-stone-800 relative shadow-2xl font-sans ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      <AnimatePresence>
        {!isOpened && <CoverPage groomName={invitation.groomName} brideName={invitation.brideName} guestName={guestName} onOpen={() => setIsOpened(true)} />}
      </AnimatePresence>

      <div className="relative">
        {/* Hero */}
        <section id="home" className="relative h-[90vh] flex items-end justify-center pb-24 overflow-hidden">
           <div className="absolute inset-0">
              <Image src={heroPhoto} alt="Couple" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f0fdfa] via-[#f0fdfa]/40 to-transparent" />
           </div>
           
           <div className="relative z-10 text-center px-6">
              <AnimatedSection animation="up">
                <div className="inline-block p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-xl shadow-[#2dd4bf]/10 mb-8">
                   <Sparkles className="text-[#2dd4bf]" size={32} />
                </div>
                <h1 className="text-5xl font-display font-bold text-[#0f766e] mb-4 text-balance">
                  {invitation.groomName.split(' ')[0]} & {invitation.brideName.split(' ')[0]}
                </h1>
                <p className="text-[#2dd4bf] font-bold tracking-[0.3em] text-[10px] uppercase">{formattedDate}</p>
              </AnimatedSection>

              <div className="mt-12">
                <TierGate 
                  tier={invitation.tier} 
                  minTier="BASIC"
                  
                >
                  <AnimatedSection delay="delay-200">
                    <CountdownTimer targetDate={invitation.eventDate} textColor="text-[#0f766e]" labelColor="text-[#2dd4bf]" separatorColor="text-[#2dd4bf]" />
                  </AnimatedSection>
                </TierGate>
              </div>
           </div>
        </section>

        {/* Intro */}
        <section className="py-24 px-8 text-center relative bg-white">
          <ArabesquePattern className="absolute top-0 left-0 w-32 h-32 text-[#2dd4bf]" />
          <ArabesquePattern className="absolute top-0 right-0 w-32 h-32 text-[#2dd4bf] rotate-90" />
          
          <AnimatedSection>
            <div className="mb-16">
              <span className="text-[#2dd4bf] text-4xl mb-6 block">﷽</span>
              <p className="text-stone-500 text-sm italic leading-relaxed max-w-xs mx-auto">
                {invitation.greeting || '"Dan jadikanlah di antara mereka rasa cinta dan kasih sayang..."'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-12">
              <div className="p-8 rounded-[2.5rem] bg-[#f0fdfa] border border-[#2dd4bf]/10">
                 <h3 className="text-2xl font-display font-bold text-[#0f766e] mb-2">{invitation.groomName}</h3>
                 <p className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-widest mb-2">Putra Dari</p>
                 <p className="text-sm text-stone-400 italic">{invitation.groomParents || 'Bapak & Ibu'}</p>
              </div>
              <div className="flex items-center justify-center"><Heart className="text-[#2dd4bf] animate-pulse" fill="currentColor" /></div>
              <div className="p-8 rounded-[2.5rem] bg-[#f0fdfa] border border-[#2dd4bf]/10">
                 <h3 className="text-2xl font-display font-bold text-[#0f766e] mb-2">{invitation.brideName}</h3>
                 <p className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-widest mb-2">Putri Dari</p>
                 <p className="text-sm text-stone-400 italic">{invitation.brideParents || 'Bapak & Ibu'}</p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Love Story */}
        <TierGate 
          tier={invitation.tier} 
          minTier="BASIC"
          
        >
          <LoveStorySection 
            story={invitation.loveStory || []} 
            bgColor="bg-[#0f766e]" 
            accentColor="text-[#2dd4bf]" 
            textColor="text-white" 
          />
        </TierGate>

        {/* Agenda */}
        <section id="date" className="py-24 px-8 bg-white">
          <div className="space-y-6">
             {(invitation.schedule || [
               { id: '1', label: 'Akad Nikah', time: invitation.eventTime, icon: 'heart' },
               { id: '2', label: 'Resepsi', time: '11:00 - Selesai', icon: 'utensils' }
             ]).map((item, idx) => (
               <AnimatedSection key={item.id} delay={`delay-${idx * 200}`} className="p-8 rounded-[2rem] bg-[#f0fdfa] border-l-4 border-[#2dd4bf]">
                  <div className="flex justify-between items-start mb-6">
                     <IconMapper name={item.icon} size={24} className="text-[#2dd4bf]" />
                     <span className="text-[10px] font-bold bg-[#2dd4bf]/10 text-[#0f766e] px-3 py-1 rounded-full uppercase tracking-widest">{item.time}</span>
                  </div>
                  <h4 className="text-xl font-display font-bold text-[#0f766e] mb-2">{item.label}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed mb-6">{invitation.venueName}<br/>{invitation.venueAddress}</p>
                  <EventActionButtons eventName={item.label} eventDate={invitation.eventDate} eventTime={item.time} venueName={invitation.venueName} venueAddress={invitation.venueAddress} />
               </AnimatedSection>
             ))}
          </div>
        </section>

        {/* Gallery */}
        <GallerySection
          photos={galleryPhotos}
          bgColor="bg-[#f0fdfa]"
          textColor="text-[#0f766e]"
          borderColor="border-[#2dd4bf]"
          title="Momen Bahagia"
        />

        <VideoEmbedSection videoUrl={invitation.videoUrl} bgColor="bg-[#0f766e]" textColor="text-[#2dd4bf]" title="Kisah Kami" />

        {/* RSVP & Wishes */}
        <section id="wishes" className="py-24 px-8 bg-white">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-display font-bold text-[#0f766e] mb-4">RSVP & Ucapan</h2>
             <p className="text-xs text-stone-400">Kehadiran Anda adalah kehormatan bagi kami.</p>
           </div>
           <WishesSection invitation={invitation} />
        </section>

        {/* Footer */}
        <section className="py-32 px-8 text-center relative bg-[#f0fdfa]">
          <ArabesquePattern className="absolute bottom-0 left-0 w-32 h-32 text-[#2dd4bf] rotate-[-90deg]" />
          <ArabesquePattern className="absolute bottom-0 right-0 w-32 h-32 text-[#2dd4bf] rotate-180" />
          
          <AnimatedSection>
            <p className="text-sm italic text-stone-500 mb-12 max-w-xs mx-auto">
              {invitation.closing || '"Terima kasih atas doa restu Anda semua..."'}
            </p>
            <h3 className="text-4xl font-display font-bold text-[#0f766e] mb-6">
              {invitation.groomName.split(' ')[0]} & {invitation.brideName.split(' ')[0]}
            </h3>
            <p className="text-[#2dd4bf] font-bold tracking-[0.5em] uppercase text-[10px]">{formattedDate}</p>

            {invitation.tier === 'ULTIMATE' && invitation.qrEnabled !== false && (
              <div className="mt-12 flex flex-col items-center justify-center gap-3 px-6 max-w-sm mx-auto relative z-10">
                <div className="bg-white p-3.5 rounded-2xl inline-block shadow-lg border border-[#2dd4bf]/40">
                  <SafeQRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${getCoupleSlug(invitation.groomName, invitation.brideName)}/${invitation.slug}/attendance`}
                    size={130}
                    level="H"
                  />
                </div>
                <p className="text-xs text-[#0f766e] font-semibold mt-1">
                  QR Code Buku Tamu (Attendance)
                </p>
                <p className="text-[9px] text-stone-500 leading-relaxed font-sans max-w-[240px] text-center">
                  Pindai QR Code ini untuk melakukan pengisian Buku Tamu secara digital saat menghadiri acara.
                </p>
              </div>
            )}
          </AnimatedSection>
        </section>

        {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} />}
      </div>
    </div>
  );
}
