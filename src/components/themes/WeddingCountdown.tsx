'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock } from 'lucide-react';

interface WeddingCountdownProps {
  eventDate: string; // ISO date string
  groomName: string;
  brideName: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft | null {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={display}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-[#1c1c1c] text-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-display font-bold shadow-xl shadow-black/20">
              {display}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[#6b6b6b]">{label}</span>
    </div>
  );
}

export default function WeddingCountdown({ eventDate, groomName, brideName }: WeddingCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calculateTimeLeft(eventDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(eventDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  const daysLeft = timeLeft?.days ?? 0;
  const urgencyColor =
    daysLeft <= 0 ? 'text-emerald-600' :
    daysLeft <= 14 ? 'text-rose-600' :
    daysLeft <= 30 ? 'text-amber-600' :
    'text-[#1c1c1c]';

  const urgencyBg =
    daysLeft <= 0 ? 'bg-emerald-50 border-emerald-100' :
    daysLeft <= 14 ? 'bg-rose-50 border-rose-100' :
    daysLeft <= 30 ? 'bg-amber-50 border-amber-100' :
    'bg-[#fdfcf9] border-[#eceae4]';

  if (!timeLeft) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[2rem] border p-6 sm:p-8 ${urgencyBg} text-center`}
      >
        <div className="inline-flex p-3 rounded-2xl bg-emerald-100 mb-4">
          <Heart className="h-6 w-6 text-emerald-600 fill-emerald-600" />
        </div>
        <h3 className="text-xl font-display font-bold text-[#1c1c1c] mb-1">
          Hari Istimewa Telah Tiba!
        </h3>
        <p className="text-[#6b6b6b] text-sm">
          Selamat untuk {groomName} & {brideName} ✨
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[2rem] border p-6 sm:p-8 ${urgencyBg}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-[#6b6b6b]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6b6b6b]">Hitung Mundur</span>
          </div>
          <h3 className="text-lg font-display font-bold text-[#1c1c1c] leading-tight">
            Menuju Hari Istimewa
          </h3>
          <p className="text-sm text-[#6b6b6b] mt-0.5">
            {groomName} <span className="text-rose-400 font-handwriting">&</span> {brideName}
          </p>
        </div>
        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl font-display font-bold shadow-sm border ${urgencyBg}`}>
          <span className={`text-2xl font-bold ${urgencyColor}`}>{daysLeft}</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#6b6b6b]">Hari</span>
        </div>
      </div>

      {/* Flip units */}
      <div className="flex items-end justify-center gap-3 sm:gap-4">
        <FlipUnit value={timeLeft.days} label="Hari" />
        <div className="text-2xl font-bold text-[#6b6b6b] mb-4">:</div>
        <FlipUnit value={timeLeft.hours} label="Jam" />
        <div className="text-2xl font-bold text-[#6b6b6b] mb-4">:</div>
        <FlipUnit value={timeLeft.minutes} label="Menit" />
        <div className="text-2xl font-bold text-[#6b6b6b] mb-4">:</div>
        <FlipUnit value={timeLeft.seconds} label="Detik" />
      </div>

      {/* Urgency message */}
      {daysLeft <= 30 && daysLeft > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-center"
        >
          <p className={`text-xs font-bold ${urgencyColor}`}>
            {daysLeft <= 14
              ? '🔴 Tinggal 2 minggu lagi — pastikan semua persiapan sudah selesai!'
              : '🟡 Kurang dari sebulan — segera bagikan undangan Anda!'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
