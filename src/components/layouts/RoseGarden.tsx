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

/* Arch-shaped photo frame */
function ArchPhoto({ src, className = '' }: { src: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ borderRadius: '50% 50% 4% 4% / 40% 40% 4% 4%' }}>
      <Image src={src} alt="Photo" fill className="object-cover animate-gentle-zoom" unoptimized />
    </div>
  );
}

/* Floral border decoration */
function FloralBorder() {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <svg viewBox="0 0 60 20" className="w-10 h-4 text-pink-300" fill="currentColor">
        <ellipse cx="10" cy="10" rx="5" ry="8" opacity="0.6" />
        <ellipse cx="22" cy="8" rx="4" ry="6" opacity="0.4" />
        <ellipse cx="15" cy="14" rx="3" ry="5" opacity="0.3" />
      </svg>
      <div className="h-px w-8 bg-pink-300/50" />
      <Heart className="h-3 w-3 text-pink-400" fill="currentColor" />
      <div className="h-px w-8 bg-pink-300/50" />
      <svg viewBox="0 0 60 20" className="w-10 h-4 text-pink-300 scale-x-[-1]" fill="currentColor">
        <ellipse cx="10" cy="10" rx="5" ry="8" opacity="0.6" />
        <ellipse cx="22" cy="8" rx="4" ry="6" opacity="0.4" />
        <ellipse cx="15" cy="14" rx="3" ry="5" opacity="0.3" />
      </svg>
    </div>
  );
}

export default function RoseGarden({ invitation }: LayoutProps) {
  const { formattedDate, dayNumber, monthName, dayName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, photo2, photo3, galleryPhotos } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  return (
    <div className="w-full max-w-lg mx-auto bg-[#fdf2f4] text-rose-950 font-sans overflow-hidden relative shadow-2xl">
      {/* Hero */}
      <section className="relative w-full h-[100vh] min-h-[600px] flex flex-col items-center justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-950/60 via-pink-900/20 to-transparent" />
        </div>

        {/* Decorative top corners */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-pink-200/30 rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-pink-200/30 rounded-tr-3xl" />

        <div className="relative z-10 text-center pb-16 px-6">
          <FloralBorder />
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-pink-200 mb-3 animate-fade-in-down mt-2">Together with their families</p>
          <h1 className="animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <span className="block text-4xl sm:text-5xl font-display font-bold text-white drop-shadow-lg">{invitation.groomName}</span>
            <span className="block text-2xl sm:text-3xl font-display italic font-normal text-pink-200 my-2">&</span>
            <span className="block text-4xl sm:text-5xl font-display font-bold text-white drop-shadow-lg">{invitation.brideName}</span>
          </h1>
          <p className="text-sm text-pink-200/70 mt-4 tracking-widest animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>{formattedDate}</p>
          <div className="mt-8 animate-bounce" style={{ animationDelay: '1.5s' }}>
            <ChevronDown className="h-6 w-6 text-pink-200/50 mx-auto" />
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-14 px-6 text-center bg-[#fdf2f4]">
        <AnimatedSection>
          <FloralBorder />
          <p className="text-xs uppercase tracking-[0.25em] text-pink-400 mb-8 mt-2">Counting the days</p>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <CountdownTimer targetDate={invitation.eventDate} textColor="text-rose-800" labelColor="text-pink-400" separatorColor="text-pink-300" />
        </AnimatedSection>
        <AnimatedSection animation="scale" delay="delay-300">
          <div className="mt-8 inline-flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-pink-200 rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-xs uppercase tracking-widest text-pink-500">{dayName}</span>
            <span className="text-3xl font-display font-bold text-rose-800">{dayNumber}</span>
            <span className="text-xs uppercase tracking-widest text-pink-500">{monthName}</span>
          </div>
        </AnimatedSection>
      </section>

      {/* Arch photo + Greeting */}
      <section className="py-12 px-8 bg-[#fdf2f4] text-center">
        <AnimatedSection animation="scale">
          <div className="mx-auto w-48 h-64 mb-8">
            <ArchPhoto src={photo2} className="w-full h-full shadow-lg border-4 border-white" />
          </div>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <div className="max-w-sm mx-auto">
            <p className="text-base sm:text-lg font-serif italic text-rose-800 leading-relaxed">&ldquo;{invitation.greeting}&rdquo;</p>
            <p className="text-sm text-rose-700/60 leading-relaxed mt-4">{invitation.mainBody}</p>
          </div>
        </AnimatedSection>
      </section>

      {/* Ceremony */}
      <section className="py-14 px-8 bg-[#fdf2f4] text-center">
        <AnimatedSection>
          <FloralBorder />
          <h2 className="text-2xl font-display font-bold text-rose-800 mt-2 mb-6">Ceremony</h2>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-pink-200 shadow-sm max-w-sm mx-auto">
            <p className="text-lg font-display font-bold text-rose-800">{invitation.eventTime}</p>
            <p className="text-sm text-rose-700 mt-2 font-medium">{invitation.venueName}</p>
            <p className="text-xs text-pink-500 mt-1">{invitation.venueAddress}</p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-rose-500 text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-rose-600 transition-all duration-300 shadow-md">
              <MapPin className="h-3.5 w-3.5" />View on Map
            </a>
          </div>
        </AnimatedSection>
      </section>

      {/* Timeline */}
      <section className="py-14 px-8 bg-[#fdf2f4]">
        <AnimatedSection>
          <FloralBorder />
          <h2 className="text-2xl font-display font-bold text-rose-800 text-center mt-2 mb-10">Itinerary</h2>
        </AnimatedSection>
        <div className="max-w-xs mx-auto relative">
          <div className="absolute left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-pink-300 via-pink-200 to-transparent" />
          {invitation.schedule && invitation.schedule.length > 0 ? (
            invitation.schedule.map((item, idx) => (
              <AnimatedSection key={item.id || idx} animation={idx % 2 === 0 ? 'left' : 'right'} delay={`delay-${(idx + 1) * 100}`}>
                <div className="flex items-start gap-4 relative">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-pink-300 flex items-center justify-center shrink-0 z-10 hover:border-rose-500 hover:scale-110 transition-all duration-300 shadow-sm">
                    <IconMapper name={item.icon} className="h-4 w-4 text-rose-500" />
                  </div>
                  <div className="pt-2 pb-6">
                    {item.time && <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">{item.time}</p>}
                    <p className="text-sm text-rose-700">{item.label}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))
          ) : (
            <p className="text-sm text-rose-700/70 text-center italic mt-6">No schedule available.</p>
          )}
        </div>
      </section>

      {/* Full-width photo */}
      <section className="relative w-full h-[350px] sm:h-[450px] overflow-hidden">
        <Image src={photo3} alt="Couple photo" fill className="object-cover animate-gentle-zoom" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-pink-950/30 to-transparent" />
      </section>

      {/* Map */}
      <section className="py-14 px-8 bg-[#fdf2f4] text-center">
        <AnimatedSection animation="scale">
          <div className="inline-flex p-3 rounded-full bg-pink-100 border border-pink-200 mb-4"><MapPin className="h-5 w-5 text-rose-500" /></div>
          <h2 className="text-2xl font-display font-bold text-rose-800 mb-6">Location</h2>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <div className="rounded-2xl overflow-hidden border border-pink-200 shadow-sm h-[280px]">
            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://www.google.com/maps?q=${encodeURIComponent(invitation.venueName + ', ' + invitation.venueAddress)}&output=embed`} allowFullScreen title="Event Location" />
          </div>
        </AnimatedSection>
      </section>

      {/* Gallery */}
      {galleryPhotos.length > 0 && (
        <section className="py-14 px-8 bg-[#fdf2f4] text-center">
          <AnimatedSection animation="scale">
            <div className="inline-flex p-3 rounded-full bg-pink-100 border border-pink-200 mb-4"><Camera className="h-5 w-5 text-rose-500" /></div>
            <h2 className="text-2xl font-display font-bold text-rose-800 mb-8">Our Moments</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 gap-3">
            {galleryPhotos.map((src, idx) => (
              <AnimatedSection key={idx} animation="scale" delay={`delay-${(idx + 1) * 100}`} className={idx === 0 ? 'col-span-2' : ''}>
                <div className={`relative overflow-hidden shadow-md group border-2 border-white ${idx === 0 ? 'h-[250px] rounded-3xl' : 'h-[180px] rounded-2xl'}`}>
                  <Image src={src} alt={`Gallery ${idx + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" unoptimized />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Closing */}
      <section className="py-14 px-8 bg-[#fdf2f4] text-center">
        <AnimatedSection><FloralBorder /></AnimatedSection>
        <AnimatedSection delay="delay-200"><p className="text-base font-serif italic text-rose-800 leading-relaxed max-w-sm mx-auto mt-4">{invitation.closing}</p></AnimatedSection>
        <AnimatedSection delay="delay-400">
          <div className="mt-10">
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-rose-800">{invitation.groomName} & {invitation.brideName}</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-pink-400 mt-3">{formattedDate}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay="delay-500"><FloralBorder /></AnimatedSection>
      </section>

      <div className="h-4 bg-[#fdf2f4]" />
      {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} activeColor="bg-rose-500 text-white hover:bg-rose-600" inactiveColor="bg-white/80 text-rose-500 hover:bg-white" />}
    </div>
  );
}
