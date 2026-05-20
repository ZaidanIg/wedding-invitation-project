'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Building2, ArrowRight, QrCode, Users, Palette, CalendarDays } from 'lucide-react';

export default function DualPathSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-[#fdfcf9] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#f43f5e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-rose-500 mb-4">Dua Jalur, Satu Platform</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-[#1c1c1c] tracking-[-0.03em] leading-[1.1] mb-6 text-balance">
            Anda Seorang <span className="text-rose-500 italic font-normal">Pengantin</span> atau <span className="text-rose-500 italic font-normal">Profesional?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: Pasangan Pengantin */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass rounded-[2.5rem] p-8 md:p-10 flex flex-col border-white/40 shadow-sm shadow-[#1c1c1c]/5 hover:shadow-xl transition-all duration-500 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart className="h-7 w-7 text-rose-500" fill="currentColor" />
            </div>

            <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-3">
              Urus Pernikahan Tanpa Ribet
            </h3>
            <p className="text-sm text-[#6b6b6b] leading-relaxed mb-8 flex-1">
              Buat undangan digital mandiri dengan yang terjangkau, atau dapatkan rekomendasi mitra terbaik yang terintegrasi dengan sistem kami.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { icon: Palette, text: 'Desain undangan premium' },
                { icon: CalendarDays, text: 'Kelola RSVP & jadwal otomatis' },
                { icon: Users, text: 'Rekomendasi mitra' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-[#4a4745]">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                    <item.icon className="h-3.5 w-3.5 text-rose-500" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/pricing"
              className="group/btn inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-rose-gradient text-white font-bold shadow-lg shadow-rose-500/15 hover:shadow-rose-500/30 transition-all duration-300 text-sm"
            >
              Mulai Rencanakan impian anda
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Card B: Mitra */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-dark rounded-[2.5rem] p-8 md:p-10 flex flex-col shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden bg-[#1c1c1c]"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
              <Building2 className="h-40 w-40 text-white" />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <Building2 className="h-7 w-7 text-amber-400" />
            </div>

            <h3 className="text-2xl font-display font-bold text-white mb-3 relative z-10">
              Paket Enterprise
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-8 flex-1 relative z-10">
              Kelola puluhan undangan pernikahan, RSVP dengan QR Code, gratis tanpa biaya bulanan.
            </p>

            <div className="space-y-3 mb-8 relative z-10">
              {[
                { icon: Users, text: 'Multi-tenant dashboard unlimited proyek' },
                { icon: QrCode, text: 'D-Day QR Scanner untuk check-in kilat' },
                { icon: Palette, text: 'White-label & custom domain per-proyek' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signin"
              className="group/btn inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-amber-400 text-[#1c1c1c] font-bold shadow-lg shadow-amber-400/15 hover:bg-amber-300 hover:shadow-amber-400/30 transition-all duration-300 text-sm relative z-10"
            >
              Daftar Mitra
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
