'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Invitation } from '@/types';
import { resolvePhotos, formatEventDate } from './shared';

interface LayerThemeRendererProps {
  invitation: Invitation;
  config: any; // The new Fabric JSON Config
}

export default function LayerThemeRenderer({ invitation, config }: LayerThemeRendererProps) {
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => setMounted(true), []);

  const { groomName, brideName, eventDate } = invitation;
  const { formattedDate } = formatEventDate(eventDate);
  const { heroPhoto } = resolvePhotos(invitation);

  // Helper to replace variables
  const parseText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/{{groomName}}/g, groomName || 'Groom')
      .replace(/{{brideName}}/g, brideName || 'Bride')
      .replace(/{{eventDate}}/g, formattedDate || 'DD/MM/YYYY');
  };

  if (!mounted) return null;

  // Expecting a raw Fabric.js JSON object
  const objects = config?.objects || [];
  
  // Fabric canvas dimensions used during design
  const CANVAS_WIDTH = 375;
  const CANVAS_HEIGHT = 812;

  return (
    <div 
      className="w-full min-h-[100dvh] relative overflow-hidden"
      style={{ backgroundColor: config?.background || '#f5f3ee' }}
    >
      <div 
        className="relative w-full overflow-hidden"
        style={{ 
          height: CANVAS_HEIGHT, // Default height, could be dynamic
        }}
      >
        {objects.map((layer: any, idx: number) => {
          // Convert px to percentages relative to mobile width (375px)
          const leftPct = ((layer.left || 0) / CANVAS_WIDTH) * 100;
          const topPct = ((layer.top || 0) / CANVAS_HEIGHT) * 100;
          
          // Fabric width/height are multiplied by scale
          const actualWidth = (layer.width || 0) * (layer.scaleX || 1);
          const actualHeight = (layer.height || 0) * (layer.scaleY || 1);
          
          const widthPct = (actualWidth / CANVAS_WIDTH) * 100;
          const heightPct = (actualHeight / CANVAS_HEIGHT) * 100;

          return (
            <motion.div
              key={`${layer.type}-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="absolute origin-top-left"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                height: `${heightPct}%`,
                zIndex: idx + 1, // Fabric arrays are z-indexed by array position
                opacity: layer.opacity ?? 1,
                rotate: `${layer.angle || 0}deg`,
              }}
            >
              {/* Render Shape */}
              {(layer.type === 'rect' || layer.type === 'circle') && (
                <div 
                  className="w-full h-full"
                  style={{ 
                    backgroundColor: layer.fill,
                    borderRadius: layer.type === 'circle' ? '50%' : (layer.rx || 0),
                  }}
                />
              )}

              {/* Render Text */}
              {(layer.type === 'i-text' || layer.type === 'text') && (
                <div 
                  className="w-full h-full leading-none"
                  style={{ 
                    color: layer.fill, 
                    fontSize: `${((layer.fontSize || 16) / CANVAS_WIDTH) * 100}vw`, // responsive font size
                    fontFamily: layer.fontFamily,
                    textAlign: layer.textAlign,
                  }}
                >
                  {parseText(layer.text)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
