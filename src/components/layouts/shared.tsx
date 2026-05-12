'use client';

import { useEffect, useState, useRef } from 'react';
import { Music, Pause, Clock, Heart, Glasses, Calendar, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-3 sm:gap-5">
          <div className="text-center">
            <div className={`text-3xl sm:text-5xl font-display font-bold ${textColor} tabular-nums transition-all duration-300`}>
              {String(block.value).padStart(2, '0')}
            </div>
            <div className={`text-[10px] sm:text-xs uppercase tracking-widest ${labelColor} mt-1`}>
              {block.label}
            </div>
          </div>
          {i < blocks.length - 1 && (
            <span className={`text-2xl sm:text-4xl ${separatorColor} font-light -mt-4`}>:</span>
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
    <div className="absolute top-0 left-0 right-0 h-6 z-10">
      <svg viewBox="0 0 500 30" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M0,0 L0,22 Q25,30 50,22 Q75,14 100,22 Q125,30 150,22 Q175,14 200,22 Q225,30 250,22 Q275,14 300,22 Q325,30 350,22 Q375,14 400,22 Q425,30 450,22 Q475,14 500,22 L500,0 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export function TornEdgeBottom({ fill = '#f5f0eb' }: { fill?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-6 z-10">
      <svg viewBox="0 0 500 30" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M0,30 L0,8 Q25,0 50,8 Q75,16 100,8 Q125,0 150,8 Q175,16 200,8 Q225,0 250,8 Q275,16 300,8 Q325,0 350,8 Q375,16 400,8 Q425,0 450,8 Q475,16 500,8 L500,30 Z"
          fill={fill}
        />
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
