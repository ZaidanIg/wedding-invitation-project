'use client';

import React from 'react';
// Triggering rebuild to fix Link ReferenceError
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, Sparkles } from 'lucide-react';
import ThemeMiniPreview from './ThemeMiniPreview';
import type { Layout } from '@/types';

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
    tag: 'Modern',
  },
  {
    name: 'Golden Classic',
    slug: 'golden-classic',
    tag: '✨ Premium',
    isLuxury: true,
  },
];

import { useState } from 'react';
import ThemePreviewModal from './ThemePreviewModal';

export default function ShowcaseSection({ fullGallery = false }: { fullGallery?: boolean }) {
  const [selectedTheme, setSelectedTheme] = useState<Layout | null>(null);
  
  const activeTheme = themes.find(t => t.slug === selectedTheme);

  return (
    <section className={`${fullGallery ? 'py-12' : 'py-32'} px-4 bg-[#fcfbf8]`}>
      <div className="max-w-7xl mx-auto">
        {!fullGallery && (
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="font-handwriting text-3xl text-[#1c1c1c]/40 mb-3 animate-fade-in">Pilih kanvas untuk kisah Anda...</div>
              <h2 className="text-[42px] sm:text-[54px] font-display font-bold text-[#1c1c1c] tracking-[-1.5px] leading-tight mb-8">
                Koleksi Desain <br /> <span className="italic font-normal">Penuh Jiwa</span>
              </h2>
              <p className="text-[#5f5f5d] text-lg leading-[1.5]">
                Setiap tema dirancang dengan <span className="text-[#1c1c1c] font-semibold underline decoration-[#1c1c1c]/10">ketelitian editorial</span>. 
                Bukan sekadar digital, tapi sebuah undangan yang menceritakan siapa Anda.
              </p>
            </div>
            <Link href="/themes" className="group flex items-center gap-2 text-[#1c1c1c] font-bold text-lg border-b-2 border-[#1c1c1c]/10 pb-1 hover:border-[#1c1c1c] transition-all">
              Jelajahi Semua Tema
            </Link>
          </div>
        )}

        <div id="collection" className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 ${fullGallery ? 'pt-8' : ''}`}>
          {themes.map((theme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedTheme(theme.slug)}
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#eceae4] mb-8 group-hover:border-highlight/30 transition-all duration-700 shadow-sm group-hover:shadow-xl group-hover:shadow-highlight/5 bg-white">
                {/* Real Live Theme Preview */}
                <div className="absolute inset-0 pointer-events-none group-hover:scale-[1.02] transition-transform duration-700">
                  <ThemeMiniPreview layout={theme.slug} />
                </div>
                
                {/* Overlay with Preview Button */}
                <div className="absolute inset-0 bg-[#1c1c1c]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center z-20">
                  <div className="bg-[#f7f4ed] text-[#1c1c1c] px-6 py-3 rounded-full font-display font-bold text-sm tracking-wide shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2 mb-4">
                    <Eye className="h-4 w-4 text-highlight" />
                    Lihat Preview
                  </div>
                  <p className="text-[#fcfbf8]/80 text-xs font-medium uppercase tracking-[2px] opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                    Live Component
                  </p>
                </div>

                {theme.isLuxury && (
                  <div className="absolute top-4 right-4 bg-[#f7f4ed] p-2 rounded-full shadow-lg z-30">
                    <Sparkles className="h-4 w-4 text-highlight" />
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-2 tracking-tight">{theme.name}</h3>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#1c1c1c]/20" />
                <p className={`text-[11px] uppercase tracking-[2px] font-bold ${theme.isLuxury ? 'text-highlight' : 'text-[#5f5f5d]'}`}>
                  {theme.tag}
                </p>
              </div>
            </motion.div>
          ))}
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
