'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, Sparkles } from 'lucide-react';
import ThemeMiniPreview from './ThemeMiniPreview';
import type { Layout } from '@/types';
import ThemePreviewModal from './ThemePreviewModal';

const themes: { name: string; slug: Layout; tag: string; isLuxury?: boolean }[] = [
  {
    name: 'Elegant Cream',
    slug: 'elegant-cream',
    tag: 'Classic',
  },
  {
    name: 'Luxury Emerald',
    slug: 'luxury-emerald',
    tag: '✨ Premium',
    isLuxury: true,
  },
  {
    name: 'Rose Garden',
    slug: 'rose-garden',
    tag: 'Romantic',
  },
  {
    name: 'Royal Blue',
    slug: 'royal-blue',
    tag: 'Klasik',
  },
  {
    name: 'Golden Classic',
    slug: 'golden-classic',
    tag: '✨ Premium',
    isLuxury: true,
  },
  {
    name: 'Islamic Grace',
    slug: 'islamic-grace',
    tag: '✨ Premium',
    isLuxury: true,
  },
  {
    name: 'Islamic Classic',
    slug: 'islamic-minimalist',
    tag: 'Klasik',
    isLuxury: false,
  },
  {
    name: 'Islamic Midnight',
    slug: 'islamic-midnight',
    tag: 'Klasik',
    isLuxury: false,
  },
  {
    name: 'Islamic Arabesque',
    slug: 'islamic-arabesque',
    tag: 'Klasik',
    isLuxury: false,
  },
  {
    name: 'Christian Elegant',
    slug: 'christian-elegant',
    tag: '✨ Premium',
    isLuxury: true,
  },
  {
    name: 'Hindu Mandala',
    slug: 'hindu-mandala',
    tag: '✨ Premium',
    isLuxury: true,
  },
  {
    name: 'Buddhist Zen',
    slug: 'buddhist-zen',
    tag: '✨ Premium',
    isLuxury: true,
  },
  {
    name: 'Confucian Oriental',
    slug: 'confucian-oriental',
    tag: '✨ Premium',
    isLuxury: true,
  }
];

export default function ShowcaseSection({ fullGallery = false }: { fullGallery?: boolean }) {
  const [selectedTheme, setSelectedTheme] = useState<Layout | null>(null);
  
  const activeTheme = themes.find(t => t.slug === selectedTheme);

  return (
    <section className={`${fullGallery ? 'py-12' : 'py-32'} px-4 bg-[#fdfcf9] overflow-hidden relative`}>
      {/* Subtle blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-rose-500/[0.03] blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {!fullGallery && (
          <div className="flex flex-col items-center text-center mb-24 gap-10">
            <div className="max-w-3xl mx-auto">
              <div className="font-handwriting text-3xl text-rose-500/40 mb-4 animate-fade-in">Tentukan pilihan kanvas untuk kisah cinta Anda</div>
              <h2 className="text-[40px] sm:text-[64px] font-display font-bold text-[#1c1c1c] tracking-tight sm:tracking-[-0.03em] leading-[1.1] mb-8 text-balance">
                Koleksi Desain <br /> <span className="text-rose-500 italic font-normal underline decoration-rose-500/10 underline-offset-8">Sepenuh Jiwa</span>
              </h2>
              <p className="text-[#6b6b6b] text-lg leading-relaxed max-w-2xl mx-auto text-balance">
                Ceritakan tentang diri Anda dan pasangan melalui pilihan tema yang kami suguhkan. Bukan hanya sekadar undangan, namun ini adalah kisah yang telah digariskan, cinta yang telah diutuhkan.
              </p>
            </div>
            <Link href="/themes" className="group flex items-center gap-3 text-[#1c1c1c] font-bold text-lg border-b-2 border-rose-500/10 pb-2 hover:border-rose-500 transition-all">
              Jelajahi Semua Tema
              <Eye className="h-5 w-5 text-rose-500 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        )}

        <div 
          id="collection" 
          className={`
            relative
            ${fullGallery 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pt-8' 
              : 'flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-8 pb-12 w-full pt-4'
            }
          `}
        >
          {themes.map((theme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`
                group cursor-pointer flex-shrink-0 snap-start
                ${fullGallery ? 'w-full' : 'w-[300px] sm:w-[400px] md:w-[320px] lg:w-[380px]'}
              `}
              onClick={() => setSelectedTheme(theme.slug)}
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[#eceae4] mb-8 group-hover:border-rose-500/30 transition-all duration-700 shadow-sm group-hover:shadow-2xl group-hover:shadow-rose-500/10 bg-white">
                {/* Real Live Theme Preview */}
                <div className="absolute inset-0 pointer-events-none group-hover:scale-[1.02] transition-transform duration-700">
                  <ThemeMiniPreview layout={theme.slug} />
                </div>
                
                {/* Overlay with Preview Button */}
                <div className="absolute inset-0 bg-[#1c1c1c]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center z-20 backdrop-blur-[2px]">
                  <div className="bg-white text-[#1c1c1c] px-8 py-4 rounded-2xl font-display font-bold text-sm tracking-wide shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-3 mb-4">
                    <Eye className="h-4 w-4 text-rose-500" />
                    Lihat Preview
                  </div>
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-[3px] opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                    Interactive Preview
                  </p>
                </div>

                {theme.isLuxury && (
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-xl z-30 border border-white">
                    <Sparkles className="h-5 w-5 text-rose-500" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-2 tracking-tight group-hover:text-rose-500 transition-colors">{theme.name}</h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-8 bg-rose-500/10 group-hover:w-12 transition-all" />
                  <p className={`text-[10px] uppercase tracking-[3px] font-bold ${theme.isLuxury ? 'text-rose-500' : 'text-[#6b6b6b]'}`}>
                    {theme.tag}
                  </p>
                  <div className="h-px w-8 bg-rose-500/10 group-hover:w-12 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}

          {!fullGallery && (
            <Link 
              href="/themes"
              className="flex-shrink-0 snap-start w-[300px] sm:w-[400px] md:w-[320px] lg:w-[380px] group"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-dashed border-[#eceae4] mb-8 flex flex-col items-center justify-center p-10 text-center hover:border-rose-500/30 hover:bg-rose-500/[0.01] transition-all duration-500">
                <div className="w-20 h-20 rounded-full bg-rose-500/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-rose-500/10 transition-all">
                  <Eye className="h-10 w-10 text-rose-500/30" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-3">Lihat Semua Tema</h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">Temukan lebih banyak koleksi desain eksklusif kami</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Theme Preview Modal */}
      <ThemePreviewModal 
        layout={selectedTheme} 
        onClose={() => setSelectedTheme(null)} 
        themeName={activeTheme?.name || ''}
      />
    </section>
  );
}
