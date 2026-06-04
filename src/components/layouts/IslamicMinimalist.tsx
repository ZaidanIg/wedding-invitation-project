'use client';
import { getCoupleSlug } from '@/lib/utils';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  ChevronDown,
  MessageCircle,
  Send,
  Camera,
  QrCode,
  Users,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';
import type { Invitation, Guest } from '@/types';
import SafeQRCodeSVG from '@/components/SafeQRCodeSVG';
import {
  AnimatedSection,
  LoveStorySection,
  AudioPlayer,
  DetailItem,
  formatEventDate,
  resolvePhotos,
  getMapsUrl,
  IconMapper,
  CountdownTimer,
  TierGate,
  DigitalGiftSection,
  QuotesSection,
  WishesSection,
  EventActionButtons,
  OpeningPhraseSection,
  GallerySection,
  VideoEmbedSection,
} from './shared';
import Button from '@/components/ui/Button';

// --- Custom Components for Islamic Minimalist ---

const GeometricPattern = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="0.5">
    <path d="M50 0 L100 50 L50 100 L0 50 Z" />
    <circle cx="50" cy="50" r="30" />
    <path d="M20 20 L80 80 M80 20 L20 80" />
  </svg>
);

const CornerOrnament = ({ className }: { className?: string }) => (
  <div className={`absolute w-16 h-16 pointer-events-none ${className}`}>
    <div className="absolute top-0 left-0 w-full h-[1px] bg-[#d4af37]/40" />
    <div className="absolute top-0 left-0 w-[1px] h-full bg-[#d4af37]/40" />
    <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-[#d4af37]/20" />
  </div>
);



function CoverPage({ groomName, brideName, guestName, onOpen }: {
  groomName: string; brideName: string; guestName: string; onOpen: () => void;
}) {
  return (
    <motion.div exit={{ y: '-100%', opacity: 0, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
      className="absolute inset-0 z-[600] bg-white flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      <div className="absolute inset-8 border border-stone-100 rounded-[2rem] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative z-10">
        <GeometricPattern className="w-24 h-24 text-[#d4af37]/20 mb-12 mx-auto" />
        <h2 className="text-[#d4af37] uppercase tracking-[0.4em] text-xs mb-4 font-sans font-bold">Walimatul Ursy</h2>
        <h1 className="text-4xl font-cinzel font-bold text-stone-800 mb-2 leading-tight">{groomName.split(' ')[0]} & {brideName.split(' ')[0]}</h1>
        <div className="flex items-center justify-center gap-3 my-10">
          <div className="h-px w-10 bg-stone-100" /><Heart className="h-3 w-3 text-stone-200" /><div className="h-px w-10 bg-stone-100" />
        </div>
        <p className="text-xs text-stone-400 mb-1 font-sans">Kepada Yth.</p>
        <p className="text-lg font-cinzel font-semibold text-stone-800 mb-10 italic">{guestName}</p>
        <button onClick={onOpen}
          className="px-12 py-5 rounded-full bg-stone-800 text-white font-sans font-bold text-xs tracking-widest uppercase transition-all hover:bg-[#d4af37] shadow-xl">
          Buka Undangan
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function IslamicClassic({ invitation, isPreview = false }: { invitation: Invitation; isPreview?: boolean }) {
  const [isOpened, setIsOpened] = useState(isPreview);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const { formattedDate } = formatEventDate(invitation.eventDate);
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

  return (
    <div className={`w-full max-w-lg mx-auto bg-[#fdfcf9] text-stone-800 relative shadow-2xl font-outfit ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      <AnimatePresence>
        {!isOpened && <CoverPage groomName={invitation.groomName} brideName={invitation.brideName} guestName={guestName} onOpen={() => setIsOpened(true)} />}
      </AnimatePresence>

      <div className="relative">
        <OpeningPhraseSection
          phrase={invitation.openingPhrase}
          style={invitation.openingStyle}
          textColorClass="text-stone-800"
          bgClass="bg-[#fdfcf9] border-b border-stone-200"
        />
        {/* Hero Section */}
        <section id="home" className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-stone-50">
           <div className="absolute inset-0">
             <Image src={heroPhoto} alt="Couple" fill className="object-cover opacity-40 grayscale-[0.5]" priority unoptimized />
             <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#fdfcf9]" />
           </div>
           
           <div className="relative z-10 text-center px-4">
              <AnimatedSection animation="up">
                <span className="text-stone-800 text-4xl mb-6 block">﷽</span>
                <h1 className="text-5xl font-cinzel font-bold text-stone-800 mb-4 text-balance leading-tight">
                  {invitation.groomName.split(' ')[0]} & {invitation.brideName.split(' ')[0]}
                </h1>
                <p className="text-[#d4af37] font-sans font-bold tracking-[0.3em] text-[10px] uppercase">{formattedDate}</p>
              </AnimatedSection>

              <div className="mt-12">
                <TierGate 
                  tier={invitation.tier} 
                  minTier="BASIC"
                  
                >
                  <AnimatedSection delay="delay-200">
                     <CountdownTimer targetDate={invitation.eventDate} textColor="text-stone-800" labelColor="text-stone-400" separatorColor="text-[#d4af37]" />
                  </AnimatedSection>
                </TierGate>
              </div>
           </div>
        </section>

        {/* Intro Section */}
        <section className="py-24 px-8 text-center relative">
          <CornerOrnament className="top-0 left-0" />
          <CornerOrnament className="top-0 right-0 rotate-90" />
          
          <AnimatedSection>
            <p className="text-stone-400 text-xs italic leading-relaxed max-w-xs mx-auto mb-12">
              {invitation.greeting || '"Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan..."'}
            </p>
            
            <div className="flex flex-col gap-16">
              <div>
                <h3 className="text-2xl font-display font-bold text-stone-800 mb-2">{invitation.groomName}</h3>
                <p className="text-xs text-stone-400">Putra dari {invitation.groomParents || 'Bapak & Ibu'}</p>
              </div>
              <div className="text-[#d4af37] text-2xl font-serif italic">&</div>
              <div>
                <h3 className="text-2xl font-display font-bold text-stone-800 mb-2">{invitation.brideName}</h3>
                <p className="text-xs text-stone-400">Putri dari {invitation.brideParents || 'Bapak & Ibu'}</p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Love Story Section */}
        <TierGate 
          tier={invitation.tier} 
          minTier="BASIC"
          
        >
          <LoveStorySection 
            story={invitation.loveStory || []} 
            bgColor="bg-stone-50" 
            accentColor="text-[#d4af37]" 
            textColor="text-stone-800" 
          />
        </TierGate>

        {/* Agenda Section */}
        <section id="date" className="py-24 px-8 bg-stone-50 relative">
          <div className="max-w-xs mx-auto space-y-12">
             {(invitation.schedule || [
               { id: '1', label: 'Akad Nikah', time: invitation.eventTime, icon: 'heart' },
               { id: '2', label: 'Resepsi', time: '11:00 - Selesai', icon: 'utensils' }
             ]).map((item, idx) => (
               <AnimatedSection key={item.id} delay={`delay-${idx * 200}`} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border border-stone-200 bg-white flex items-center justify-center shrink-0">
                    <IconMapper name={item.icon} size={20} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-bold text-stone-800">{item.label}</h4>
                    <p className="text-xs font-bold text-[#d4af37] mb-2 uppercase tracking-widest">{item.time}</p>
                    <p className="text-xs text-stone-400 leading-relaxed">{invitation.venueName}<br/>{invitation.venueAddress}</p>
                  </div>
               </AnimatedSection>
             ))}
          </div>
          
          <div className="mt-16 text-center">
             <EventActionButtons eventName="Acara Pernikahan" eventDate={invitation.eventDate} eventTime={invitation.eventTime} venueName={invitation.venueName} venueAddress={invitation.venueAddress} />
          </div>
        </section>

        {/* Gallery Section */}
        <GallerySection
          photos={galleryPhotos}
          bgColor="bg-white"
          textColor="text-stone-800"
          borderColor="border-[#d4af37]"
          title="Our Moments"
        />

        <VideoEmbedSection videoUrl={invitation.videoUrl} bgColor="bg-stone-900" textColor="text-[#d4af37]" title="Our Story" />

        {/* RSVP Section */}
        <section id="wishes" className="py-24 px-8 bg-stone-50">
           <div className="text-center mb-12">
             <MessageCircle className="mx-auto text-[#d4af37] opacity-20 mb-6" size={40} />
             <h2 className="text-2xl font-display font-bold text-stone-800 mb-2">RSVP & Wishes</h2>
             <p className="text-xs text-stone-400">Kehadiran Anda adalah kado terindah bagi kami.</p>
           </div>
           <WishesSection invitation={invitation} />
        </section>

        {/* Footer */}
        <section className="py-24 px-8 text-center relative bg-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
             <GeometricPattern className="absolute -bottom-10 -right-10 w-64 h-64" />
          </div>
          <CornerOrnament className="bottom-0 left-0 rotate-[-90deg]" />
          <CornerOrnament className="bottom-0 right-0 rotate-180" />
          
          <AnimatedSection>
            <p className="text-sm italic text-stone-500 mb-12 max-w-xs mx-auto">
              {invitation.closing || '"Terima kasih atas doa restu Anda semua..."'}
            </p>
            <h3 className="text-3xl font-display font-bold text-stone-800 mb-4">
              {invitation.groomName.split(' ')[0]} & {invitation.brideName.split(' ')[0]}
            </h3>
            <p className="text-[10px] font-bold text-[#d4af37] tracking-[0.4em] uppercase">{formattedDate}</p>

            {invitation.tier === 'ULTIMATE' && invitation.qrEnabled !== false && (
              <div className="mt-12 flex flex-col items-center justify-center gap-3 px-6 max-w-sm mx-auto relative z-10">
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

