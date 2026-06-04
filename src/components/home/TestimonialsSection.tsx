'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Heart } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Anisa & Rizky',
    role: 'Pasangan Pengantin',
    image: 'https://images.unsplash.com/photo-1623091423319-578d99dd9cc7?q=80&w=200&h=200&auto=format&fit=crop',
    text: 'Awalnya ragu buat undangan digital, tapi Sahinaja bikin semuanya jadi gampang banget. Desain Islamic Grace-nya mewah banget, banyak tamu yang nanya bikin di mana!',
    rating: 5,
  },
  {
    name: 'Budi Santoso',
    role: 'Wedding Organizer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop',
    text: 'Paket Pro Sahinaja bener-bener ngebantu bisnis WO saya. Manajemen klien jadi lebih rapi dan hasilnya selalu bikin klien puas. Worth every penny!',
    rating: 5,
  },
  {
    name: 'Siti Sarah',
    role: 'Pasangan Pengantin',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=200&h=200&auto=format&fit=crop',
    text: 'Fitur AI-nya ngebantu banget buat bikin kata-kata undangan yang puitis tapi tetep islami. Proses checkout-nya juga cepet banget.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 px-4 bg-[#fdfcf9] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/5 border border-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Star className="h-3.5 w-3.5" />
            Social Proof
          </motion.div>
          <h2 className="text-[36px] md:text-[54px] font-display font-bold text-[#1c1c1c] tracking-tight mb-6">
            Dipercaya Oleh <span className="text-rose-500 italic font-normal">Ribuan</span> Pasangan
          </h2>
          <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
            Bergabunglah dengan pasangan yang telah mewujudkan momen tak terlupakan mereka bersama Sahinaja.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-[#eceae4] p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-500 group"
            >
              <div className="flex items-center gap-1 mb-6 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              
              <div className="relative mb-8">
                <Quote className="absolute -top-4 -left-2 h-10 w-10 text-rose-500/10" />
                <p className="text-[#1c1c1c] font-medium leading-relaxed italic relative z-10">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[#eceae4]">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1c1c1c]">{t.name}</h4>
                  <p className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand Bar Placeholder */}
        <div className="mt-24 pt-16 border-t border-[#eceae4] flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-30 grayscale">
           <span className="text-xl font-display font-bold">BRIDES.ID</span>
           <span className="text-xl font-display font-bold">WEDDINGKU</span>
           <span className="text-xl font-display font-bold">VOGUE WEDDING</span>
           <span className="text-xl font-display font-bold">THE BRIDESTORY</span>
        </div>
      </div>
    </section>
  );
}
