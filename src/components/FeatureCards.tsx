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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-[#f7f4ed] border border-[#eceae4] hover:border-[#1c1c1c]/40 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#1c1c1c]/5 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-[#1c1c1c]" />
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
