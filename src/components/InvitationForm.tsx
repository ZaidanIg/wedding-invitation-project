'use client';

import React, { useState, useEffect } from 'react';
import { useInvitationStore } from '@/store/invitation-store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  Trash2,
  ListChecks,
  Plus,
  User,
  FileText,
  RotateCcw,
  Lock,
  Music,
  CheckCircle2,
  AlertCircle,
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
  { value: '/music/Epic Spectrum - Sky Clearing (freetouse.com).mp3', label: '🎻 Sky Clearing (Default)' },
  { value: 'https://docs.google.com/uc?export=download&id=1GCYf7Ch3JLvd3RyzelpQte1FYZyWnngV', label: '🎼 Perfect Symphony (Premium)' },
  { value: 'https://cdn.pixabay.com/audio/2022/10/25/audio_22dbdcdcc8.mp3', label: '🎹 Romantic Piano' },
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
  { number: 1, title: 'PASANGAN', icon: Heart },
  { number: 2, title: 'ACARA', icon: Calendar },
  { number: 3, title: 'FOTO', icon: Camera },
  { number: 4, title: 'GAYA', icon: Palette },
  { number: 5, title: 'SELESAI', icon: Sparkles },
];

const tiers = [
  { id: 'DRAFT', name: 'Free Demo', price: 'Gratis', description: 'Coba fitur dasar dan lihat pratinjau desain Anda.', features: ['2 Foto Mempelai', 'Pilih Tema Dasar', 'Tanpa Musik', 'Tidak Bisa Disimpan'], color: 'text-stone-500', bg: 'bg-stone-50' },
  { id: 'BASIC', name: 'Basic Plan', price: 'Rp 50.000', description: 'Sangat cocok untuk undangan minimalis yang elegan.', features: ['Header Foto', '2 Foto Mempelai', '2 Foto Galeri', 'Aktif Selamanya', 'Bisa Disimpan'], color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'PREMIUM', name: 'Premium Plan', price: 'Rp 100.000', description: 'Fitur lengkap untuk momen pernikahan yang tak terlupakan.', features: ['Header Foto', '2 Foto Mempelai', 'Unlimited Galeri', 'Background Music', 'Priority Support', 'Custom Link'], color: 'text-rose-500', bg: 'bg-rose-50' },
];

export default function InvitationForm() {
  const store = useInvitationStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [subStep, setSubStep] = useState(1);
  const [userAccountType, setUserAccountType] = useState<string>('B2C_FREE');
  const [showPlanSelection, setShowPlanSelection] = useState(true);

  useEffect(() => {
    if (session === null) {
      router.push('/auth/signin');
    } else if (session?.user?.id) {
       fetchUserStats();
    }
  }, [session, router]);

  const fetchUserStats = async () => {
    try {
      const res = await fetch('/api/invitations');
      const data = await res.json();
      if (data.success) {
        setUserAccountType(data.user.accountType);
        // If B2B, automatically set to PREMIUM features and skip plan selection
        if (data.user.accountType === 'B2B_PRO' || data.user.accountType === 'B2B_ALL_TIME') {
          store.setTargetTier('PREMIUM');
          setShowPlanSelection(false);
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleGenerateAI = async () => {
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
      if (!response.ok) throw new Error(data.error || 'Gagal memproses data');
      store.setGeneratedInvitation(data.data);
      showToast('success', 'Teks berhasil di-generate!');
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (store.targetTier === 'DRAFT') {
       router.push('/pricing');
       return;
    }
    if (!store.generatedInvitation) {
       showToast('error', 'Silakan generate teks undangan terlebih dahulu');
       return;
    }
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
          headerPhotoUrl: store.headerPhotoUrl,
          groomPhotoUrl: store.groomPhotoUrl,
          bridePhotoUrl: store.bridePhotoUrl,
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
      if (!response.ok) throw new Error(data.error || 'Gagal menyimpan');
      showToast('success', 'Undangan disimpan! Mengalihkan...');
      setTimeout(() => { window.location.href = `/invitation/${data.data.slug}`; }, 1500);
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      store.setIsSaving(false);
    }
  };

  const canProceedStep1 = store.coupleDetails.groomName.trim().length >= 2 && store.coupleDetails.brideName.trim().length >= 2;
  const canProceedStep2 = store.eventDetails.eventDate && store.eventDetails.eventTime && store.eventDetails.venueName.trim().length >= 2 && store.eventDetails.venueAddress.trim().length >= 5;

  if (!session) return null;

  const mockInvitation = {
    ...store.coupleDetails,
    ...store.eventDetails,
    ...store.generatedInvitation,
    photoUrls: store.photoUrls,
    headerPhotoUrl: store.headerPhotoUrl,
    groomPhotoUrl: store.groomPhotoUrl,
    bridePhotoUrl: store.bridePhotoUrl,
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

  // Dynamic constraints based on tier
  const isFree = store.targetTier === 'DRAFT';
  const isBasic = store.targetTier === 'BASIC';
  const isPremium = store.targetTier === 'PREMIUM';

  if (showPlanSelection) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
           <h1 className="text-4xl font-display font-bold text-[#1c1c1c] mb-4">Pilih Paket Undangan</h1>
           <p className="text-stone-500">Sesuaikan fitur dengan kebutuhan hari bahagia Anda</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <Card key={t.id} onClick={() => { store.setTargetTier(t.id as any); setShowPlanSelection(false); }} className={`cursor-pointer transition-all hover:scale-[1.02] border-2 ${store.targetTier === t.id ? 'border-rose-500 shadow-xl' : 'border-[#eceae4]'} flex flex-col`}>
              <div className={`p-6 ${t.bg} border-b border-[#eceae4]`}>
                <h3 className={`text-xl font-bold ${t.color}`}>{t.name}</h3>
                <div className="text-2xl font-display font-bold mt-2">{t.price}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-stone-500 mb-6">{t.description}</p>
                <ul className="space-y-3 flex-1">
                  {t.features.map((f, i) => (
                    <li key={i} className="text-xs flex items-center gap-2 text-stone-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8 bg-[#1c1c1c] text-white rounded-xl">Pilih Paket</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      {/* Dynamic Tier Banner */}
      <div className="mb-8 flex items-center justify-between bg-white border border-[#eceae4] p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isFree ? 'bg-stone-100 text-stone-500' : isBasic ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'}`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Paket Saat Ini</div>
            <div className="text-sm font-bold text-[#1c1c1c]">{tiers.find(t => t.id === store.targetTier)?.name}</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowPlanSelection(true)} className="text-rose-500 text-xs font-bold">
          Ganti Paket
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="relative mb-24 px-4 sm:px-10">
        <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-[#1c1c1c]/10 -translate-y-1/2 z-0" />
        <div className="flex items-center justify-between relative z-10 max-w-2xl mx-auto">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center group relative">
              <motion.div animate={{ backgroundColor: store.step >= s.number ? '#1c1c1c' : '#fcfbf8', color: store.step >= s.number ? '#fcfbf8' : '#1c1c1c', borderColor: store.step >= s.number ? '#1c1c1c' : '#eceae4', scale: store.step === s.number ? 1.1 : 1 }} className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 cursor-pointer ${store.step > s.number ? 'bg-[#1c1c1c] text-[#fcfbf8]' : 'bg-white shadow-sm'}`} onClick={() => store.step > s.number && store.setStep(s.number)}>
                {store.step > s.number ? <Heart className="h-3 w-3 sm:h-5 sm:w-5 fill-current" /> : <s.icon className={`h-3 w-3 sm:h-5 sm:w-5 ${store.step === s.number ? 'animate-pulse' : ''}`} />}
              </motion.div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"><span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-500 block ${store.step >= s.number ? 'text-[#1c1c1c] opacity-100' : 'text-[#1c1c1c]/30 opacity-0 sm:opacity-100'} ${store.step === s.number ? 'scale-105 text-rose-500' : ''}`}>{s.title}</span></div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {store.step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="bg-white border-[#eceae4] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
              <div className="p-6 sm:p-10">
                <div className="text-center mb-10"><div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4"><Heart className="h-7 w-7 text-rose-500" /></div><h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1c1c1c]">Data Pasangan</h2></div>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8"><Input label="Nama Mempelai Pria" placeholder="John Doe" value={store.coupleDetails.groomName} onChange={(e) => store.setCoupleDetails({ ...store.coupleDetails, groomName: e.target.value })} /><Input label="Orang Tua Pria" placeholder="Bapak John & Ibu Jane" value={store.coupleDetails.groomParents} onChange={(e) => store.setCoupleDetails({ ...store.coupleDetails, groomParents: e.target.value })} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8"><Input label="Nama Mempelai Wanita" placeholder="Jane Doe" value={store.coupleDetails.brideName} onChange={(e) => store.setCoupleDetails({ ...store.coupleDetails, brideName: e.target.value })} /><Input label="Orang Tua Wanita" placeholder="Bapak Doe & Ibu Doe" value={store.coupleDetails.brideParents} onChange={(e) => store.setCoupleDetails({ ...store.coupleDetails, brideParents: e.target.value })} /></div>
                </div>
                <div className="flex justify-end mt-12"><Button onClick={() => store.nextStep()} disabled={!canProceedStep1} size="lg" className="w-full sm:w-auto bg-[#1c1c1c] text-white">Lanjut Ke Acara <ChevronRight className="h-4 w-4 ml-1" /></Button></div>
              </div>
            </Card>
          </motion.div>
        )}

        {store.step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="bg-white border-[#eceae4] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
              <div className="flex border-b border-[#eceae4] bg-[#fcfbf8]/50">
                {[{ id: 1, label: 'LOKASI', icon: MapPin }, { id: 2, label: 'AGENDA', icon: ListChecks }, { id: 3, label: 'CERITA', icon: Sparkles }, { id: 4, label: 'KADO', icon: Heart }].map((s) => (
                  <button key={s.id} onClick={() => setSubStep(s.id)} className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${subStep === s.id ? 'text-rose-500' : 'text-[#1c1c1c]/40 hover:text-[#1c1c1c]/60'}`}>
                    <s.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${subStep === s.id ? 'animate-pulse' : ''}`} /><span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">{s.label}</span>
                    {subStep === s.id && <motion.div layoutId="subIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500" />}
                  </button>
                ))}
              </div>
              <div className="p-6 sm:p-10">
                <AnimatePresence mode="wait">
                  {subStep === 1 && (<motion.div key="sub1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6"><div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><Input label="Tanggal Acara" type="date" value={store.eventDetails.eventDate} onChange={(e) => store.setEventDetails({ ...store.eventDetails, eventDate: e.target.value })} /><Input label="Waktu Mulai" type="time" value={store.eventDetails.eventTime} onChange={(e) => store.setEventDetails({ ...store.eventDetails, eventTime: e.target.value })} /></div><Input label="Nama Lokasi" placeholder="The Grand Ballroom Sumedang" value={store.eventDetails.venueName} onChange={(e) => store.setEventDetails({ ...store.eventDetails, venueName: e.target.value })} /><Textarea label="Alamat Lengkap" placeholder="Jl. Pangeran Kornel No. 123, Sumedang Selatan" rows={3} value={store.eventDetails.venueAddress} onChange={(e) => store.setEventDetails({ ...store.eventDetails, venueAddress: e.target.value })} /></motion.div>)}
                  {subStep === 2 && (<motion.div key="sub2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6"><div className="flex items-center justify-between"><h3 className="font-bold text-sm">Rangkaian Acara</h3><Button variant="ghost" size="sm" onClick={() => store.setEventDetails({ ...store.eventDetails, schedule: [...store.eventDetails.schedule, { id: Date.now().toString(), time: '', label: '', icon: 'heart' }] })} className="text-rose-500"><Plus className="h-4 w-4 mr-1" /> Tambah</Button></div><div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">{store.eventDetails.schedule.map((item, index) => (<div key={item.id} className="bg-[#fcfbf8] p-4 border border-[#eceae4] rounded-2xl space-y-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Input label="Jam" type="time" value={item.time} onChange={(e) => { const n = [...store.eventDetails.schedule]; n[index].time = e.target.value; store.setEventDetails({ ...store.eventDetails, schedule: n }); }} /><Select label="Ikon" options={iconOptions} value={item.icon} onChange={(e) => { const n = [...store.eventDetails.schedule]; n[index].icon = e.target.value; store.setEventDetails({ ...store.eventDetails, schedule: n }); }} /></div><div className="flex gap-2"><Input label="Kegiatan" placeholder="Contoh: Akad Nikah" className="flex-1" value={item.label} onChange={(e) => { const n = [...store.eventDetails.schedule]; n[index].label = e.target.value; store.setEventDetails({ ...store.eventDetails, schedule: n }); }} /><button className="mt-8 text-red-400 p-2" onClick={() => { const n = store.eventDetails.schedule.filter((_, i) => i !== index); store.setEventDetails({ ...store.eventDetails, schedule: n }); }}><Trash2 className="h-4 w-4" /></button></div></div>))}</div></motion.div>)}
                  {subStep === 3 && (<motion.div key="sub3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6"><div className="flex items-center justify-between"><h3 className="font-bold text-sm">Kisah Cinta</h3><Button variant="ghost" size="sm" onClick={() => store.setEventDetails({ ...store.eventDetails, loveStory: [...store.eventDetails.loveStory, { id: Date.now().toString(), year: '', title: '', description: '' }] })} className="text-rose-500"><Plus className="h-4 w-4 mr-1" /> Tambah</Button></div><div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">{store.eventDetails.loveStory.map((item, index) => (<div key={item.id} className="bg-[#fcfbf8] p-5 border border-[#eceae4] rounded-2xl space-y-4"><div className="grid grid-cols-2 gap-4"><Input label="Tahun" placeholder="2020" value={item.year} onChange={(e) => { const n = [...store.eventDetails.loveStory]; n[index].year = e.target.value; store.setEventDetails({ ...store.eventDetails, loveStory: n }); }} /><Input label="Judul" placeholder="Pertemuan Pertama" value={item.title} onChange={(e) => { const n = [...store.eventDetails.loveStory]; n[index].title = e.target.value; store.setEventDetails({ ...store.eventDetails, loveStory: n }); }} /></div><div className="flex gap-2"><Textarea label="Cerita" placeholder="Menceritakan momen indah..." rows={2} className="flex-1" value={item.description} onChange={(e) => { const n = [...store.eventDetails.loveStory]; n[index].description = e.target.value; store.setEventDetails({ ...store.eventDetails, loveStory: n }); }} /><button className="mt-8 text-red-400 p-2" onClick={() => { const n = store.eventDetails.loveStory.filter((_, i) => i !== index); store.setEventDetails({ ...store.eventDetails, loveStory: n }); }}><Trash2 className="h-5 w-5" /></button></div></div>))}</div></motion.div>)}
                  {subStep === 4 && (<motion.div key="sub4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6"><div className="flex items-center justify-between"><h3 className="font-bold text-sm">Kado Digital</h3><Button variant="ghost" size="sm" onClick={() => { const n = [...(store.eventDetails.digitalGifts || [])]; n.push({ bankName: '', accountNumber: '', accountHolder: '' }); store.setEventDetails({ ...store.eventDetails, digitalGifts: n } as any); }} className="text-rose-500"><Plus className="h-4 w-4 mr-1" /> Rekening</Button></div><div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">{(store.eventDetails.digitalGifts || []).map((gift: any, index: number) => (<div key={index} className="bg-[#fcfbf8] p-5 border border-[#eceae4] rounded-2xl"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"><Input label="Bank / Wallet" placeholder="BCA" value={gift.bankName} onChange={(e) => { const n = [...store.eventDetails.digitalGifts]; n[index].bankName = e.target.value; store.setEventDetails({ ...store.eventDetails, digitalGifts: n } as any); }} /><Input label="Nomor Rekening" placeholder="1234567890" value={gift.accountNumber} onChange={(e) => { const n = [...store.eventDetails.digitalGifts]; n[index].accountNumber = e.target.value; store.setEventDetails({ ...store.eventDetails, digitalGifts: n } as any); }} /></div><div className="flex items-end gap-3"><div className="flex-1"><Input label="Atas Nama" placeholder="John Doe" value={gift.accountHolder} onChange={(e) => { const n = [...store.eventDetails.digitalGifts]; n[index].accountHolder = e.target.value; store.setEventDetails({ ...store.eventDetails, digitalGifts: n } as any); }} /></div><button className="h-12 w-12 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-xl transition-colors border border-[#eceae4] bg-white" onClick={() => { const n = store.eventDetails.digitalGifts.filter((_: any, i: number) => i !== index); store.setEventDetails({ ...store.eventDetails, digitalGifts: n } as any); }}><Trash2 className="h-5 w-5" /></button></div></div>))}</div></motion.div>)}
                </AnimatePresence>
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-12 gap-3"><Button variant="secondary" className="h-12 sm:h-auto" onClick={() => subStep > 1 ? setSubStep(subStep - 1) : store.prevStep()}><ChevronLeft className="h-4 w-4 mr-1" /> {subStep === 1 ? 'Kembali Ke Pasangan' : 'Kembali'}</Button><Button size="lg" className="h-14 sm:h-auto bg-[#1c1c1c] text-white" onClick={() => subStep < 4 ? setSubStep(subStep + 1) : store.nextStep()} disabled={subStep === 1 && !canProceedStep2}>{subStep === 4 ? 'Lanjut Ke Foto' : 'Lanjut'}</Button></div>
              </div>
            </Card>
          </motion.div>
        )}

        {store.step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="bg-white border-[#eceae4] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
              <div className="p-6 sm:p-10 max-h-[75vh] overflow-y-auto no-scrollbar">
                <div className="text-center mb-10"><Camera className="h-7 w-7 text-rose-500 mx-auto mb-2" /><h2 className="text-2xl sm:text-3xl font-display font-bold">Galeri Foto</h2></div>
                <div className="space-y-12">
                  {/* Header Photo: Only for BASIC & PREMIUM */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm flex items-center gap-2">Foto Header / Sampul {!isPremium && !isBasic && <Lock className="h-3 w-3 text-stone-300" />}</h3>
                    {isFree ? (
                      <div className="bg-stone-50 border border-stone-200 p-6 rounded-3xl text-center">
                        <Lock className="h-6 w-6 mx-auto mb-2 text-stone-300" />
                        <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Terkunci di Paket Gratis</p>
                        <Button variant="ghost" size="sm" onClick={() => setShowPlanSelection(true)} className="text-rose-500 mt-2 text-xs">Upgrade Paket</Button>
                      </div>
                    ) : (
                      <div className="bg-[#fcfbf8] border-2 border-dashed border-[#eceae4] p-6 rounded-3xl">{store.headerPhotoUrl ? (<div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg"><Image src={store.headerPhotoUrl} alt="H" fill className="object-cover" unoptimized /><button className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-xl" onClick={() => store.setHeaderPhotoUrl('')}><Trash2 className="h-4 w-4" /></button></div>) : (<UploadDropzone endpoint="weddingPhotos" appearance={{ button: 'bg-rose-500 text-[10px] uppercase font-bold tracking-widest px-8 py-2.5 rounded-xl', container: 'p-6 border-none bg-transparent' }} onClientUploadComplete={(res) => { if (res?.[0]) store.setHeaderPhotoUrl(res[0].ufsUrl); }} />)}</div>
                    )}
                  </div>

                  {/* Groom & Bride: Always available */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8"><div className="space-y-4"><h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2"><User className="h-3 w-3 text-blue-400" /> Mempelai Pria</h3><div className="bg-[#fcfbf8] border-2 border-dashed border-[#eceae4] p-4 rounded-3xl min-h-[180px] flex items-center justify-center">{store.groomPhotoUrl ? (<div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md"><Image src={store.groomPhotoUrl} alt="G" fill className="object-cover" unoptimized /><button className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500" onClick={() => store.setGroomPhotoUrl('')}><Trash2 className="h-3.5 w-3.5" /></button></div>) : (<UploadDropzone endpoint="weddingPhotos" appearance={{ button: 'bg-[#1c1c1c] text-[9px] px-4 py-2 rounded-lg', container: 'p-2 border-none bg-transparent' }} onClientUploadComplete={(res) => { if (res?.[0]) store.setGroomPhotoUrl(res[0].ufsUrl); }} />)}</div></div><div className="space-y-4"><h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2"><User className="h-3 w-3 text-pink-400" /> Mempelai Wanita</h3><div className="bg-[#fcfbf8] border-2 border-dashed border-[#eceae4] p-4 rounded-3xl min-h-[180px] flex items-center justify-center">{store.bridePhotoUrl ? (<div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md"><Image src={store.bridePhotoUrl} alt="B" fill className="object-cover" unoptimized /><button className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500" onClick={() => store.setBridePhotoUrl('')}><Trash2 className="h-3.5 w-3.5" /></button></div>) : (<UploadDropzone endpoint="weddingPhotos" appearance={{ button: 'bg-[#1c1c1c] text-[9px] px-4 py-2 rounded-lg', container: 'p-2 border-none bg-transparent' }} onClientUploadComplete={(res) => { if (res?.[0]) store.setBridePhotoUrl(res[0].ufsUrl); }} />)}</div></div></div>

                  {/* Gallery: Restricted */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm flex items-center gap-2">Galeri Foto {isFree && <Lock className="h-3 w-3 text-stone-300" />} {isBasic && <span className="text-[10px] text-blue-500 font-normal ml-2">(Maks 2)</span>}</h3>
                    {isFree ? (
                      <div className="bg-stone-50 border border-stone-200 p-8 rounded-3xl text-center">
                         <Camera className="h-8 w-8 mx-auto mb-2 text-stone-300" />
                         <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Galeri Hanya Untuk Paket Premium</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(isBasic && store.photoUrls.length >= 2) ? (
                          <div className="bg-amber-50 p-4 rounded-xl text-[10px] text-amber-600 flex items-center gap-2 border border-amber-100">
                             <AlertCircle className="h-4 w-4" /> Batas galeri Paket Basic tercapai (2 foto).
                          </div>
                        ) : (
                          <div className="bg-[#fcfbf8] border-2 border-dashed border-[#eceae4] p-8 rounded-3xl">
                            <UploadDropzone endpoint="weddingPhotos" appearance={{ button: 'bg-[#1c1c1c] text-[10px] uppercase font-bold tracking-widest px-8 py-2.5 rounded-xl', container: 'p-4 border-none bg-transparent' }} onClientUploadComplete={(res) => { if (res) res.forEach(f => store.addPhotoUrl(f.ufsUrl)); }} />
                          </div>
                        )}
                        <div className="grid grid-cols-4 gap-2 mt-4">{store.photoUrls.map((u, i) => (<div key={i} className="relative aspect-square rounded-xl overflow-hidden border shadow-sm group"><Image src={u} alt="G" fill className="object-cover group-hover:scale-110 transition-transform" unoptimized /><button className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" onClick={() => store.removePhotoUrl(u)}><Trash2 className="h-3.5 w-3.5 text-white" /></button></div>))}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-12 gap-3"><Button variant="secondary" className="h-12 sm:h-auto" onClick={() => store.prevStep()}><ChevronLeft className="h-4 w-4 mr-1" /> Kembali</Button><Button size="lg" className="h-14 sm:h-auto bg-[#1c1c1c] text-white" onClick={() => store.nextStep()}>Selanjutnya <ChevronRight className="h-4 w-4 ml-1" /></Button></div>
              </div>
            </Card>
          </motion.div>
        )}

        {store.step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="bg-white border-[#eceae4] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
              <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto no-scrollbar">
                <div className="text-center mb-10"><Palette className="h-7 w-7 text-rose-500 mx-auto mb-2" /><h2 className="text-2xl sm:text-3xl font-display font-bold">Gaya & Teks</h2></div>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1c1c1c]/50">Pilih Tema</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">{layoutOptions.map((opt) => (<button key={opt.value} onClick={() => store.setStylePreferences({ ...store.stylePreferences, layout: opt.value })} className={`p-4 border rounded-2xl flex flex-col items-center gap-3 transition-all ${store.stylePreferences.layout === opt.value ? 'ring-2 ring-rose-500 bg-rose-50/20 border-rose-200' : 'hover:bg-[#fcfbf8] border-[#eceae4]'}`}><div className={`w-10 h-14 rounded-lg border-2 ${opt.bg} ${opt.border} shadow-sm`} /><span className="text-[9px] font-bold uppercase tracking-wider">{opt.label}</span></button>))}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><Select label="Nuansa" options={toneOptions} value={store.stylePreferences.tone} onChange={(e) => store.setStylePreferences({ ...store.stylePreferences, tone: e.target.value as any })} /><Select label="Bahasa" options={languageOptions} value={store.stylePreferences.language} onChange={(e) => store.setStylePreferences({ ...store.stylePreferences, language: e.target.value as any })} /></div>
                  
                  {/* Music: Restricted */}
                  <div className="relative">
                    <Select label="Musik Latar" options={isPremium ? musicOptions : [{ value: '', label: '🔇 Tanpa Musik (Upgrade ke Premium)' }]} value={isPremium ? store.stylePreferences.musicUrl : ''} onChange={(e) => store.setStylePreferences({ ...store.stylePreferences, musicUrl: e.target.value })} disabled={!isPremium} />
                    {!isPremium && <Lock className="absolute top-10 right-10 h-4 w-4 text-stone-300" />}
                    {!isPremium && <p className="text-[9px] text-stone-400 mt-1">* Musik hanya tersedia pada Paket Premium</p>}
                  </div>

                  <div className="pt-6 border-t border-[#eceae4] space-y-6">
                    <div className="flex items-center justify-between"><h3 className="font-bold flex items-center gap-2"><FileText className="h-4 w-4 text-rose-500" /> Teks Undangan</h3><Button variant="ghost" size="sm" onClick={handleGenerateAI} isLoading={store.isGenerating} className="text-rose-500 hover:bg-rose-50"><RotateCcw className={`h-4 w-4 mr-2 ${store.isGenerating ? 'animate-spin' : ''}`} />{store.generatedInvitation ? 'Ganti Teks (AI)' : 'Generate Teks (AI)'}</Button></div>
                    {store.generatedInvitation ? (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6"><Textarea label="Salam Pembuka" value={store.generatedInvitation.greeting} onChange={(e) => store.setGeneratedInvitation({ ...store.generatedInvitation!, greeting: e.target.value })} rows={3} /><Textarea label="Narasi Utama" value={store.generatedInvitation.mainBody} onChange={(e) => store.setGeneratedInvitation({ ...store.generatedInvitation!, mainBody: e.target.value })} rows={5} /><Textarea label="Info Acara" value={store.generatedInvitation.eventInfo} onChange={(e) => store.setGeneratedInvitation({ ...store.generatedInvitation!, eventInfo: e.target.value })} rows={3} /><Textarea label="Salam Penutup" value={store.generatedInvitation.closing} onChange={(e) => store.setGeneratedInvitation({ ...store.generatedInvitation!, closing: e.target.value })} rows={3} /></motion.div>) : (<div className="bg-[#fcfbf8] border border-[#eceae4] border-dashed rounded-2xl p-8 text-center"><p className="text-sm text-[#5f5f5d]">Gunakan AI untuk membuat teks undangan secara otomatis.</p></div>)}
                  </div>
                  <Textarea label="Quotes favorit" placeholder="Dan di antara tanda-tanda kekuasaan-Nya..." rows={2} value={store.eventDetails.quotes} onChange={(e) => store.setEventDetails({ ...store.eventDetails, quotes: e.target.value })} />
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-12 gap-3"><Button variant="secondary" className="h-12 sm:h-auto" onClick={() => store.prevStep()}><ChevronLeft className="h-4 w-4 mr-1" /> Kembali</Button><Button onClick={() => store.nextStep()} disabled={!store.generatedInvitation} className="h-14 sm:h-auto bg-[#1c1c1c] text-white">Lihat Hasil Akhir <Sparkles className="h-4 w-4 ml-1" /></Button></div>
              </div>
            </Card>
          </motion.div>
        )}

        {store.step === 5 && store.generatedInvitation && (
          <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-10 pb-20">
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold">Undangan Siap Dilihat</h2>
              {isFree && <div className="mt-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Ini adalah mode Demo. Silakan upgrade untuk menyimpan & membagikan.</div>}
            </div>
            <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] flex justify-center"><div className="relative w-full aspect-[9/19] rounded-[3.5rem] border-[12px] border-[#1c1c1c] bg-[#1c1c1c] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1c1c1c] rounded-b-3xl z-50 flex items-center justify-center"><div className="w-12 h-1 bg-white/10 rounded-full" /></div><div className="absolute inset-0 bg-white overflow-y-auto no-scrollbar scroll-smooth"><InvitationPreview invitation={mockInvitation} /></div><div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50" /></div></div>
            <div className="max-w-md w-full space-y-4">
              <Button onClick={handleSave} isLoading={store.isSaving} size="lg" className={`w-full ${isFree ? 'bg-rose-500' : 'bg-[#1c1c1c]'} text-white py-8 text-xl font-display tracking-widest shadow-2xl transition-all`}>
                {isFree ? 'UPGRADE UNTUK PUBLIKASI' : store.isSaving ? 'MENYIMPAN...' : 'SIMPAN & PUBLIKASIKAN'}
              </Button>
              <div className="flex gap-4"><Button variant="secondary" onClick={() => store.setStep(4)} className="flex-1 py-4">Edit Gaya & Teks</Button><Button variant="secondary" onClick={handleGenerateAI} isLoading={store.isGenerating} className="flex-1 py-4"><RotateCcw className="h-4 w-4 mr-2" /> Regenerasi Teks</Button></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
