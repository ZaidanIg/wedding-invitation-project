'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Invitation } from '@/types';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { resolvePhotos, AudioPlayer,  GallerySection, VideoEmbedSection } from './shared';
import { ChevronDown, MapPin, Clock, Copy, ExternalLink, Gift } from 'lucide-react';
import RsvpForm from '../themes/RsvpForm';

// ==========================================
// TEMPLATE SECTIONS - SILAKAN ISI MANUAL
// ==========================================

function FloatingOrnaments() {
  return (
    <>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-60 w-80 h-40 opacity-40 -right-20 pointer-events-none z-0">
        <Image src="/assets/javaneseTheme/Assets/ornament-27.png" alt="Ornament 27" fill className="object-contain object-right" />
      </motion.div>
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-40 w-80 h-40 opacity-30 -left-20 pointer-events-none -scale-x-100 z-0">
        <Image src="/assets/javaneseTheme/Assets/ornament-28.png" alt="Ornament 28" fill className="object-contain object-right" />
      </motion.div>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-20 w-80 h-40 opacity-40 -right-40 pointer-events-none z-0">
        <Image src="/assets/javaneseTheme/Assets/ornament-29.png" alt="Ornament 29" fill className="object-contain object-top" />
      </motion.div>
    </>
  );
}

function EnvelopeSection({ data, onOpen, guestName }: { data: Invitation; onOpen: () => void; guestName: string }) {
  const { heroPhoto } = resolvePhotos(data);

  return (
    <motion.section
      id="envelope-section"
      exit={{ scale: 1.2, opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex justify-center bg-black/90 sm:p-4 backdrop-blur-sm"
    >
      <div className="w-full h-full max-w-lg relative bg-[#F8F5F0] overflow-hidden flex flex-col items-center justify-center sm:rounded-2xl sm:shadow-2xl">


        {/* Background Envelope Main */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 w-full h-[50vh] opacity-40 pointer-events-none"
        >
          <Image src="/assets/javaneseTheme/Assets/width_150.webp" alt="Background Envelope" fill className="object-cover object-bottom" />
        </motion.div>

        <FloatingOrnaments />

        {/* Corner Ornaments */}
        <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40">
          <Image src="/assets/javaneseTheme/Assets/ornament-36.png" alt="Ornament TL" fill className="object-contain object-left-top" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 -scale-x-100">
          <Image src="/assets/javaneseTheme/Assets/ornament-36.png" alt="Ornament TR" fill className="object-contain object-left-top" />
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 md:w-40 md:h-40 rotate-180">
          <Image src="/assets/javaneseTheme/Assets/ornament-36.png" alt="Ornament BR" fill className="object-contain object-left-top" />
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 -scale-y-100">
          <Image src="/assets/javaneseTheme/Assets/ornament-36.png" alt="Ornament BL" fill className="object-contain object-left-top" />
        </div>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative z-10 text-center flex flex-col items-center max-w-sm w-full px-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'backOut' }}
            className="relative w-48 h-64 md:w-56 md:h-72 mb-8 mx-auto"
          >
            {/* Glowing Stroke (Blinking) */}
            <div className="absolute inset-0 rounded-[80px] border-[3px] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.7)] animate-pulse z-20 pointer-events-none"></div>
            
            {/* Main Photo */}
            <div className="absolute inset-0 rounded-[80px] overflow-hidden z-10 bg-[#F8F5F0]">
              <Image src={heroPhoto} alt="Couple Photo" fill className="object-cover" />
            </div>

            {/* Ornament at the bottom edge */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-28 h-28 z-30 pointer-events-none">
              <Image src="/assets/javaneseTheme/Assets/ornament-30.png" alt="Ornament 30" fill className="object-contain" />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xs uppercase tracking-[0.4em] text-[#4A3728] font-bold mb-6"
          >Pernikahan</motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="font-display text-4xl sm:text-5xl text-[#4A3728] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {data.groomName}
          </motion.h1>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="text-[#D4AF37] font-display italic text-2xl my-2"
          >&amp;</motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="font-display text-4xl sm:text-5xl text-[#4A3728] mb-10" style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {data.brideName}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mb-10 text-sm text-[#4A3728]/80"
          >
            <p className="mb-2 italic">Kepada Yth.</p>
            <p className="font-bold text-xl text-[#4A3728] pb-1 border-b border-[#D4AF37]/50 inline-block px-4">{guestName}</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            onClick={onOpen}
            className="group relative px-10 py-3.5 bg-[#4A3728] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-xl hover:scale-105 transition-transform overflow-hidden border border-[#D4AF37]"
          >
            <span className="relative z-10 text-[#F8F5F0]">Buka Undangan</span>
            <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
function FallingSparkles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const sparkles = useMemo(() => {
    return [...Array(35)].map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 4,
      size: Math.random() * 5 + 5,
      x2: (Math.random() - 0.5) * 80,
      x3: (Math.random() - 0.5) * 80,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: ['-5vh', '105vh'],
            x: [0, sparkle.x2, sparkle.x3],
            opacity: [0, 0.9, 0.9, 0],
            rotate: [0, 180, 360],
            scale: [0.5, 1.2, 0.8]
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "linear"
          }}
          style={{ left: `${sparkle.left}%`, width: sparkle.size, height: sparkle.size }}
          className="absolute top-0 bg-gradient-to-b from-[#D4AF37] via-white to-transparent rounded-full shadow-[0_0_12px_rgba(212,175,55,0.9)] blur-[0.5px]"
        />
      ))}
    </div>
  );
}

function SectionBottomDivider() {
  return (
    <div className="absolute bottom-0 left-0 w-full pointer-events-none z-20 flex items-end">
      <Image
        src="/assets/javaneseTheme/Assets/width_800.webp"
        alt="Divider Bottom"
        width={800}
        height={150}
        className="w-full h-auto opacity-80"
       
      />
    </div>
  );
}

function HeroSection({ data }: { data: Invitation }) {
  const { heroPhoto } = resolvePhotos(data);

  return (
    <section id="hero-section" className="relative min-h-screen flex flex-col items-center justify-end bg-[#F8F5F0] overflow-hidden pb-20">
      <FloatingOrnaments />
      <div className="absolute inset-0">
        <Image src={heroPhoto} alt="Couple" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        {/* White Gradient at the bottom */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#F8F5F0]/80 to-transparent" />
      </div>

      <FallingSparkles />

      <div className="relative z-10 text-center px-6 mt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xs uppercase tracking-[0.4em] text-white font-bold mb-6"
        >Pernikahan</motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-5xl sm:text-6xl text-white mb-2 drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {data.groomName}
        </motion.h1>
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-[#D4AF37] font-display italic text-3xl my-2 block drop-shadow-md"
        >&amp;</motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-display text-5xl sm:text-6xl text-white drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {data.brideName}
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="relative z-10 mt-16"
      >
        <ChevronDown className="w-8 h-8 text-white/80" />
      </motion.div>
      <SectionBottomDivider />
    </section>
  );
}

function GroomSection({ data }: { data: Invitation }) {
  const { groomPhoto, bridePhoto } = resolvePhotos(data);

  return (
    <section id="groom-section" className="relative py-20 px-6 flex flex-col items-center bg-[#F8F5F0] overflow-hidden">
      <FloatingOrnaments />
      {/* Pembatas Atas */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-48 h-12 sm:w-64 sm:h-16 mb-12"
      >
        <Image src="/assets/javaneseTheme/Assets/ornament-26.png" alt="Divider" fill className="object-contain" />
      </motion.div>

      {/* Teks Awal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center max-w-sm w-full z-10"
      >
        <p className="text-sm sm:text-base font-serif italic text-[#4A3728] leading-relaxed">
          &ldquo;{data.greeting}&rdquo;
        </p>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-60 w-80 h-40 opacity-40 -right-20 pointer-events-none"
      >
        <Image src="/assets/javaneseTheme/Assets/ornament-27.png" alt="Ornament 27" fill className="object-contain object-right" />
      </motion.div>


      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 w-80 h-40 opacity-30 -left-20 pointer-events-none -scale-x-100"
      >
        <Image src="/assets/javaneseTheme/Assets/ornament-28.png" alt="Ornament 28" fill className="object-contain object-right" />
      </motion.div>

      {/* Wrapper Profil & Ornamen */}
      <div className="relative w-full max-w-md mx-auto mt-24">
        {/* Ornamen Atas Arch (Mandala & Burung) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-between px-0 sm:px-2 items-center z-20 pointer-events-none">
          {/* Burung Kiri */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: -30 }}
            transition={{ duration: 0.8 }}
            className="relative w-36 h-36 sm:w-48 sm:h-48 -translate-y-6 sm:-translate-y-10 z-20"
          >
            <Image src="/assets/javaneseTheme/Assets/burung.png" alt="Burung Kiri" fill className="object-contain object-bottom" />
          </motion.div>

          {/* Mandala */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 z-10"
          >
            <Image src="/assets/javaneseTheme/Assets/mandala.png" alt="Mandala" fill className="object-contain" />
          </motion.div>

          {/* Burung Kanan */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: 30 }}
            transition={{ duration: 0.8 }}
            className="relative w-36 h-36 sm:w-48 sm:h-48 -translate-y-6 sm:-translate-y-10 z-20"
          >
            <Image
              src="/assets/javaneseTheme/Assets/burung.png"
              alt="Burung Kanan"
              fill
              className="object-contain object-bottom"
              style={{ transform: 'scaleX(-1)' }}
             
            />
          </motion.div>
        </div>
      </div>

      {/* Profil Mempelai (Wrapped in Gold Gradient for Shiny Border) */}
      <motion.div 
        animate={{ boxShadow: ["0px 0px 15px rgba(212,175,55,0.4)", "0px 0px 35px rgba(212,175,55,0.8)", "0px 0px 15px rgba(212,175,55,0.4)"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full z-10 rounded-t-full pt-[6px] px-[6px] bg-gradient-to-br from-[#F9F0C7] via-[#D4AF37] to-[#8A671F]"
      >
        <div className="relative overflow-hidden pt-24 pb-12 px-6 flex flex-col items-center gap-6 w-full bg-white rounded-t-full">

        <motion.div
          initial={{ scale: 1.05, opacity: 0.2 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 w-full h-[50vh] pointer-events-none"
        >
          <Image src="/assets/javaneseTheme/Assets/width_150.webp" alt="Background Envelope" fill className="object-cover object-bottom" />
        </motion.div>

        {/* Groom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-6">
            {/* Ornament 34 - Belakang Kanan Groom */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: "-50%" }}
              whileInView={{ opacity: 1, x: 0, y: "-50%" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-1/2 -right-16 sm:-right-24 w-28 h-48 sm:w-36 sm:h-64 pointer-events-none z-0"
            >
              <Image src="/assets/javaneseTheme/Assets/ornament-34.png" alt="Ornament Kanan" fill className="object-contain object-left" />
            </motion.div>

            <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#D4AF37]/50 shadow-xl relative z-10">
              <Image src={groomPhoto} alt="Groom" fill className="object-cover" />
            </div>
          </div>
          <h3 className="font-display text-4xl sm:text-5xl text-[#4A3728] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{data.groomName}</h3>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#4A3728]/70 mb-1">Putra Dari</p>
          <p className="text-sm sm:text-base font-serif italic text-[#4A3728]">{data.groomParents || 'Bapak & Ibu'}</p>
        </motion.div>

        {/* Separator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="my-4 text-5xl sm:text-6xl font-display italic text-[#D4AF37]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          &amp;
        </motion.div>

        {/* Bride */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-6">
            {/* Ornament 35 - Belakang Kiri Bride */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: "-50%" }}
              whileInView={{ opacity: 1, x: 0, y: "-50%" }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute top-1/2 -left-16 sm:-left-24 w-28 h-48 sm:w-36 sm:h-64 pointer-events-none z-0"
            >
              <Image src="/assets/javaneseTheme/Assets/ornament-35.png" alt="Ornament Kiri" fill className="object-contain object-right" />
            </motion.div>

            <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#D4AF37]/50 shadow-xl relative z-10">
              <Image src={bridePhoto} alt="Bride" fill className="object-cover" />
            </div>
          </div>
          <h3 className="font-display text-4xl sm:text-5xl text-[#4A3728] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{data.brideName}</h3>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#4A3728]/70 mb-1">Putri Dari</p>
          <p className="text-sm sm:text-base font-serif italic text-[#4A3728]">{data.brideParents || 'Bapak & Ibu'}</p>
        </motion.div>

      </div>
      </motion.div>
      <SectionBottomDivider />
    </section>
  );
}

function DateSection({ data }: { data: Invitation }) {
  const defaultSchedule = [
    { id: '1', time: data.eventTime, label: 'Akad Nikah', icon: 'heart' },
    { id: '2', time: '11:00 - Selesai', label: 'Resepsi', icon: 'glass' }
  ];
  const schedule = data.schedule?.length ? data.schedule : defaultSchedule;

  return (
    <section id="date-section" className="relative pt-24 pb-40 px-6 flex flex-col items-center bg-[#F8F5F0] overflow-hidden">
      <FloatingOrnaments />
      
      {/* Background Ornaments */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <h2 className="text-4xl sm:text-5xl font-display text-[#4A3728] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Waktu & Tempat
        </h2>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full mb-6 opacity-60"></div>
        <p className="text-sm sm:text-base text-[#4A3728]/80 font-serif italic max-w-md mx-auto">
          Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami:
        </p>
      </motion.div>

      {/* Date Highlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, boxShadow: "0px 0px 0px rgba(212,175,55,0)" }}
        whileInView={{ 
          opacity: 1, 
          scale: 1,
          boxShadow: ["0px 0px 15px rgba(212,175,55,0.4)", "0px 0px 35px rgba(212,175,55,0.8)", "0px 0px 15px rgba(212,175,55,0.4)"]
        }}
        viewport={{ once: false }}
        transition={{ 
          opacity: { duration: 0.6 },
          scale: { duration: 0.6 },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative w-full max-w-md mx-auto rounded-t-full pt-[6px] px-[6px] bg-gradient-to-br from-[#F9F0C7] via-[#D4AF37] to-[#8A671F] mb-16 z-10"
      >
        <div className="relative bg-white w-full h-full rounded-t-full pt-16 pb-8 px-6 flex flex-col items-center">

        {/* Restored Mandala */}
        <div className="absolute top-4 w-32 h-32 pointer-events-none opacity-80 z-20">
          <Image src="/assets/javaneseTheme/Assets/mandala.png" alt="Mandala" fill className="object-contain" />
        </div>
        <p className="text-[#D4AF37] tracking-widest uppercase text-xs font-bold mb-2 mt-12">Simpan Tanggal</p>
        <p className="font-display text-3xl text-[#4A3728] mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          {(() => {
            try {
              const d = new Date(data.eventDate);
              if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });
              }
            } catch (_e) { }
            return data.eventDate;
          })()}
        </p>

        <div className="w-full space-y-6">
          {schedule.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex flex-col items-center pb-6 border-b border-[#D4AF37]/30 last:border-0 last:pb-0"
            >
              <h4 className="text-lg font-serif italic text-[#4A3728] mb-1">{item.label}</h4>
              <div className="flex items-center gap-2 text-sm text-[#4A3728]/80">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>{item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </motion.div>

      {/* Ornament Below Rectangle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm h-12 relative mb-12 z-10"
      >
        <Image src="/assets/javaneseTheme/Assets/cover-1.png" alt="Ornament Bottom" fill className="object-contain" />
      </motion.div>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-[#D4AF37]/20 flex flex-col items-center text-center relative z-10 mb-12"
      >
        <div className="w-12 h-12 bg-[#F8F5F0] rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-[#D4AF37]" />
        </div>
        <h3 className="text-xl font-display text-[#4A3728] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{data.venueName}</h3>
        <p className="text-sm text-[#4A3728]/70 mb-6 leading-relaxed">
          {data.venueAddress}
        </p>

        {/* Google Maps Embed */}
        <div className="w-full h-48 rounded-2xl overflow-hidden shadow-inner mb-6 relative bg-gray-200">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(data.venueName + ' ' + data.venueAddress)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
        </div>

        <motion.a
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.venueName + ' ' + data.venueAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A3728] text-white rounded-full text-sm font-semibold hover:bg-[#3A2A1E] transition-colors shadow-md"
        >
          <ExternalLink className="w-4 h-4" /> Buka Google Maps
        </motion.a>
      </motion.div>

      <SectionBottomDivider />
    </section>
  );
}

function LoveStorySection({ data }: { data: Invitation }) {
  if (!data.loveStory || data.loveStory.length === 0) return null;

  return (
    <section id="love-story-section" className="relative pt-24 pb-40 px-6 flex flex-col items-center bg-white overflow-hidden">
      <FloatingOrnaments />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 relative z-10"
      >
        <p className="text-[#D4AF37] tracking-widest uppercase text-xs font-bold mb-2">Perjalanan Kami</p>
        <h2 className="text-4xl sm:text-5xl font-display text-[#4A3728] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Kisah Cinta
        </h2>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full mb-6 opacity-60"></div>
      </motion.div>

      <div className="relative w-full max-w-lg mx-auto z-10 flex flex-col items-center">
        {(data.loveStory || []).map((story, index) => {
          const isLast = index === (data.loveStory || []).length - 1;
          const isEven = index % 2 === 0;

          return (
            <div key={story.id || index} className="w-full flex flex-col items-center relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-[85%] z-10"
              >
                <div className="bg-white border border-[#D4AF37]/20 p-5 rounded-2xl shadow-lg w-full flex flex-col items-center text-center">
                  {story.photoUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden shadow-sm bg-[#D4AF37]/5">
                      <Image src={story.photoUrl} alt={story.title} fill className="object-cover" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase mb-1">{story.year}</span>
                  <h4 className="text-xl font-display text-[#4A3728] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{story.title}</h4>
                  <p className="text-xs sm:text-sm text-[#4A3728]/70 leading-relaxed italic break-words whitespace-pre-line">{story.description}</p>
                </div>
              </motion.div>

              {!isLast && (
                <div className="relative w-full h-20 my-[-4px] z-0 opacity-60">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {isEven ? (
                      <path d="M 50 0 C 90 0, 90 100, 50 100" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 4" fill="none" vectorEffect="non-scaling-stroke" />
                    ) : (
                      <path d="M 50 0 C 10 0, 10 100, 50 100" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 4" fill="none" vectorEffect="non-scaling-stroke" />
                    )}
                  </svg>
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'left-[80%]' : 'left-[20%]'} -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#D4AF37] z-10 shadow-sm`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SectionBottomDivider />
    </section>
  );
}


function RsvpSection({ data }: { data: Invitation }) {
  return (
    <section id="rsvp-section" className="relative pt-24 pb-40 px-6 flex flex-col items-center bg-[#F8F5F0] overflow-hidden">
      <FloatingOrnaments />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <h2 className="text-4xl sm:text-5xl font-display text-[#4A3728] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Kehadiran & Ucapan
        </h2>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full mb-6 opacity-60"></div>
        <p className="text-sm sm:text-base text-[#4A3728]/80 font-serif italic max-w-md mx-auto">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Ornaments for RSVP Box */}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
          {/* Subtle floral bg inside RSVP */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <Image src="/assets/javaneseTheme/Assets/mandala.png" alt="Background Texture" fill className="object-cover" />
          </div>

          <div className="relative z-10 p-2">
            <RsvpForm
              slug={data.slug}
              tier={data.tier}
              qrEnabled={data.qrEnabled}
            />
          </div>
        </div>
      </motion.div>

      <SectionBottomDivider />
    </section>
  );
}

function GiftSection({ data }: { data: Invitation }) {
  if (!data.digitalGifts || data.digitalGifts.length === 0) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Nomor rekening berhasil disalin!');
  };

  return (
    <section id="gift-section" className="relative pt-24 pb-40 px-6 flex flex-col items-center bg-white overflow-hidden">
      <FloatingOrnaments />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="text-center mb-4 relative z-10"
      >
        <div className="w-16 h-16 bg-[#F8F5F0] rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-display text-[#4A3728] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Kado Pernikahan
        </h2>
        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full mb-6 opacity-60"></div>
        <p className="text-sm sm:text-base text-[#4A3728]/80 font-serif italic max-w-md mx-auto">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat mengirimkan melalui fitur di bawah ini:
        </p>
      </motion.div>

      <div className="w-full max-w-md flex flex-col gap-6 relative z-10">
        {data.digitalGifts.map((gift, idx) => (
          <motion.div
            key={gift.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-[#F8F5F0] rounded-2xl p-6 shadow-md border border-[#D4AF37]/20 flex flex-col items-center text-center relative overflow-hidden"
          >
            <FloatingOrnaments />
            <h3 className="text-lg font-bold text-[#4A3728] tracking-widest uppercase mb-4">{gift.bankName}</h3>
            <p className="text-2xl font-mono text-[#D4AF37] mb-2">{gift.accountNumber}</p>
            <p className="text-sm text-[#4A3728]/80 font-serif italic mb-6">a.n. {gift.accountHolder}</p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
              onClick={() => handleCopy(gift.accountNumber)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-[#4A3728] text-sm font-bold uppercase tracking-wider rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-white transition-colors shadow-sm"
            >
              <Copy className="w-4 h-4" />
              Salin Rekening
            </motion.button>
          </motion.div>
        ))}
      </div>

      <SectionBottomDivider />
    </section>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function PremiumJavanese({ invitation: data, isPreview = false }: { invitation: Invitation; isPreview?: boolean }) {
  const [isOpened, setIsOpened] = useState(isPreview); // auto-open in preview
  const [guestName, setGuestName] = useState(data.rsvpName || 'Tamu Undangan');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!data.rsvpName) {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('to');
      setTimeout(() => { if (to) setGuestName(to); }, 0);
    }
  }, [data.rsvpName]);

  const handleOpen = () => {
    setIsOpened(true);
    // Scroll to hero section precisely after envelope exits
    setTimeout(() => {
      const heroEl = document.getElementById('hero-section');
      if (heroEl) {
        window.scrollTo({ top: heroEl.offsetTop, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 900); // wait for exit animation
    setIsPlaying(true);
  };

  if (!data) return null;

  return (
    <div className={`relative w-full max-w-lg mx-auto bg-[#F8F5F0] shadow-[0_0_40px_rgba(0,0,0,0.1)] font-sans text-slate-800 overflow-x-hidden ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {!isPreview && (
        <AnimatePresence>
          {!isOpened && <EnvelopeSection data={data} guestName={guestName} onOpen={handleOpen} />}
        </AnimatePresence>
      )}


      <HeroSection data={data} />
      <GroomSection data={data} />
      <DateSection data={data} />

      <VideoEmbedSection videoUrl={data.videoUrl} bgColor="bg-white" textColor="text-[#4A3728]" title="Kenangan Indah" />

      {data.loveStory && data.loveStory.length > 0 && (
        <LoveStorySection data={data} />
      )}

      <GiftSection data={data} />
      <GallerySection photos={resolvePhotos(data).galleryPhotos} bgColor="bg-[#F8F5F0]" textColor="text-[#4A3728]" borderColor="border-[#D4AF37]" title="Galeri Foto" />
      <RsvpSection data={data} />

      {/* Standard Audio Player & Auto Scroll */}
      {data.musicUrl && <AudioPlayer src={data.musicUrl} isPreview={isPreview} isPlayingProp={isPlaying} onPlayChange={setIsPlaying} activeColor="bg-[#4A3728] text-[#D4AF37]" inactiveColor="bg-[#F8F5F0] text-[#4A3728]" />}
    </div>
  );
}
