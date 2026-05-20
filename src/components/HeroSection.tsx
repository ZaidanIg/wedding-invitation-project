'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#f7f4ed]">
      {/* Background Image with Elegant Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-image.jpg"
          alt="Wedding Background"
          fill
          className="object-cover object-center opacity-90 transition-opacity duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f4ed]/90 via-[#f7f4ed]/95 to-[#f7f4ed]/60 md:bg-gradient-to-r md:from-[#f7f4ed] md:via-[#f7f4ed]/95 md:to-[#f7f4ed]/10 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl flex flex-col items-center md:items-start w-full text-center md:text-left">
          {/* Accent */}
          <div className="mb-6 flex items-center justify-center md:justify-start gap-3 animate-fade-in">
            <span className="font-handwriting text-2xl text-rose-600/80">- Ekosistem pernikahan terpadu -</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-[64px] md:text-[76px] font-display font-bold leading-[1.0] tracking-tight sm:tracking-[-0.03em] text-[#1c1c1c] mb-8 animate-fade-in-up">
            Satu Platform, <br />
            Seluruh Ekosistem <br />
            <span className="text-rose-500 italic font-normal">Pernikahan Anda.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5f5f5d] max-w-xl mb-12 leading-relaxed animate-fade-in-up delay-200 text-balance mx-auto md:mx-0">
            Sahinaja menghubungkan calon pengantin dengan vendor terbaik, dan penyedia venue eksklusif, ditenagai oleh sistem manajemen undangan digital dan QR check-in terintegrasi.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-4 sm:gap-5 animate-fade-in-up delay-300 w-full sm:w-auto">
            <Link
              href="/pricing"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4.5 text-base font-bold rounded-2xl bg-rose-gradient text-white shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all duration-500 animate-glow-pulse"
            >
              Mulai Rencanakan undangan anda
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-2xl border-2 border-[#1c1c1c]/15 text-[#1c1c1c] hover:border-rose-500/40 hover:text-rose-500 transition-all duration-300"
            >
              <Building2 className="h-4.5 w-4.5" />
              Daftar Mitra
            </Link>
          </div>
        </div>

        {/* Brand Floating Accent */}
        <div className="absolute hidden xl:block right-16 top-1/2 -translate-y-1/2 font-handwriting text-[100px] text-[#1c1c1c]/[0.02] rotate-90 select-none pointer-events-none">
          Sahinaja
        </div>
      </div>

      <style>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.3), 0 8px 10px -6px rgba(244, 63, 94, 0.3); }
          50% { box-shadow: 0 20px 40px -2px rgba(244, 63, 94, 0.6), 0 12px 20px -3px rgba(244, 63, 94, 0.45); }
        }
        .animate-glow-pulse { animation: glow-pulse 3s infinite ease-in-out; }
      `}</style>
    </section>
  );
}
