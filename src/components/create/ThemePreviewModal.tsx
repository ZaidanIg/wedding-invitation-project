'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ExternalLink } from 'lucide-react';
import ThemeMiniPreview from '../themes/ThemeMiniPreview';
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
        className="fixed inset-0 z-[100] flex justify-center md:items-center p-4 bg-[#1c1c1c]/90 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-[#fcfbf8] w-full max-w-lg h-fit max-h-[90vh] md:h-[90vh] rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >



          {/* Phone Preview */}
          <div className="w-full h-full relative flex items-center justify-center py-12">
            {/* The scaled wrapper for the exact 375x812 phone size */}
            <div className="relative w-[375px] h-[812px] shrink-0 scale-[0.75] md:scale-[0.85] lg:scale-[0.9] origin-center">
              
              {/* The content container without the border pushing the content inward */}
              <div className="absolute inset-0 rounded-[3.5rem] overflow-hidden bg-white shadow-2xl">
                <ThemeMiniPreview layout={layout} isInteractable={true} scale={1} hideNotch={true} />
              </div>

              {/* The Mockup Overlay - on top of content so it doesn't squish */}
              <div className="absolute inset-0 border-[12px] border-[#1c1c1c] rounded-[3.5rem] shadow-2xl ring-1 ring-black/10 pointer-events-none z-50" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1c1c1c] rounded-b-2xl pointer-events-none z-[60]" />
              
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
