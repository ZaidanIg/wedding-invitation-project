'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import ThemeMiniPreview from '@/components/themes/ThemeMiniPreview';
import type { Layout } from '@/types';

const FEATURED_THEMES: { slug: Layout; label: string }[] = [
  { slug: 'premium-javanese', label: 'Premium Javanese' },
  { slug: 'islamic-grace', label: 'Islamic Grace' },
  { slug: 'luxury-emerald', label: 'Luxury Emerald' },
  { slug: 'premium-charcoal', label: 'Premium Charcoal' },
  { slug: 'christian-elegant', label: 'Christian Elegant' },
  { slug: 'rose-garden', label: 'Rose Garden' },
];

export default function TryItWidget() {
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Layout>('premium-javanese');
  const [isFocused, setIsFocused] = useState(false);

  const displayGroomName = groomName.trim() || 'Nama Pria';
  const displayBrideName = brideName.trim() || 'Nama Wanita';

  return (
    <section className="py-20 px-4 bg-[#fdfcf9] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rose-500/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-400/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[36px] sm:text-[52px] font-display font-bold text-[#1c1c1c] tracking-tight leading-[1.1] mb-5">
            Rasakan Pengalaman <br />
            <span className="text-rose-500 italic font-normal">Undangan Impian Anda</span>
          </h2>
          <p className="text-[#6b6b6b] text-lg max-w-xl mx-auto leading-relaxed">
            Ketik nama pasangan dan lihat secara langsung bagaimana undangan digital Anda akan terlihat — tanpa perlu mendaftar.
          </p>
        </motion.div>

        {/* Main Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="bg-white rounded-[2.5rem] border border-[#eceae4] shadow-xl p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                </div>
                <div>
                  <h3 className="text-[#1c1c1c] font-display font-bold text-lg leading-tight">Isi Nama Pasangan</h3>
                  <p className="text-[#6b6b6b] text-xs">Preview akan langsung berubah secara realtime</p>
                </div>
              </div>

              {/* Name Inputs */}
              <div className="space-y-5 mb-8">
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
                    Nama Mempelai Pria
                  </label>
                  <Input
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Contoh: Ahmad Rizki"
                    className="h-14 text-base rounded-2xl border-[#eceae4] focus:border-rose-300 focus:ring-rose-200"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="h-px flex-1 bg-[#eceae4]" />
                  <div className="mx-4 w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
                    <span className="text-rose-400 text-xs font-handwriting">&</span>
                  </div>
                  <div className="h-px flex-1 bg-[#eceae4]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
                    Nama Mempelai Wanita
                  </label>
                  <Input
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="Contoh: Siti Amira"
                    className="h-14 text-base rounded-2xl border-[#eceae4] focus:border-rose-300 focus:ring-rose-200"
                  />
                </div>
              </div>

              {/* Theme Selector */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-3">
                  Pilih Tema
                </label>
                <div className="flex flex-wrap gap-2">
                  {FEATURED_THEMES.map((t) => (
                    <button
                      key={t.slug}
                      onClick={() => setSelectedTheme(t.slug)}
                      className={`
                        px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer
                        ${selectedTheme === t.slug
                          ? 'bg-[#1c1c1c] text-white shadow-md scale-[1.03]'
                          : 'bg-[#f5f4f1] text-[#6b6b6b] hover:bg-[#eceae4] hover:text-[#1c1c1c]'
                        }
                      `}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview indicator (mobile only) */}
              <div className="block lg:hidden mb-6 text-center">
                <div className="flex items-center gap-2 justify-center text-xs text-[#6b6b6b]">
                  <Eye className="h-3.5 w-3.5 text-rose-400" />
                  <span>Geser ke bawah untuk melihat preview</span>
                </div>
              </div>

              {/* CTA */}
              <Link href="/pricing">
                <button className="w-full h-14 bg-[#1c1c1c] hover:bg-rose-500 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg hover:shadow-rose-500/30 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group">
                  <Sparkles className="h-4 w-4 text-rose-400 group-hover:text-white transition-colors" />
                  Buat Undangan Saya Sekarang
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <p className="text-center text-xs text-[#6b6b6b] mt-4">
                ✨ Pilih paket yang sesuai dengan kebutuhan pernikahan Anda
              </p>
            </div>
          </motion.div>

          {/* Right — Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            {/* Live indicator badge */}
            <div className="flex items-center gap-2 mb-6 bg-white border border-[#eceae4] rounded-full px-5 py-2.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#1c1c1c] tracking-wide">PREVIEW REALTIME</span>
            </div>

            {/* Names display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${displayGroomName}-${displayBrideName}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="text-center mb-6"
              >
                <p className="text-2xl font-display font-bold text-[#1c1c1c] tracking-tight">
                  {displayGroomName}
                  <span className="text-rose-400 mx-3 font-handwriting">&</span>
                  {displayBrideName}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Phone mockup with live theme */}
            <div className="relative w-[220px] h-[440px] sm:w-[260px] sm:h-[520px]">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-rose-500/10 blur-2xl rounded-full" />
              <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] border-[10px] border-[#1c1c1c] shadow-2xl shadow-black/30 ring-1 ring-black/10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1c1c1c] rounded-b-xl z-10" />
                <div className="w-full h-full overflow-hidden">
                  <div className="w-[375px] h-[812px] origin-top-left sm:hidden" style={{ transform: `scale(${200/375})` }}>
                    <ThemeMiniPreview layout={selectedTheme} isInteractable={true} scale={1} hideNotch hideMockup groomName={displayGroomName} brideName={displayBrideName} />
                  </div>
                  <div className="w-[375px] h-[812px] origin-top-left hidden sm:block" style={{ transform: `scale(${240/375})` }}>
                    <ThemeMiniPreview layout={selectedTheme} isInteractable={true} scale={1} hideNotch hideMockup groomName={displayGroomName} brideName={displayBrideName} />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-[#6b6b6b] text-center max-w-xs leading-relaxed">
              Ini hanya sebagian kecil dari tampilan. Daftar untuk melihat undangan lengkap dengan galeri foto, musik, dan masih banyak lagi.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
