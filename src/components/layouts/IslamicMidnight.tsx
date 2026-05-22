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
  QrCode,
  Users,
  Link as LinkIcon,
  Sparkles,
  Music
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
  WishesSection
} from './shared';

const StarField = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#c5a059] rounded-full opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

function CoverPage({ groomName, brideName, guestName, onOpen }: {
  groomName: string; brideName: string; guestName: string; onOpen: () => void;
}) {
  return (
    <motion.div exit={{ y: '-100%', opacity: 0, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
      className="absolute inset-0 z-[600] bg-[#0a0f0d] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      <StarField />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative z-10">
        <div className="w-24 h-24 rounded-full border border-[#c5a059]/30 flex items-center justify-center mb-12 mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#c5a059]/10 flex items-center justify-center">
              <Sparkles className="text-[#c5a059] h-8 w-8" />
            </div>
        </div>
        <h2 className="text-[#c5a059] uppercase tracking-[0.6em] text-[10px] mb-6 font-sans font-bold">Walimatul Ursy</h2>
        <h1 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
          {groomName.split(' ')[0]} <span className="text-[#c5a059]">&</span> {brideName.split(' ')[0]}
        </h1>
        <p className="text-[#c5a059]/60 text-xs mb-2">Kepada Yth.</p>
        <p className="text-xl font-display font-semibold text-white mb-10 italic">{guestName}</p>
        <button onClick={onOpen}
          className="group relative px-12 py-5 rounded-full bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#1a2b23] font-sans font-bold text-xs tracking-widest uppercase transition-all hover:shadow-[0_0_30px_rgba(197,160,89,0.4)]">
          Buka Undangan
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function IslamicMidnight({ invitation, isPreview = false }: { invitation: Invitation; isPreview?: boolean }) {
  const [isOpened, setIsOpened] = useState(isPreview);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const { formattedDate } = formatEventDate(invitation.eventDate);
  const { heroPhoto, galleryPhotos } = resolvePhotos(invitation);
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
    <div className={`w-full max-w-lg mx-auto bg-[#0a0f0d] text-white relative shadow-2xl font-sans ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      <AnimatePresence>
        {!isOpened && <CoverPage groomName={invitation.groomName} brideName={invitation.brideName} guestName={guestName} onOpen={() => setIsOpened(true)} />}
      </AnimatePresence>

      <div className="relative">
        {/* Hero Section */}
        <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center px-6">
           <div className="absolute inset-0">
             <Image src={heroPhoto} alt="Couple" fill className="object-cover opacity-30" priority unoptimized />
             <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d] via-transparent to-[#0a0f0d]" />
             <StarField />
           </div>
           
           <div className="relative z-10">
              <AnimatedSection animation="up">
                <div className="w-20 h-20 rounded-full border border-[#c5a059]/20 flex items-center justify-center mb-8 mx-auto">
                  <span className="text-[#c5a059] text-3xl">🌙</span>
                </div>
                <h1 className="text-6xl font-display font-bold mb-6 text-balance">
                  {invitation.groomName.split(' ')[0]} <br/>
                  <span className="text-[#c5a059] text-4xl font-serif italic">&</span> <br/>
                  {invitation.brideName.split(' ')[0]}
                </h1>
                <div className="h-px w-12 bg-[#c5a059] mx-auto mb-6" />
                <p className="text-[#c5a059] font-sans font-bold tracking-[0.4em] text-[10px] uppercase">{formattedDate}</p>
              </AnimatedSection>
              
              <div className="mt-16">
                <TierGate 
                  tier={invitation.tier} 
                  minTier="BASIC"
                  
                >
                  <CountdownTimer targetDate={invitation.eventDate} textColor="text-white" labelColor="text-white/40" separatorColor="text-[#c5a059]" />
                </TierGate>
              </div>
           </div>
        </section>

        {/* Intro Section */}
        <section className="py-32 px-8 text-center bg-[#0d1411]">
          <AnimatedSection>
            <div className="mb-12">
              <span className="text-[#c5a059] text-5xl mb-8 block opacity-40">﷽</span>
              <p className="text-white/60 text-xs italic leading-relaxed max-w-xs mx-auto">
                {invitation.greeting || '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri..."'}
              </p>
            </div>
            
            <div className="space-y-16">
              <div>
                <h3 className="text-3xl font-display font-bold text-white mb-2">{invitation.groomName}</h3>
                <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest">Putra Dari</p>
                <p className="text-sm text-white/40 italic">{invitation.groomParents || 'Bapak & Ibu'}</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-[#c5a059]/20" />
                <Heart className="text-[#c5a059]" fill="currentColor" size={16} />
                <div className="h-px w-8 bg-[#c5a059]/20" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold text-white mb-2">{invitation.brideName}</h3>
                <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest">Putri Dari</p>
                <p className="text-sm text-white/40 italic">{invitation.brideParents || 'Bapak & Ibu'}</p>
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
            bgColor="bg-[#0a0f0d]" 
            accentColor="text-[#c5a059]" 
            textColor="text-white" 
          />
        </TierGate>

        {/* Agenda Section */}
        <section id="date" className="py-32 px-8 relative">
          <StarField />
          <div className="space-y-12 relative z-10">
             {(invitation.schedule || [
               { id: '1', label: 'Akad Nikah', time: invitation.eventTime, icon: 'heart' },
               { id: '2', label: 'Resepsi', time: '11:00 - Selesai', icon: 'utensils' }
             ]).map((item, idx) => (
               <AnimatedSection key={item.id} delay={`delay-${idx * 200}`} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/10 flex items-center justify-center mb-6">
                    <IconMapper name={item.icon} size={24} className="text-[#c5a059]" />
                  </div>
                  <h4 className="text-2xl font-display font-bold text-white mb-2">{item.label}</h4>
                  <p className="text-sm font-bold text-[#c5a059] mb-4 uppercase tracking-[0.2em]">{item.time}</p>
                  <div className="flex items-start gap-2 text-xs text-white/50 mb-6 italic">
                    <MapPin size={14} className="shrink-0 mt-0.5" />
                    <p>{invitation.venueName}<br/>{invitation.venueAddress}</p>
                  </div>
                  <button 
                    onClick={() => window.open(mapsUrl)}
                    className="w-full py-3 rounded-xl border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-widest hover:bg-[#c5a059] hover:text-[#1a2b23] transition-all"
                  >
                    Buka Google Maps
                  </button>
               </AnimatedSection>
             ))}
          </div>
        </section>

        {/* Gallery Section */}
        {galleryPhotos.length > 0 && (
          <section id="gallery" className="py-32 px-4 text-center bg-[#0d1411]">
             <AnimatedSection className="mb-16">
                <h2 className="text-3xl font-display font-bold text-white mb-4 italic">Captured Moments</h2>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto" />
             </AnimatedSection>
             
             <div className="columns-2 gap-2 space-y-2">
                {galleryPhotos.map((src: string, idx: number) => (
                  <AnimatedSection key={idx} animation="scale" className="break-inside-avoid">
                     <div className="relative overflow-hidden rounded-2xl border border-white/10">
                        <Image src={src} alt="Gallery" width={400} height={400} className="w-full h-auto object-cover" unoptimized />
                     </div>
                  </AnimatedSection>
                ))}
             </div>
          </section>
        )}

        {/* RSVP & Wishes */}
        <section id="wishes" className="py-32 px-8">
           <div className="text-center mb-16">
             <Sparkles className="mx-auto text-[#c5a059] mb-6" size={32} />
             <h2 className="text-3xl font-display font-bold text-white mb-4 italic">RSVP & Wishes</h2>
             <p className="text-sm text-white/40 italic">Berikan doa terbaik Anda untuk kami.</p>
           </div>
           <WishesSection invitation={invitation} />
        </section>

        {/* Footer */}
        <section className="py-40 px-8 text-center relative overflow-hidden bg-[#0a0f0d]">
          <StarField />
          <AnimatedSection>
            <h3 className="text-5xl font-display font-bold text-white mb-6">
              {invitation.groomName.split(' ')[0]} <span className="text-[#c5a059]">&</span> {invitation.brideName.split(' ')[0]}
            </h3>
            <p className="text-[#c5a059] font-sans font-bold tracking-[0.6em] uppercase text-[10px] mb-12">{formattedDate}</p>

            {invitation.tier === 'ULTIMATE' && invitation.qrEnabled !== false && (
              <div className="mt-12 flex flex-col items-center justify-center gap-3 px-6 max-w-sm mx-auto relative z-10">
                <div className="bg-white p-3.5 rounded-2xl inline-block shadow-lg border border-[#c5a059]/40">
                  <SafeQRCodeSVG
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${getCoupleSlug(invitation.groomName, invitation.brideName)}/${invitation.slug}/attendance`}
                    size={130}
                    level="H"
                  />
                </div>
                <p className="text-xs text-[#c5a059] font-semibold mt-1">
                  QR Code Buku Tamu (Attendance)
                </p>
                <p className="text-[9px] text-white/50 leading-relaxed font-sans max-w-[240px] text-center">
                  Pindai QR Code ini untuk melakukan pengisian Buku Tamu secara digital saat menghadiri acara.
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 opacity-30 mt-12">
              <div className="h-px w-12 bg-[#c5a059]" />
              <Sparkles size={16} />
              <div className="h-px w-12 bg-[#c5a059]" />
            </div>
          </AnimatedSection>
        </section>

        {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} />}
      </div>
    </div>
  );
}

