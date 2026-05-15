'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin, Camera, ChevronDown, MessageCircle, Send } from 'lucide-react';
import type { Invitation } from '@/types';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedSection, CountdownTimer, resolvePhotos, formatEventDate, getMapsUrl, IconMapper, WaveDivider, ParallaxImage, ParallaxSection, PhotoCarousel, LoveStorySection, DigitalGiftSection, QuotesSection } from '../shared';
import {
  GoldParticles,
  CoverPage,
  BottomNav,
  EmeraldAudio,
  IslamicDivider,
  FlyingBirds,
  FloatingFlowers,
} from './parts';

interface LayoutProps { invitation: Invitation; }

export default function LuxuryEmerald({ invitation }: LayoutProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const { formattedDate, dayNumber, monthName, dayName } = formatEventDate(invitation.eventDate);
  const { heroPhoto, photo2, photo3, galleryPhotos, groomPhoto, bridePhoto } = resolvePhotos(invitation);
  const mapsUrl = getMapsUrl(invitation.venueName, invitation.venueAddress);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const to = p.get('to');
    if (to) setGuestName(decodeURIComponent(to));
  }, []);

  const handleOpen = () => {
    setIsOpened(true);
    setTimeout(() => {
      const btn = document.querySelector('[data-emerald-audio]') as HTMLButtonElement;
      if (btn) btn.click();
    }, 800);
  };

  return (
    <div className={`w-full max-w-lg mx-auto bg-[#faf7f0] text-[#1a1a2e] font-sans relative shadow-2xl ${!isOpened ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <AnimatePresence>{!isOpened && <CoverPage groomName={invitation.groomName} brideName={invitation.brideName} guestName={guestName} onOpen={handleOpen} />}</AnimatePresence>

      {isOpened && (
        <>
          <GoldParticles />
          <FlyingBirds />
          <ParallaxSection speed={-0.2}>
            <FloatingFlowers />
          </ParallaxSection>
        </>
      )}

      <section id="home" className="relative w-full h-[100vh] min-h-[600px] flex flex-col items-center justify-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroPhoto} alt="Couple" fill className="object-cover animate-gentle-zoom" priority unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-[#042f2e]/80 via-[#042f2e]/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center pb-16 px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37]/70 mb-3 animate-fade-in-down">The Wedding of</p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={isOpened ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.8 }}>
            <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.groomName}</span>
            <span className="block text-2xl font-display italic text-[#d4af37] my-2">&amp;</span>
            <span className="block text-4xl sm:text-6xl font-display font-bold text-white drop-shadow-lg">{invitation.brideName}</span>
          </motion.h1>
          <p className="text-sm text-white/50 mt-6 tracking-widest animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>{formattedDate}</p>
          <div className="mt-10 animate-bounce"><ChevronDown className="h-6 w-6 text-[#d4af37]/50 mx-auto" /></div>
        </div>
      </section>

      <section className="py-14 px-8 bg-[#042f2e] text-center">
        <AnimatedSection>
          <p className="text-2xl font-display text-[#d4af37] mb-4" style={{ fontFamily: 'serif' }}>﷽</p>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm mx-auto">Assalamualaikum Warahmatullahi Wabarakatuh</p>
          <p className="text-xs text-white/40 mt-4 leading-relaxed max-w-sm mx-auto">Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan kami:</p>
        </AnimatedSection>
        <IslamicDivider />
      </section>

      <section id="couple" className="py-14 px-8 bg-[#faf7f0] text-center">
        <AnimatedSection><p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-8">The Groom & Bride</p></AnimatedSection>
        <div className="grid grid-cols-1 gap-10">
          <AnimatedSection animation="left">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#d4af37]/30 shadow-lg mb-4 relative">
                <Image src={groomPhoto} alt="Groom" fill className="object-cover" unoptimized />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#042f2e]">{invitation.groomName}</h3>
              <p className="text-xs text-[#042f2e]/50 mt-1">Putra dari</p>
              <p className="text-sm text-[#042f2e]/70">{invitation.groomParents || 'Bapak & Ibu'}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="scale"><Heart className="h-6 w-6 text-[#d4af37] mx-auto" fill="currentColor" /></AnimatedSection>
          <AnimatedSection animation="right">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#d4af37]/30 shadow-lg mb-4 relative">
                <Image src={bridePhoto} alt="Bride" fill className="object-cover" unoptimized />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#042f2e]">{invitation.brideName}</h3>
              <p className="text-xs text-[#042f2e]/50 mt-1">Putri dari</p>
              <p className="text-sm text-[#042f2e]/70">{invitation.brideParents || 'Bapak & Ibu'}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 px-8 bg-[#042f2e] text-center relative overflow-hidden">
        <WaveDivider fill="#faf7f0" position="top" />
        <div className="absolute inset-6 border border-[#d4af37]/10 pointer-events-none" />
        <AnimatedSection>
          <p className="text-base font-serif italic text-white/70 leading-relaxed max-w-sm mx-auto">&ldquo;Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).&rdquo;</p>
          <p className="text-xs text-[#d4af37]/60 mt-4 tracking-wider">— QS. Adh-Dhariyat: 49</p>
        </AnimatedSection>
        <IslamicDivider />
        <AnimatedSection delay="delay-200">
          <p className="text-base font-serif italic text-white/70 leading-relaxed max-w-sm mx-auto">&ldquo;{invitation.greeting}&rdquo;</p>
        </AnimatedSection>
      </section>

      <section id="date" className="py-20 px-6 text-center bg-[#faf7f0] relative">
        <WaveDivider fill="#042f2e" position="top" />
        <div className="mt-12">
          <AnimatedSection><p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-8">Counting Down</p></AnimatedSection>
          <AnimatedSection delay="delay-200">
            <CountdownTimer targetDate={invitation.eventDate} textColor="text-[#042f2e]" labelColor="text-[#042f2e]/40" separatorColor="text-[#d4af37]" />
          </AnimatedSection>
          <AnimatedSection animation="scale" delay="delay-300">
            <div className="mt-8 inline-flex items-center gap-6 border border-[#042f2e]/30 rounded-[0.5rem] px-8 py-4 shadow-sm bg-white/40 backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#042f2e]/60 font-semibold">{dayName}</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-display font-bold text-[#042f2e]">{dayNumber}</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#042f2e]/60 font-semibold">{monthName}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 bg-[#faf7f0]">
        <PhotoCarousel 
          photos={[photo2, photo3, galleryPhotos[0] || heroPhoto]} 
          className="h-[400px] sm:h-[500px]" 
        />
      </section>

      <section className="py-20 px-8 bg-[#042f2e] text-center relative">
        <WaveDivider fill="#faf7f0" position="top" />
        <div className="mt-12">
          <AnimatedSection>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2">The Ceremony</p>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Akad & Resepsi</h2>
          </AnimatedSection>
          <AnimatedSection delay="delay-200">
            <div className="bg-white/5 backdrop-blur-sm border border-[#d4af37]/20 p-6 max-w-sm mx-auto">
              <p className="text-lg text-white font-display font-bold">{invitation.eventTime}</p>
              <p className="text-sm text-white/80 mt-2 font-medium">{invitation.venueName}</p>
              <p className="text-xs text-white/50 mt-1">{invitation.venueAddress}</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 border border-[#d4af37] text-[#d4af37] text-xs font-semibold uppercase tracking-widest hover:bg-[#d4af37] hover:text-[#042f2e] transition-all duration-300">
                <MapPin className="h-3.5 w-3.5" />Lihat Lokasi
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {invitation.schedule && invitation.schedule.length > 0 && (
        <section className="py-20 px-8 bg-[#faf7f0] relative">
          <WaveDivider fill="#042f2e" position="top" />
          <AnimatedSection><h2 className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] text-center mb-10">Rundown Acara</h2></AnimatedSection>
          <div className="max-w-xs mx-auto relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[#d4af37]/40 via-[#d4af37]/20 to-transparent" />
            {invitation.schedule.map((item, idx) => (
              <AnimatedSection key={item.id || idx} animation={idx % 2 === 0 ? 'left' : 'right'} delay={`delay-${(idx + 1) * 100}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#042f2e] border-2 border-[#d4af37]/40 flex items-center justify-center shrink-0 z-10">
                    <IconMapper name={item.icon} className="h-4 w-4 text-[#d4af37]" />
                  </div>
                  <div className="pt-2">
                    {item.time && <p className="text-xs font-bold text-[#042f2e] uppercase tracking-wider">{item.time}</p>}
                    <p className="text-sm text-[#042f2e]/70">{item.label}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      <section className="py-12 bg-[#faf7f0]">
        <ParallaxImage src={photo3} alt="Photo" className="h-[350px] sm:h-[450px]" />
      </section>

      <section className="py-20 px-8 bg-[#faf7f0] text-center relative">
        <div className="mt-12">
          <AnimatedSection><p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-6">Lokasi Acara</p></AnimatedSection>
          <AnimatedSection delay="delay-200">
            <div className="overflow-hidden border border-[#d4af37]/20 shadow-sm h-[280px]">
              <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={`https://www.google.com/maps?q=${encodeURIComponent(invitation.venueName + ', ' + invitation.venueAddress)}&output=embed`} allowFullScreen title="Location" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <DigitalGiftSection gifts={(invitation as any).digitalGifts || []} bgColor="bg-[#faf7f0]" textColor="text-[#042f2e]" />
      <LoveStorySection story={invitation.loveStory || []} />

      {galleryPhotos.length > 0 && (
        <section id="gallery" className="pb-24 pt-12 px-8 bg-[#042f2e] text-center relative">
          <div className="relative z-10">
            <AnimatedSection>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-8 bg-[#d4af37]/30" />
                <Heart className="h-4 w-4 text-[#d4af37]" fill="currentColor" />
                <div className="h-px w-8 bg-[#d4af37]/30" />
              </div>
              <Camera className="h-5 w-5 text-[#d4af37] mx-auto mb-3" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-8">Our Moments</p>
            </AnimatedSection>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {galleryPhotos.map((src, idx) => (
              <AnimatedSection key={idx} animation="scale" delay={`delay-${(idx + 1) * 100}`} className={idx === 0 ? 'col-span-2' : ''}>
                <div className={`relative overflow-hidden group border border-[#d4af37]/20 ${idx === 0 ? 'h-[250px]' : 'h-[180px]'}`}>
                  <Image src={src} alt={`Gallery ${idx + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      <section id="wishes" className="py-20 px-8 bg-[#faf7f0] text-center relative">
        <WaveDivider fill="#042f2e" position="top" />
        <AnimatedSection>
          <MessageCircle className="h-5 w-5 text-[#d4af37] mx-auto mb-3" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-2">Ucapan & Doa</p>
          <p className="text-sm text-[#042f2e]/50 mb-6">Sampaikan ucapan dan doa untuk kedua mempelai</p>
        </AnimatedSection>
        <AnimatedSection delay="delay-200">
          <WishesSection slug={invitation.slug} guests={invitation.guests || []} />
        </AnimatedSection>
      </section>

      <QuotesSection text={invitation.quotes || ''} bgColor="bg-[#faf7f0]" textColor="text-[#042f2e]" />

      <section className="py-24 px-8 bg-[#042f2e] text-center relative overflow-hidden">
        <WaveDivider fill="#faf7f0" position="top" />
        <div className="absolute inset-6 border border-[#d4af37]/15 pointer-events-none" />
        <AnimatedSection><Heart className="h-6 w-6 text-[#d4af37] mx-auto mb-6" fill="currentColor" /></AnimatedSection>
        <AnimatedSection delay="delay-200"><p className="text-base font-serif italic text-white/70 leading-relaxed max-w-sm mx-auto">{invitation.closing}</p></AnimatedSection>
        <AnimatedSection delay="delay-400">
          <div className="mt-10">
            <h3 className="text-3xl font-display font-bold animate-text-shimmer">{invitation.groomName} & {invitation.brideName}</h3>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mt-4">{formattedDate}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay="delay-500"><p className="text-xs text-white/30">Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir</p></AnimatedSection>
      </section>

      <div className="h-20 bg-[#042f2e]" />
      {isOpened && invitation.musicUrl && <EmeraldAudioAutoPlay src={invitation.musicUrl} isPreview={invitation.id === 'preview'} />}
      <BottomNav visible={isOpened} isPreview={invitation.id === 'preview'} />
    </div>
  );
}

function EmeraldAudioAutoPlay({ src, isPreview }: { src: string; isPreview?: boolean }) {
  return <EmeraldAudio src={src} isPreview={isPreview} />;
}

import type { Guest } from '@/types';

function WishesSection({ slug, guests: initialGuests }: { slug: string; guests: Guest[] }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [wishes, setWishes] = useState(initialGuests.filter(g => g.message));

  const submit = async () => {
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/invitations/${slug}/rsvp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, rsvpStatus: 'ATTENDING', attendees: 1 }),
      });
      if (res.ok) {
        const data = await res.json();
        setWishes(prev => [data.data, ...prev]);
        setName(''); setMessage('');
      }
    } catch { /* silent */ } finally { setSending(false); }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="space-y-3 mb-6 text-left">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama Anda" className="w-full px-4 py-3 bg-white border border-[#d4af37]/20 text-sm text-[#042f2e] placeholder:text-[#042f2e]/30 focus:border-[#d4af37] focus:outline-none transition-colors" />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tulis ucapan & doa..." rows={3} className="w-full px-4 py-3 bg-white border border-[#d4af37]/20 text-sm text-[#042f2e] placeholder:text-[#042f2e]/30 focus:border-[#d4af37] focus:outline-none transition-colors resize-none" />
        <button onClick={submit} disabled={sending || !name.trim() || !message.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#042f2e] text-[#d4af37] text-xs font-semibold uppercase tracking-widest hover:bg-[#064e3b] transition-all disabled:opacity-50">
          <Send className="h-3.5 w-3.5" />{sending ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </div>
      {wishes.length > 0 && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
          {wishes.map((w, i) => (
            <div key={w.id || i} className="bg-white border border-[#d4af37]/10 p-4 text-left">
              <p className="text-xs font-semibold text-[#042f2e]">{w.name}</p>
              <p className="text-sm text-[#042f2e]/70 mt-1">{w.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
