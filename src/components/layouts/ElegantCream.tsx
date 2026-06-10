'use client';
import { getCoupleSlug } from '@/lib/utils';

import { useState, useEffect } from 'react';
import { Heart, MapPin, ChevronDown } from 'lucide-react';
import SafeQRCodeSVG from '@/components/dashboard/SafeQRCodeSVG';
import type { Invitation, Guest } from '@/types';
import Image from 'next/image';
import {
  AnimatedSection,
  CountdownTimer,
  AudioPlayer,
  resolvePhotos,
  formatEventDate,
  getMapsUrl,
  IconMapper,
  WaveDivider,
  ParallaxImage,
  DigitalGiftSection,
  LoveStorySection,
  QuotesSection,
  GuestWelcome,
  TornEdgeTop,
  TornEdgeBottom,
  TierGate,
  useTier,
  EventActionButtons,
  
  GallerySection,
  VideoEmbedSection,
} from './shared';

interface LayoutProps {
  invitation: Invitation;
  isPreview?: boolean;
}

export default function ElegantCream({ invitation, isPreview = false }: LayoutProps) {
  const { tier } = useTier();
  const [_matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
  const { formattedDate, dayNumber, monthName, dayName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, photo2, photo3, galleryPhotos, groomPhoto, bridePhoto } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  useEffect(() => {
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
  }, [invitation.guests]);

  return (
    <div className="w-full max-w-lg mx-auto bg-[#f5f0eb] text-stone-800 font-sans overflow-hidden relative shadow-2xl">
      {/* Opening Phrase — user-customizable, renders above hero */}
      {/* Hero */}
      <section className="relative w-full h-[100dvh] min-h-[600px] flex flex-col items-center justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="absolute top-20 left-6 w-24 h-24 rounded-full bg-white/5 blur-2xl animate-float" />
        <div className="absolute top-40 right-8 w-32 h-32 rounded-full bg-white/5 blur-2xl animate-float-delayed" />

        <div className="relative z-10 text-center pb-16 px-6">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/70 mb-3 animate-fade-in-down">Kami Segera Menikah</p>
          <h1 className="animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.groomName}</span>
            <span className="block text-2xl sm:text-3xl font-serif italic font-normal text-white/80 my-2">&</span>
            <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.brideName}</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 mt-6 tracking-widest animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>{formattedDate}</p>
          
          <GuestWelcome />

          <div className="mt-10 animate-bounce" style={{ animationDelay: '1.5s' }}>
            <ChevronDown className="h-6 w-6 text-white/50 mx-auto" />
          </div>
        </div>
      </section>

      <div className="relative h-px w-full bg-[#f5f0eb]">
        <WaveDivider fill="#faf7f0" position="top" />
      </div>

      {/* Countdown */}
      <section className="py-14 px-4 sm:px-6 text-center bg-[#f5f0eb]">
        <TierGate tier={tier} minTier="PREMIUM">
        <AnimatedSection><p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-8">Menuju Hari Bahagia</p></AnimatedSection>
        <AnimatedSection delay="delay-200"><CountdownTimer targetDate={invitation.eventDate} /></AnimatedSection>
      </TierGate>
        <AnimatedSection delay="delay-300">
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-stone-300 animate-shimmer" />
            <Heart className="h-4 w-4 text-stone-400 animate-heartbeat" />
            <div className="h-px w-12 bg-stone-300 animate-shimmer" />
          </div>
          <p className="text-sm text-stone-500 mt-6 leading-relaxed max-w-xs mx-auto">Kami mengundang Anda untuk merayakan pernikahan kami</p>
        </AnimatedSection>
        <AnimatedSection animation="scale" delay="delay-400">
          <div className="mt-6 inline-flex items-center gap-4 border border-stone-300 rounded-sm px-6 py-3">
            <span className="text-xs uppercase tracking-widest text-stone-500">{dayName}</span>
            <span className="text-3xl font-display font-bold text-stone-800">{dayNumber}</span>
            <span className="text-xs uppercase tracking-widest text-stone-500">{monthName}</span>
          </div>
        </AnimatedSection>
      </section>

      {/* Greeting */}
      <section className="py-12 px-8 bg-[#f5f0eb] text-center">
        <AnimatedSection><div className="max-w-sm mx-auto"><p className="text-base sm:text-lg font-serif italic text-stone-600 leading-relaxed">&ldquo;{invitation.greeting}&rdquo;</p></div></AnimatedSection>
        <AnimatedSection delay="delay-200"><p className="text-sm text-stone-500 leading-relaxed mt-6 max-w-sm mx-auto">{invitation.mainBody}</p></AnimatedSection>
      </section>

      {/* The Couple Profile */}
      <section className="py-20 px-8 bg-[#f5f0eb] text-center">
        <div className="grid grid-cols-1 gap-16">
          {/* Groom */}
          <AnimatedSection animation="left">
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-8 group">
                <div className="absolute inset-0 bg-stone-200 rounded-full scale-110 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <Image src={groomPhoto} alt="Groom" fill className="object-cover" unoptimized />
                </div>
              </div>
              <h3 className="text-3xl font-display font-bold text-stone-800 mb-2">{invitation.groomName}</h3>
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Putra dari</p>
              <p className="text-sm text-stone-600 font-serif italic">{invitation.groomParents || 'Bapak & Ibu'}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="scale">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-stone-300" />
              <Heart className="h-5 w-5 text-rose-400/60 animate-heartbeat" fill="currentColor" />
              <div className="h-px w-12 bg-stone-300" />
            </div>
          </AnimatedSection>

          {/* Bride */}
          <AnimatedSection animation="right">
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-8 group">
                <div className="absolute inset-0 bg-rose-100 rounded-full scale-110 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <Image src={bridePhoto} alt="Bride" fill className="object-cover" unoptimized />
                </div>
              </div>
              <h3 className="text-3xl font-display font-bold text-stone-800 mb-2">{invitation.brideName}</h3>
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Putri dari</p>
              <p className="text-sm text-stone-600 font-serif italic">{invitation.brideParents || 'Bapak & Ibu'}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Photo divider */}
      <ParallaxImage src={photo2} alt="Couple photo" className="w-full h-[350px] sm:h-[450px]" />

      {/* Ceremony */}
      <section className="py-20 px-8 bg-white text-center relative">
        <WaveDivider fill="#f5f0eb" position="top" />
        <div className="mt-12">
          <AnimatedSection animation="scale"><div className="inline-flex p-3 rounded-full border border-stone-300 mb-4"><Heart className="h-5 w-5 text-stone-500" /></div></AnimatedSection>
          <AnimatedSection delay="delay-100"><h2 className="text-2xl font-display font-bold text-stone-800 mb-4">Acara Pernikahan</h2></AnimatedSection>
          <AnimatedSection delay="delay-200">
            <p className="text-sm text-stone-600 leading-relaxed">{invitation.eventTime}</p>
            <p className="text-sm text-stone-600 mt-1 font-medium">{invitation.venueName}</p>
            <p className="text-xs text-stone-400 mt-1">{invitation.venueAddress}</p>
                  <EventActionButtons eventName="Acara Pernikahan" eventDate={invitation.eventDate} eventTime={invitation.eventTime} venueName={invitation.venueName} venueAddress={invitation.venueAddress} />
          </AnimatedSection>
          <AnimatedSection delay="delay-300">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 border border-stone-800 text-stone-800 text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-stone-800 hover:text-[#f5f0eb] transition-all duration-300">
              <MapPin className="h-3.5 w-3.5" />Petunjuk Lokasi
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-8 bg-[#f5f0eb] relative">
        <WaveDivider fill="#fff" position="top" />
        <AnimatedSection><h2 className="text-2xl font-display font-bold text-stone-800 text-center mb-10">Susunan Acara</h2></AnimatedSection>
        <div className="max-w-xs mx-auto space-y-0">
          {invitation.schedule && invitation.schedule.length > 0 ? (
            invitation.schedule.map((item, idx) => (
              <AnimatedSection key={item.id || idx} animation={idx % 2 === 0 ? 'left' : 'right'} delay={`delay-${(idx + 1) * 100}`}>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-stone-300 bg-[#f5f0eb] flex items-center justify-center shrink-0 hover:border-stone-500 hover:scale-110 transition-all duration-300">
                      <IconMapper name={item.icon} className="h-4 w-4 text-stone-500" />
                    </div>
                    {idx < invitation.schedule.length - 1 && <div className="w-px h-10 bg-stone-300" />}
                  </div>
                  <div className="pt-2 pb-6">
                    {item.time && <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">{item.time}</p>}
                    <p className="text-sm text-stone-600">{item.label}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))
          ) : (
            <p className="text-sm text-stone-500 text-center italic">Jadwal tidak tersedia.</p>
          )}
        </div>
      </section>

      {/* Photo divider */}
      <section className="relative w-full h-[350px] sm:h-[450px] overflow-hidden">
        <TornEdgeTop />
        <Image src={photo3} alt="Couple photo" fill className="object-cover animate-gentle-zoom" unoptimized />
        <TornEdgeBottom />
      </section>

      {/* Location Map */}
      <section className="py-14 px-8 bg-[#f5f0eb] text-center">
        <AnimatedSection animation="scale">
          <div className="inline-flex p-3 rounded-full border border-stone-300 mb-4"><MapPin className="h-5 w-5 text-stone-500" /></div>
          <h2 className="text-2xl font-display font-bold text-stone-800 mb-6">Lokasi Acara</h2>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <div className="rounded-xl overflow-hidden border border-stone-200 shadow-sm h-[280px]">
            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://www.google.com/maps?q=${encodeURIComponent(invitation.venueName + ', ' + invitation.venueAddress)}&output=embed`} allowFullScreen title="Event Location" />
          </div>
        </AnimatedSection>
        <AnimatedSection delay="delay-300">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-stone-800 text-[#f5f0eb] text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-stone-700 transition-all duration-300">
            <MapPin className="h-3.5 w-3.5" />Buka di Google Maps
          </a>
        </AnimatedSection>
      </section>

      {/* Love Story */}
      <LoveStorySection story={invitation.loveStory || []} bgColor="#f5f0eb" textColor="text-stone-800" accentColor="text-rose-400" floralImage="/images/bunga.png" />

      {/* Digital Gift */}
      <DigitalGiftSection gifts={(invitation as any).digitalGifts || []} bgColor="bg-[#faf9f6]" textColor="text-stone-800" />

      {/* Gallery — shared tier-aware component */}
      <GallerySection
        photos={galleryPhotos}
        bgColor="bg-[#f5f0eb]"
        textColor="text-stone-800"
        borderColor="border-stone-300"
        title="Momen Bahagia"
      />

      {/* Video Embed — ULTIMATE only, shared component */}
      <VideoEmbedSection
        videoUrl={invitation.videoUrl}
        bgColor="bg-stone-900"
        textColor="text-white"
        title="Kisah Kami"
      />

      {/* Quotes */}
      <QuotesSection text={invitation.quotes || ''} bgColor="#fcfbf8" textColor="text-stone-800" />

      {/* Closing */}
      <section className="py-14 px-8 bg-[#f5f0eb] text-center">
        <AnimatedSection>
          <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-10 bg-stone-300" /><Heart className="h-4 w-4 text-stone-400 animate-heartbeat" fill="currentColor" /><div className="h-px w-10 bg-stone-300" /></div>
        </AnimatedSection>
        <AnimatedSection delay="delay-200"><p className="text-base font-serif italic text-stone-600 leading-relaxed max-w-sm mx-auto">{invitation.closing}</p></AnimatedSection>
        <AnimatedSection delay="delay-400">
          <div className="mt-10">
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-stone-800">{invitation.groomName} & {invitation.brideName}</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400 mt-3">{formattedDate}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay="delay-500">
          <div className="flex items-center justify-center gap-3 mt-10"><div className="h-px w-16 bg-stone-300" /><Heart className="h-3 w-3 text-stone-300" /><div className="h-px w-16 bg-stone-300" /></div>
        </AnimatedSection>

        {invitation.tier === 'ULTIMATE' && invitation.qrEnabled !== false && (
          <AnimatedSection delay="delay-500">
            <div className="mt-12 flex flex-col items-center justify-center gap-3 px-6 max-w-sm mx-auto">
              <div className="bg-white p-3.5 rounded-2xl inline-block shadow-lg border border-stone-200">
                <SafeQRCodeSVG
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${getCoupleSlug(invitation.groomName, invitation.brideName)}/${invitation.slug}/attendance`}
                  size={130}
                  level="H"
                />
              </div>
              <p className="text-xs text-stone-700 font-semibold mt-1">
                QR Code Buku Tamu (Attendance)
              </p>
              <p className="text-[9px] text-stone-500 leading-relaxed font-sans max-w-[240px] text-center">
                Pindai QR Code ini untuk melakukan pengisian Buku Tamu secara digital saat menghadiri acara.
              </p>
            </div>
          </AnimatedSection>
        )}
      </section>

      <div className="h-4 bg-[#f5f0eb]" />
      {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} />}
    </div>
  );
}
