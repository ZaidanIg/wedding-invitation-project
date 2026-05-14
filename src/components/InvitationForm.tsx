'use client';

import React from 'react';
import { useInvitationStore } from '@/store/invitation-store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { showToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Calendar,
  MapPin,
  Palette,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  X,
  Upload,
  Music,
  Plus,
  Trash2,
  ListChecks,
} from 'lucide-react';
import type { Tone, Language, Layout } from '@/types';
import Image from 'next/image';
import { UploadDropzone } from '@/lib/uploadthing';
import InvitationPreview from '@/components/InvitationPreview';

const toneOptions = [
  { value: 'formal', label: '🎩 Formal — Elegan & Berwibawa' },
  { value: 'romantic', label: '💕 Romantis — Penuh Perasaan' },
  { value: 'modern', label: '✨ Modern — Bersih & Kontemporer' },
  { value: 'playful', label: '🎉 Ceria — Menyenangkan' },
];

const languageOptions = [
  { value: 'id', label: '🇮🇩 Bahasa Indonesia' },
  { value: 'en', label: '🇬🇧 English' },
];

const iconOptions = [
  { value: 'clock', label: 'Jam' },
  { value: 'heart', label: 'Hati' },
  { value: 'glasses', label: 'Toast' },
  { value: 'calendar', label: 'Kalender' },
  { value: 'music', label: 'Musik' },
  { value: 'camera', label: 'Kamera' },
];

const musicOptions = [
  { value: '', label: '🔇 Tanpa Musik' },
  { value: 'https://docs.google.com/uc?export=download&id=1GCYf7Ch3JLvd3RyzelpQte1FYZyWnngV', label: '🎼 Perfect Symphony (Premium)' },
  { value: 'https://cdn.pixabay.com/audio/2022/10/25/audio_22dbdcdcc8.mp3', label: '🎹 Romantic Piano (Default)' },
  { value: 'https://cdn.pixabay.com/audio/2024/09/10/audio_517e4f937e.mp3', label: '🕯️ Cinematic Wedding' },
  { value: 'https://cdn.pixabay.com/audio/2022/11/08/audio_82c2a3e0f9.mp3', label: '🎸 Acoustic Serenade' },
  { value: 'https://cdn.pixabay.com/audio/2022/01/26/audio_d0c6ff1cbd.mp3', label: '🎻 Classical Wedding' },
  { value: 'custom', label: '🔗 URL Kustom...' },
];

const layoutOptions: { value: Layout; label: string; bg: string; border: string; preview: string; category: 'basic' | 'advance' }[] = [
  { value: 'elegant-cream', label: 'Cream', bg: 'bg-[#f7f4ed]', border: 'border-[#eceae4]', preview: 'bg-[#1c1c1c]/10', category: 'basic' },
  { value: 'royal-blue', label: 'Royal Blue', bg: 'bg-[#e8f0fe]', border: 'border-blue-300', preview: 'bg-blue-200', category: 'basic' },
  { value: 'rose-garden', label: 'Rose Garden', bg: 'bg-[#fdf2f4]', border: 'border-pink-300', preview: 'bg-pink-200', category: 'basic' },
  { value: 'golden-classic', label: 'Golden Classic', bg: 'bg-white', border: 'border-[#D4AF37]', preview: 'bg-[#D4AF37]/20', category: 'advance' },
  { value: 'luxury-emerald', label: '✨ Emerald', bg: 'bg-[#042f2e]', border: 'border-[#d4af37]', preview: 'bg-[#d4af37]/30', category: 'advance' },
];

const steps = [
  { number: 1, title: 'Pasangan', icon: Heart },
  { number: 2, title: 'Acara', icon: Calendar },
  { number: 3, title: 'Foto', icon: Camera },
  { number: 4, title: 'Gaya', icon: Palette },
  { number: 5, title: 'Selesai', icon: Sparkles },
];

export default function InvitationForm() {
  const store = useInvitationStore();
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (session === null) {
      router.push('/auth/signin');
    }
  }, [session, router]);

  const handleGenerate = async () => {
    store.setIsGenerating(true);

    try {
      const response = await fetch('/api/invitations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...store.coupleDetails,
          ...store.eventDetails,
          ...store.stylePreferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses data');
      }

      store.setGeneratedInvitation(data.data);
      store.nextStep();
      showToast('success', 'Undangan berhasil diproses!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      showToast('error', message);
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!store.generatedInvitation) return;

    store.setIsSaving(true);

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...store.coupleDetails,
          ...store.eventDetails,
          ...store.generatedInvitation,
          photoUrls: store.photoUrls,
          tone: store.stylePreferences.tone,
          language: store.stylePreferences.language,
          layout: store.stylePreferences.layout,
          musicUrl: store.stylePreferences.musicUrl === 'custom' ? '' : store.stylePreferences.musicUrl,
          schedule: store.eventDetails.schedule,
          loveStory: store.eventDetails.loveStory,
          digitalGifts: store.eventDetails.digitalGifts,
          quotes: store.eventDetails.quotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan');
      }

      showToast('success', 'Undangan disimpan! Mengalihkan...');

      // Redirect to the invitation page
      setTimeout(() => {
        window.location.href = `/invitation/${data.data.slug}`;
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      showToast('error', message);
    } finally {
      store.setIsSaving(false);
    }
  };

  const canProceedStep1 =
    store.coupleDetails.groomName.trim().length >= 2 && store.coupleDetails.brideName.trim().length >= 2;
  const canProceedStep2 =
    store.eventDetails.eventDate &&
    store.eventDetails.eventTime &&
    store.eventDetails.venueName.trim().length >= 2 &&
    store.eventDetails.venueAddress.trim().length >= 5;

  const [subStep, setSubStep] = React.useState(1);

  if (!session) return null;

  // Build a mock invitation for the live preview in Step 5
  const mockInvitation = {
    ...store.coupleDetails,
    ...store.eventDetails,
    ...store.generatedInvitation,
    photoUrls: store.photoUrls,
    tone: store.stylePreferences.tone,
    language: store.stylePreferences.language,
    layout: store.stylePreferences.layout,
    musicUrl: store.stylePreferences.musicUrl === 'custom' ? '' : store.stylePreferences.musicUrl,
    id: 'preview',
    slug: 'preview',
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps — Redesigned for Elegance */}
      <div className="relative mb-24 px-4 sm:px-10">
        <div className="absolute top-1/2 left-10 right-10 h-[1px] bg-[#1c1c1c]/10 -translate-y-1/2 z-0" />
        <div className="flex items-center justify-between relative z-10 max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.number} className="flex flex-col items-center group relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: store.step >= s.number ? '#1c1c1c' : '#fcfbf8',
                  color: store.step >= s.number ? '#fcfbf8' : '#1c1c1c',
                  borderColor: store.step >= s.number ? '#1c1c1c' : '#eceae4',
                  scale: store.step === s.number ? 1.2 : 1,
                }}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 cursor-pointer
                  ${store.step > s.number ? 'bg-[#1c1c1c] text-[#fcfbf8]' : 'bg-white shadow-sm'}
                `}
                onClick={() => store.step > s.number && store.setStep(s.number)}
              >
                {store.step > s.number ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  </motion.div>
                ) : (
                  <s.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${store.step === s.number ? 'animate-pulse' : ''}`} />
                )}
              </motion.div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <span className={`
                  text-[9px] sm:text-[10px] font-bold uppercase tracking-[2px] transition-all duration-500 block
                  ${store.step >= s.number ? 'text-[#1c1c1c] opacity-100' : 'text-[#1c1c1c]/30 opacity-0 sm:opacity-100'}
                  ${store.step === s.number ? 'scale-110 translate-y-1 text-highlight' : ''}
                `}>
                  {s.title === 'PADA PASANGAN' ? 'MEMPELAI' : s.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Couple Details */}
        {store.step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white border-[#eceae4] shadow-xl shadow-[#1c1c1c]/5 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-highlight" />
              <div className="text-center mb-8 pt-4">
                <div className="inline-flex p-3 rounded-full bg-highlight/5 mb-3">
                  <Heart className="h-6 w-6 text-highlight" />
                </div>
                <h2 className="text-2xl font-display font-bold text-[#1c1c1c]">Data Pasangan</h2>
                <p className="text-sm text-[#5f5f5d] mt-1">Lengkapi nama mempelai pria dan wanita</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Nama Mempelai Pria"
                    placeholder="Contoh: Ahmad Rizky"
                    helperText="Tuliskan nama lengkap tanpa gelar"
                    value={store.coupleDetails.groomName}
                    onChange={(e) =>
                      store.setCoupleDetails({ ...store.coupleDetails, groomName: e.target.value })
                    }
                  />
                  <Input
                    label="Orang Tua Pria (Opsional)"
                    placeholder="Contoh: Bapak Budi & Ibu Ani"
                    helperText="Nama kedua orang tua mempelai pria"
                    value={store.coupleDetails.groomParents}
                    onChange={(e) =>
                      store.setCoupleDetails({ ...store.coupleDetails, groomParents: e.target.value })
                    }
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Nama Mempelai Wanita"
                    placeholder="Contoh: Siti Nurhaliza"
                    helperText="Tuliskan nama lengkap tanpa gelar"
                    value={store.coupleDetails.brideName}
                    onChange={(e) =>
                      store.setCoupleDetails({ ...store.coupleDetails, brideName: e.target.value })
                    }
                  />
                  <Input
                    label="Orang Tua Wanita (Opsional)"
                    placeholder="Contoh: Bapak Slamet & Ibu Wati"
                    helperText="Nama kedua orang tua mempelai wanita"
                    value={store.coupleDetails.brideParents}
                    onChange={(e) =>
                      store.setCoupleDetails({ ...store.coupleDetails, brideParents: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end mt-12">
                <Button 
                  onClick={() => store.nextStep()} 
                  disabled={!canProceedStep1} 
                  size="lg"
                  className="bg-[#1c1c1c] text-[#fcfbf8] shadow-lg hover:shadow-highlight/20 transition-all hover:scale-[1.02]"
                >
                  Lanjut Ke Acara
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Event Details */}
        {store.step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white border-[#eceae4] shadow-xl shadow-[#1c1c1c]/5 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-highlight" />
              
              {/* Internal Sub-Step Navigation */}
              <div className="flex border-b border-[#eceae4]">
                {[
                  { id: 1, label: 'Waktu & Tempat', icon: MapPin },
                  { id: 2, label: 'Rangkaian Acara', icon: ListChecks },
                  { id: 3, label: 'Kisah Cinta', icon: Sparkles },
                  { id: 4, label: 'Kado Digital', icon: Heart }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSubStep(s.id)}
                    className={`
                      flex-1 py-4 flex flex-col items-center gap-1 transition-all relative
                      ${subStep === s.id ? 'text-highlight' : 'text-[#1c1c1c]/40 hover:text-[#1c1c1c]/60'}
                    `}
                  >
                    <s.icon className={`h-4 w-4 ${subStep === s.id ? 'animate-bounce' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">{s.label}</span>
                    {subStep === s.id && (
                      <motion.div layoutId="subStepIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-highlight" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  {subStep === 1 && (
                    <motion.div
                      key="sub1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-display font-bold text-[#1c1c1c]">Waktu & Lokasi</h2>
                        <p className="text-sm text-[#5f5f5d] mt-1">Kapan dan di mana hari bahagia Anda dirayakan?</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input
                          label="Tanggal Acara"
                          type="date"
                          helperText="Pilih tanggal pelaksanaan pernikahan"
                          value={store.eventDetails.eventDate}
                          onChange={(e) =>
                            store.setEventDetails({ ...store.eventDetails, eventDate: e.target.value })
                          }
                        />
                        <Input
                          label="Waktu Mulai"
                          type="time"
                          helperText="Jam dimulainya acara utama"
                          value={store.eventDetails.eventTime}
                          onChange={(e) =>
                            store.setEventDetails({ ...store.eventDetails, eventTime: e.target.value })
                          }
                        />
                      </div>
                      <Input
                        label="Nama Lokasi / Gedung"
                        placeholder="Contoh: The Grand Ballroom"
                        helperText="Nama tempat atau gedung pernikahan"
                        value={store.eventDetails.venueName}
                        onChange={(e) =>
                          store.setEventDetails({ ...store.eventDetails, venueName: e.target.value })
                        }
                      />
                      <Textarea
                        label="Alamat Lengkap Lokasi"
                        placeholder="Contoh: Jl. Gatot Subroto No. 123, Jakarta Selatan"
                        helperText="Sertakan detail agar mudah ditemukan tamu"
                        rows={3}
                        value={store.eventDetails.venueAddress}
                        onChange={(e) =>
                          store.setEventDetails({ ...store.eventDetails, venueAddress: e.target.value })
                        }
                      />
                    </motion.div>
                  )}

                  {subStep === 2 && (
                    <motion.div
                      key="sub2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-display font-bold text-[#1c1c1c]">Rangkaian Acara</h2>
                        <p className="text-sm text-[#5f5f5d] mt-1">Tentukan agenda momen berharga Anda</p>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-highlight font-bold"
                          onClick={() =>
                            store.setEventDetails({
                              ...store.eventDetails,
                              schedule: [
                                ...store.eventDetails.schedule,
                                { id: Date.now().toString(), time: '', label: '', icon: 'heart' },
                              ],
                            })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Agenda
                        </Button>
                      </div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                        {store.eventDetails.schedule.length === 0 && (
                          <div className="text-center py-12 border-2 border-dashed border-[#eceae4] rounded-2xl">
                            <ListChecks className="h-12 w-12 text-[#1c1c1c]/10 mx-auto mb-3" />
                            <p className="text-sm text-[#1c1c1c]/40">Belum ada agenda yang ditambahkan</p>
                          </div>
                        )}
                        {store.eventDetails.schedule.map((item, index) => (
                          <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-[#fcfbf8] p-4 rounded-xl border border-[#eceae4]">
                            <div className="w-full sm:w-32">
                              <Input
                                label="Waktu"
                                type="time"
                                value={item.time}
                                onChange={(e) => {
                                  const newSchedule = [...store.eventDetails.schedule];
                                  newSchedule[index].time = e.target.value;
                                  store.setEventDetails({ ...store.eventDetails, schedule: newSchedule });
                                }}
                              />
                            </div>
                            <div className="flex-1 w-full">
                              <Input
                                label="Kegiatan"
                                placeholder="Contoh: Akad Nikah"
                                value={item.label}
                                onChange={(e) => {
                                  const newSchedule = [...store.eventDetails.schedule];
                                  newSchedule[index].label = e.target.value;
                                  store.setEventDetails({ ...store.eventDetails, schedule: newSchedule });
                                }}
                              />
                            </div>
                            <div className="w-full sm:w-32">
                              <Select
                                label="Ikon"
                                options={iconOptions}
                                value={item.icon}
                                onChange={(e) => {
                                  const newSchedule = [...store.eventDetails.schedule];
                                  newSchedule[index].icon = e.target.value;
                                  store.setEventDetails({ ...store.eventDetails, schedule: newSchedule });
                                }}
                              />
                            </div>
                            <button
                              className="mt-6 p-2 text-[#1c1c1c]/40 hover:text-red-500 transition-colors"
                              onClick={() => {
                                const newSchedule = store.eventDetails.schedule.filter((_, i) => i !== index);
                                store.setEventDetails({ ...store.eventDetails, schedule: newSchedule });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {subStep === 3 && (
                    <motion.div
                      key="sub3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-display font-bold text-[#1c1c1c]">Kisah Cinta</h2>
                        <p className="text-sm text-[#5f5f5d] mt-1">Bagikan perjalanan cinta Anda kepada tamu</p>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-xs font-bold text-highlight hover:opacity-70 flex items-center gap-1.5 transition-all"
                          onClick={() => {
                            const newStory = [...store.eventDetails.loveStory];
                            newStory.push({ id: Date.now().toString(), year: '', title: '', description: '' });
                            store.setEventDetails({ ...store.eventDetails, loveStory: newStory });
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Tambah Momen
                        </button>
                      </div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                        {store.eventDetails.loveStory.length === 0 && (
                          <div className="text-center py-12 border-2 border-dashed border-[#eceae4] rounded-2xl">
                            <Sparkles className="h-12 w-12 text-[#1c1c1c]/10 mx-auto mb-3" />
                            <p className="text-sm text-[#1c1c1c]/40">Belum ada cerita yang ditambahkan</p>
                          </div>
                        )}
                        {store.eventDetails.loveStory.map((item, index) => (
                          <div key={item.id} className="bg-[#fcfbf8] p-5 rounded-xl border border-[#eceae4] space-y-4 relative">
                            <div className="flex gap-4">
                              <div className="w-28">
                                <Input
                                  label="Tahun"
                                  placeholder="2020"
                                  value={item.year}
                                  onChange={(e) => {
                                    const newStory = [...store.eventDetails.loveStory];
                                    newStory[index].year = e.target.value;
                                    store.setEventDetails({ ...store.eventDetails, loveStory: newStory });
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <Input
                                  label="Judul Momen"
                                  placeholder="Pertemuan Pertama"
                                  value={item.title}
                                  onChange={(e) => {
                                    const newStory = [...store.eventDetails.loveStory];
                                    newStory[index].title = e.target.value;
                                    store.setEventDetails({ ...store.eventDetails, loveStory: newStory });
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                className="mt-6 p-2 text-[#1c1c1c]/20 hover:text-red-500 transition-colors"
                                onClick={() => {
                                  const newStory = store.eventDetails.loveStory.filter((_, i) => i !== index);
                                  store.setEventDetails({ ...store.eventDetails, loveStory: newStory });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <Textarea
                              label="Cerita Singkat"
                              placeholder="Ceritakan momen indah ini..."
                              rows={2}
                              value={item.description}
                              onChange={(e) => {
                                const newStory = [...store.eventDetails.loveStory];
                                newStory[index].description = e.target.value;
                                store.setEventDetails({ ...store.eventDetails, loveStory: newStory });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {subStep === 4 && (
                    <motion.div
                      key="sub4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-display font-bold text-[#1c1c1c]">Kado Digital</h2>
                        <p className="text-sm text-[#5f5f5d] mt-1">Opsional: Tambahkan informasi rekening untuk kado digital</p>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-highlight font-bold"
                          onClick={() => {
                            const newGifts = [...((store as any).eventDetails.digitalGifts || [])];
                            newGifts.push({ bankName: '', accountNumber: '', accountHolder: '' });
                            store.setEventDetails({ ...store.eventDetails, digitalGifts: newGifts } as any);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Rekening
                        </Button>
                      </div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                        {((store as any).eventDetails.digitalGifts || []).length === 0 && (
                          <div className="text-center py-12 border-2 border-dashed border-[#eceae4] rounded-2xl">
                            <Heart className="h-12 w-12 text-[#1c1c1c]/10 mx-auto mb-3" />
                            <p className="text-sm text-[#1c1c1c]/40">Belum ada informasi kado digital</p>
                          </div>
                        )}
                        {((store as any).eventDetails.digitalGifts || []).map((gift: any, index: number) => (
                          <div key={index} className="bg-[#fcfbf8] p-5 rounded-xl border border-[#eceae4] space-y-4 relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Input
                                label="Nama Bank / E-Wallet"
                                placeholder="Contoh: BCA, Mandiri, GoPay"
                                value={gift.bankName}
                                onChange={(e) => {
                                  const newGifts = [...((store as any).eventDetails.digitalGifts || [])];
                                  newGifts[index].bankName = e.target.value;
                                  store.setEventDetails({ ...store.eventDetails, digitalGifts: newGifts } as any);
                                }}
                              />
                              <Input
                                label="Nomor Rekening"
                                placeholder="Contoh: 1234567890"
                                value={gift.accountNumber}
                                onChange={(e) => {
                                  const newGifts = [...((store as any).eventDetails.digitalGifts || [])];
                                  newGifts[index].accountNumber = e.target.value;
                                  store.setEventDetails({ ...store.eventDetails, digitalGifts: newGifts } as any);
                                }}
                              />
                            </div>
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <Input
                                  label="Atas Nama (Pemilik)"
                                  placeholder="Contoh: Ahmad Rizky"
                                  value={gift.accountHolder}
                                  onChange={(e) => {
                                    const newGifts = [...((store as any).eventDetails.digitalGifts || [])];
                                    newGifts[index].accountHolder = e.target.value;
                                    store.setEventDetails({ ...store.eventDetails, digitalGifts: newGifts } as any);
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                className="mt-6 p-2 text-[#1c1c1c]/20 hover:text-red-500 transition-colors"
                                onClick={() => {
                                  const newGifts = (store as any).eventDetails.digitalGifts.filter((_: any, i: number) => i !== index);
                                  store.setEventDetails({ ...store.eventDetails, digitalGifts: newGifts } as any);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step Footer Navigation */}
              <div className="flex justify-between p-8 pt-0 border-t border-[#eceae4]/30 mt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    if (subStep > 1) setSubStep(subStep - 1);
                    else store.prevStep();
                  }} 
                  className="text-[#1c1c1c]/60"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {subStep === 1 ? 'Data Mempelai' : 'Kembali'}
                </Button>
                
                <Button 
                  onClick={() => {
                    if (subStep < 4) setSubStep(subStep + 1);
                    else store.nextStep();
                  }} 
                  disabled={subStep === 1 && !canProceedStep2} 
                  size="lg"
                  className="bg-[#1c1c1c] text-[#fcfbf8] shadow-lg hover:shadow-highlight/20 transition-all hover:scale-[1.02]"
                >
                  {subStep === 4 ? 'Lanjut Ke Foto' : 'Selanjutnya'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Photo Upload */}
        {store.step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white border-[#eceae4] shadow-xl shadow-[#1c1c1c]/5 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-highlight" />
              <div className="text-center mb-10 pt-4">
                <div className="inline-flex p-3 rounded-full bg-highlight/5 mb-3">
                  <Camera className="h-6 w-6 text-highlight" />
                </div>
                <h2 className="text-2xl font-display font-bold text-[#1c1c1c]">Galeri Foto</h2>
                <p className="text-sm text-[#5f5f5d] mt-1">Unggah momen indah Anda (opsional, maks 30 foto)</p>
              </div>

              {/* UploadThing Dropzone */}
              {store.photoUrls.length < 30 && (
                <div className="bg-[#fcfbf8] rounded-2xl border-2 border-dashed border-[#eceae4] p-2 hover:border-highlight/30 transition-all">
                  <UploadDropzone
                    endpoint="weddingPhotos"
                    onClientUploadComplete={(res) => {
                      if (res) {
                        res.forEach((file) => {
                          store.addPhotoUrl(file.ufsUrl);
                        });
                        showToast('success', `${res.length} photo(s) uploaded!`);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      showToast('error', error.message || 'Upload failed');
                    }}
                    config={{ mode: 'auto' }}
                    appearance={{
                      container: 'border-none bg-transparent p-12 hover:bg-highlight/5 transition-all duration-500',
                      label: 'text-[#1c1c1c] font-bold text-base hover:text-highlight transition-colors',
                      allowedContent: 'text-[#5f5f5d]/40 text-[10px] uppercase tracking-widest mt-2',
                      button: 'bg-[#1c1c1c] text-white text-sm font-bold rounded-xl px-8 py-3 shadow-lg transition-all active:scale-95',
                      uploadIcon: 'text-highlight/40 h-12 w-12 mb-4',
                    }}
                  />
                </div>
              )}

              {/* Uploaded Photos Preview */}
              {store.photoUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                  {store.photoUrls.map((url, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group aspect-square rounded-2xl overflow-hidden border border-[#eceae4] shadow-sm"
                    >
                      <Image
                        src={url}
                        alt={`Photo ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-[#1c1c1c]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => store.removePhotoUrl(url)}
                          className="p-2 rounded-full bg-white text-red-500 hover:scale-110 transition-transform shadow-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex justify-between mt-12 pt-6 border-t border-[#eceae4]/30">
                <Button variant="ghost" onClick={() => store.prevStep()} className="text-[#1c1c1c]/60">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Kembali
                </Button>
                <Button 
                  onClick={() => store.nextStep()} 
                  size="lg"
                  className="bg-[#1c1c1c] text-[#fcfbf8] shadow-lg hover:shadow-highlight/20 transition-all hover:scale-[1.02]"
                >
                  {store.photoUrls.length === 0 ? 'Lewati Foto' : 'Lanjut Ke Gaya'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Style Preferences */}
        {store.step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white border-[#eceae4] shadow-xl shadow-[#1c1c1c]/5 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-highlight" />
              <div className="text-center mb-10 pt-4">
                <div className="inline-flex p-3 rounded-full bg-highlight/5 mb-3">
                  <Palette className="h-6 w-6 text-highlight" />
                </div>
                <h2 className="text-2xl font-display font-bold text-[#1c1c1c]">Pilihan Gaya</h2>
                <p className="text-sm text-[#5f5f5d] mt-1">Tentukan nuansa undangan Anda</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-8">
                  {['basic', 'advance'].map((category) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-[#1c1c1c] uppercase tracking-[0.3em]">
                          {category === 'basic' ? 'Standard Collection' : 'Premium Editorial'}
                        </span>
                        <div className="h-px flex-1 bg-[#1c1c1c]/5" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {layoutOptions
                          .filter((opt) => opt.category === category)
                          .map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() =>
                                store.setStylePreferences({
                                  ...store.stylePreferences,
                                  layout: opt.value,
                                })
                              }
                              className={`
                                relative p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-500 overflow-hidden group
                                ${store.stylePreferences.layout === opt.value ? 'ring-2 ring-highlight ring-offset-4 ring-offset-white bg-[#fcfbf8] shadow-lg' : 'hover:bg-[#fcfbf8]/50 hover:shadow-md opacity-70 hover:opacity-100 border border-[#eceae4]'}
                              `}
                            >
                              <div className={`w-12 h-16 rounded-lg shadow-sm border-2 ${opt.bg} ${opt.border} flex flex-col items-center justify-between p-1 z-10 transition-transform duration-500 group-hover:scale-110`}>
                                <div className={`w-6 h-6 rounded-full ${opt.preview} mt-1`} />
                                <div className="w-8 h-1.5 bg-[#1c1c1c]/5 rounded-full" />
                              </div>
                              <span className="text-[10px] font-bold text-[#1c1c1c] uppercase tracking-wider relative z-10">{opt.label}</span>
                              {category === 'advance' && (
                                <div className="absolute top-2 right-2">
                                  <Sparkles className="h-3 w-3 text-highlight" />
                                </div>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="Nuansa Undangan"
                    options={toneOptions}
                    value={store.stylePreferences.tone}
                    onChange={(e) =>
                      store.setStylePreferences({
                        ...store.stylePreferences,
                        tone: e.target.value as Tone,
                      })
                    }
                  />
                  <Select
                    label="Bahasa Utama"
                    options={languageOptions}
                    value={store.stylePreferences.language}
                    onChange={(e) =>
                      store.setStylePreferences({
                        ...store.stylePreferences,
                        language: e.target.value as Language,
                      })
                    }
                  />
                </div>
                
                <Select
                  label="Musik Latar"
                  options={musicOptions}
                  value={
                    musicOptions.some((opt) => opt.value === store.stylePreferences.musicUrl)
                      ? store.stylePreferences.musicUrl || ''
                      : 'custom'
                  }
                  onChange={(e) =>
                    store.setStylePreferences({
                      ...store.stylePreferences,
                      musicUrl: e.target.value,
                    })
                  }
                />

                {(store.stylePreferences.musicUrl === 'custom' ||
                  (!musicOptions.some((opt) => opt.value === store.stylePreferences.musicUrl) &&
                    store.stylePreferences.musicUrl !== '')) && (
                  <Input
                    label="Custom Audio URL (.mp3, .wav)"
                    placeholder="https://example.com/song.mp3"
                    value={store.stylePreferences.musicUrl === 'custom' ? '' : store.stylePreferences.musicUrl}
                    onChange={(e) =>
                      store.setStylePreferences({
                        ...store.stylePreferences,
                        musicUrl: e.target.value,
                      })
                    }
                  />
                )}

                <Textarea
                  label="Catatan Tambahan (Opsional)"
                  placeholder="Misal: Ayat Al-Quran tertentu, dress code, dll..."
                  rows={3}
                  value={store.stylePreferences.additionalNotes}
                  onChange={(e) =>
                    store.setStylePreferences({
                      ...store.stylePreferences,
                      additionalNotes: e.target.value,
                    })
                  }
                />

                <Textarea
                  label="Quotes / Kata Mutiara"
                  placeholder="Masukkan kutipan favorit Anda yang akan tampil di bagian akhir undangan..."
                  rows={3}
                  value={store.eventDetails.quotes}
                  onChange={(e) =>
                    store.setEventDetails({
                      ...store.eventDetails,
                      quotes: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-between mt-12 pt-6 border-t border-[#eceae4]/30">
                <Button variant="ghost" onClick={() => store.prevStep()} className="text-[#1c1c1c]/60">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Kembali
                </Button>
                <Button
                  onClick={handleGenerate}
                  isLoading={store.isGenerating}
                  size="lg"
                  className="bg-[#1c1c1c] text-[#fcfbf8] shadow-lg hover:shadow-highlight/20 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className={`h-4 w-4 mr-2 ${store.isGenerating ? 'animate-spin' : 'animate-pulse'}`} />
                  {store.isGenerating ? 'Sedang merangkai momen Anda...' : 'Lihat Hasil Akhir'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 5: Preview & Save — Dramatic Transformation */}
        {store.step === 5 && store.generatedInvitation && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="text-center">
              <div className="font-handwriting text-3xl text-highlight/60 mb-2">Sempurna...</div>
              <h2 className="text-3xl font-display font-bold text-[#1c1c1c]">Undangan Anda Telah Siap</h2>
              <p className="text-[#5f5f5d] mt-2">Pratinjau tampilan undangan di perangkat tamu Anda</p>
            </div>

            {/* Live Mobile Preview Frame */}
            <div className="relative mx-auto max-w-[375px] w-full">
              <div className="relative aspect-[9/19.5] rounded-[3.5rem] border-[12px] border-[#1c1c1c] bg-white shadow-2xl overflow-hidden ring-1 ring-black/10">
                {/* iPhone Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1c1c1c] rounded-b-2xl z-50 flex items-center justify-around px-4">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-12 h-1 rounded-full bg-white/10" />
                </div>
                
                <div className="absolute inset-0 overflow-y-auto no-scrollbar scroll-smooth bg-[#fcfbf8]">
                  <InvitationPreview invitation={mockInvitation} />
                </div>
              </div>

              {/* Visual depth decor */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-highlight/5 blur-3xl rounded-full -z-10" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-highlight/5 blur-3xl rounded-full -z-10" />
            </div>

            {/* Final Actions — Editorial Style */}
            <div className="max-w-md mx-auto space-y-4 pt-10">
              <Button
                onClick={handleSave}
                isLoading={store.isSaving}
                size="lg"
                className="w-full bg-[#1c1c1c] text-[#fcfbf8] shadow-2xl py-6 text-lg tracking-widest hover:scale-[1.02] transition-all"
              >
                <Heart className={`h-5 w-5 mr-2 ${store.isSaving ? '' : 'animate-heartbeat'}`} fill="currentColor" />
                {store.isSaving ? 'MENYIAPKAN UNDANGAN...' : 'SIMPAN & PUBLIKASIKAN'}
              </Button>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => store.setStep(4)}
                  className="flex-1 border-[#eceae4] text-[#1c1c1c]/60"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Edit Gaya
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGenerate}
                  isLoading={store.isGenerating}
                  className="flex-1 border-[#eceae4] text-[#1c1c1c] hover:bg-[#1c1c1c]/5"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerasi Teks
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
