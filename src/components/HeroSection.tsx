'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Wedding Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-[#f7f4ed]/80 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Subtle Accent */}
        <div className="mb-6 flex items-center justify-center gap-3 animate-fade-in">
          <span className="h-px w-8 bg-[#1c1c1c]/20" />
          <span className="font-handwriting text-2xl text-[#1c1c1c]/60">Cerita cinta Anda...</span>
          <span className="h-px w-8 bg-[#1c1c1c]/20" />
        </div>

        {/* Heading */}
        <h1 className="text-[52px] sm:text-[72px] md:text-[88px] font-display font-bold leading-[1.1] tracking-[-2px] text-[#1c1c1c] mb-10 animate-fade-in-up">
          Rayakan Momen <br />
          <span className="italic font-normal text-highlight">Terindah</span> Bersama
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-[#5f5f5d] max-w-2xl mx-auto mb-14 leading-[1.5] animate-fade-in-up delay-200">
          Undangan digital yang terasa <span className="text-[#1c1c1c] border-b border-highlight/30">personal</span>. 
          Hanya butuh 5 menit untuk menyusun undangan pernikahan yang elegan, mewah, dan berkesan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
          <Link
            href="/create"
            className="group relative inline-flex items-center gap-3 px-10 py-5 text-lg font-bold rounded-lg bg-[#1c1c1c] text-[#fcfbf8] shadow-inset hover:opacity-95 transition-all duration-500 hover:scale-[1.02]"
          >
            Buat Undangan Sekarang
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/pricing"
            className="text-[#1c1c1c] font-bold text-lg hover:opacity-70 border-b-2 border-[#1c1c1c]/10 pb-1 transition-all"
          >
            Lihat Paket Hemat
          </Link>
        </div>

        {/* Floating Accents */}
        <div className="absolute hidden lg:block left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 font-handwriting text-[120px] text-[#1c1c1c]/[0.03] rotate-[-90deg] select-none">
          Wedding
        </div>
        <div className="absolute hidden lg:block right-0 top-1/2 -translate-y-1/2 translate-x-1/2 font-handwriting text-[120px] text-[#1c1c1c]/[0.03] rotate-[90deg] select-none">
          Invitation
        </div>
      </div>
    </section>
  );
}
