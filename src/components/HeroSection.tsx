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
          className="object-cover opacity-[0.15]"
          priority
        />
        <div className="absolute inset-0 bg-[#fdfcf9]/60 backdrop-blur-[2px]" />
        
        {/* Rose Blurs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full animate-float-delayed" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle Accent */}
        <div className="mb-8 flex items-center justify-center gap-4 animate-fade-in">
          <div className="p-2 rounded-xl bg-rose-500/5">
          </div>
          <span className="font-handwriting text-2xl text-[#1c1c1c]/60">Cerita cinta Anda...</span>
          <div className="p-2 rounded-xl bg-rose-500/5">
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-[84px] md:text-[100px] font-display font-bold leading-[0.95] tracking-tight sm:tracking-[-0.04em] text-[#1c1c1c] mb-12 animate-fade-in-up">
          Rayakan Momen <br />
          <span className="text-rose-500 italic font-normal">Terindah</span> Bersama
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#6b6b6b] max-w-2xl mx-auto mb-16 leading-relaxed animate-fade-in-up delay-200 text-balance">
          Wujudkan visi pernikahan Anda dalam <span className="text-[#1c1c1c] font-semibold underline decoration-rose-500/30 underline-offset-8">5 menit</span>. 
          Undangan digital yang mewah, elegan, dan siap memikat tamu Anda.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
          <Link
            href="/create"
            className="group relative inline-flex items-center gap-4 px-12 py-5 text-lg font-bold rounded-2xl bg-rose-gradient text-white shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all duration-500"
          >
            Mulai Buat Undangan
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/pricing"
            className="flex items-center gap-2 text-[#1c1c1c] font-bold text-lg hover:text-rose-500 transition-colors"
          >
            Lihat Paket Harga
            <Sparkles className="h-4 w-4 text-rose-400" />
          </Link>
        </div>

        {/* Floating Accents */}
        <div className="absolute hidden lg:block left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 font-handwriting text-[120px] text-[#1c1c1c]/[0.03] rotate-[-90deg] select-none">
          Sahin
        </div>
      </div>
    </section>
  );
}
