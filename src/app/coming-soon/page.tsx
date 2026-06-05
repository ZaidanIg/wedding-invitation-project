'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

const LAUNCH_DATE = new Date('2026-06-11T17:00:00Z').getTime();

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = LAUNCH_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        window.location.href = '/'; // Redirect if ready
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fdfcf9] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-rose-100/40 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-rose-100/30 blur-[120px]" />
        <div className="absolute top-0 w-full h-full bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative w-64 h-20 mx-auto">
            <Image
              src="/images/logo.png"
              alt="Sahinaja"
              fill
              className="object-contain scale-[1.5]"
              priority
              unoptimized
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-playfair text-4xl md:text-6xl font-bold text-[#1c1c1c] mb-4"
        >
          Sesuatu yang Luar Biasa <br />
          <span className="text-transparent bg-clip-text bg-rose-gradient">Segera Hadir</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[#6b6b6b] text-lg md:text-xl mb-12 max-w-lg mx-auto"
        >
          Platform undangan pernikahan digital premium terbaik di Indonesia sedang bersiap untuk peluncuran resminya.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-4 md:gap-6 mb-16"
        >
          {[
            { label: 'Hari', value: timeLeft.days },
            { label: 'Jam', value: timeLeft.hours },
            { label: 'Menit', value: timeLeft.minutes },
            { label: 'Detik', value: timeLeft.seconds },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 glass bg-white/50 border border-rose-500/10 rounded-2xl flex items-center justify-center mb-2 shadow-xl shadow-rose-500/5">
                <span className="font-playfair text-2xl md:text-4xl font-bold text-[#1c1c1c]">
                  {item.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-xs md:text-sm font-semibold text-[#6b6b6b] uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="glass bg-white/60 p-2 border border-rose-500/10 rounded-2xl shadow-2xl shadow-rose-500/5">
            {status === 'success' ? (
              <div className="flex items-center justify-center gap-3 p-3 text-emerald-600 font-semibold animate-fade-in">
                <CheckCircle2 className="w-5 h-5" />
                <span>Terima kasih! Anda masuk dalam daftar antrean.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 relative">
                <input
                  type="email"
                  required
                  placeholder="Masukkan email Anda..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[#1c1c1c] px-4 py-3 text-sm placeholder:text-[#6b6b6b]/60"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-rose-gradient text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {status === 'loading' ? 'Memproses...' : (
                    <>
                      <span>Kabari Saya</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          <p className="text-xs text-[#6b6b6b]/60 mt-4 font-medium">
            Jadilah yang pertama tahu saat kami rilis dan dapatkan penawaran khusus peluncuran!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
