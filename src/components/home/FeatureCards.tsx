'use client';

import { CheckSquare, Gift, MapPin, Music, Globe, Wand2, Send, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: CheckSquare,
    title: 'RSVP & QR Check-in',
    description: 'Pantau kehadiran tamu dengan sistem RSVP online dan fitur check-in menggunakan QR code di lokasi acara.',
  },
  {
    icon: Gift,
    title: 'Digital Gift',
    description: 'Terima amplop atau kado pernikahan secara langsung melalui multi-rekening atau e-wallet dengan aman.',
  },
  {
    icon: MapPin,
    title: 'Integrasi Google Maps',
    description: 'Bantu tamu menemukan lokasi acara pernikahan Anda dengan akurasi tinggi melalui integrasi peta interaktif.',
  },
  {
    icon: Music,
    title: 'Galeri, Video & Musik',
    description: 'Buat undangan lebih hidup dengan galeri foto, tautan video, dan musik latar belakang khusus pilihan Anda.',
  },
  {
    icon: Globe,
    title: 'Link Eksklusif',
    description: 'Dapatkan tautan undangan eksklusif dengan nama pasangan yang mudah dibagikan ke semua kerabat.',
  },
  {
    icon: Wand2,
    title: 'AI Text Generation',
    description: 'Kesulitan merangkai kata? Gunakan teknologi AI kami untuk membuat teks undangan dengan berbagai gaya bahasa.',
  },
  {
    icon: Send,
    title: 'WhatsApp Broadcast',
    description: 'Kirim undangan secara otomatis ke banyak tamu sekaligus melalui fitur WhatsApp Broadcast yang terintegrasi.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analytics',
    description: 'Analisis lengkap statistik pengunjung dan tamu yang mengonfirmasi kehadiran langsung dari dashboard interaktif.',
  },
];

export default function FeatureCards() {
  return (
    <section className="py-24 px-4 bg-[#f7f4ed]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative group/grid">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
              className="
                p-8 rounded-2xl bg-[#f7f4ed] border border-[#eceae4] transition-all duration-500 
                group-hover/grid:blur-[3px] group-hover/grid:opacity-60 group-hover/grid:scale-[0.98]
                hover:!blur-none hover:!opacity-100 hover:!scale-105 hover:-translate-y-2 hover:bg-white hover:shadow-2xl hover:border-rose-200 hover:!z-10
                relative z-0 group/card
              "
            >
              <div className="w-14 h-14 rounded-full bg-[#1c1c1c]/5 flex items-center justify-center mb-6 group-hover/card:bg-rose-50 transition-colors duration-500">
                <feature.icon className="
                  h-6 w-6 transition-colors duration-500
                  text-[#1c1c1c] 
                  group-hover/grid:text-white
                  group-hover/card:!text-rose-500
                " />
              </div>
              <h3 className="text-xl font-bold text-[#1c1c1c] mb-3">{feature.title}</h3>
              <p className="text-[#5f5f5d] text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
