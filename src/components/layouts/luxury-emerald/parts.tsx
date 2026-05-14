'use client';
import { useState, useEffect, useRef } from 'react';
import { Heart, Home, Users, CalendarDays, Camera, MessageCircle, Music, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Flying Birds (3D-like Effect) ── */
export function FlyingBirds() {
  const birds = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    startPos: { x: -50, y: 15 + Math.random() * 60 },
    endPos: { x: 450, y: 10 + Math.random() * 80 },
    delay: Math.random() * 15,
    duration: 15 + Math.random() * 10,
    scale: 0.4 + Math.random() * 0.4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {birds.map((b) => (
        <motion.div
          key={b.id}
          initial={{ x: b.startPos.x, y: `${b.startPos.y}%`, opacity: 0 }}
          animate={{
            x: b.endPos.x,
            y: [`${b.startPos.y}%`, `${b.startPos.y - 5}%`, `${b.startPos.y + 5}%`, `${b.endPos.y}%`],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{ scale: b.scale }}
        >
          <svg width="40" height="30" viewBox="0 0 40 30" className="text-[#d4af37]/40 fill-current">
            <path d="M0,15 C5,10 15,0 20,15 C25,0 35,10 40,15 C35,20 25,30 20,15 C15,30 5,20 0,15 Z">
              <animate 
                attributeName="d" 
                dur="0.6s" 
                repeatCount="indefinite"
                values="
                  M0,15 C5,10 15,0 20,15 C25,0 35,10 40,15 C35,20 25,30 20,15 C15,30 5,20 0,15 Z;
                  M0,15 C5,5 15,-10 20,15 C25,-10 35,5 40,15 C35,10 25,20 20,15 C15,20 5,10 0,15 Z;
                  M0,15 C5,10 15,0 20,15 C25,0 35,10 40,15 C35,20 25,30 20,15 C15,30 5,20 0,15 Z
                "
              />
            </path>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Floating Flowers (Romantic Effect) ── */
export function FloatingFlowers() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 20,
    duration: 15 + Math.random() * 20,
    size: `${20 + Math.random() * 40}px`,
    rotate: Math.random() * 360,
  }));
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-20">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: '100vh', x: item.left, rotate: 0 }}
          animate={{
            y: '-20vh',
            x: [item.left, `${parseFloat(item.left) + 10}%`, `${parseFloat(item.left) - 10}%`, item.left],
            rotate: item.rotate + 360,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{ width: item.size, height: item.size }}
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="#d4af37" strokeWidth="2" className="w-full h-full">
            <path d="M50 50 Q70 20 50 10 Q30 20 50 50 Z" />
            <path d="M50 50 Q80 70 90 50 Q80 30 50 50 Z" />
            <path d="M50 50 Q70 80 50 90 Q30 80 50 50 Z" />
            <path d="M50 50 Q20 70 10 50 Q20 30 50 50 Z" />
            <circle cx="50" cy="50" r="5" fill="#d4af37" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Gold Particles ── */
export function GoldParticles() {
  const items = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${8 + Math.random() * 12}s`,
    size: `${1 + Math.random() * 3}px`,
    opacity: 0.2 + Math.random() * 0.5,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {items.map((p) => (
        <div key={p.id} className="absolute rounded-full bg-[#d4af37] animate-particle-fall"
          style={{ left: p.left, top: '-5%', opacity: p.opacity, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size }} />
      ))}
    </div>
  );
}

/* ── Cover Page ── */
export function CoverPage({ groomName, brideName, guestName, onOpen }: {
  groomName: string; brideName: string; guestName: string; onOpen: () => void;
}) {
  return (
    <motion.div exit={{ y: '-100%', opacity: 0, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#042f2e] overflow-hidden">
      {/* Ornamental frame */}
      <div className="absolute inset-6 border border-[#d4af37]/30 pointer-events-none" />
      <div className="absolute inset-8 border border-[#d4af37]/15 pointer-events-none" />
      {/* Corner ornaments */}
      {['top-6 left-6','top-6 right-6 rotate-90','bottom-6 right-6 rotate-180','bottom-6 left-6 -rotate-90'].map((pos,i) => (
        <svg key={i} className={`absolute ${pos} w-12 h-12 text-[#d4af37]/40`} viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0,0 L20,0 M0,0 L0,20" /><path d="M5,0 Q0,0 0,5" /><circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.5" />
        </svg>
      ))}
      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-center px-8 relative z-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37]/60 mb-6">The Wedding of</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-1">{groomName}</h1>
        <span className="text-2xl font-display italic text-[#d4af37]/70 block my-2">&amp;</span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white">{brideName}</h1>
        <div className="flex items-center justify-center gap-3 my-8">
          <div className="h-px w-12 bg-[#d4af37]/40" /><Heart className="h-4 w-4 text-[#d4af37] animate-heartbeat" fill="currentColor" /><div className="h-px w-12 bg-[#d4af37]/40" />
        </div>
        <p className="text-xs text-white/50 mb-1">Kepada Yth.</p>
        <p className="text-xs text-white/40 mb-1">Bapak/Ibu/Saudara/i</p>
        <p className="text-lg font-display font-semibold text-[#d4af37] mb-10">{guestName}</p>
        <motion.button onClick={onOpen} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="px-8 py-3 border border-[#d4af37] text-[#d4af37] text-xs font-semibold uppercase tracking-[0.3em] hover:bg-[#d4af37] hover:text-[#042f2e] transition-all duration-500 animate-glow-pulse">
          Buka Undangan
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ── Bottom Navigation ── */
export function BottomNav({ visible, isPreview }: { visible: boolean; isPreview?: boolean }) {
  const [active, setActive] = useState('home');
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'couple', icon: Users, label: 'Mempelai' },
    { id: 'date', icon: CalendarDays, label: 'Tanggal' },
    { id: 'gallery', icon: Camera, label: 'Galeri' },
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
    <nav className="sticky bottom-0 left-0 right-0 z-[100] w-full max-w-lg mx-auto" data-emerald-nav>
      <div className="mx-3 mb-3 flex items-center justify-around bg-[#042f2e]/90 backdrop-blur-xl rounded-2xl border border-[#d4af37]/20 px-2 py-2 shadow-2xl">
        {items.map(i => (
          <a key={i.id} href={`#${i.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: 'smooth' }); }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${active === i.id ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-white/40 hover:text-white/70'}`}>
            <i.icon className="h-4 w-4" /><span className="text-[9px] font-medium">{i.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ── Emerald Audio Player ── */
export function EmeraldAudio({ src, isPreview }: { src: string; isPreview?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
      setPlaying(false);
    } else {
      ref.current.play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.error('Audio playback error:', err);
          setPlaying(false);
        });
    }
  };

  useEffect(() => {
    const audio = ref.current;
    if (audio && !isPreview) {
      // Try to auto-play on mount
      const attemptPlay = () => {
        audio.play()
          .then(() => setPlaying(true))
          .catch(() => {
            // Auto-play might be blocked by browser, wait for interaction
            setPlaying(false);
          });
      };
      
      attemptPlay();
      
      const handleEnded = () => setPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [src, isPreview]);

  const positionClass = isPreview ? 'sticky' : 'fixed';
  return (
    <div className={`${positionClass} bottom-20 right-4 z-[100] flex justify-end`}>
      <audio 
        ref={ref} 
        src={src} 
        loop 
        preload="auto" 
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={(e) => {
          console.error('Audio source error:', e);
          setPlaying(false);
        }}
      >
        <source src={src} type="audio/mpeg" />
        <source src={src} type="audio/wav" />
        <source src={src} type="audio/ogg" />
      </audio>
      <button 
        onClick={toggle} 
        data-emerald-audio
        className={`w-11 h-11 flex items-center justify-center rounded-full shadow-2xl border border-[#d4af37]/30 backdrop-blur-md transition-all duration-300 ${playing ? 'bg-[#d4af37] text-[#042f2e]' : 'bg-[#042f2e]/80 text-[#d4af37] animate-pulse-slow'}`}>
        {playing ? <Pause className="h-4 w-4 fill-current" /> : <Music className="h-4 w-4" />}
      </button>
    </div>
  );
}

/* ── Islamic Ornament Divider ── */
export function IslamicDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 max-w-xs mx-auto">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
      <svg viewBox="0 0 40 40" className="w-8 h-8 text-[#d4af37]/50" fill="currentColor">
        <path d="M20 2l3 8h8l-6.5 5 2.5 8L20 18l-7 5 2.5-8L9 10h8z" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
    </div>
  );
}
