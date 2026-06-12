'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Heart, MapPin, ChevronDown } from 'lucide-react';
import type { Invitation, Guest } from '@/types';
import {
  AnimatedSection,
  CountdownTimer,
  AudioPlayer,
  resolvePhotos,
  formatEventDate,
  getMapsUrl,
  WaveDivider,
  CurvedDivider,
  ParallaxImage,
  DigitalGiftSection,
  LoveStorySection,
  GuestWelcome,
  TierGate,
  useTier,
  EventActionButtons,
  GallerySection,
  VideoEmbedSection,
  WishesSection,
} from './shared';

interface CanvasLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  zIndex?: number;
  position?: 'absolute' | 'relative';

  // text
  textTitle?: string;
  fontSize?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';

  // image
  imageUrl?: string;
  borderRadius?: number;
  opacity?: number;

  // shape
  shapeType?: 'circle' | 'rectangle' | 'line';
  shapeColor?: string;
  borderRadiusShape?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
}

interface ThemeConfig {
  style?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    fontFamilyTitle?: string;
    fontFamilyBody?: string;
    fontFamilyScript?: string;
    customCss?: string;
  };
  ambientEffect?: 'sparkles' | 'gold-dust' | 'snow' | 'none';
  sections: Array<{
    id: string;
    type: string;
    animation?: 'up' | 'left' | 'right' | 'scale' | 'fade' | 'down' | 'flip' | 'rotate' | 'none';
    delay?: string;
    paddingY?: string;
    layout?: string;
    customStyles?: Record<string, string>;

    // Custom styling overrides
    backgroundColor?: string;
    textColor?: string;
    bgImage?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    opacity?: number;
    shadowBlur?: number;
    shadowColor?: string;
    shadowOffsetX?: number;
    shadowOffsetY?: number;

    // custom-text fields
    textTitle?: string;
    textBody?: string;
    titleFontSize?: string;
    bodyFontSize?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';

    // custom-image fields
    imageUrl?: string;
    imageWidth?: string;
    imageHeight?: string;
    imageAlign?: 'left' | 'center' | 'right';

    // custom-shape fields
    shapeType?: 'circle' | 'rectangle' | 'line' | 'card';
    shapeWidth?: string;
    shapeHeight?: string;
    shapeColor?: string;
    shapeAlign?: 'left' | 'center' | 'right';

    // Divider fill
    dividerFill?: string;

    // Canvas Layers (Figma Builder)
    layers?: CanvasLayer[];
    canvasHeight?: string;
  }>;
}

interface DynamicThemeRendererProps {
  invitation: Invitation;
  config: ThemeConfig;
  isPreview?: boolean;
  editingMode?: boolean;
  selectedLayerId?: string | null;
  onSelectLayer?: (sectionId: string, layerId: string) => void;
  onUpdateLayer?: (sectionId: string, layerId: string, updates: any) => void;
}

export default function DynamicThemeRenderer({
  invitation,
  config,
  isPreview = false,
  editingMode = false,
  selectedLayerId = null,
  onSelectLayer,
  onUpdateLayer,
}: DynamicThemeRendererProps) {
  const { tier } = useTier();
  const [mounted, setMounted] = useState(false);
  const [_matchedGuest, setMatchedGuest] = useState<Guest | null>(null);

  const { formattedDate, dayNumber, monthName, dayName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, photo2, photo3, galleryPhotos, groomPhoto, bridePhoto } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  // Parse style configuration
  const themeStyles = useMemo(() => config.style || {}, [config.style]);

  // Load Google Fonts dynamically on mount
  useEffect(() => {
    setMounted(true);
    
    // Extract unique font names
    const fonts = [
      themeStyles.fontFamilyTitle,
      themeStyles.fontFamilyBody,
      themeStyles.fontFamilyScript
    ].filter(Boolean) as string[];

    if (fonts.length === 0) return;

    // Build Google Fonts API URL
    const fontQuery = fonts.map(f => `family=${f.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,700;1,400`).join('&');
    const linkId = 'dynamic-google-fonts';
    
    let linkElement = document.getElementById(linkId) as HTMLLinkElement;
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.id = linkId;
      linkElement.rel = 'stylesheet';
      document.head.appendChild(linkElement);
    }
    linkElement.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;

    // Handle guest matching
    const p = new URLSearchParams(window.location.search);
    const to = p.get('to');
    if (to && invitation.guests) {
      const decodedTo = decodeURIComponent(to).trim().toLowerCase();
      const guest = invitation.guests.find(
        (g) => g.name.trim().toLowerCase() === decodedTo
      );
      if (guest) {
        setTimeout(() => { setMatchedGuest(guest); }, 0);
      }
    }
  }, [themeStyles, invitation.guests]);

  // Inject custom CSS variable styles into a dynamic <style> block
  const styleVariables = useMemo(() => {
    const titleFont = themeStyles.fontFamilyTitle || 'Playfair Display';
    const bodyFont = themeStyles.fontFamilyBody || 'Inter';
    const scriptFont = themeStyles.fontFamilyScript || 'Dancing Script';

    return `
      .dynamic-theme-wrapper {
        --bg-color: ${themeStyles.backgroundColor || '#fdfcf9'};
        --text-color: ${themeStyles.textColor || '#1c1c1c'};
        --accent-color: ${themeStyles.accentColor || '#f43f5e'};
        --font-title: "${titleFont}", serif;
        --font-body: "${bodyFont}", sans-serif;
        --font-script: "${scriptFont}", cursive;
      }
      .dynamic-theme-wrapper .font-display {
        font-family: var(--font-title);
      }
      .dynamic-theme-wrapper .font-serif {
        font-family: var(--font-title);
      }
      .dynamic-theme-wrapper .font-handwriting {
        font-family: var(--font-script);
      }
      .dynamic-theme-wrapper p, 
      .dynamic-theme-wrapper span, 
      .dynamic-theme-wrapper div:not(.font-display):not(.font-serif):not(.font-handwriting) {
        font-family: var(--font-body);
      }
      ${themeStyles.customCss || ''}
    `;
  }, [themeStyles]);

  // Render ambient background animations
  const renderAmbientEffect = () => {
    if (!mounted) return null;
    switch (config.ambientEffect) {
      case 'sparkles':
        // Reuse PremiumJavanese FallingSparkles component if it's there
        return <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden"><FallingSparklesWrapper /></div>;
      case 'gold-dust':
        // Reuse ElegantSundanese GoldDustParticles component
        return <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden"><GoldDustParticlesWrapper /></div>;
      case 'snow':
        // We can render a fallback snow effect or empty
        return null;
      case 'none':
      default:
        return null;
    }
  };

  const sections = useMemo(() => config.sections || [], [config.sections]);

  return (
    <div className="dynamic-theme-wrapper w-full max-w-lg mx-auto overflow-hidden relative shadow-2xl min-h-screen text-[var(--text-color)]" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* Inject custom variables & custom CSS */}
      <style dangerouslySetInnerHTML={{ __html: styleVariables }} />

      {/* Background Audio */}
      {invitation.musicUrl && (
        <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} />
      )}

      {/* Particle Overlay */}
      {renderAmbientEffect()}

      {/* Sequential Sections Rendering */}
      {sections.map((sect, index) => {
        const paddingYClass = sect.paddingY || 'py-16';

        // Prepare custom style overrides for the section
        const sectionCustomStyle: React.CSSProperties = {
          backgroundColor: sect.backgroundColor || undefined,
          color: sect.textColor || undefined,
          backgroundImage: sect.bgImage ? `url(${sect.bgImage})` : undefined,
          backgroundSize: sect.bgImage ? 'cover' : undefined,
          backgroundPosition: sect.bgImage ? 'center' : undefined,
          borderRadius: sect.borderRadius ? `${sect.borderRadius}px` : undefined,
          borderStyle: sect.borderStyle || undefined,
          borderWidth: sect.borderWidth ? `${sect.borderWidth}px` : undefined,
          borderColor: sect.borderColor || undefined,
          opacity: sect.opacity !== undefined ? sect.opacity / 100 : undefined,
          boxShadow: (sect.shadowOffsetX !== undefined || sect.shadowOffsetY !== undefined || sect.shadowBlur !== undefined)
            ? `${sect.shadowOffsetX || 0}px ${sect.shadowOffsetY || 0}px ${sect.shadowBlur || 0}px ${sect.shadowColor || 'rgba(0,0,0,0.1)'}`
            : undefined,
        };
        
        // Wrap content with animation helper
        const renderContentWithAnimation = (content: React.ReactNode) => {
          if (!sect.animation || sect.animation === 'none') {
            return <div className={`${paddingYClass} px-6 relative z-10`}>{content}</div>;
          }
          return (
            <AnimatedSection animation={sect.animation as any} delay={sect.delay || ''} className={`${paddingYClass} px-6 relative z-10`}>
              {content}
            </AnimatedSection>
          );
        };

        switch (sect.type) {
          case 'hero':
            return (
              <section key={sect.id} className="relative w-full h-[100dvh] min-h-[600px] flex flex-col items-center justify-end overflow-hidden" style={sectionCustomStyle}>
                <div className="absolute inset-0">
                  <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom" priority unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="relative z-10 text-center pb-16 px-6">
                  <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/70 mb-3 font-semibold">Kami Segera Menikah</p>
                  <h1 className="my-2">
                    <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.groomName}</span>
                    <span className="block text-2xl sm:text-3xl font-handwriting text-white/80 my-2">&</span>
                    <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.brideName}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-white/60 mt-6 tracking-widest">{formattedDate}</p>
                  
                  <GuestWelcome />

                  <div className="mt-10 animate-bounce">
                    <ChevronDown className="h-6 w-6 text-white/50 mx-auto" />
                  </div>
                </div>
              </section>
            );

          case 'countdown':
            return (
              <section key={sect.id} className="bg-transparent text-center relative overflow-hidden" style={sectionCustomStyle}>
                <TierGate tier={tier} minTier="PREMIUM">
                  {renderContentWithAnimation(
                    <div className="flex flex-col items-center">
                      <p className="text-xs uppercase tracking-[0.25em] opacity-65 mb-8">Menuju Hari Bahagia</p>
                      <CountdownTimer targetDate={invitation.eventDate} />
                      <div className="mt-8 flex items-center justify-center gap-3 w-full">
                        <div className="h-px w-12 opacity-30 bg-[var(--text-color)]" />
                        <Heart className="h-4 w-4 text-[var(--accent-color)] animate-heartbeat" fill="currentColor" />
                        <div className="h-px w-12 opacity-30 bg-[var(--text-color)]" />
                      </div>
                      <div className="mt-6 inline-flex items-center gap-4 border border-[var(--text-color)]/25 rounded-md px-6 py-3">
                        <span className="text-xs uppercase tracking-widest opacity-75">{dayName}</span>
                        <span className="text-3xl font-display font-bold">{dayNumber}</span>
                        <span className="text-xs uppercase tracking-widest opacity-75">{monthName}</span>
                      </div>
                    </div>
                  )}
                </TierGate>
              </section>
            );

          case 'quote':
            return (
              <section key={sect.id} className="bg-transparent text-center" style={sectionCustomStyle}>
                {renderContentWithAnimation(
                  <div className="max-w-sm mx-auto flex flex-col gap-6">
                    <p className="text-base sm:text-lg font-handwriting text-[var(--accent-color)] leading-relaxed">&ldquo;{invitation.greeting}&rdquo;</p>
                    <p className="text-sm opacity-80 leading-relaxed">{invitation.mainBody}</p>
                  </div>
                )}
              </section>
            );

          case 'couple':
            return (
              <section key={sect.id} className="bg-transparent text-center" style={sectionCustomStyle}>
                {renderContentWithAnimation(
                  <div className="grid grid-cols-1 gap-14">
                    {/* Groom */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-6 group">
                        <div className="absolute inset-0 bg-[var(--accent-color)]/5 rounded-full scale-110 blur-xl opacity-50" />
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                          <Image src={groomPhoto} alt="Groom" fill className="object-cover" unoptimized />
                        </div>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2">{invitation.groomName}</h3>
                      <p className="text-[10px] sm:text-xs opacity-50 uppercase tracking-widest mb-1">Putra dari</p>
                      <p className="text-sm opacity-80 font-handwriting text-lg">{invitation.groomParents || 'Bapak & Ibu'}</p>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <div className="h-px w-12 opacity-20 bg-[var(--text-color)]" />
                      <Heart className="h-5 w-5 text-[var(--accent-color)]/70 animate-heartbeat" fill="currentColor" />
                      <div className="h-px w-12 opacity-20 bg-[var(--text-color)]" />
                    </div>

                    {/* Bride */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-6 group">
                        <div className="absolute inset-0 bg-[var(--accent-color)]/5 rounded-full scale-110 blur-xl opacity-50" />
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                          <Image src={bridePhoto} alt="Bride" fill className="object-cover" unoptimized />
                        </div>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2">{invitation.brideName}</h3>
                      <p className="text-[10px] sm:text-xs opacity-50 uppercase tracking-widest mb-1">Putri dari</p>
                      <p className="text-sm opacity-80 font-handwriting text-lg">{invitation.brideParents || 'Bapak & Ibu'}</p>
                    </div>
                  </div>
                )}
              </section>
            );

          case 'divider-image':
            return (
              <div key={sect.id} style={sectionCustomStyle}>
                <ParallaxImage src={photo2} alt="Couple photo" className="w-full h-[300px] sm:h-[400px]" />
              </div>
            );

          case 'event':
            return (
              <section key={sect.id} className="relative z-10 text-center bg-white/40 backdrop-blur-md" style={sectionCustomStyle}>
                <WaveDivider fill={sect.dividerFill || "var(--bg-color)"} position="top" />
                {renderContentWithAnimation(
                  <div className="my-6">
                    <div className="inline-flex p-3 rounded-full border border-[var(--text-color)]/20 mb-4">
                      <Heart className="h-5 w-5 text-[var(--accent-color)]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold mb-4">Acara Pernikahan</h2>
                    <p className="text-sm opacity-80 leading-relaxed">{invitation.eventTime}</p>
                    <p className="text-sm font-semibold mt-2">{invitation.venueName}</p>
                    <p className="text-xs opacity-60 mt-1 max-w-xs mx-auto">{invitation.venueAddress}</p>
                    
                    <EventActionButtons 
                      eventName="Acara Pernikahan" 
                      eventDate={invitation.eventDate} 
                      eventTime={invitation.eventTime} 
                      venueName={invitation.venueName} 
                      venueAddress={invitation.venueAddress} 
                    />

                    <div className="mt-8">
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--text-color)] text-[var(--bg-color)] text-xs font-semibold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all duration-300">
                        <MapPin className="h-3.5 w-3.5" />Petunjuk Lokasi
                      </a>
                    </div>
                  </div>
                )}
                <WaveDivider fill={sect.dividerFill || "var(--bg-color)"} position="bottom" />
              </section>
            );

          case 'story':
            return (
              <section key={sect.id} className="bg-transparent" style={sectionCustomStyle}>
                {renderContentWithAnimation(
                  <div className="flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-10">Kisah Cinta Kami</h2>
                    <LoveStorySection story={invitation.loveStory || []} />
                  </div>
                )}
              </section>
            );

          case 'gallery':
            return (
              <section key={sect.id} className="bg-transparent" style={sectionCustomStyle}>
                {renderContentWithAnimation(
                  <div className="flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-10">Galeri Foto</h2>
                    <GallerySection photos={galleryPhotos} />
                  </div>
                )}
              </section>
            );

          case 'video':
            return (
              <section key={sect.id} className="bg-transparent" style={sectionCustomStyle}>
                {renderContentWithAnimation(
                  <div className="flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-10">Pratinjau Video</h2>
                    <VideoEmbedSection videoUrl={invitation.videoUrl} />
                  </div>
                )}
              </section>
            );

          case 'gifts':
            return (
              <section key={sect.id} className="bg-white/40 backdrop-blur-md relative" style={sectionCustomStyle}>
                <WaveDivider fill={sect.dividerFill || "var(--bg-color)"} position="top" />
                {renderContentWithAnimation(
                  <div className="my-6">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-center mb-8">Kado Digital</h2>
                    <DigitalGiftSection gifts={invitation.digitalGifts || []} />
                  </div>
                )}
                <WaveDivider fill={sect.dividerFill || "var(--bg-color)"} position="bottom" />
              </section>
            );

          case 'wishes':
            return (
              <section key={sect.id} className="bg-transparent" style={sectionCustomStyle}>
                {renderContentWithAnimation(
                  <WishesSection invitation={invitation} />
                )}
              </section>
            );

          case 'divider-wave':
            return (
              <div key={sect.id} className="relative h-12 w-full" style={sectionCustomStyle}>
                <WaveDivider fill={sect.dividerFill || "var(--bg-color)"} position={index % 2 === 0 ? 'top' : 'bottom'} />
              </div>
            );

          case 'divider-curved':
            return (
              <div key={sect.id} className="relative h-12 w-full" style={sectionCustomStyle}>
                <CurvedDivider fill={sect.dividerFill || "var(--bg-color)"} position={index % 2 === 0 ? 'top' : 'bottom'} />
              </div>
            );

          case 'custom-text':
            return (
              <section key={sect.id} className="relative z-10 w-full" style={sectionCustomStyle}>
                {renderContentWithAnimation(
                  <div className="w-full px-4" style={{ textAlign: sect.textAlign || 'center' }}>
                    {sect.textTitle && (
                      <h2 
                        className="font-display font-bold mb-4" 
                        style={{ 
                          fontSize: sect.titleFontSize || '1.75rem',
                          color: sect.textColor || 'inherit'
                        }}
                      >
                        {sect.textTitle}
                      </h2>
                    )}
                    {sect.textBody && (
                      <p 
                        className="opacity-80 leading-relaxed" 
                        style={{ 
                          fontSize: sect.bodyFontSize || '0.875rem',
                          color: sect.textColor || 'inherit'
                        }}
                      >
                        {sect.textBody}
                      </p>
                    )}
                  </div>
                )}
              </section>
            );

          case 'custom-image':
            return (
              <section key={sect.id} className="relative z-10 w-full" style={sectionCustomStyle}>
                {renderContentWithAnimation(
                  <div className="w-full flex" style={{ justifyContent: sect.imageAlign === 'left' ? 'flex-start' : sect.imageAlign === 'right' ? 'flex-end' : 'center' }}>
                    {sect.imageUrl ? (
                      <div 
                        className="relative overflow-hidden"
                        style={{
                          width: sect.imageWidth || '100%',
                          height: sect.imageHeight || 'auto',
                          aspectRatio: sect.imageHeight ? undefined : '16/9',
                          borderRadius: sect.borderRadius ? `${sect.borderRadius}px` : '0px',
                          borderStyle: sect.borderStyle || undefined,
                          borderWidth: sect.borderWidth ? `${sect.borderWidth}px` : undefined,
                          borderColor: sect.borderColor || undefined,
                        }}
                      >
                        <img 
                          src={sect.imageUrl} 
                          alt="Custom upload" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-[#eceae4] p-8 text-center text-xs opacity-50 w-full rounded-xl">
                        Belum ada gambar terpilih. Silakan unggah di panel inspektor.
                      </div>
                    )}
                  </div>
                )}
              </section>
            );

          case 'custom-shape':
            return (
              <section key={sect.id} className="relative z-10 w-full flex" style={{ ...sectionCustomStyle, justifyContent: sect.shapeAlign === 'left' ? 'flex-start' : sect.shapeAlign === 'right' ? 'flex-end' : 'center' }}>
                {renderContentWithAnimation(
                  <div 
                    style={{
                      width: sect.shapeWidth || '60px',
                      height: sect.shapeType === 'line' ? (sect.shapeHeight || '2px') : (sect.shapeHeight || '60px'),
                      backgroundColor: sect.shapeColor || 'var(--accent-color)',
                      borderRadius: sect.shapeType === 'circle' ? '50%' : (sect.borderRadius ? `${sect.borderRadius}px` : '0px'),
                      borderStyle: sect.borderStyle || undefined,
                      borderWidth: sect.borderWidth ? `${sect.borderWidth}px` : undefined,
                      borderColor: sect.borderColor || undefined,
                    }}
                  />
                )}
              </section>
            );

          case 'canvas': {
            const canvasHeight = sect.canvasHeight || '500px';
            const layers = sect.layers || [];
            
            return (
              <section 
                key={sect.id} 
                className="relative w-full overflow-hidden flex flex-col items-center justify-center p-4 gap-3" 
                style={{ ...sectionCustomStyle, height: canvasHeight }}
                onClick={() => {
                  if (onSelectLayer && editingMode) onSelectLayer(sect.id, '');
                }}
              >
                {layers.map((layer) => {
                  const isSelected = selectedLayerId === layer.id;
                  const isAbsolute = layer.position !== 'relative';
                  
                  // Style for the layer container
                  const layerStyle: React.CSSProperties = {
                    position: isAbsolute ? 'absolute' : 'relative',
                    left: isAbsolute ? `${layer.left}%` : undefined,
                    top: isAbsolute ? `${layer.top}%` : undefined,
                    width: `${layer.width}%`,
                    height: `${layer.height}%`,
                    transform: layer.rotate ? `rotate(${layer.rotate}deg)` : undefined,
                    zIndex: layer.zIndex || 1,
                    margin: isAbsolute ? undefined : '0 auto',
                  };

                  return (
                    <CanvasLayerRenderer
                      key={layer.id}
                      layer={layer}
                      style={layerStyle}
                      isSelected={isSelected}
                      editingMode={editingMode}
                      sectionId={sect.id}
                      onSelect={(e) => {
                        e.stopPropagation();
                        if (onSelectLayer) onSelectLayer(sect.id, layer.id);
                      }}
                      onUpdateLayer={onUpdateLayer}
                    />
                  );
                })}
              </section>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

// Sparkles fallback wrapper using Javanese FallingSparkles component code
function FallingSparklesWrapper() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const sparkles = useMemo(() => {
    return [...Array(35)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      delay: `${Math.random() * 12}s`,
      duration: `${Math.random() * 15 + 10}s`,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <>
      {sparkles.map((s, idx) => (
        <span
          key={idx}
          className="absolute rounded-full bg-yellow-300 opacity-60 animate-sparkle pointer-events-none"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(0.8); opacity: 0.2; }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.2); opacity: 0.8; }
        }
        .animate-sparkle {
          animation: sparkle infinite linear;
        }
      `}</style>
    </>
  );
}

// Gold Dust fallback wrapper using Sundanese GoldDustParticles component code
function GoldDustParticlesWrapper() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const dustParticles = useMemo(() => {
    return [...Array(40)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 20 + 15}s`,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <>
      {dustParticles.map((d, idx) => (
        <span
          key={idx}
          className="absolute rounded-full bg-gradient-to-br from-yellow-100 to-amber-400 opacity-40 animate-dust pointer-events-none"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
      <style>{`
        @keyframes dust {
          0%, 100% { transform: translateY(0) translateX(0) scale(0.7); opacity: 0.1; }
          50% { transform: translateY(-40px) translateX(15px) scale(1.3); opacity: 0.6; }
        }
        .animate-dust {
          animation: dust infinite ease-in-out;
        }
      `}</style>
    </>
  );
}

// ── FIGMA CANVAS DRAG-AND-RESIZE LAYER RENDERER ──
interface CanvasLayerRendererProps {
  layer: CanvasLayer;
  style: React.CSSProperties;
  isSelected: boolean;
  editingMode: boolean;
  sectionId: string;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateLayer?: (sectionId: string, layerId: string, updates: any) => void;
}

function CanvasLayerRenderer({
  layer,
  style,
  isSelected,
  editingMode,
  sectionId,
  onSelect,
  onUpdateLayer,
}: CanvasLayerRendererProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Custom Drag handling (Figma Style)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editingMode || !onUpdateLayer) return;
    
    // Select the layer
    onSelect(e);
    
    // If it is in relative flow position, we cannot drag to position coordinates
    if (layer.position === 'relative') return;
    
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    
    const initialLeft = layer.left;
    const initialTop = layer.top;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const deltaLeftPercent = (deltaX / parentRect.width) * 100;
      const deltaTopPercent = (deltaY / parentRect.height) * 100;
      
      const newLeft = Math.max(0, Math.min(100 - layer.width, initialLeft + deltaLeftPercent));
      const newTop = Math.max(0, Math.min(100 - layer.height, initialTop + deltaTopPercent));
      
      onUpdateLayer(sectionId, layer.id, {
        left: Math.round(newLeft * 10) / 10,
        top: Math.round(newTop * 10) / 10,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Custom Resize handling from bottom-right handle node (Figma Style)
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!editingMode || !onUpdateLayer) return;
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    
    const initialWidth = layer.width;
    const initialHeight = layer.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const deltaWidthPercent = (deltaX / parentRect.width) * 100;
      const deltaHeightPercent = (deltaY / parentRect.height) * 100;
      
      const isAbsolute = layer.position !== 'relative';
      const maxW = isAbsolute ? 100 - layer.left : 100;
      const maxH = isAbsolute ? 100 - layer.top : 100;
      
      const newWidth = Math.max(5, Math.min(maxW, initialWidth + deltaWidthPercent));
      const newHeight = Math.max(5, Math.min(maxH, initialHeight + deltaHeightPercent));
      
      onUpdateLayer(sectionId, layer.id, {
        width: Math.round(newWidth * 10) / 10,
        height: Math.round(newHeight * 10) / 10,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const renderLayerContent = () => {
    switch (layer.type) {
      case 'text':
        return (
          <div 
            className="w-full h-full" 
            style={{
              color: layer.color || 'var(--text-color)',
              fontFamily: layer.fontFamily ? `"${layer.fontFamily}", sans-serif` : 'inherit',
              fontWeight: layer.fontWeight || 'bold',
              fontSize: layer.fontSize || '1.2rem',
              textAlign: layer.textAlign || 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: layer.textAlign === 'left' ? 'flex-start' : layer.textAlign === 'right' ? 'flex-end' : 'center',
            }}
          >
            {layer.textTitle || 'Teks Bebas'}
          </div>
        );
        
      case 'image':
        return (
          <div 
            className="w-full h-full overflow-hidden"
            style={{
              borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : '0px',
              opacity: layer.opacity !== undefined ? layer.opacity / 100 : 1,
            }}
          >
            {layer.imageUrl ? (
              <img src={layer.imageUrl} alt="Layer asset" className="w-full h-full object-cover pointer-events-none" />
            ) : (
              <div className="w-full h-full bg-rose-100 flex items-center justify-center text-[9px] text-rose-500 font-bold border border-rose-200 p-2 text-center leading-normal">
                Pilih Gambar di Panel
              </div>
            )}
          </div>
        );
        
      case 'shape':
        return (
          <div 
            className="w-full h-full"
            style={{
              backgroundColor: layer.shapeType === 'line' ? 'transparent' : (layer.shapeColor || 'var(--accent-color)'),
              borderRadius: layer.shapeType === 'circle' ? '50%' : (layer.borderRadiusShape ? `${layer.borderRadiusShape}px` : '0px'),
              borderStyle: layer.borderStyle || undefined,
              borderWidth: layer.shapeType === 'line' ? undefined : (layer.borderWidth ? `${layer.borderWidth}px` : undefined),
              borderColor: layer.borderColor || undefined,
              borderBottom: layer.shapeType === 'line' ? `${layer.borderWidth || 2}px ${layer.borderStyle || 'solid'} ${layer.borderColor || 'var(--text-color)'}` : undefined,
              opacity: layer.opacity !== undefined ? layer.opacity / 100 : 1,
            }}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      style={style}
      onMouseDown={handleMouseDown}
      className={`group ${editingMode ? 'cursor-move' : ''}`}
    >
      {editingMode && isSelected && (
        <div className="absolute inset-[-2px] border-2 border-blue-500 pointer-events-none z-50">
          <div 
            onMouseDown={handleResizeMouseDown}
            className="absolute bottom-[-5px] right-[-5px] w-3 h-3 bg-blue-500 rounded-full cursor-se-resize border-2 border-white pointer-events-auto shadow"
          />
        </div>
      )}
      
      {editingMode && !isSelected && (
        <div className="absolute inset-0 border border-blue-400/30 border-dashed pointer-events-none group-hover:border-blue-400 z-40" />
      )}
      
      {renderLayerContent()}
    </div>
  );
}
