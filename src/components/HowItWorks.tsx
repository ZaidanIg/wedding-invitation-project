'use client';

import { motion } from 'framer-motion';
import { Sparkles, PenTool, Share2, Heart, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Sparkles,
    title: 'Tentukan Tema',
    description: 'Tersedia berbagai koleksi tema eksklusif untuk momen terindah Anda.',
  },
  {
    icon: PenTool,
    title: 'Isi Data Lengkap',
    description: 'Lengkapi data diri pasangan, acara, dan informasi tambahan dengan mudah dan cepat.',
  },
  {
    icon: Share2,
    title: 'Tebarkan Kebahagiaan',
    description: 'Sebarkan undangan untuk orang-orang terdekat dan tamu spesial melalui kontak WhatsApp Anda.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-[#fcfbf8] overflow-hidden border-y border-[#eceae4]">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-[#1c1c1c] tracking-tight sm:tracking-[-1.5px] mb-6">
            Langkah Sederhana Menuju <br /> <span className="italic font-normal">Momen Sempurna</span>
          </h2>
          <p className="text-base md:text-lg text-[#5f5f5d] max-w-2xl mx-auto leading-relaxed">
            Kami menyediakan layanan yang mudah dan cepat. Cukup dengan hitungan detik menuju kisah cinta tanpa titik.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) - refined */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-px bg-[#1c1c1c]/10 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-white border border-[#eceae4] flex items-center justify-center mb-10 shadow-sm group-hover:border-[#1c1c1c]/40 transition-all duration-700 group-hover:shadow-focus">
                  <step.icon className="h-8 w-8 text-[#1c1c1c]" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-5 tracking-tight">{step.title}</h3>
                <p className="text-[#5f5f5d] leading-relaxed text-sm max-w-[240px] mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits List - Editorial style */}
        <div className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 border-t border-[#eceae4] pt-20">
          {[
            'RSVP Tracking',
            'Digital Gift',
            'Google Maps Integration',
            'Music & Gallery',
            'Custom Domain',
            'Unlimited Views',
            'WhatsApp Generator',
            'Dashboard Analytics',
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="h-2 w-2 rounded-full bg-[#1c1c1c]/20 group-hover:bg-[#1c1c1c] transition-colors" />
              <span className="text-[15px] font-bold text-[#1c1c1c] tracking-tight">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
