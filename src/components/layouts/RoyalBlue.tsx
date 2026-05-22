import { getCoupleSlug } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, Calendar, Music, Camera, ChevronDown, Glasses } from 'lucide-react';
import SafeQRCodeSVG from '@/components/SafeQRCodeSVG';
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
  CurvedDivider,
  DigitalGiftSection,
  LoveStorySection,
  GuestWelcome,
  QuotesSection,
  TierGate,
  useTier,
} from './shared';

interface LayoutProps {
  invitation: Invitation;
  isPreview?: boolean;
}


/* Floral accent SVG */
function FloralAccent({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`w-16 h-16 ${className}`} fill="none" stroke="#4a7cc9" strokeWidth="1.5" opacity="0.3">
      <circle cx="50" cy="50" r="8" />
      <path d="M50 30 Q55 40 50 42 Q45 40 50 30" />
      <path d="M50 58 Q55 60 50 70 Q45 60 50 58" />
      <path d="M30 50 Q40 45 42 50 Q40 55 30 50" />
      <path d="M58 50 Q60 45 70 50 Q60 55 58 50" />
      <path d="M36 36 Q44 40 42 42 Q40 44 36 36" />
      <path d="M64 64 Q56 60 58 58 Q60 56 64 64" />
      <path d="M64 36 Q56 40 58 42 Q60 44 64 36" />
      <path d="M36 64 Q44 60 42 58 Q40 56 36 64" />
    </svg>
  );
}

export default function RoyalBlue({ invitation, isPreview = false }: LayoutProps) {
  const { tier } = useTier();
  const [matchedGuest, setMatchedGuest] = useState<Guest | null>(null);
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
        setMatchedGuest(guest);
      }
    }
  }, [invitation.guests]);

  return (
    <div className="w-full max-w-lg mx-auto bg-[#e8f0fe] text-slate-800 font-sans overflow-hidden relative shadow-2xl">
      {/* Hero */}
      <section className="relative w-full h-[100vh] min-h-[600px] flex flex-col items-center justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/30 to-blue-900/10" />
        </div>
        <div className="absolute top-16 left-4 opacity-20 animate-float"><FloralAccent /></div>
        <div className="absolute top-32 right-4 opacity-20 animate-float-delayed"><FloralAccent /></div>

        <div className="relative z-10 text-center pb-16 px-6">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-blue-200/80 mb-2 animate-fade-in-down">The Wedding of</p>
          <h1 className="animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.groomName}</span>
            <span className="block text-2xl sm:text-3xl font-display italic font-normal text-blue-200 my-2">&</span>
            <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.brideName}</span>
          </h1>
          <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
            <span className="text-xs uppercase tracking-widest text-blue-100">{monthName}</span>
            <span className="text-2xl font-display font-bold text-white">{dayNumber}</span>
            <span className="text-xs uppercase tracking-widest text-blue-100">{new Date(invitation.eventDate).getFullYear()}</span>
          </div>

          <GuestWelcome />

          <div className="mt-8 animate-bounce" style={{ animationDelay: '1.5s' }}>
            <ChevronDown className="h-6 w-6 text-blue-200/50 mx-auto" />
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* Monogram & Countdown */}
      <section className="py-14 px-4 sm:px-6 text-center bg-[#e8f0fe]">
        <AnimatedSection animation="scale">
          <div className="w-24 h-24 mx-auto rounded-full border-2 border-blue-400/40 flex items-center justify-center mb-6">
            <span className="text-2xl font-display font-bold text-blue-600">
              {invitation.groomName[0]}&{invitation.brideName[0]}
            </span>
          </div>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <CountdownTimer targetDate={invitation.eventDate} textColor="text-blue-800" labelColor="text-blue-400" separatorColor="text-blue-300" />
        </AnimatedSection>
        <AnimatedSection delay="delay-300">
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-blue-300" />
            <Heart className="h-4 w-4 text-blue-400 animate-heartbeat" />
            <div className="h-px w-12 bg-blue-300" />
          </div>
        </AnimatedSection>
      </section>

      {/* The Couple Profile */}
      <section className="py-14 px-8 bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-12 text-center">
          {/* Groom */}
          <AnimatedSection animation="left">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg mb-4 relative">
                <Image src={groomPhoto} alt="Groom" fill className="object-cover" unoptimized />
              </div>
              <h3 className="text-2xl font-display font-bold text-blue-800">{invitation.groomName}</h3>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest mt-2">Putra dari</p>
              <p className="text-sm text-slate-600 font-medium">{invitation.groomParents || 'Bapak & Ibu'}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="scale"><FloralAccent className="opacity-40" /></AnimatedSection>

          {/* Bride */}
          <AnimatedSection animation="right">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg mb-4 relative">
                <Image src={bridePhoto} alt="Bride" fill className="object-cover" unoptimized />
              </div>
              <h3 className="text-2xl font-display font-bold text-blue-800">{invitation.brideName}</h3>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest mt-2">Putri dari</p>
              <p className="text-sm text-slate-600 font-medium">{invitation.brideParents || 'Bapak & Ibu'}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Greeting */}
      <section className="py-12 px-8 bg-[#e8f0fe] text-center">
        <AnimatedSection>
          <div className="max-w-sm mx-auto bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/40 shadow-sm">
            <p className="text-base sm:text-lg font-serif italic text-blue-900 leading-relaxed">&ldquo;{invitation.greeting}&rdquo;</p>
            <p className="text-sm text-blue-700/60 leading-relaxed mt-4">{invitation.mainBody}</p>
          </div>
        </AnimatedSection>
      </section>

      {/* Photo divider */}
      <section className="relative w-full h-[350px] sm:h-[450px] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-8 z-10">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-full rotate-180">
            <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill="#e8f0fe" />
          </svg>
        </div>
        <Image src={photo2} alt="Couple photo" fill className="object-cover animate-gentle-zoom" unoptimized />
        <WaveDivider />
        <div className="absolute bottom-0 left-0 right-0 h-8 z-10">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill="#e8f0fe" />
          </svg>
        </div>
      </section>

      {/* Ceremony */}
      <section className="py-14 px-8 bg-[#e8f0fe] text-center">
        <AnimatedSection animation="scale">
          <div className="inline-flex p-3 rounded-full bg-blue-100 border border-blue-200 mb-4"><Heart className="h-5 w-5 text-blue-500" /></div>
        </AnimatedSection>
        <AnimatedSection delay="delay-100"><h2 className="text-2xl font-display font-bold text-blue-800 mb-4">Ceremony</h2></AnimatedSection>
        <AnimatedSection delay="delay-200">
          <p className="text-sm text-blue-700 leading-relaxed">{invitation.eventTime}</p>
          <p className="text-sm text-blue-700 mt-1 font-medium">{invitation.venueName}</p>
          <p className="text-xs text-blue-500/70 mt-1">{invitation.venueAddress}</p>
        </AnimatedSection>
        <AnimatedSection delay="delay-300">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-blue-600 text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md">
            <MapPin className="h-3.5 w-3.5" />View Location
          </a>
        </AnimatedSection>
      </section>

      {/* Timeline */}
      <section className="py-14 px-8 bg-[#e8f0fe]">
        <AnimatedSection><h2 className="text-2xl font-display font-bold text-blue-800 text-center mb-10">The Wedding Program</h2></AnimatedSection>
        <div className="max-w-xs mx-auto space-y-0">
          {invitation.schedule && invitation.schedule.length > 0 ? (
            invitation.schedule.map((item, idx) => (
              <AnimatedSection key={item.id || idx} animation={idx % 2 === 0 ? 'left' : 'right'} delay={`delay-${(idx + 1) * 100}`}>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-blue-300 bg-blue-50 flex items-center justify-center shrink-0 hover:border-blue-500 hover:scale-110 transition-all duration-300">
                      <IconMapper name={item.icon} className="h-4 w-4 text-blue-500" />
                    </div>
                    {idx < invitation.schedule.length - 1 && <div className="w-px h-10 bg-blue-200" />}
                  </div>
                  <div className="pt-2 pb-6">
                    {item.time && <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">{item.time}</p>}
                    <p className="text-sm text-blue-700">{item.label}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))
          ) : (
            <p className="text-sm text-blue-600/70 text-center italic">No schedule available.</p>
          )}
        </div>
      </section>

      {/* Photo divider */}
      <section className="relative w-full h-[350px] sm:h-[450px] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-8 z-10 rotate-180">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill="#e8f0fe" />
          </svg>
        </div>
        <Image src={photo3} alt="Couple photo" fill className="object-cover animate-gentle-zoom" unoptimized />
        <div className="absolute bottom-0 left-0 right-0 h-8 z-10">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill="#e8f0fe" />
          </svg>
        </div>
      </section>

      {/* Map */}
      <section className="py-14 px-8 bg-[#e8f0fe] text-center">
        <AnimatedSection animation="scale">
          <div className="inline-flex p-3 rounded-full bg-blue-100 border border-blue-200 mb-4"><MapPin className="h-5 w-5 text-blue-500" /></div>
          <h2 className="text-2xl font-display font-bold text-blue-800 mb-6">The Venues</h2>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <div className="rounded-2xl overflow-hidden border border-blue-200 shadow-sm h-[280px]">
            <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://www.google.com/maps?q=${encodeURIComponent(invitation.venueName + ', ' + invitation.venueAddress)}&output=embed`} allowFullScreen title="Event Location" />
          </div>
        </AnimatedSection>
      </section>

      {/* Love Story */}
      <LoveStorySection 
        story={invitation.loveStory || []} 
        bgColor="bg-[#e8f0fe]" 
        accentColor="text-blue-600" 
        textColor="text-slate-800"
      />

      {/* Digital Gift */}
      <DigitalGiftSection gifts={(invitation as any).digitalGifts || []} bgColor="bg-white" textColor="text-blue-900" />

      {/* Gallery */}
      {galleryPhotos.length > 0 && (
        <section className="py-14 px-8 bg-[#e8f0fe] text-center">
          <AnimatedSection animation="scale">
            <div className="inline-flex p-3 rounded-full bg-blue-100 border border-blue-200 mb-4"><Camera className="h-5 w-5 text-blue-500" /></div>
            <h2 className="text-2xl font-display font-bold text-blue-800 mb-8">Gallery</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 gap-3">
            {galleryPhotos.map((src: string, idx: number) => (
              <AnimatedSection key={idx} animation="scale" delay={`delay-${(idx + 1) * 100}`} className={idx === 0 ? 'col-span-2' : ''}>
                <div className={`relative rounded-2xl overflow-hidden shadow-md border-2 border-blue-200/50 group ${idx === 0 ? 'h-[250px]' : 'h-[180px]'}`}>
                  <Image src={src} alt={`Gallery ${idx + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" unoptimized />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Quotes */}
      <QuotesSection text={invitation.quotes || ''} bgColor="bg-slate-50" textColor="text-blue-900" />

      {/* Closing */}
      <section className="py-14 px-8 bg-[#e8f0fe] text-center">
        <AnimatedSection>
          <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-10 bg-blue-300" /><Heart className="h-4 w-4 text-blue-400 animate-heartbeat" fill="currentColor" /><div className="h-px w-10 bg-blue-300" /></div>
        </AnimatedSection>
        <AnimatedSection delay="delay-200"><p className="text-base font-serif italic text-blue-800 leading-relaxed max-w-sm mx-auto">{invitation.closing}</p></AnimatedSection>
        <AnimatedSection delay="delay-400">
          <div className="mt-10">
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-blue-800">{invitation.groomName} & {invitation.brideName}</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-400 mt-3">{formattedDate}</p>
          </div>
        </AnimatedSection>

        {invitation.tier === 'ULTIMATE' && invitation.qrEnabled !== false && (
          <AnimatedSection delay="delay-500">
            <div className="mt-12 flex flex-col items-center justify-center gap-3 px-6 max-w-sm mx-auto">
              <div className="bg-white p-3.5 rounded-2xl inline-block shadow-lg border border-blue-200">
                <SafeQRCodeSVG
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${getCoupleSlug(invitation.groomName, invitation.brideName)}/${invitation.slug}/attendance`}
                  size={130}
                  level="H"
                />
              </div>
              <p className="text-xs text-blue-800 font-semibold mt-1">
                QR Code Buku Tamu (Attendance)
              </p>
              <p className="text-[9px] text-slate-500 leading-relaxed font-sans max-w-[240px] text-center">
                Pindai QR Code ini untuk melakukan pengisian Buku Tamu secara digital saat menghadiri acara.
              </p>
            </div>
          </AnimatedSection>
        )}
      </section>

      <div className="h-4 bg-[#e8f0fe]" />
      {invitation.musicUrl && <AudioPlayer src={invitation.musicUrl} isPreview={isPreview} activeColor="bg-blue-600 text-white hover:bg-blue-700" inactiveColor="bg-white/80 text-blue-600 hover:bg-white" />}
    </div>
  );
}
