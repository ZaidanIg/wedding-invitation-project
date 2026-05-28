'use client';

import { useEffect, useState, useRef } from 'react';
import { Music, Pause, Clock, Heart, Glasses, Calendar, Camera, BookOpen, MapPin, Coffee, Utensils, CalendarDays } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Lock, Sparkles, MessageCircle, Check } from 'lucide-react';
import SafeQRCodeSVG from '@/components/SafeQRCodeSVG';

import type { Tier, Invitation, Guest } from '@/types';
import { createContext, useContext } from 'react';

/* ── Tier Context & Hooks ── */
export interface TierContextType {
  tier: Tier;
  isPreview: boolean;
}

export const TierContext = createContext<TierContextType>({
  tier: 'BASIC',
  isPreview: false,
});

export function TierProvider({
  tier,
  isPreview,
  children,
}: {
  tier: Tier;
  isPreview: boolean;
  children: React.ReactNode;
}) {
  return (
    <TierContext.Provider value={{ tier, isPreview }}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  return useContext(TierContext);
}

/* ── Tier Ranking ── */
export const TIER_RANK: Record<Tier, number> = {
  'DRAFT': 0,
  'BASIC': 1,
  'PREMIUM': 2,
  'ULTIMATE': 3
};

export function TierGate({ 
  tier, 
  minTier, 
  children,
  fallback = null 
}: { 
  tier: Tier; 
  minTier: Tier; 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const currentRank = TIER_RANK[tier] || 0;
  const requiredRank = TIER_RANK[minTier] || 0;

  if (currentRank >= requiredRank) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}



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
          <Image src={photos[index]} alt="Carousel" fill className="object-cover" />
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
  const { tier, isPreview } = useTier();
  const currentRank = TIER_RANK[tier] || 0;
  const requiredRank = TIER_RANK['PREMIUM'];

  if (currentRank < requiredRank) return null;

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
        <Image src={src} alt={alt} fill className="object-cover" />
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

/* ── Floating Element (Subtle Animation) ── */
export function FloatingElement({ 
  children, 
  delay = 0, 
  duration = 4,
  yOffset = 20,
  className = "" 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  duration?: number;
  yOffset?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Snowfall Effect ── */
export function Snowfall() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            x: Math.random() * 100 + "%",
            y: -20,
            scale: Math.random() * 0.5 + 0.3
          }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            y: "110vh",
            x: (Math.random() * 100 - 50) + "vw"
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
          className="absolute w-2 h-2 bg-white/20 rounded-full blur-[1px]"
        />
      ))}
    </div>
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
  const { tier, isPreview } = useTier();
  const currentRank = TIER_RANK[tier] || 0;
  const requiredRank = TIER_RANK['PREMIUM'];

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

  if (currentRank < requiredRank) return null;

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
  isPreview = false,
  isPlayingProp,
  onPlayChange,
}: {
  src: string;
  activeColor?: string;
  inactiveColor?: string;
  isPreview?: boolean;
  isPlayingProp?: boolean;
  onPlayChange?: (isPlaying: boolean) => void;
}) {
  const { tier } = useTier();
  const currentRank = TIER_RANK[tier] || 0;
  const requiredRank = TIER_RANK['PREMIUM'];

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (currentRank < requiredRank) {
    return null;
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPlayChange?.(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          onPlayChange?.(true);
        }).catch((err) => {
          console.error('Audio playback error:', err);
          setIsPlaying(false);
          onPlayChange?.(false);
        });
      }
    }
  };

  // Sync internal state with external control prop (for cover page autoplay)
  useEffect(() => {
    if (isPlayingProp !== undefined) {
      setIsPlaying(isPlayingProp);
      if (audioRef.current) {
        if (isPlayingProp) {
          audioRef.current.play().catch((err) => {
            console.log('Autoplay blocked or deferred:', err);
          });
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [isPlayingProp]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        setIsPlaying(false);
        onPlayChange?.(false);
      };
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [onPlayChange]);

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
export function resolvePhotos(invitation: any) {
  const photos = invitation.photoUrls && invitation.photoUrls.length > 0 ? invitation.photoUrls : fallbackPhotos;
  
  // New specific fields
  const headerPhoto = invitation.headerPhotoUrl || photos[0];
  const groomPhoto = invitation.groomPhotoUrl || photos[0];
  const bridePhoto = invitation.bridePhotoUrl || photos[0];
  
  // Enforce tier-based gallery photos limit
  const tier = invitation.tier || 'BASIC';
  let limit = 0;
  if (tier === 'PREMIUM') limit = 3;
  else if (tier === 'ULTIMATE') limit = 7;
  
  const galleryPhotos = photos.slice(0, limit);
  
  return {
    photos,
    heroPhoto: headerPhoto,
    photo2: photos[1] || photos[0],
    photo3: photos[2] || photos[0],
    galleryPhotos,
    groomPhoto,
    bridePhoto,
  };
}

/* ── Helper: format date ── */
export function formatEventDate(eventDate: string) {
  if (!eventDate) return { formattedDate: '', dayNumber: '', monthName: '', dayName: '' };
  const date = new Date(eventDate);
  if (isNaN(date.getTime())) return { formattedDate: '', dayNumber: '', monthName: '', dayName: '' };
  
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

/* ── Helper: calendar URL ── */
export function getCalendarUrl(eventName: string, eventDate: string, eventTime: string, venueName: string, venueAddress: string) {
  if (!eventDate || !eventTime) return '#';
  const [year, month, day] = eventDate.split('-');
  const [hour, min] = eventTime.split(':');
  
  const start = `${year}${month}${day}T${hour}${min}00`;
  let endHour = parseInt(hour, 10) + 2;
  const end = `${year}${month}${day}T${endHour.toString().padStart(2, '0')}${min}00`;
  
  const text = encodeURIComponent(`Acara: ${eventName}`);
  const details = encodeURIComponent(`Acara kami di ${venueName}`);
  const location = encodeURIComponent(`${venueName}, ${venueAddress}`);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function EventActionButtons({
  eventName,
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  containerClass = "flex flex-col sm:flex-row gap-3 mt-6",
  buttonClass = "flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
}: {
  eventName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  containerClass?: string;
  buttonClass?: string;
}) {
  const mapsUrl = getMapsUrl(venueName, venueAddress);
  const calendarUrl = getCalendarUrl(eventName, eventDate, eventTime, venueName, venueAddress);

  return (
    <div className={containerClass}>
      <button onClick={() => window.open(mapsUrl, '_blank')} className={`${buttonClass} bg-stone-900 text-white hover:bg-stone-800`}>
        <MapPin size={14} /> Google Maps
      </button>
      <button onClick={() => window.open(calendarUrl, '_blank')} className={`${buttonClass} bg-stone-100 text-stone-900 hover:bg-stone-200`}>
        <Calendar size={14} /> Simpan Kalender
      </button>
    </div>
  );
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
export function IconMapper({ name, className, size = 20, strokeWidth = 2 }: { name: string; className?: string; size?: number; strokeWidth?: number }) {
  const iconName = name.toLowerCase();
  switch (iconName) {
    case 'clock':
    case 'time':
      return <Clock className={className} size={size} strokeWidth={strokeWidth} />;
    case 'heart':
    case 'love':
      return <Heart className={className} size={size} strokeWidth={strokeWidth} />;
    case 'glasses':
      return <Glasses className={className} size={size} strokeWidth={strokeWidth} />;
    case 'calendar':
    case 'date':
      return <Calendar className={className} size={size} strokeWidth={strokeWidth} />;
    case 'calendar-days':
      return <CalendarDays className={className} size={size} strokeWidth={strokeWidth} />;
    case 'music':
      return <Music className={className} size={size} strokeWidth={strokeWidth} />;
    case 'camera':
      return <Camera className={className} size={size} strokeWidth={strokeWidth} />;
    case 'map-pin':
    case 'location':
      return <MapPin className={className} size={size} strokeWidth={strokeWidth} />;
    case 'coffee':
      return <Coffee className={className} size={size} strokeWidth={strokeWidth} />;
    case 'utensils':
    case 'food':
      return <Utensils className={className} size={size} strokeWidth={strokeWidth} />;
    default:
      return <Heart className={className} size={size} strokeWidth={strokeWidth} />;
  }
}

export function DetailItem({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value: string, className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-[10px] opacity-60 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="font-medium text-sm leading-tight text-white">{value}</p>
      </div>
    </div>
  );
}
export function WishesSection({ invitation }: { invitation: Invitation }) {
  const { tier, isPreview } = useTier();
  const currentRank = TIER_RANK[tier] || 0;
  const requiredRank = TIER_RANK['PREMIUM'];

  const [wishes, setWishes] = useState<Guest[]>(invitation.guests || []);
  const [name, setName] = useState(invitation.rsvpName || '');
  const [phone, setPhone] = useState(invitation.rsvpPhone || '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'ATTENDING' | 'NOT_ATTENDING' | 'PENDING'>(invitation.rsvpStatus || 'ATTENDING');
  const [sending, setSending] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(invitation.rsvpGuestId || null);
  const [isSubmitted, setIsSubmitted] = useState(invitation.rsvpSubmitted || false);

  if (currentRank < requiredRank) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invitation.rsvpSubmitted) {
      if (!message.trim()) return;
    } else {
      if (!name.trim() || !phone.trim() || !message.trim()) return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/invitations/${invitation.slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: invitation.rsvpSubmitted ? invitation.rsvpName : name.trim(),
          phone: invitation.rsvpSubmitted ? invitation.rsvpPhone : phone.trim(),
          message: message.trim(),
          rsvpStatus: invitation.rsvpSubmitted ? invitation.rsvpStatus : status,
          attendees: 1,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWishes([data.data, ...wishes]);
        setGuestId(data.data.id);
        setIsSubmitted(true);
        setName(data.data.name);
        setPhone(data.data.phone);
        setMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const isQrAvailable = (invitation.tier === 'PREMIUM' || invitation.tier === 'ULTIMATE') && invitation.qrEnabled !== false;

  if (isSubmitted && isQrAvailable && status === 'ATTENDING' && guestId) {
    return (
       <div className="max-w-md mx-auto text-center bg-white p-10 rounded-[3rem] shadow-xl border border-stone-100 animate-fade-in">

          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
             <Check className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-display font-bold text-stone-800 mb-2">Terima Kasih!</h3>
          <p className="text-sm text-stone-500 mb-8 px-4">Kehadiran Anda sangat berarti bagi kami. Berikut QR Code untuk check-in:</p>
          
          <div className="bg-white p-4 rounded-3xl border border-stone-50 inline-block shadow-sm">
             <SafeQRCodeSVG value={guestId} size={180} level="H" />
          </div>
          
          <p className="mt-8 text-[10px] text-stone-400 uppercase tracking-widest leading-loose">
            Simpan QR Code ini untuk<br />ditunjukkan pada saat acara
          </p>
          
          <button 
            onClick={() => setIsSubmitted(false)}
            className="mt-10 text-xs font-bold text-rose-500 uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            Lihat Ucapan Lainnya
          </button>
       </div>
    );
  }

  return (
    <div className="space-y-12">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-left bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
        {invitation.rsvpSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center mb-4">
            <p className="text-xs font-bold text-emerald-600 mb-1">✓ Anda Telah Mengisi RSVP</p>
            <p className="text-[10px] text-stone-500 font-medium">
              Nama: <span className="font-bold text-stone-700">{invitation.rsvpName}</span> • Kehadiran: <span className="font-bold text-stone-700">{invitation.rsvpStatus === 'ATTENDING' ? 'Hadir' : 'Absen'}</span>
            </p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                required
                className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-1 focus:ring-stone-200 transition-all text-stone-800 placeholder:text-stone-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Nomor WhatsApp *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                required
                className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-1 focus:ring-stone-200 transition-all text-stone-800 placeholder:text-stone-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Kehadiran</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'ATTENDING', label: 'Hadir', icon: '😊' },
                  { id: 'NOT_ATTENDING', label: 'Maaf, Tidak Bisa', icon: '😔' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStatus(opt.id as any)}
                    className={`py-4 rounded-2xl text-xs font-bold transition-all border ${status === opt.id ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'}`}
                  >
                    <span className="block mb-1 text-lg">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Ucapan & Doa</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis ucapan selamat & doa..."
            rows={4}
            className="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-1 focus:ring-stone-200 transition-all text-stone-800 placeholder:text-stone-300 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={sending || (!invitation.rsvpSubmitted && !name.trim()) || !message.trim()}
          className="w-full py-4 bg-[#1c1c1c] text-white rounded-2xl font-bold hover:bg-stone-800 transition-all disabled:opacity-50 shadow-lg active:scale-95"
        >
          {sending ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </form>

      <div className="max-w-2xl mx-auto space-y-6 max-h-[400px] overflow-y-auto no-scrollbar px-2">
        {wishes.map((wish, i) => (
          <motion.div
            key={wish.id || i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-stone-200" />
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-stone-800 text-sm">{wish.name}</h4>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${wish.rsvpStatus === 'ATTENDING' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-50 text-stone-400'}`}>
                {wish.rsvpStatus === 'ATTENDING' ? 'Hadir' : 'Absen'}
              </span>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed italic">"{wish.message}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
