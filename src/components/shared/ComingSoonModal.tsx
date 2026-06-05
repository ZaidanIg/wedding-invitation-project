'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const LAUNCH_DATE = new Date('2026-06-11T17:00:00Z').getTime();

export default function ComingSoonModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Show modal automatically on mount
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = LAUNCH_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        window.location.reload(); // Reload to remove lock if time is up
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

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/80 backdrop:backdrop-blur-sm bg-transparent w-full max-w-lg mx-auto p-4 rounded-3xl m-auto"
      onCancel={(e) => e.preventDefault()} // Prevent Escape key from closing it
    >
      <div className="bg-[#fdfcf9] rounded-3xl p-8 md:p-10 text-center relative overflow-hidden shadow-2xl border border-rose-500/10">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-rose-gradient" />
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-rose-100/40 blur-[50px] pointer-events-none" />

        <div className="relative z-10">
          <div className="relative w-48 h-12 mx-auto mb-6">
            <Image
              src="/images/logo.png"
              alt="Sahinaja"
              fill
              className="object-contain scale-[1.5]"
              priority
              unoptimized
            />
          </div>

          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[#1c1c1c] mb-3">
            Pembuatan Undangan <br /> <span className="text-rose-500">Dikunci Sementara</span>
          </h2>
          
          <p className="text-[#6b6b6b] text-sm mb-8">
            Fitur pembuatan undangan (*checkout*) baru akan dibuka pada saat <b>Grand Launching</b> kami. Harap bersabar sedikit lagi!
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-3 md:gap-4 mb-10">
            {[
              { label: 'Hari', value: timeLeft.days },
              { label: 'Jam', value: timeLeft.hours },
              { label: 'Menit', value: timeLeft.minutes },
              { label: 'Detik', value: timeLeft.seconds },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white border border-rose-500/20 rounded-xl flex items-center justify-center mb-2 shadow-lg shadow-rose-500/5">
                  <span className="font-playfair text-xl md:text-2xl font-bold text-[#1c1c1c]">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#1c1c1c] hover:bg-black text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
      
      {/* Global CSS for dialog removal of native borders */}
      <style>{`
        dialog { border: none; }
      `}</style>
    </dialog>
  );
}
