'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ExternalLink } from 'lucide-react';
import ThemeMiniPreview from './ThemeMiniPreview';
import type { Layout } from '@/types';

interface ThemePreviewModalProps {
  layout: Layout | null;
  onClose: () => void;
  themeName: string;
}

export default function ThemePreviewModal({ layout, onClose, themeName }: ThemePreviewModalProps) {
  if (!layout) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1c1c1c]/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#f7f4ed] w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Side: Information */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white border-r border-[#eceae4]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#1c1c1c] text-[#f7f4ed]">
                  <Smartphone className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[3px] text-[#5f5f5d]">Live Theme Preview</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1c1c1c] mb-6 leading-tight">
                {themeName}
              </h2>
              
              <p className="text-lg text-[#5f5f5d] leading-relaxed mb-8">
                Rasakan pengalaman nyata dari undangan digital Anda. Desain ini dioptimalkan untuk perangkat mobile dengan animasi yang halus dan tata letak yang elegan.
              </p>

              <div className="space-y-4">
                {[
                  'Desain Responsif Mobile-First',
                  'Animasi Scroll yang Halus',
                  'Integrasi Musik & Gallery',
                  'Fitur RSVP & Buku Tamu',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-highlight" />
                    <span className="text-[#1c1c1c] font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onClose}
                className="px-8 py-4 rounded-xl bg-[#1c1c1c] text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Gunakan Tema Ini
              </button>
              <button className="px-8 py-4 rounded-xl border-2 border-[#1c1c1c]/10 text-[#1c1c1c] font-bold hover:bg-[#1c1c1c]/5 transition-all flex items-center justify-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open Demo
              </button>
            </div>
          </div>

          {/* Right Side: Phone Preview */}
          <div className="w-full md:w-1/2 bg-[#fcfbf8] relative flex items-center justify-center overflow-hidden py-12">
            <div className="relative w-[320px] h-[650px] md:w-[375px] md:h-[760px] transform scale-[0.85] md:scale-100 transition-transform">
              <div className="absolute inset-0 border-[12px] border-[#1c1c1c] rounded-[3.5rem] overflow-hidden shadow-2xl bg-white ring-1 ring-black/10">
                <ThemeMiniPreview layout={layout} isInteractable={true} scale={1} hideNotch={true} />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1c1c1c] rounded-b-2xl z-20" />
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/40 text-[#1c1c1c] backdrop-blur-md transition-all z-[110]"
          >
            <X className="h-6 w-6" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
