'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Eye, Sparkles } from 'lucide-react';
import ThemeMiniPreview from './ThemeMiniPreview';
import type { Layout } from '@/types';
import ThemePreviewModal from './ThemePreviewModal';

type ThemeCategory = 'Semua' | 'Modern' | 'Islami' | 'Kristen' | 'Hindu' | 'Buddha' | 'Oriental';

const themes: {
  name: string;
  slug: Layout;
  tag: string;
  isLuxury?: boolean;
  category: ThemeCategory;
  palette: string[];
}[] = [
  {
    name: 'Elegant Cream',
    slug: 'elegant-cream',
    tag: 'Basic',
    category: 'Modern',
    palette: ['#fdfcf9', '#1c1c1c', '#e8c9a0'],
  },
  {
    name: 'Luxury Emerald',
    slug: 'luxury-emerald',
    tag: '✨ Premium',
    isLuxury: true,
    category: 'Modern',
    palette: ['#042f2e', '#d4af37', '#ffffff'],
  },
  {
    name: 'Rose Garden',
    slug: 'rose-garden',
    tag: 'Basic',
    category: 'Modern',
    palette: ['#fdf2f4', '#f43f5e', '#f9a8d4'],
  },
  {
    name: 'Royal Blue',
    slug: 'royal-blue',
    tag: 'Basic',
    category: 'Modern',
    palette: ['#1e3a8a', '#fbbf24', '#ffffff'],
  },
  {
    name: 'Golden Classic',
    slug: 'golden-classic',
    tag: '✨ Premium',
    isLuxury: true,
    category: 'Modern',
    palette: ['#ffffff', '#D4AF37', '#1c1c1c'],
  },
  {
    name: 'Premium Charcoal',
    slug: 'premium-charcoal',
    tag: '✨ Premium',
    isLuxury: true,
    category: 'Modern',
    palette: ['#111111', '#d4af37', '#888888'],
  },
  {
    name: 'Islamic Grace',
    slug: 'islamic-grace',
    tag: '✨ Premium',
    isLuxury: true,
    category: 'Islami',
    palette: ['#1a2b23', '#c5a059', '#f5f0e8'],
  },
  {
    name: 'Islamic Classic',
    slug: 'islamic-minimalist',
    tag: 'Basic',
    isLuxury: false,
    category: 'Islami',
    palette: ['#fdfcf9', '#d4af37', '#2d5016'],
  },
  {
    name: 'Islamic Midnight',
    slug: 'islamic-midnight',
    tag: 'Basic',
    isLuxury: false,
    category: 'Islami',
    palette: ['#0a0f0d', '#c5a059', '#3d6b47'],
  },
  {
    name: 'Islamic Arabesque',
    slug: 'islamic-arabesque',
    tag: 'Basic',
    isLuxury: false,
    category: 'Islami',
    palette: ['#f0fdfa', '#2dd4bf', '#0f766e'],
  },
  {
    name: 'Christian Elegant',
    slug: 'christian-elegant',
    tag: '✨ Premium',
    isLuxury: true,
    category: 'Kristen',
    palette: ['#f8f7f4', '#c0a882', '#8b5e83'],
  },
  {
    name: 'Hindu Mandala',
    slug: 'hindu-mandala',
    tag: '✨ Premium',
    isLuxury: true,
    category: 'Hindu',
    palette: ['#fff8f0', '#d4af37', '#c0392b'],
  },
  {
    name: 'Buddhist Zen',
    slug: 'buddhist-zen',
    tag: '✨ Premium',
    isLuxury: true,
    category: 'Buddha',
    palette: ['#fdfbf7', '#a3b18a', '#5c4033'],
  },
  {
    name: 'Confucian Oriental',
    slug: 'confucian-oriental',
    tag: '✨ Premium',
    isLuxury: true,
    category: 'Oriental',
    palette: ['#fffcf9', '#8b0000', '#d4af37'],
  },
];

type PricingFilter = 'Semua' | 'Basic' | 'Premium';

export default function ShowcaseSection({ fullGallery = false }: { fullGallery?: boolean }) {
  const [selectedTheme, setSelectedTheme] = useState<Layout | null>(null);
  const [activeFilter, setActiveFilter] = useState<PricingFilter>('Semua');

  const activeTheme = themes.find(t => t.slug === selectedTheme);

  const pricingFilters: { id: PricingFilter; label: string; count: number }[] = [
    { id: 'Semua', label: 'Semua', count: themes.length },
    { id: 'Basic', label: 'Basic', count: themes.filter(t => !t.isLuxury).length },
    { id: 'Premium', label: 'Premium', count: themes.filter(t => t.isLuxury).length },
  ];

  const filteredThemes = useMemo(() => {
    if (activeFilter === 'Basic') return themes.filter(t => !t.isLuxury);
    if (activeFilter === 'Premium') return themes.filter(t => t.isLuxury);
    return themes;
  }, [activeFilter]);

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
                Koleksi Desain <br /> <span className="text-rose-500 italic font-normal">Sepenuh Jiwa</span>
              </h2>
              <p className="text-[#6b6b6b] text-lg leading-relaxed max-w-2xl mx-auto text-balance">
                Ceritakan tentang diri Anda dan pasangan melalui pilihan tema yang kami suguhkan. Bukan hanya sekadar undangan, namun ini adalah kisah yang telah digariskan, cinta yang telah diutuhkan.
              </p>
            </div>
            <Link href="/themes" className="group flex items-center gap-3 p-8 text-[#1c1c1c] font-bold text-lg border-b-2 border-rose-500/10 pb-2 hover:border-rose-500 transition-all">
              Jelajahi Semua Tema
              <Eye className="h-5 w-5 text-rose-500 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        )}

        {/* ── Filter Bar (only in fullGallery mode) ── */}
        {fullGallery && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1c1c1c] tracking-tight mb-3">
              Koleksi Tema
            </h1>
            <p className="text-[#6b6b6b] text-lg mb-10 max-w-2xl">
              {themes.length} tema undangan — temukan yang paling merepresentasikan kisah cinta Anda.
            </p>

            {/* Pricing filter tabs — pill style */}
            <div className="w-full overflow-x-auto no-scrollbar pb-2 -mb-2">
              <div className="flex items-center gap-1 sm:gap-2 p-1.5 bg-[#f0ede8] rounded-2xl w-max">
                {pricingFilters.map((f) => {
                  const isActive = activeFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={`
                        relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap
                        ${isActive
                          ? 'bg-white text-[#1c1c1c] shadow-md'
                          : 'text-[#6b6b6b] hover:text-[#1c1c1c]'
                        }
                      `}
                    >
                      {f.id === 'Premium' && (
                        <Sparkles className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isActive ? 'text-rose-500' : 'text-[#6b6b6b]/60'}`} />
                      )}
                      {f.label}
                      <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-rose-50 text-rose-500' : 'bg-white/60 text-[#6b6b6b]'}`}>
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active filter hint */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeFilter}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-4 text-sm text-[#6b6b6b]"
              >
                {activeFilter === 'Semua' && `Menampilkan semua ${themes.length} tema.`}
                {activeFilter === 'Basic' && 'Tersedia di semua paket — cocok untuk undangan minimalis yang elegan.'}
                {activeFilter === 'Premium' && (
                  <>Eksklusif untuk paket <span className="font-bold text-rose-500">Premium & Ultimate</span> — animasi dan fitur lengkap.</>
                )}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Theme Grid ── */}
        {fullGallery ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredThemes.map((theme) => (
                <motion.div
                  key={theme.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTheme(theme.slug)}
                >
                  <ThemeCard theme={theme} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div
            id="collection"
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-8 pb-12 w-full pt-4"
          >
            {themes.map((theme, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group cursor-pointer flex-shrink-0 snap-start w-[300px] sm:w-[400px] md:w-[320px] lg:w-[380px]"
                onClick={() => setSelectedTheme(theme.slug)}
              >
                <ThemeCard theme={theme} />
              </motion.div>
            ))}

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
          </div>
        )}
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

// ── Reusable Theme Card ──────────────────────────────────────────────────────
function ThemeCard({ theme }: { theme: typeof themes[number] }) {
  return (
    <>
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[#eceae4] mb-6 group-hover:border-rose-500/30 transition-all duration-700 shadow-sm group-hover:shadow-2xl group-hover:shadow-rose-500/10 bg-white">
        {/* Real Live Theme Preview */}
        <div className="absolute inset-0 pointer-events-none group-hover:scale-[1.02] transition-transform duration-700">
          <ThemeMiniPreview layout={theme.slug} />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#1c1c1c]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center z-20 backdrop-blur-[2px]">
          <div className="bg-white text-[#1c1c1c] px-8 py-4 rounded-2xl font-display font-bold text-sm tracking-wide shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-3 mb-4">
            <Eye className="h-4 w-4 text-rose-500" />
            Lihat Preview
          </div>
          <p className="text-white/80 text-[10px] font-bold uppercase tracking-[3px] opacity-0 group-hover:opacity-100 transition-opacity delay-200">
            Interactive Preview
          </p>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4 z-30">
          {theme.isLuxury ? (
            <span className="flex items-center gap-1.5 bg-[#1c1c1c]/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
              <Sparkles className="h-3 w-3 text-rose-400" />
              Premium
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[#1c1c1c] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#eceae4]">
              Basic
            </span>
          )}
        </div>
      </div>

      {/* Info + Palette Swatches */}
      <div className="text-center">
        <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-2 tracking-tight group-hover:text-rose-500 transition-colors">{theme.name}</h3>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-8 bg-rose-500/10 group-hover:w-12 transition-all" />
          <p className={`text-[10px] uppercase tracking-[3px] font-bold ${theme.isLuxury ? 'text-rose-500' : 'text-[#6b6b6b]'}`}>
            {theme.tag}
          </p>
          <div className="h-px w-8 bg-rose-500/10 group-hover:w-12 transition-all" />
        </div>
        {/* Color palette swatches */}
        <div className="flex items-center justify-center gap-2">
          {theme.palette.map((color, idx) => (
            <div
              key={idx}
              className="w-5 h-5 rounded-full border border-white shadow-md ring-1 ring-black/10 transition-transform group-hover:scale-110"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </>
  );
}
