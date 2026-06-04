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
    <section className="py-32 px-4 bg-[#fcfbf8] overflow-hidden border-y border-[#eceae4]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-[54px] font-display font-bold text-[#1c1c1c] tracking-tight sm:tracking-[-1.5px] mb-6"
          >
            Langkah Sederhana Menuju <br /> <span className="italic font-normal">Momen Sempurna</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#5f5f5d] max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Kami menyediakan layanan yang mudah dan cepat. Cukup dengan hitungan detik menuju kisah cinta tanpa titik.
          </motion.p>
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
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
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

      </div>
    </section>
  );
}
