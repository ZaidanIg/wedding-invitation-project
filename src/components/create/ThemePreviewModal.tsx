'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import IframePreview from '@/components/ui/IframePreview';
import { layouts } from '../layouts';
import { MOCK_INVITATION } from '@/constants/demoData';
import type { Layout } from '@/types';

interface ThemePreviewModalProps {
  layout: Layout | null;
  onClose: () => void;
  themeName: string;
}

export default function ThemePreviewModal({ layout, onClose }: ThemePreviewModalProps) {
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
          <div className="w-full h-full relative flex items-center justify-center p-4 sm:p-8">
            {/* The responsive aspect-ratio wrapper */}
            <div 
              className="relative mx-auto flex justify-center shrink-0 w-full max-w-[400px]"
              style={{ aspectRatio: '375/812', maxHeight: '100%' }}
            >
              {/* Content container */}
              <div className="relative w-full h-full rounded-[2.5rem] sm:rounded-[3.5rem] border-[8px] sm:border-[12px] border-[#1c1c1c] bg-[#1c1c1c] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1c1c1c] rounded-b-3xl z-50 flex items-center justify-center">
                  <div className="w-12 h-1 bg-white/10 rounded-full" />
                </div>
                
                <div className="absolute inset-0 bg-white overflow-hidden rounded-[2.5rem]">
                  <IframePreview title="Theme Preview" className="w-full h-full">
                    {(() => {
                      const LayoutComponent = (layouts as any)[layout] || layouts['elegant-cream'];
                      const invitation = {
                        ...MOCK_INVITATION,
                        stylePreferences: {
                          ...MOCK_INVITATION.stylePreferences,
                          layout: layout
                        }
                      };
                      return <LayoutComponent invitation={invitation} isPreview={true} />;
                    })()}
                  </IframePreview>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Close Button - Positioned fixed to the viewport so it's always accessible */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="fixed top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all shadow-xl z-[110]"
        >
          <X className="h-6 w-6" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
