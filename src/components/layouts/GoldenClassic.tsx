'use client';

import { Heart, MapPin, Clock, Calendar, Music, Camera, ChevronDown, Glasses } from 'lucide-react';
import type { Invitation } from '@/types';
import Image from 'next/image';
import {
  AnimatedSection,
  CountdownTimer,
  AudioPlayer,
  resolvePhotos,
  formatEventDate,
  getMapsUrl,
  IconMapper,
} from './shared';

interface LayoutProps {
  invitation: Invitation;
}

/* Gold Divider */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-4 w-full max-w-xs mx-auto">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
      <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
    </div>
  );
}

export default function GoldenClassic({ invitation }: LayoutProps) {
  const { formattedDate, dayNumber, monthName, dayName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, photo2, photo3, galleryPhotos } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  return (
    <div className="w-full max-w-lg mx-auto bg-white text-zinc-900 font-sans overflow-hidden relative shadow-2xl border-x border-[#D4AF37]/20">
      {/* Hero */}
      <section className="relative w-full h-[100vh] min-h-[600px] flex flex-col overflow-hidden pt-12 pb-8 px-6">
        <div className="absolute inset-0 z-0">
          <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom opacity-15" priority unoptimized />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        </div>

        {/* Inner border frame */}
        <div className="absolute inset-4 border border-[#D4AF37]/40 z-10 pointer-events-none" />
        <div className="absolute inset-5 border border-[#D4AF37]/20 z-10 pointer-events-none" />

        <div className="relative z-20 text-center flex-1 flex flex-col items-center justify-center">
          <AnimatedSection>
            <div className="mb-8">
              <span className="text-4xl font-serif text-[#D4AF37] opacity-80 italic">
                {invitation.groomName[0]}&{invitation.brideName[0]}
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay="delay-100">
            <h1 className="flex flex-col gap-2 uppercase tracking-[0.2em]">
              <span className="text-3xl sm:text-4xl font-light">{invitation.groomName}</span>
              <span className="text-xl font-serif italic text-[#D4AF37]">and</span>
              <span className="text-3xl sm:text-4xl font-light">{invitation.brideName}</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay="delay-200">
            <GoldDivider />
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mt-4">{formattedDate}</p>
          </AnimatedSection>
        </div>

        <div className="relative z-20 mt-auto animate-bounce pb-4">
          <ChevronDown className="h-6 w-6 text-[#D4AF37]/70 mx-auto" />
        </div>
      </section>

      {/* Countdown */}
      <section className="py-16 px-6 text-center bg-zinc-50 border-y border-[#D4AF37]/10">
        <AnimatedSection>
          <h2 className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] mb-10">Countdown to Forever</h2>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <CountdownTimer targetDate={invitation.eventDate} textColor="text-zinc-800" labelColor="text-zinc-500" separatorColor="text-[#D4AF37]" />
        </AnimatedSection>
      </section>

      {/* Full Bleed Photo 2 */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <Image src={photo2} alt="Couple photo" fill className="object-cover animate-gentle-zoom" unoptimized />
      </section>

      {/* Greeting */}
      <section className="py-16 px-8 text-center bg-white">
        <AnimatedSection>
          <div className="mb-6"><Heart className="h-5 w-5 text-[#D4AF37] mx-auto" /></div>
          <p className="text-lg font-serif italic text-zinc-800 leading-relaxed max-w-sm mx-auto">&ldquo;{invitation.greeting}&rdquo;</p>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <GoldDivider />
          <p className="text-sm text-zinc-600 leading-relaxed max-w-sm mx-auto mt-6 font-light">{invitation.mainBody}</p>
        </AnimatedSection>
      </section>

      {/* Ceremony */}
      <section className="py-16 px-8 bg-zinc-50 text-center border-y border-[#D4AF37]/10">
        <AnimatedSection>
          <h2 className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] mb-8">The Ceremony</h2>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <div className="max-w-sm mx-auto bg-white p-8 border border-[#D4AF37]/20 shadow-sm">
            <p className="text-xl font-light text-zinc-800 mb-2">{invitation.eventTime}</p>
            <p className="text-sm text-zinc-800 font-medium uppercase tracking-wider">{invitation.venueName}</p>
            <p className="text-xs text-zinc-500 mt-2 font-light">{invitation.venueAddress}</p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] text-xs font-medium uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-300">
              <MapPin className="h-3.5 w-3.5" />Location
            </a>
          </div>
        </AnimatedSection>
      </section>

      {/* Timeline */}
      <section className="py-16 px-8 bg-white">
        <AnimatedSection>
          <h2 className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] text-center mb-12">Itinerary</h2>
        </AnimatedSection>
        <div className="max-w-xs mx-auto relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#D4AF37]/30" />
          {invitation.schedule && invitation.schedule.length > 0 ? (
            invitation.schedule.map((item, idx) => (
              <AnimatedSection key={item.id || idx} animation="up" delay={`delay-${(idx + 1) * 100}`}>
                <div className="flex items-start gap-6 relative mb-8 last:mb-0">
                  <div className="w-10 h-10 rounded-none bg-white border border-[#D4AF37] flex items-center justify-center shrink-0 z-10 rotate-45 transform origin-center transition-all duration-300 hover:bg-[#D4AF37] group">
                    <IconMapper name={item.icon} className="h-4 w-4 text-[#D4AF37] -rotate-45 group-hover:text-white transition-colors" />
                  </div>
                  <div className="pt-2">
                    {item.time && <p className="text-xs font-medium text-zinc-800 uppercase tracking-widest">{item.time}</p>}
                    <p className="text-sm text-zinc-600 font-light mt-1">{item.label}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))
          ) : (
            <p className="text-sm text-zinc-500 text-center italic mt-6">No schedule available.</p>
          )}
        </div>
      </section>

      {/* Full Bleed Photo 3 */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <Image src={photo3} alt="Couple photo" fill className="object-cover animate-gentle-zoom" unoptimized />
      </section>

      {/* Map */}
      <section className="py-16 px-8 bg-zinc-50 text-center border-y border-[#D4AF37]/10">
        <AnimatedSection>
          <h2 className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] mb-8">Venue Map</h2>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <div className="overflow-hidden border border-[#D4AF37]/20 shadow-sm h-[300px] bg-white p-2">
            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://www.google.com/maps?q=${encodeURIComponent(invitation.venueName + ', ' + invitation.venueAddress)}&output=embed`} allowFullScreen title="Event Location" />
          </div>
        </AnimatedSection>
      </section>

      {/* Gallery */}
      {galleryPhotos.length > 0 && (
        <section className="py-16 px-8 bg-white text-center">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] mb-8">Captured Moments</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 gap-1">
            {galleryPhotos.map((src, idx) => (
              <AnimatedSection key={idx} animation="scale" delay={`delay-${(idx + 1) * 100}`} className={idx === 0 ? 'col-span-2' : ''}>
                <div className={`relative overflow-hidden group bg-zinc-100 ${idx === 0 ? 'h-[300px]' : 'h-[200px]'}`}>
                  <Image src={src} alt={`Gallery ${idx + 1}`} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out" unoptimized />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Closing */}
      <section className="py-16 px-8 bg-zinc-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-4 border border-[#D4AF37]/30 pointer-events-none" />
        <div className="absolute inset-5 border border-[#D4AF37]/10 pointer-events-none" />
        <AnimatedSection>
          <Heart className="h-6 w-6 text-[#D4AF37] mx-auto mb-8" fill="currentColor" />
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <p className="text-base font-serif italic text-zinc-300 leading-relaxed max-w-sm mx-auto">{invitation.closing}</p>
        </AnimatedSection>
        <AnimatedSection delay="delay-400">
          <div className="mt-12">
            <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-[#D4AF37] flex flex-col gap-2">
              <span>{invitation.groomName}</span>
              <span className="text-sm font-serif lowercase italic text-white/50">and</span>
              <span>{invitation.brideName}</span>
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mt-6">{formattedDate}</p>
          </div>
        </AnimatedSection>
      </section>

      {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} activeColor="bg-[#D4AF37] text-white hover:bg-[#B8860B]" inactiveColor="bg-white text-[#D4AF37] hover:bg-zinc-50 border border-[#D4AF37]/30" />}
    </div>
  );
}
