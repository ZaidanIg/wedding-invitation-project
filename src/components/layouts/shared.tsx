'use client';

import { useEffect, useState, useRef } from 'react';
import { Music, Pause, Clock, Heart, Glasses, Calendar, Camera, BookOpen } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/* ── Photo Carousel (Fade Animation) ── */
export function PhotoCarousel({ photos, className = "" }: { photos: string[]; className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos]);

  if (!photos.length) return null;

  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] mx-4 sm:mx-8 shadow-2xl border border-white/10 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src={photos[index]} alt="Carousel" className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {photos.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
}

/* ── Floral Divider ── */
export function FloralDivider({ color = "#8b5e3c", imageSrc, className = "" }: { color?: string; imageSrc?: string; className?: string }) {
  if (imageSrc) {
    return (
      <div className={`flex items-center justify-between w-full px-2 sm:px-6 ${className}`}>
        <div className="relative w-24 h-24 opacity-80 rotate-[15deg]" style={{ filter: 'sepia(100%) saturate(300%) brightness(40%) hue-rotate(5deg)' }}>
          <Image src={imageSrc} alt="Flower" fill className="object-contain" unoptimized />
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-10 mx-2" style={{ color }} />
        <div className="relative w-24 h-24 opacity-80 scale-x-[-1] -rotate-[15deg]" style={{ filter: 'sepia(100%) saturate(300%) brightness(40%) hue-rotate(5deg)' }}>
          <Image src={imageSrc} alt="Flower" fill className="object-contain" unoptimized />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between w-full px-4 sm:px-12 opacity-40 ${className}`}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-45">
        <circle cx="20" cy="20" r="4" fill={color} />
        <ellipse cx="20" cy="10" rx="4" ry="8" fill={color} />
        <ellipse cx="20" cy="30" rx="4" ry="8" fill={color} />
        <ellipse cx="10" cy="20" rx="8" ry="4" fill={color} />
        <ellipse cx="30" cy="20" rx="8" ry="4" fill={color} />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-10 mx-4" style={{ color }} />
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="-rotate-45">
        <circle cx="20" cy="20" r="4" fill={color} />
        <ellipse cx="20" cy="10" rx="4" ry="8" fill={color} />
        <ellipse cx="20" cy="30" rx="4" ry="8" fill={color} />
        <ellipse cx="10" cy="20" rx="8" ry="4" fill={color} />
        <ellipse cx="30" cy="20" rx="8" ry="4" fill={color} />
      </svg>
    </div>
  );
}

/* ── Love Story Section ── */
export function LoveStorySection({ 
  story, 
  bgColor = "bg-[#042f2e]", 
  accentColor = "text-[#d4af37]", 
  textColor = "text-white",
  floralImage
}: { 
  story: any[]; 
  bgColor?: string; 
  accentColor?: string; 
  textColor?: string;
  floralImage?: string;
}) {
  if (!story || story.length === 0) return null;

  return (
    <section id="story" className={`py-24 px-8 ${bgColor} text-center relative overflow-hidden`}>
      <div className="relative z-10 mt-12">
        <FloralDivider color="#8b5e3c" imageSrc={floralImage} className="mb-12" />
        
        <AnimatedSection>
          <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
            <BookOpen className={`h-5 w-5 ${accentColor}`} />
          </div>
          <h2 className={`text-2xl font-display font-bold ${textColor} mb-2`}>Our Love Story</h2>
          <p className={`text-[10px] uppercase tracking-[0.3em] ${accentColor} opacity-60 mb-16`}>Perjalanan Cinta Kami</p>
        </AnimatedSection>

        <div className="max-w-md mx-auto relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2" />

          {story.map((item, idx) => (
            <div key={item.id} className={`relative mb-20 last:mb-0 ${idx % 2 === 0 ? 'text-right pr-[50%] mr-8' : 'text-left pl-[50%] ml-8'}`}>
              <AnimatedSection animation={idx % 2 === 0 ? 'left' : 'right'}>
                {/* Year Bubble */}
                <div className={`absolute top-0 w-12 h-12 rounded-full ${bgColor} border border-white/20 flex items-center justify-center z-10 ${idx % 2 === 0 ? '-right-14' : '-left-14'}`}>
                  <span className={`text-[10px] font-bold ${accentColor}`}>{item.year}</span>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl">
                  <h3 className={`text-lg font-display font-bold ${textColor} mb-2`}>{item.title}</h3>
                  <p className={`text-sm ${textColor} opacity-60 leading-relaxed italic`}>&ldquo;{item.description}&rdquo;</p>
                </div>
              </AnimatedSection>
            </div>
          ))}
        </div>

        <AnimatedSection delay="delay-500">
          <div className="mt-16">
            <Heart className={`h-6 w-6 ${accentColor} mx-auto animate-pulse`} fill="currentColor" />
          </div>
        </AnimatedSection>

        <FloralDivider color="#8b5e3c" imageSrc={floralImage} className="mt-20" />
      </div>
    </section>
  );
}

/* ── Parallax Image Effect ── */
export function ParallaxImage({ src, alt, className = "", rounded = true }: { src: string; alt: string; className?: string; rounded?: boolean }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${rounded ? 'rounded-[2rem] mx-4 sm:mx-8' : ''} ${className} shadow-xl border border-white/10`}>
      <motion.div style={{ y, height: "130%", top: "-15%" }} className="absolute inset-0 w-full">
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}

export function ParallaxSection({ children, speed = 0.5 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 20}%`]);
  
  return (
    <motion.div ref={ref} style={{ y }} className="relative z-0">
      {children}
    </motion.div>
  );
}

/* ── Animated Section Wrapper (3D Smooth Fade) ── */
export function AnimatedSection({
  children,
  className = '',
  animation = 'up',
  delay = '',
}: {
  children: React.ReactNode;
  className?: string;
  animation?: 'up' | 'left' | 'right' | 'scale';
  delay?: string;
}) {
  const delayNum = delay && delay.startsWith('delay-') 
    ? parseInt(delay.replace('delay-', ''), 10) / 1000 
    : 0;

  const getVariants = () => {
    switch (animation) {
      case 'left':
        return {
          hidden: { opacity: 0, x: -60, rotateY: -15, scale: 0.95 },
          visible: { opacity: 1, x: 0, rotateY: 0, scale: 1 }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: 60, rotateY: 15, scale: 0.95 },
          visible: { opacity: 1, x: 0, rotateY: 0, scale: 1 }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8, rotateX: 20 },
          visible: { opacity: 1, scale: 1, rotateX: 0 }
        };
      case 'up':
      default:
        return {
          hidden: { opacity: 0, y: 60, rotateX: -20, scale: 0.95 },
          visible: { opacity: 1, y: 0, rotateX: 0, scale: 1 }
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={getVariants()}
      transition={{ 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1], 
        delay: delayNum 
      }}
      className={className}
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}


/* ── Quotes Section ── */
export function QuotesSection({ 
  text, 
  textColor = "text-stone-800", 
  bgColor = "bg-white" 
}: { 
  text: string; 
  textColor?: string; 
  bgColor?: string; 
}) {
  if (!text) return null;

  return (
    <section className={`py-24 px-8 ${bgColor} text-center relative overflow-hidden`}>
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-10">
              <BookOpen className={`h-24 w-24 ${textColor}`} />
            </div>
            
            <div className="relative z-10 pt-8">
              <p className={`text-2xl md:text-3xl font-display italic leading-relaxed ${textColor} mb-8`}>
                "{text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className={`h-px w-12 ${textColor} opacity-20`} />
                <Heart className={`h-5 w-5 ${textColor} opacity-40`} />
                <div className={`h-px w-12 ${textColor} opacity-20`} />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── Countdown Timer ── */
export function CountdownTimer({
  targetDate,
  textColor = 'text-stone-800',
  labelColor = 'text-stone-400',
  separatorColor = 'text-stone-300',
}: {
  targetDate: string;
  textColor?: string;
  labelColor?: string;
  separatorColor?: string;
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  const blocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-5 px-1 max-w-full overflow-hidden">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-1 sm:gap-5">
          <div className="text-center min-w-[42px] sm:min-w-[70px]">
            <div className={`text-2xl sm:text-5xl font-display font-bold ${textColor} tabular-nums transition-all duration-300 leading-none`}>
              {String(block.value).padStart(2, '0')}
            </div>
            <div className={`text-[7px] sm:text-[10px] uppercase tracking-widest ${labelColor} mt-1.5`}>
              {block.label}
            </div>
          </div>
          {i < blocks.length - 1 && (
            <span className={`text-xl sm:text-4xl ${separatorColor} font-light -mt-4 opacity-40`}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Audio Player ── */
export function AudioPlayer({
  src,
  activeColor = 'bg-stone-800 text-[#f5f0eb] hover:bg-stone-700',
  inactiveColor = 'bg-white/80 text-stone-800 hover:bg-white',
}: {
  src: string;
  activeColor?: string;
  inactiveColor?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.error('Audio playback error:', err);
          setIsPlaying(false);
        });
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        onClick={togglePlay}
        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-md ${
          isPlaying ? activeColor : `${inactiveColor} animate-pulse-slow`
        }`}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 fill-current" />
        ) : (
          <Music className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

/* ── Torn Paper Edge SVGs ── */
export function TornEdgeTop({ fill = '#f5f0eb' }: { fill?: string }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none">
      <svg viewBox="0 0 500 30" preserveAspectRatio="none" className="w-full h-full">
        <path d="M0,0 L0,22 Q25,30 50,22 Q75,14 100,22 Q125,30 150,22 Q175,14 200,22 Q225,30 250,22 Q275,14 300,22 Q325,30 350,22 Q375,14 400,22 Q425,30 450,22 Q475,14 500,22 L500,0 Z" fill={fill} />
      </svg>
    </div>
  );
}

export function TornEdgeBottom({ fill = '#f5f0eb' }: { fill?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-6 z-10 pointer-events-none">
      <svg viewBox="0 0 500 30" preserveAspectRatio="none" className="w-full h-full">
        <path d="M0,30 L0,8 Q25,0 50,8 Q75,16 100,8 Q125,0 150,8 Q175,16 200,8 Q225,0 250,8 Q275,16 300,8 Q325,0 350,8 Q375,16 400,8 Q425,0 450,8 Q475,16 500,8 L500,30 Z" fill={fill} />
      </svg>
    </div>
  );
}

/* ── Dramatic Wave Dividers ── */
export function WaveDivider({ fill = '#faf7f0', position = 'top', flip = false }: { fill?: string; position?: 'top' | 'bottom'; flip?: boolean }) {
  return (
    <div className={`absolute left-0 right-0 w-full h-16 z-10 pointer-events-none ${position === 'top' ? 'top-[-1px]' : 'bottom-[-1px]'} ${flip ? 'scale-x-[-1]' : ''}`}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={`w-full h-full ${position === 'bottom' ? 'rotate-180' : ''} scale-y-105`}>
        <path fill={fill} d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,80C1120,75,1280,85,1360,90.7L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" />
      </svg>
    </div>
  );
}

export function CurvedDivider({ fill = '#faf7f0', position = 'top' }: { fill?: string; position?: 'top' | 'bottom' }) {
  return (
    <div className={`absolute left-0 right-0 w-full h-10 z-10 pointer-events-none ${position === 'top' ? 'top-0' : 'bottom-0'}`}>
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className={`w-full h-full ${position === 'bottom' ? 'rotate-180' : ''}`}>
        <path d="M0 0 Q 50 10 100 0 L 100 0 L 0 0 Z" fill={fill} />
      </svg>
    </div>
  );
}


/* ── Fallback Photos ── */
export const fallbackPhotos = [
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
];

/* ── Helper: resolve photos ── */
export function resolvePhotos(invitation: { photoUrls: string[] }) {
  const photos = invitation.photoUrls && invitation.photoUrls.length > 0 ? invitation.photoUrls : fallbackPhotos;
  return {
    photos,
    heroPhoto: photos[0],
    photo2: photos[1] || photos[0],
    photo3: photos[2] || photos[0],
    galleryPhotos: photos.slice(1),
  };
}

/* ── Helper: format date ── */
export function formatEventDate(eventDate: string) {
  const date = new Date(eventDate);
  return {
    formattedDate: date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    dayNumber: date.getDate(),
    monthName: date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase(),
    dayName: date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
  };
}

/* ── Helper: maps URL ── */
export function getMapsUrl(venueName: string, venueAddress: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName + ', ' + venueAddress)}`;
}

/* ── Digital Gift (Angpao) ── */
export function DigitalGiftSection({ 
  gifts, 
  bgColor = "bg-white", 
  textColor = "text-stone-800" 
}: { 
  gifts: any[]; 
  bgColor?: string; 
  textColor?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!gifts || gifts.length === 0) return null;

  const handleCopy = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(accountNumber);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className={`py-24 px-8 ${bgColor} text-center relative overflow-hidden`}>
      {/* Subtle Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-20 animate-float">
        <Heart className="h-20 w-20 text-rose-200" fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 animate-float-delayed scale-75">
        <Heart className="h-24 w-24 text-rose-300" fill="currentColor" />
      </div>

      <div className="relative z-10">
        <AnimatedSection>
          <div className="inline-flex p-3 rounded-full bg-current opacity-5 mb-4 relative">
            <Heart className="h-5 w-5 text-rose-500 relative z-10" fill="currentColor" />
          </div>
          <h2 className={`text-2xl font-display font-bold ${textColor} mb-2`}>Wedding Gift</h2>
          <p className="text-sm opacity-60 mb-12 leading-relaxed max-w-xs mx-auto">
            Doa restu Anda sudah lebih dari cukup. Namun bagi Anda yang ingin memberikan tanda kasih, dapat melalui:
          </p>
        </AnimatedSection>

        <div className="space-y-6 max-w-sm mx-auto">
          {gifts.map((gift, idx) => (
            <AnimatedSection key={idx} animation="scale" delay={`delay-${idx * 100}`}>
              <div className="p-8 rounded-[2rem] bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-stone-100 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent opacity-50" />
                
                <div className="absolute -top-6 -right-6 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                  <Heart className="h-32 w-32 text-rose-900" />
                </div>
                
                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-3 font-bold">{gift.bankName}</p>
                  <p className="text-xl font-display font-bold text-stone-800 mb-2 tracking-wider">{gift.accountNumber}</p>
                  <p className="text-xs text-stone-500 mb-6 font-medium">Atas Nama: <span className="text-stone-800 uppercase">{gift.accountHolder}</span></p>
                  
                  <button
                    onClick={() => handleCopy(gift.accountNumber)}
                    className="group relative inline-flex items-center gap-3 px-8 py-3 bg-stone-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:pr-10"
                  >
                    <span className="relative z-10">{copied === gift.accountNumber ? 'Tersalin!' : 'Salin Nomor'}</span>
                    <div className="absolute inset-0 bg-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    {copied !== gift.accountNumber && (
                      <svg className="w-3 h-3 relative z-10 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ── Guest Welcome (Personalized Greeting) ── */
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export function GuestWelcome({ defaultText = "You" }: { defaultText?: string }) {
  return (
    <Suspense fallback={null}>
      <GuestWelcomeContent defaultText={defaultText} />
    </Suspense>
  );
}

function GuestWelcomeContent({ defaultText }: { defaultText: string }) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to');

  if (!guestName) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="mt-8 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 inline-block"
    >
      <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Exclusive Invitation for</p>
      <p className="text-xl font-display font-bold text-white uppercase tracking-wider">{guestName}</p>
    </motion.div>
  );
}

/* ── Helper: Icon Mapper ── */
export function IconMapper({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'clock':
      return <Clock className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'glasses':
      return <Glasses className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'music':
      return <Music className={className} />;
    case 'camera':
      return <Camera className={className} />;
    default:
      return <Heart className={className} />;
  }
}
