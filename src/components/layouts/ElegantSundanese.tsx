'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Invitation } from '@/types';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  resolvePhotos,
  AudioPlayer,

  GallerySection,
  VideoEmbedSection,
} from './shared';
import {
  ChevronDown,
  MapPin,
  Clock,
  Copy,
  ExternalLink,
  Gift,
} from 'lucide-react';
import RsvpForm from '../themes/RsvpForm';

// ─── Design Tokens (from temaWedding spec) ───────────────────────────────────
const C = {
  bg: '#FFFFFF',
  text: '#000000',
  card: '#E8E5E5',
  gold: '#F4CD78',
  goldMid: '#DEC57E',
  goldBright: '#F9CB67',
  goldDark: '#A57318',
  creamHeavy: 'rgba(250,241,219,0.76)',
  creamLight: 'rgba(250,241,219,0.30)',
  shadow: 'rgba(0,0,0,0.25)',
} as const;

// Cover-specific tokens (color-3, color-4 from cover spec)
const _COVER = {
  namePillBg: '#EFEFEF',  // color-3
  namePillText: '#323232',  // color-4
} as const;

// ─── Asset Paths ──────────────────────────────────────────────────────────────
const A = {
  corner: '/assets/ElegantSundanesseTheme/assets/corner.png',
  header: '/assets/ElegantSundanesseTheme/assets/header-wedding.jpg',
  batik: '/assets/ElegantSundanesseTheme/assets/batik-sunda.jpg',
  batik2: '/assets/ElegantSundanesseTheme/assets/batik-sunda2.jpg',
  mandala: '/assets/ElegantSundanesseTheme/assets/mandala-gold.png',
  megaMendung: '/assets/ElegantSundanesseTheme/assets/mega-mendung.png',
  megaMendungBg: '/assets/ElegantSundanesseTheme/assets/mega mendung.jpg',
  circle: '/assets/ElegantSundanesseTheme/assets/circle.png',
  cincin: '/assets/ElegantSundanesseTheme/assets/cincin.png',
} as const;

function GoldDustParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() =>
    [...Array(40)].map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 5,
      size: Math.random() * 4 + 3,
      x2: (Math.random() - 0.5) * 60,
      x3: (Math.random() - 0.5) * 60,
      opacity: Math.random() * 0.6 + 0.2,
    })), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.x2, p.x3],
            opacity: [0, p.opacity, p.opacity, 0],
            rotate: [0, 360],
            scale: [0.5, 1.2, 0.6],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          className="absolute top-0"
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${C.goldBright}, ${C.goldDark})`,
              boxShadow: `0 0 8px ${C.gold}`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Mega Mendung Floating Ornaments ─────────────────────────────────────────
function MegaMendungOrnaments() {
  return (
    <>
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 -right-16 w-52 h-36 opacity-30 pointer-events-none z-0"
      >
        <Image src={A.megaMendung} alt="Mega Mendung" fill className="object-contain" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-32 -left-16 w-52 h-36 opacity-25 pointer-events-none z-0 -scale-x-100"
      >
        <Image src={A.megaMendung} alt="Mega Mendung" fill className="object-contain" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-32 -right-10 w-44 h-28 opacity-20 pointer-events-none z-0"
      >
        <Image src={A.megaMendung} alt="Mega Mendung" fill className="object-contain" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -9, 0], x: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-8 -left-12 w-48 h-32 opacity-20 pointer-events-none z-0 -scale-x-100"
      >
        <Image src={A.megaMendung} alt="Mega Mendung" fill className="object-contain" />
      </motion.div>
    </>
  );
}

// ─── Corner Ornaments ─────────────────────────────────────────────────────────
function CornerOrnaments() {
  return (
    <>
      <div className="absolute -top-2 -left-2 w-40 h-40 pointer-events-none z-10 -scale-y-100 -scale-x-100">
        <Image src={A.corner} alt="Corner TL" fill className="object-contain object-left-top" />
      </div>
      <div className="absolute -top-2 -right-2 w-40 h-40 pointer-events-none z-10 -scale-y-100">
        <Image src={A.corner} alt="Corner TR" fill className="object-contain object-left-top" />
      </div>
      <div className="absolute -bottom-2 -left-2 w-40 h-40 pointer-events-none z-10 -scale-x-100">
        <Image src={A.corner} alt="Corner BL" fill className="object-contain object-left-top" />
      </div>
      <div className="absolute -bottom-2 -right-2 w-40 h-40 pointer-events-none z-10">
        <Image src={A.corner} alt="Corner BR" fill className="object-contain object-left-top" />
      </div>
    </>
  );
}

// ─── Gold Divider ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center gap-3 w-full max-w-xs mx-auto my-6">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold})` }} />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 relative opacity-80"
      >
        <Image src={A.mandala} alt="Mandala" fill className="object-contain" />
      </motion.div>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${C.gold})` }} />
    </div>
  );
}

// ─── Ring Decoration ─────────────────────────────────────────────────────────
function RingDecoration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.8 }}
      className="flex justify-center my-8"
    >
      <div className="relative w-20 h-20">
        <Image src={A.cincin} alt="Wedding Rings" fill className="object-contain" />
      </div>
    </motion.div>
  );
}

// ─── Cover / Envelope Section ─────────────────────────────────────────────────
// Layout faithfully recreated from Figma "Cover" screen (402×874px):
//
//   BatikSunda21  ─ full-screen batik background
//   Rect "2"      ─ hero couple photo, top 0–57.2% (500/874), elevation-1 shadow
//   MandalaGold1  ─ top:30.1%, left:-20.8%, w:78.1%, rotates CW, overflows left
//   MandalaGold3  ─ top:30.1%, right:-21.1%, w:78.1%, rotates CCW, overflows right
//   Cincin1       ─ top:51.1%, centered, w:24.9% (100/402), pop-in animation
//   Rect "3"      ─ solid white panel from top:63.2% to bottom
//   Names h1      ─ top:66.0%, display-regular 48px, "{groomName} & {brideName}"
//   MandalaGold2  ─ top:84.8%, full-width (403/402), overflows bottom, slow rotate
//   Container "1" ─ top:76.7%, centered 42% width:
//                     "Kami Mengundang" (h2-regular 24px)
//                     "saudara/i" (body-md-regular 15px)
//                     NamaTamu pill (#EFEFEF, radius-37, elevation-2 shadow)
//   CTA button    ─ "Buka Undangan", pinned 2.5% from bottom
// ─────────────────────────────────────────────────────────────────────────────
function EnvelopeSection({
  data,
  onOpen,
  guestName,
}: {
  data: Invitation;
  onOpen: () => void;
  guestName: string;
}) {
  const { photos } = resolvePhotos(data);
  const coverPhoto = photos[0] || A.header;

  return (
    <motion.section
      id="envelope-section"
      exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[100] flex justify-center overflow-hidden"
    >
      {/* ── Root container: silver-gray background like reference ── */}
      <div className="relative w-full max-w-lg h-full overflow-hidden" style={{ background: '#D9D9D9' }}>

        {/* ── Batik texture across full background ── */}
        <div className="absolute inset-0 z-0" style={{ opacity: 0.1 }}>
          <Image src={A.batik2} alt="Batik Background" fill className="object-cover" />
        </div>

        {/* ── MandalaGold1: left side, behind arch (z-10) ── */}
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0, transition: { duration: 0.7, ease: 'easeIn' } }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute pointer-events-none z-10"
          style={{ top: '34%', left: '-34%', width: '80%', aspectRatio: '1/1' }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
            className="relative w-full h-full"
          >
            <Image src={A.mandala} alt="Mandala Left" fill className="object-contain" style={{ opacity: 0.85 }} />
          </motion.div>
        </motion.div>

        {/* ── MandalaGold3: right side, behind arch (z-10) ── */}
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0, transition: { duration: 0.7, ease: 'easeIn' } }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          className="absolute pointer-events-none z-10"
          style={{ top: '34%', right: '-34%', width: '80%', aspectRatio: '1/1' }}
        >
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 33, repeat: Infinity, ease: 'linear' }}
            className="relative w-full h-full"
          >
            <Image src={A.mandala} alt="Mandala Right" fill className="object-contain" style={{ opacity: 0.85 }} />
          </motion.div>
        </motion.div>

        {/* ── MandalaGold2: large bottom mandala, behind arch (z-10) ── */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0, transition: { duration: 0.7, ease: 'easeIn' } }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
          className="absolute pointer-events-none z-10 -translate-x-1/2"
          style={{ top: '80%', left: '50%', width: '105%', aspectRatio: '1/1' }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
            className="relative w-full h-full"
          >
            <Image src={A.mandala} alt="Mandala Bottom" fill className="object-contain" style={{ opacity: 0.55 }} />
          </motion.div>
        </motion.div>

        {/* ── Hero photo: fills top ~55%, with OVAL ARCH bottom edge (z-20) ── */}
        <motion.div
          initial={{ opacity: 0, y: '-100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ y: '-100%', opacity: 0, transition: { duration: 0.7, ease: 'easeIn' } }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute top-0 left-0 right-0 z-20"
          style={{
            height: '54%',
            /* Deep arch curve */
            borderRadius: '0 0 50% 50% / 0 0 250px 250px',
            overflow: 'hidden',
            boxShadow: '0px 6px 20px rgba(0,0,0,0.30)',
          }}
        >
          <Image
            src={coverPhoto}
            alt="Couple"
            fill
            className="object-cover object-center"
            priority
           
          />
          <div
            className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(217,217,217,0.50) 0%, transparent 100%)' }}
          />
        </motion.div>

        {/* ── Cincin: wedding ring, exact center over the arch curve (z-30) ── */}
        <div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            top: '54%', /* Aligned to the bottom of the 54% height arch */
            left: '50%',
            width: '22%',
            aspectRatio: '1/1',
          }}
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.9, ease: 'backOut' }}
            className="relative w-full h-full"
          >
            <Image src={A.cincin} alt="Wedding Rings" fill className="object-contain" />
          </motion.div>
        </div>

        {/* ── Couple Names: bold uppercase, below ring (z-40) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="absolute left-0 right-0 z-40 text-center px-6"
          style={{ top: '63%' }}
        >
          <h1
            className="not-italic"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(28px, 10.5vw, 46px)',
              fontWeight: 700,
              fontStyle: 'normal',
              color: '#000000',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
              textTransform: 'uppercase',
            }}
          >
            {data.groomName} &amp; {data.brideName}
          </h1>
        </motion.div>

        {/* ── "Kami Mengundang" block (z-40) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute z-40 left-0 right-0 flex flex-col items-center"
          style={{ top: '74%' }}
        >
          {/* "Kami Mengundang" — h2-regular 24px — centred */}
          <p
            style={{
              fontSize: 'clamp(16px, 5.5vw, 24px)',
              fontWeight: 400,
              color: '#000000',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            Kami Mengundang
          </p>

          {/* "saudara/i" — body-md-regular 15px — centred */}
          <p
            style={{
              fontSize: 'clamp(11px, 3.5vw, 15px)',
              fontWeight: 400,
              color: '#000000',
              textAlign: 'center',
              marginTop: 2,
            }}
          >
            saudara/i
          </p>

          {/* NamaTamu pill — white/light, radius-37, prominent shadow, full width pill */}
          <div
            style={{
              marginTop: 10,
              backgroundColor: '#EFEFEF',
              borderRadius: 37,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              padding: '11px 28px',
              minWidth: 'min(200px, 50%)',
              maxWidth: '60%',
            }}
          >
            <p
              style={{
                fontSize: 'clamp(13px, 4vw, 16px)',
                fontWeight: 400,
                color: '#323232',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {guestName}
            </p>
          </div>
        </motion.div>

        {/* ── CTA Button (z-50) ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="absolute z-50 left-0 right-0 flex justify-center"
          style={{ bottom: '4.5%' }}
        >
          <motion.button
            onClick={onOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-xl px-10 py-3.5"
            style={{ background: C.goldDark, border: `1px solid ${C.gold}` }}
          >
            <span className="relative z-10">Buka Undangan</span>
            <motion.div
              className="absolute inset-0"
              style={{ background: C.gold, borderRadius: '9999px' }}
              initial={{ scaleX: 0, originX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>


        {/* ── Gold dust particles (z-50) ── */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <GoldDustParticles />
        </div>
      </div>
    </motion.section>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ data }: { data: Invitation }) {
  const { heroPhoto } = resolvePhotos(data);

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex flex-col items-center justify-between overflow-hidden py-16"
    >
      <div className="absolute inset-0">
        <Image src={A.header} alt="Hero" fill className="object-cover blur-sm scale-110" priority />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />
        {/* White transparent gradient from bottom to top (40% height) for text readability */}
        <div
          className="absolute bottom-0 inset-x-0 h-[50%]"
          style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 100%)' }}
        />
      </div>
      <GoldDustParticles />


      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 w-50 h-50 sm:w-72 sm:h-72 pointer-events-none z-10 rotate-180 -translate-x-[8%] -translate-y-[8%]"
      >
        <Image src={A.corner} alt="Corner TL" fill className="object-contain object-left-top" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-0 right-0 w-50 h-50 sm:w-72 sm:h-72 pointer-events-none z-10 translate-x-[8%] translate-y-[8%]"
      >
        <Image src={A.corner} alt="Corner BR" fill className="object-contain object-left-top" />
      </motion.div>

      {/* ── Center Rectangle Photo ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="relative z-20 w-[55%] max-w-[240px] shrink-0 aspect-[3/4] rounded-[100px] sm:rounded-[120px] overflow-hidden mt-auto mb-auto"
        style={{
          border: `2px solid ${C.gold}`,
          boxShadow: `0 0 30px ${C.gold}80, 0 4px 15px rgba(0, 0, 0, 0.3)`
        }}
      >
        <Image src={heroPhoto} alt="Couple Photo" fill className="object-cover" />
      </motion.div>

      <div className="relative z-20 text-center px-6 shrink-0 mt-2">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-[10px] sm:text-xs uppercase font-bold mb-4 tracking-[0.3em] sm:tracking-[0.5em]"
          style={{ color: '#000000' }}
        >
          Pernikahan
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          style={{ fontFamily: "'Playfair Display', serif", color: '#000000' }}
          className="text-4xl sm:text-5xl leading-tight drop-shadow-lg"
        >
          {data.groomName}
        </motion.h1>
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ color: '#000000', fontFamily: "'Playfair Display', serif" }}
          className="text-3xl sm:text-4xl italic block my-2 drop-shadow-lg"
        >
          &amp;
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          style={{ fontFamily: "'Playfair Display', serif", color: '#000000' }}
          className="text-4xl sm:text-5xl leading-tight drop-shadow-lg"
        >
          {data.brideName}
        </motion.h1>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-8"
        >
          <ChevronDown className="w-7 h-7 mx-auto" style={{ color: '#000000' }} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Couple Section ───────────────────────────────────────────────────────────
function CoupleSection({ data }: { data: Invitation }) {
  const { groomPhoto, bridePhoto } = resolvePhotos(data);

  return (
    <section
      id="couple"
      className="relative py-20 px-6 flex flex-col items-center overflow-hidden"
      style={{ background: '#ffffffff' }}
    >
      {/* Zig-Zag Mega Mendung Ornaments (Black & White) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0 pointer-events-none grayscale"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] -left-12 w-48 h-32"
        >
          <Image src={A.megaMendung} alt="Mega Mendung" fill className="object-contain" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[35%] -right-12 w-48 h-32 -scale-x-100"
        >
          <Image src={A.megaMendung} alt="Mega Mendung" fill className="object-contain" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[60%] -left-12 w-48 h-32"
        >
          <Image src={A.megaMendung} alt="Mega Mendung" fill className="object-contain" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-[10%] -right-12 w-48 h-32 -scale-x-100"
        >
          <Image src={A.megaMendung} alt="Mega Mendung" fill className="object-contain" />
        </motion.div>
      </motion.div>

      {/* ── Corners TR & BL ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 right-0 w-50 h-50 sm:w-72 sm:h-72 pointer-events-none z-10 -scale-y-100 translate-x-[8%] -translate-y-[8%]"
      >
        <Image src={A.corner} alt="Corner TR" fill className="object-contain object-left-top" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-0 left-0 w-50 h-50 sm:w-72 sm:h-72 pointer-events-none z-10 -scale-x-100 -translate-x-[8%] translate-y-[8%]"
      >
        <Image src={A.corner} alt="Corner BL" fill className="object-contain object-left-top" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <p className="text-xs uppercase font-bold tracking-[0.35em] mb-2" style={{ color: C.goldDark }}>
          Mempelai
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-3xl sm:text-4xl mb-2">
          Calon Pengantin
        </h2>
        <GoldDivider />
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.9 }}
        className="relative w-full max-w-sm mx-auto z-10"
        style={{
          borderRadius: 31,
          border: `4px solid ${C.gold}`,
          background: C.card,
          boxShadow: `5px 7px 11.7px 0px ${C.shadow}`,
          overflow: 'hidden',
        }}
      >
        {/* Inner background: batik, opacity 20, blend mode lighten */}
        <div className="absolute inset-0 opacity-70 pointer-events-none">
          <Image src={A.batik} alt="Batik Card" fill className="object-cover" />
        </div>

        {/* Mandala TL and BR */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute w-80 h-80 opacity-20 pointer-events-none"
          style={{ top: -150, left: -150 }}
        >
          <Image src={A.mandala} alt="Mandala TL" fill className="object-contain" />
        </motion.div>
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute w-80 h-80 opacity-20 pointer-events-none"
          style={{ bottom: -150, right: -150 }}
        >
          <Image src={A.mandala} alt="Mandala BR" fill className="object-contain" />
        </motion.div>

        {/* Groom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col items-center pt-10 pb-6 px-6"
        >
          <div className="relative w-36 h-36 mb-4">
            <div className="absolute inset-0 rounded-full overflow-hidden z-0">
              <Image src={groomPhoto} alt="Groom" fill className="object-cover" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-10">
              <Image src={A.circle} alt="Circle Frame" fill className="object-contain" />
            </div>
            <motion.div
              animate={{ boxShadow: [`0 0 12px ${C.gold}60`, `0 0 28px ${C.gold}aa`, `0 0 12px ${C.gold}60`] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full pointer-events-none"
            />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-2xl sm:text-3xl text-center mb-1">
            {data.groomName}
          </h3>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: `${C.text}70` }}>Putra Dari</p>
          <p className="text-sm italic text-center" style={{ color: C.text }}>
            {data.groomParents || 'Bapak & Ibu'}
          </p>
        </motion.div>

        {/* Divider */}
        <div className="relative z-10 flex items-center justify-center px-8 py-2">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold})` }} />
          <span className="mx-4 text-3xl italic" style={{ fontFamily: "'Playfair Display', serif", color: C.goldDark }}>&amp;</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${C.gold})` }} />
        </div>

        {/* Bride */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center py-6 px-6 pb-10"
        >
          <div className="relative w-36 h-36 mb-4">
            <div className="absolute inset-0 rounded-full overflow-hidden z-0">
              <Image src={bridePhoto} alt="Bride" fill className="object-cover" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-10">
              <Image src={A.circle} alt="Circle Frame" fill className="object-contain" />
            </div>
            <motion.div
              animate={{ boxShadow: [`0 0 12px ${C.gold}60`, `0 0 28px ${C.gold}aa`, `0 0 12px ${C.gold}60`] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
              className="absolute inset-0 rounded-full pointer-events-none"
            />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-2xl sm:text-3xl text-center mb-1">
            {data.brideName}
          </h3>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: `${C.text}70` }}>Putri Dari</p>
          <p className="text-sm italic text-center" style={{ color: C.text }}>
            {data.brideParents || 'Bapak & Ibu'}
          </p>
        </motion.div>
      </motion.div>

      {data.greeting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-sm text-center mt-10 relative z-10"
        >
          <RingDecoration />
          <p className="text-sm italic leading-relaxed" style={{ color: `${C.text}cc`, fontFamily: 'Georgia, serif' }}>
            &ldquo;{data.greeting}&rdquo;
          </p>
        </motion.div>
      )}
    </section>
  );
}

// ─── Simple Countdown ─────────────────────────────────────────────────────────
function SimpleCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center gap-2 text-[22px] font-bold tracking-widest mb-6" style={{ color: '#000000' }}>
      <span>{String(timeLeft.days).padStart(2, '0')}</span>
      <span style={{ color: C.goldDark }}>:</span>
      <span>{String(timeLeft.hours).padStart(2, '0')}</span>
      <span style={{ color: C.goldDark }}>:</span>
      <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
      <span style={{ color: C.goldDark }}>:</span>
      <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
}

// ─── Date & Venue Section ─────────────────────────────────────────────────────
function DateSection({ data }: { data: Invitation }) {
  const defaultSchedule = [
    { id: '1', time: data.eventTime || '09:00', label: 'Akad Nikah', icon: 'heart' },
    { id: '2', time: '11:00 - Selesai', label: 'Resepsi', icon: 'glass' },
  ];
  const schedule = data.schedule?.length ? data.schedule : defaultSchedule;

  const formattedDate = (() => {
    try {
      const d = new Date(data.eventDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch { }
    return data.eventDate;
  })();

  return (
    <section
      id="date"
      className="relative py-24 px-6 flex flex-col items-center overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none grayscale z-0"
      >
        <MegaMendungOrnaments />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-3xl sm:text-4xl mb-2">
          Waktu &amp; Tempat
        </h2>
      </motion.div>

      {/* Date card (Arched Top) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7 }}
        className="relative w-[calc(100%+3rem)] shrink-0 mb-16 z-10"
        style={{
          borderRadius: '400px 400px 0 0',
          borderWidth: '5px 5px 0 5px',
          borderStyle: 'solid',
          borderColor: C.gold,
          background: '#FFFFFF', // Clean white background inside the card
          overflow: 'hidden',
        }}
      >
        <div className="relative z-10 px-6 py-14 flex flex-col items-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6" style={{ color: C.goldDark }}>Simpan Tanggal</p>

          <SimpleCountdown targetDate={data.eventDate} />

          <p style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-xl sm:text-2xl text-center font-bold mb-6">
            {formattedDate}
          </p>

          {/* Glowing horizontal line */}
          <div className="w-20 h-[2px] mb-8 relative">
            <div className="absolute inset-0" style={{ background: C.gold, boxShadow: `0 0 10px 2px ${C.gold}` }} />
          </div>

          <div className="w-full space-y-6 flex flex-col items-center">
            {schedule.map((item, idx) => (
              <React.Fragment key={item.id || idx}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex flex-col items-center"
                >
                  <h4 className="text-[16px] italic mb-1.5" style={{ fontFamily: "'Playfair Display', serif", color: C.text, fontWeight: 'bold' }}>{item.label}</h4>
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: `${C.text}90` }}>
                    <Clock className="w-3.5 h-3.5" style={{ color: C.goldDark }} />
                    <span>{item.time}</span>
                  </div>
                </motion.div>

                {/* Glowing separator except for the last item */}
                {idx < schedule.length - 1 && (
                  <div className="w-20 h-[2px] relative">
                    <div className="absolute inset-0" style={{ background: C.gold, boxShadow: `0 0 10px 2px ${C.gold}` }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Separator Ornament (using Corners) */}
      <div className="relative w-full h-16 sm:h-24 mb-10 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className="absolute left-0 w-50 h-50 sm:w-72 sm:h-72 -scale-x-100 -translate-x-[24%] -translate-y-[70%]"
          style={{ top: 0 }}
        >
          <Image src={A.corner} alt="Separator Corner Left" fill className="object-contain object-left" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className="absolute right-0 w-50 h-50 sm:w-72 sm:h-72 translate-x-[24%] -translate-y-[70%]"
          style={{ top: 0 }}
        >
          <Image src={A.corner} alt="Separator Corner Right" fill className="object-contain object-left" />
        </motion.div>
      </div>

      <div className="relative w-full h-16 sm:h-24 mb-10 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className="absolute left-0 w-50 h-50 sm:w-72 sm:h-72 -scale-x-100 -scale-y-100 -translate-x-[24%] -translate-y-[28%]"
          style={{ top: 0 }}
        >
          <Image src={A.corner} alt="Separator Corner Left Flipped" fill className="object-contain object-left" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className="absolute right-0 w-50 h-50 sm:w-72 sm:h-72 -scale-y-100 translate-x-[24%] -translate-y-[28%]"
          style={{ top: 0 }}
        >
          <Image src={A.corner} alt="Separator Corner Right Flipped" fill className="object-contain object-left" />
        </motion.div>
      </div>

      {/* Venue card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative w-[90%] max-w-md mx-auto z-10"
        style={{
          borderRadius: 24,
          background: '#FFFFFF',
          border: `1px solid ${C.gold}50`,
          boxShadow: `0px 4px 15px 0px ${C.shadow}`,
          overflow: 'hidden',
        }}
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: C.creamHeavy }}>
            <MapPin className="w-6 h-6" style={{ color: C.goldDark }} />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-xl sm:text-2xl mb-2">
            {data.venueName}
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: `${C.text}70` }}>{data.venueAddress}</p>

          <div className="w-full rounded-2xl overflow-hidden mb-6 relative bg-gray-200" style={{ height: 180 }}>
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent((data.venueName || '') + ' ' + (data.venueAddress || ''))}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((data.venueName || '') + ' ' + (data.venueAddress || ''))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full shadow-md"
            style={{ background: C.goldDark }}
          >
            <ExternalLink className="w-4 h-4" />
            Buka Google Maps
          </motion.a>
        </div>
      </motion.div>

      <div className="relative w-full h-16 sm:h-24 mb-10 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className="absolute left-0 w-50 h-50 sm:w-72 sm:h-72 -scale-x-100 -translate-x-[24%] translate-y-[55%]"
          style={{ bottom: 0 }}
        >
          <Image src={A.corner} alt="Separator Corner Left" fill className="object-contain object-left" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
          className="absolute right-0 w-50 h-50 sm:w-72 sm:h-72 translate-x-[24%] translate-y-[55%]"
          style={{ bottom: 0 }}
        >
          <Image src={A.corner} alt="Separator Corner Right" fill className="object-contain object-left" />
        </motion.div>
      </div>

    </section>
  );
}

// ─── Love Story Section ───────────────────────────────────────────────────────
function LoveStorySection({ data }: { data: Invitation }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!data.loveStory || data.loveStory.length === 0) return null;

  const { galleryPhotos: _galleryPhotos } = resolvePhotos(data);

  return (
    <section
      id="love-story-section"
      className="relative py-24 px-6 flex flex-col items-center overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      {/* Right side Rotating Mandala */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[120%] max-w-[600px] aspect-square opacity-[0.08] pointer-events-none"
        style={{ top: '15%', right: '-50%' }}
      >
        <Image src={A.mandala} alt="Mandala Background" fill className="object-contain" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="text-center w-full mb-16 relative z-10"
      >
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-4xl sm:text-5xl mb-2">Kisah Cinta</h2>
        <p className="text-[10px] tracking-widest mt-0 uppercase font-semibold" style={{ color: C.text }}>Perjalanan cinta kami</p>
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
                <div className="bg-white border p-5 rounded-2xl shadow-lg w-full flex flex-col items-center text-center" style={{ borderColor: `${C.gold}40` }}>
                  {story.photoUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: `${C.gold}10` }}>
                      <Image src={story.photoUrl} alt={story.title} fill className="object-cover" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: C.goldDark }}>{story.year}</span>
                  <h4 style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-xl mb-1">{story.title}</h4>
                  <p className="text-xs sm:text-sm leading-relaxed italic break-words whitespace-pre-line" style={{ color: `${C.text}90` }}>{story.description}</p>
                </div>
              </motion.div>

              {!isLast && (
                <div className="relative w-full h-20 my-[-4px] z-0 opacity-60">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {isEven ? (
                      <path d="M 50 0 C 90 0, 90 100, 50 100" stroke={C.gold} strokeWidth="2" strokeDasharray="4 4" fill="none" vectorEffect="non-scaling-stroke" />
                    ) : (
                      <path d="M 50 0 C 10 0, 10 100, 50 100" stroke={C.gold} strokeWidth="2" strokeDasharray="4 4" fill="none" vectorEffect="non-scaling-stroke" />
                    )}
                  </svg>
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'left-[80%]' : 'left-[20%]'} -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 z-10 shadow-sm`}
                    style={{ borderColor: C.gold }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Image Modal Popup */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md aspect-[3/4] sm:aspect-square bg-white rounded-2xl overflow-hidden shadow-2xl border-4"
              style={{ borderColor: C.gold }}
            >
              <Image src={selectedImage} alt="Story Image" fill className="object-cover" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black transition-colors z-10"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Gift Section ─────────────────────────────────────────────────────────────
function GiftSection({ data }: { data: Invitation }) {
  const [copied, setCopied] = useState<string | null>(null);
  if (!data.digitalGifts || data.digitalGifts.length === 0) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section
      id="gift-section"
      className="relative py-24 px-6 flex flex-col items-center overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      <MegaMendungOrnaments />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: C.creamHeavy }}>
          <Gift className="w-8 h-8" style={{ color: C.goldDark }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-3xl sm:text-4xl mb-2">Kado Pernikahan</h2>
        <GoldDivider />
        <p className="text-sm italic max-w-xs mx-auto" style={{ color: `${C.text}80` }}>
          Doa restu Anda merupakan karunia yang sangat berarti. Namun jika berkenan memberikan tanda kasih:
        </p>
      </motion.div>

      <div className="w-full max-w-sm flex flex-col gap-5 relative z-10">
        {data.digitalGifts.map((gift, idx) => (
          <motion.div
            key={gift.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative overflow-hidden flex flex-col items-center text-center p-6"
            style={{
              borderRadius: 18,
              background: C.creamHeavy,
              border: `1px solid ${C.gold}60`,
              boxShadow: `0px 4px 4px 0px ${C.shadow}`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.3 + (idx * 0.1) }}
              className="absolute top-0 left-0 w-40 h-40 opacity-15 pointer-events-none -translate-x-[50%] -translate-y-[50%]"
            >
              <Image src={A.mandala} alt="Mandala" fill className="object-contain" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.4 + (idx * 0.1) }}
              className="absolute bottom-0 right-0 w-40 h-40 opacity-15 pointer-events-none translate-x-[50%] translate-y-[50%]"
            >
              <Image src={A.mandala} alt="Mandala" fill className="object-contain" />
            </motion.div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: C.text }}>{gift.bankName}</h3>
            <p className="text-2xl font-mono mb-2" style={{ color: C.goldDark }}>{gift.accountNumber}</p>
            <p className="text-xs italic mb-5" style={{ color: `${C.text}80` }}>a.n. {gift.accountHolder}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCopy(gift.accountNumber)}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-full transition-colors"
              style={{
                background: copied === gift.accountNumber ? C.goldDark : '#FFFFFF',
                color: copied === gift.accountNumber ? '#FFFFFF' : C.goldDark,
                border: `1px solid ${C.gold}60`,
              }}
            >
              <Copy className="w-4 h-4" />
              {copied === gift.accountNumber ? 'Tersalin!' : 'Salin Rekening'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── RSVP Section ─────────────────────────────────────────────────────────────
function RsvpSection({ data }: { data: Invitation }) {
  return (
    <section
      id="rsvp"
      className="relative py-24 px-6 flex flex-col items-center overflow-hidden"
      style={{ background: '#FAF1DB' }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <Image src={A.batik} alt="Batik Texture" fill className="object-cover" />
      </div>
      <MegaMendungOrnaments />
      {/* Custom Rotated Corners for RSVP */}
      <div className="absolute top-0 left-0 w-50 h-50 sm:w-72 sm:h-72 pointer-events-none z-10 -scale-y-100 -scale-x-100 -translate-x-[10%] -translate-y-[10%]">
        <Image src={A.corner} alt="Corner TL" fill className="object-contain object-left-top" />
      </div>
      <div className="absolute top-0 right-0 w-50 h-50 sm:w-72 sm:h-72 pointer-events-none z-10 -scale-y-100 translate-x-[10%] -translate-y-[10%]">
        <Image src={A.corner} alt="Corner TR" fill className="object-contain object-left-top" />
      </div>
      <div className="absolute bottom-0 right-0 w-50 h-50 sm:w-72 sm:h-72 pointer-events-none z-10 translate-x-[10%] translate-y-[10%]">
        <Image src={A.corner} alt="Corner BR" fill className="object-contain object-left-top" />
      </div>
      <div className="absolute bottom-0 left-0 w-50 h-50 sm:w-72 sm:h-72 pointer-events-none z-10 -scale-x-100 -translate-x-[10%] translate-y-[10%]">
        <Image src={A.corner} alt="Corner BL" fill className="object-contain object-left-top" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.text }} className="text-3xl sm:text-4xl mb-2">
          Kehadiran &amp; Ucapan
        </h2>
        <GoldDivider />
        <p className="text-sm italic max-w-xs mx-auto" style={{ color: `${C.text}80` }}>
          Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-sm relative z-10"
        style={{
          borderRadius: 18,
          background: '#FFFFFF',
          border: `1px solid ${C.gold}40`,
          boxShadow: `2px 4px 4px 0px ${C.shadow}`,
          overflow: 'hidden',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <div className="relative w-64 h-64">
            <Image src={A.mandala} alt="Mandala Watermark" fill className="object-contain" />
          </div>
        </div>
        <div className="relative z-10 p-3">
          <RsvpForm slug={data.slug} tier={data.tier} qrEnabled={data.qrEnabled} />
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function FooterSection({ data }: { data: Invitation }) {
  return (
    <footer
      className="relative py-16 px-6 flex flex-col items-center text-center overflow-hidden"
      style={{ background: C.goldDark }}
    >
      <CornerOrnaments />
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image src={A.batik} alt="Batik" fill className="object-cover" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="relative w-20 h-20 opacity-70 mb-6"
        >
          <Image src={A.mandala} alt="Mandala" fill className="object-contain" />
        </motion.div>
        <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: C.goldBright }}>With Love</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }} className="text-2xl sm:text-3xl leading-tight mb-1">
          {data.groomName}
        </h2>
        <span style={{ fontFamily: "'Playfair Display', serif", color: C.goldBright }} className="text-2xl italic block my-1">&amp;</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }} className="text-2xl sm:text-3xl leading-tight mb-8">
          {data.brideName}
        </h2>
        <div className="h-px w-32 mb-6" style={{ background: `linear-gradient(to right, transparent, ${C.goldBright}, transparent)` }} />
        <p className="text-xs" style={{ color: `${C.goldBright}80` }}>
          © {new Date().getFullYear()} · Sahinaja Wedding Invitation
        </p>
      </motion.div>
    </footer>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ElegantSundanese({
  invitation: data,
  isPreview = false,
}: {
  invitation: Invitation;
  isPreview?: boolean;
}) {
  const [isOpened, setIsOpened] = useState(isPreview);
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
    setTimeout(() => {
      const heroEl = document.getElementById('hero-section');
      if (heroEl) {
        window.scrollTo({ top: heroEl.offsetTop, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 900);
    setIsPlaying(true);
  };

  if (!data) return null;

  const { galleryPhotos } = resolvePhotos(data);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />

      <div
        className={`relative w-full max-w-lg mx-auto shadow-[0_0_40px_rgba(0,0,0,0.12)] font-sans overflow-x-hidden ${!isOpened ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'}`}
        style={{ background: '#fdfbf7', color: '#1c1c1c' }}
      >
        {/* Envelope overlay */}
        {!isPreview && (
          <AnimatePresence>
            {!isOpened && (
              <EnvelopeSection data={data} guestName={guestName} onOpen={handleOpen} />
            )}
          </AnimatePresence>
        )}

        {/* Opening phrase */}
        <HeroSection data={data} />
        <CoupleSection data={data} />
        <DateSection data={data} />

        {data.loveStory && data.loveStory.length > 0 && (
          <LoveStorySection data={data} />
        )}

        <RsvpSection data={data} />
        <GiftSection data={data} />

        <GallerySection
          photos={galleryPhotos}
          bgColor="bg-white"
          textColor="text-[#A57318]"
          borderColor="border-[#F4CD78]"
          title="Galeri Foto"
        >
          {/* Separator Ornament (using Corners) */}
          <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.7 }}
              className="absolute top-0 left-0 w-50 h-50 sm:w-72 sm:h-72 -scale-y-100 -scale-x-100 -translate-x-[10%] -translate-y-[10%]"
            >
              <Image src={A.corner} alt="Separator Corner Left" fill className="object-contain object-left-top" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.7 }}
              className="absolute top-0 right-0 w-50 h-50 sm:w-72 sm:h-72 -scale-y-100 translate-x-[10%] -translate-y-[10%]"
            >
              <Image src={A.corner} alt="Separator Corner Right" fill className="object-contain object-left-top" />
            </motion.div>
          </div>
        </GallerySection>

        <VideoEmbedSection
          videoUrl={data.videoUrl}
          bgColor="bg-[#FAF1DB]"
          textColor="text-[#A57318]"
          title="Momen Spesial"
        />

        <FooterSection data={data} />

        {data.musicUrl && (
          <AudioPlayer
            src={data.musicUrl}
            isPreview={isPreview}
            isPlayingProp={isPlaying}
            onPlayChange={setIsPlaying}
            activeColor="bg-[#A57318] text-[#F9CB67]"
            inactiveColor="bg-[rgba(250,241,219,0.9)] text-[#A57318]"
          />
        )}
      </div>
    </>
  );
}
