'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowRight } from 'lucide-react';
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
        {/* Responsive gradient overlay using brand bg color #f7f4ed */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f4ed]/90 via-[#f7f4ed]/95 to-[#f7f4ed]/60 md:bg-gradient-to-r md:from-[#f7f4ed] md:via-[#f7f4ed]/95 md:to-[#f7f4ed]/10 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left flex justify-center md:justify-start">
        <div className="max-w-3xl flex flex-col items-center md:items-start w-full">
          {/* Subtle Accent */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center text-center md:justify-center sm:text-xs gap-3"
          >
            <span className="font-handwriting text-2xl text-rose-600/80 text-center md:text-left">- Suratan pertama untuk cerita kasih selamanya -</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-[72px] md:text-[84px] font-display font-bold leading-[1.0] tracking-tight sm:tracking-[-0.03em] text-[#1c1c1c] mb-8 text-center md:text-left"
          >
            Rayakan Momen <br />
            <span className="text-rose-500 italic font-normal">Terindah</span> Bersama
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:justify-center sm:text-lg text-[#5f5f5d] max-w-xl mb-12 leading-relaxed text-balance text-center md:text-left mx-auto md:mx-0"
          >
            Izinkan kami membantu mewujudkan cita dan harapan Anda mengarungi perjalanan panjang bersama dengan undangan digital mewah, elegan, dan menyenangkan hati.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <Link
              href="/create"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4.5 text-base font-bold rounded-2xl bg-rose-gradient text-white shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all duration-500 animate-glow-pulse"
            >
              Mulai Momen Indah Anda Dari Sini
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 text-[#1c1c1c] font-bold text-base hover:text-rose-500 transition-colors py-3 sm:py-0"
            >
              Lihat Paket Harga
              <Heart className="h-4 w-4 text-rose-400" />
            </Link>
          </motion.div>
        </div>

        {/* Subtle Brand Floating Accent */}
        <div className="absolute hidden xl:block right-16 top-1/2 -translate-y-1/2 font-handwriting text-[100px] text-[#1c1c1c]/[0.02] rotate-90 select-none pointer-events-none">
          Sahinaja
        </div>
      </div>

      {/* Elegant Infinite Glow Animation Style */}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.3), 0 8px 10px -6px rgba(244, 63, 94, 0.3);
          }
          50% {
            box-shadow: 0 20px 40px -2px rgba(244, 63, 94, 0.6), 0 12px 20px -3px rgba(244, 63, 94, 0.45);
          }
        }
        .animate-glow-pulse {
          animation: glow-pulse 3s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}
