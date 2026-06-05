
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Clock,
  User,
  FileText,
  RotateCcw,
  Lock,
  Music,
  Video,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { MOCK_INVITATION } from '@/constants/demoData';
import IframePreview from '@/components/ui/IframePreview';
import type { Tone, Language, Layout } from '@/types';
import Image from 'next/image';
import { UploadDropzone } from '@/lib/uploadthing';
import InvitationPreview from '@/components/themes/InvitationPreview';

const toneOptions = [
  { value: 'formal', label: 'Formal - Elegan & Berwibawa' },
  { value: 'romantic', label: 'Romantis - Penuh Perasaan' },
  { value: 'modern', label: 'Modern - Bersih & Kontemporer' },
  { value: 'playful', label: 'Ceria - Menyenangkan' },
];

const languageOptions = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' },
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
  { value: '', label: 'Tanpa Musik' },
  { value: '/music/Epic Spectrum - Sky Clearing (freetouse.com).mp3', label: 'Sky Clearing' },
  { value: 'custom', label: 'Upload Musik Saya...' },
];

const layoutOptions: { value: Layout; label: string; bg: string; border: string; preview: string; category: 'klasik' | 'premium' }[] = [
  // ── Klasik (tersedia di semua tier) ──
  { value: 'elegant-cream',    label: 'Ivory Bloom',       bg: 'bg-[#f7f4ed]', border: 'border-[#eceae4]',   preview: 'bg-[#1c1c1c]/10',    category: 'klasik' },
  { value: 'royal-blue',       label: 'Azure Classic',     bg: 'bg-[#e8f0fe]', border: 'border-blue-300',     preview: 'bg-blue-200',         category: 'klasik' },
  { value: 'rose-garden',      label: 'Blush Garden',      bg: 'bg-[#fdf2f4]', border: 'border-pink-300',     preview: 'bg-pink-200',         category: 'klasik' },
  { value: 'sand-dunes',       label: 'Sand Dunes',        bg: 'bg-[#fdfcf9]', border: 'border-[#d4af37]',   preview: 'bg-[#d4af37]/20',     category: 'klasik' },
  { value: 'midnight-velvet',  label: 'Midnight Velvet',   bg: 'bg-[#0a0f0d]', border: 'border-[#c5a059]',   preview: 'bg-[#c5a059]/40',     category: 'klasik' },
  { value: 'arabesque-pattern',label: 'Arabesque Pattern', bg: 'bg-[#f0fdfa]', border: 'border-[#2dd4bf]',   preview: 'bg-[#2dd4bf]/20',     category: 'klasik' },
  // ── Premium ──
  { value: 'golden-classic',   label: 'Golden Classic',    bg: 'bg-white',     border: 'border-[#D4AF37]',   preview: 'bg-[#D4AF37]/20',     category: 'premium' },
  { value: 'luxury-emerald',   label: 'Emerald Forest',    bg: 'bg-[#042f2e]', border: 'border-[#d4af37]',   preview: 'bg-[#d4af37]/30',     category: 'premium' },
  { value: 'forest-grace',     label: 'Forest Grace',      bg: 'bg-[#1a2b23]', border: 'border-[#c5a059]',   preview: 'bg-[#c5a059]/30',     category: 'premium' },
  { value: 'garden-chapel',    label: 'Garden Chapel',     bg: 'bg-[#f8f7f4]', border: 'border-rose-200',     preview: 'bg-rose-100/50',      category: 'premium' },
  { value: 'mandala-fusion',   label: 'Mandala Fusion',    bg: 'bg-[#fff8f0]', border: 'border-[#d4af37]',   preview: 'bg-[#d4af37]/20',     category: 'premium' },
  { value: 'zen-garden',       label: 'Zen Garden',        bg: 'bg-[#fdfbf7]', border: 'border-[#a3b18a]',   preview: 'bg-[#a3b18a]/20',     category: 'premium' },
  { value: 'oriental-luxe',    label: 'Oriental Luxe',     bg: 'bg-[#fffcf9]', border: 'border-[#8b0000]',   preview: 'bg-[#8b0000]/20',     category: 'premium' },
  { value: 'onyx-premium',     label: 'Onyx Premium',      bg: 'bg-[#111111]', border: 'border-[#d4af37]',   preview: 'bg-[#d4af37]/30',     category: 'premium' },
  { value: 'premium-sunda-3d', label: 'Nusantara 3D',      bg: 'bg-[#F8F4E6]', border: 'border-[#4A5D23]',   preview: 'bg-[#D4AF37]/30',     category: 'premium' },
  { value: 'batik-heritage',   label: 'Batik Heritage',    bg: 'bg-[#F8F5F0]', border: 'border-[#D4AF37]',   preview: 'bg-[#8B5A2B]/30',     category: 'premium' },
];

const steps = [
  { number: 1, title: 'TEMA', icon: Palette },
  { number: 2, title: 'PASANGAN', icon: Heart },
  { number: 3, title: 'ACARA', icon: Calendar },
  { number: 4, title: 'FOTO', icon: Camera },
  { number: 5, title: 'SELESAI', icon: Sparkles },
];

const tiers = [
  { id: 'BASIC', name: 'Minimalist Plan', price: 'Rp 75.000', description: 'Sangat cocok untuk undangan minimalis yang elegan.', features: ['Hapus Watermark', '2 Foto Mempelai', '3 Foto Galeri', 'Aktif Selamanya', 'Semua Tema Klasik'], color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'PREMIUM', name: 'Premium Plan', price: 'Rp 150.000', description: 'Fitur lengkap untuk momen pernikahan yang tak terlupakan.', features: ['6 Foto Galeri', 'Love Story Section', 'Countdown Timer', 'Musik Latar Kustom', 'Akses Tema Klasik'], color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'ULTIMATE', name: 'Ultimate Plan', price: 'Rp 250.000', description: 'Justifikasi termewah dengan fitur manajemen tamu modern.', features: ['Akses Tema Premium', 'Sistem QR Check-in', 'Link Per Tamu', 'WA Blast Integration', '10 Foto Galeri', 'Video Embed'], color: 'text-amber-500', bg: 'bg-amber-50/50' },
];

export default function InvitationForm() {
  const store = useInvitationStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [subStep, setSubStep] = useState(1);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [isAdminBypass, setIsAdminBypass] = useState(false);
  const [aiMode, setAiMode] = useState<"auto" | "custom">(
    store.stylePreferences.additionalNotes ? "custom" : "auto"
  );
  const previewScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll preview to the relevant section when step changes
  useEffect(() => {
    const el = previewScrollRef.current;
    if (!el) return;
    // Scroll targets per step (IDs used in layouts)
    const sectionMap: Record<number, string> = {
      1: 'home',
      2: 'couple',
      3: 'date',
      4: 'gallery',
      5: 'home',
    };
    const targetId = sectionMap[store.step];
    if (!targetId) return;
    // Small timeout to let new section render
    const timer = setTimeout(() => {
      const section = el.querySelector(`#${targetId}`) as HTMLElement | null;
      if (section) {
        el.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
      } else {
        // fallback: if no ID found, scroll to a proportional position
        const scrollTargets: Record<number, number> = { 1: 0, 2: 0.3, 3: 0.55, 4: 0.7, 5: 0 };
        el.scrollTo({ top: el.scrollHeight * (scrollTargets[store.step] || 0), behavior: 'smooth' });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [store.step]);

  const [customMusicUrl, setCustomMusicUrl] = useState(
    store.stylePreferences.musicUrl && store.stylePreferences.musicUrl !== "custom" &&
    store.stylePreferences.musicUrl !== "" &&
    store.stylePreferences.musicUrl !== "/music/Epic Spectrum - Sky Clearing (freetouse.com).mp3"
      ? store.stylePreferences.musicUrl
      : ""
  );

  useEffect(() => {
    if (typeof window !== "undefined" && session?.user?.role === 'ADMIN') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === 'staging.sahinaja.com') {
        setIsAdminBypass(true);
      }
    }
  }, [session]);

  useEffect(() => {
    if (session === null) {
      router.push("/auth/signin");
    }
  }, [session, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get("plan");
      if (planParam) {
        store.setTargetTier(planParam as any);
        document.cookie = `selected_plan=${planParam}; path=/; max-age=86400`;
        setShowPlanSelection(false);
      }
    }
  }, []);


  const handleGenerateAI = async () => {
    store.setIsGenerating(true);
    try {
      const response = await fetch("/api/invitations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...store.coupleDetails,
          ...store.eventDetails,
          ...store.stylePreferences,
          invitationId: new URLSearchParams(window.location.search).get("edit") || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memproses data");
      store.setGeneratedInvitation(data.data);
      showToast("success", "Teks berhasil di-generate!");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!store.generatedInvitation) {
       showToast("error", "Silakan generate teks undangan terlebih dahulu");
       return;
    }
    store.setIsSaving(true);
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          musicUrl: store.stylePreferences.musicUrl === "custom" ? customMusicUrl.trim() : store.stylePreferences.musicUrl,
          videoUrl: store.stylePreferences.videoUrl,
          schedule: store.eventDetails.schedule,
          loveStory: store.eventDetails.loveStory,
          digitalGifts: store.eventDetails.digitalGifts,
          quotes: store.eventDetails.quotes,
          qrEnabled: store.qrEnabled,
          tier: store.targetTier,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal menyimpan");

      const isOwner = session?.user?.role !== "ADMIN";
      
      if (isOwner) {
        showToast("success", "Undangan disimpan! Menyiapkan tagihan...");
        try {
          await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: store.targetTier, invitationId: data.data.id }),
          });
        } catch (err) {
          console.error("Failed to pre-create checkout:", err);
        }
        setTimeout(() => {
          store.reset();
          document.cookie = "selected_plan=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          window.location.href = `/checkout?plan=${store.targetTier}&invitationId=${data.data.id}`;
        }, 1500);
        return;
      }
      showToast("success", "Undangan disimpan! Mengalihkan...");
      setTimeout(() => { 
        store.reset();
        document.cookie = "selected_plan=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = `/invitation/${data.data.slug}`; 
      }, 1500);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      store.setIsSaving(false);
    }
  };

  const canProceedStep2 = store.coupleDetails.groomName.trim().length >= 2 && store.coupleDetails.brideName.trim().length >= 2;
  const canProceedStep3 = store.eventDetails.eventDate && store.eventDetails.eventTime && store.eventDetails.venueName.trim().length >= 2 && store.eventDetails.venueAddress.trim().length >= 5;

  if (!session) return null;

  const mockInvitation = {
    ...MOCK_INVITATION,
    ...store.generatedInvitation,
    ...store.coupleDetails,
    ...store.eventDetails,
    photoUrls: store.photoUrls,
    headerPhotoUrl: store.headerPhotoUrl,
    groomPhotoUrl: store.groomPhotoUrl,
    bridePhotoUrl: store.bridePhotoUrl,
    tone: store.stylePreferences.tone,
    language: store.stylePreferences.language,
    layout: store.stylePreferences.layout,
    musicUrl: store.stylePreferences.musicUrl === "custom" ? customMusicUrl.trim() : store.stylePreferences.musicUrl,
    videoUrl: store.stylePreferences.videoUrl,
    qrEnabled: store.qrEnabled,
    tier: store.targetTier,
    id: "preview",
    slug: "preview",
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;

  const activeTier = store.targetTier;
  const isFree = false;
  const isBasic = activeTier === "BASIC" && !isAdminBypass;
  const isPremium = activeTier === "PREMIUM" || isAdminBypass;
  const isUltimate = activeTier === "ULTIMATE" || isAdminBypass;

  const hasBasic = true;
  const hasPremium = activeTier === "PREMIUM" || activeTier === "ULTIMATE" || isAdminBypass;
  const hasUltimate = activeTier === "ULTIMATE" || isAdminBypass;

  return (
    <>
      {/* Onboarding Overlay */}
      {store.showOnboarding && (
         <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <Card className="max-w-lg w-full bg-white border-0 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-rose-500" />
             <div className="text-center mb-8">
               <h2 className="text-2xl font-display font-bold text-[#1c1c1c] mb-2">Selamat Datang di Pembuat Undangan Sahinaja</h2>
               <p className="text-sm text-stone-500">Buat undangan pernikahan digital yang indah hanya dalam beberapa langkah mudah. Kami akan memandu Anda setiap saat.</p>
             </div>
             
             <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-8">
               <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Langkah-langkah Pembuatan:</h3>
               <ul className="space-y-3 text-sm text-stone-600">
                 <li className="flex gap-3"><Palette className="w-5 h-5 text-rose-500 shrink-0" /> <span><strong>Pilih Tema</strong> - Menentukan tampilan dasar undangan</span></li>
                 <li className="flex gap-3"><Heart className="w-5 h-5 text-rose-500 shrink-0" /> <span><strong>Data Pasangan</strong> - Mengisi nama mempelai dan orang tua</span></li>
                 <li className="flex gap-3"><Calendar className="w-5 h-5 text-rose-500 shrink-0" /> <span><strong>Detail Acara</strong> - Mengisi tanggal, lokasi, dan agenda</span></li>
                 <li className="flex gap-3"><Camera className="w-5 h-5 text-rose-500 shrink-0" /> <span><strong>Unggah Foto</strong> - Mengunggah foto mempelai dan galeri</span></li>
                 <li className="flex gap-3"><Sparkles className="w-5 h-5 text-rose-500 shrink-0" /> <span><strong>Selesai</strong> - Memilih musik, generate teks AI, & simpan</span></li>
               </ul>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Button onClick={() => store.loadDemoData()} variant="secondary" className="h-auto py-3 whitespace-normal text-left flex flex-col items-start gap-1">
                 <span className="font-bold text-[#1c1c1c]">Gunakan Data Contoh</span>
                 <span className="text-[10px] text-stone-500 font-normal">Memuat data contoh agar pratinjau langsung terisi</span>
               </Button>
               <Button onClick={() => store.dismissOnboarding()} className="h-auto py-3 whitespace-normal text-left flex flex-col items-start gap-1 bg-[#1c1c1c] text-white">
                 <span className="font-bold">Mulai dari Awal</span>
                 <span className="text-[10px] text-stone-300 font-normal">Mengisi formulir kosong secara manual</span>
               </Button>
             </div>
             </Card>
         </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Dynamic Tier Banner */}
        <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between bg-white border border-[#eceae4] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isFree ? 'bg-stone-100 text-stone-500' : isBasic ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'}`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Paket Saat Ini</div>
              <div className="text-sm font-bold text-[#1c1c1c]">{tiers.find(t => t.id === store.targetTier)?.name}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/pricing')} className="text-rose-500 text-xs font-bold">
            Ganti Paket
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="relative mb-12 sm:mb-16 max-w-3xl mx-auto px-4 sm:px-10">
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

        {/* Mobile Tab Navigation */}
        <div className="block lg:hidden flex mb-4 border-b border-[#eceae4] sticky top-0 bg-white z-40 py-2">
          <button onClick={() => store.setActiveMobileTab("form")} className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-all ${store.activeMobileTab === "form" ? 'border-[#1c1c1c] text-[#1c1c1c]' : 'border-transparent text-stone-400'}`}>Isi Form</button>
          <button onClick={() => store.setActiveMobileTab("preview")} className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-all ${store.activeMobileTab === "preview" ? 'border-[#1c1c1c] text-[#1c1c1c]' : 'border-transparent text-stone-400'}`}>Pratinjau</button>
        </div>

        <Card className="bg-white border-[#eceae4] shadow-xl relative overflow-hidden w-full max-w-6xl mx-auto h-[calc(100dvh-140px)] min-h-[600px] mb-8 lg:mt-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 z-10" />
          <div className="flex flex-col lg:flex-row h-full">
          
          {/* FORM COLUMN */}
          <div className={`w-full lg:w-[55%] xl:w-[60%] flex flex-col h-full bg-white relative ${store.activeMobileTab === "form" ? 'flex' : 'hidden lg:flex'}`}>
            <div className="relative w-full h-full overflow-hidden flex-1">
              <AnimatePresence mode="wait">
              {store.step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-0 w-full h-full flex flex-col bg-white">
                    <div className="p-4 sm:p-8 flex-1 overflow-y-auto overscroll-y-contain pb-32 pt-8">
                      <div className="text-center mb-10"><Palette className="h-7 w-7 text-rose-500 mx-auto mb-2" /><h2 className="text-2xl sm:text-3xl font-display font-bold">Pilih Tema</h2></div>
                      <div className="space-y-4">
                        <p className="text-sm text-stone-500 text-center mb-8">Pilih tata letak dan tema dasar undangan Anda. Pratinjau di samping akan langsung menyesuaikan dengan pilihan Anda.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                          {layoutOptions
                            .filter(opt => hasPremium || opt.category === 'klasik')
                            .map((opt) => (
                              <button 
                                key={opt.value} 
                                onClick={() => store.setStylePreferences({ ...store.stylePreferences, layout: opt.value })} 
                                className={`p-3 sm:p-4 border rounded-2xl flex flex-col items-center gap-2.5 transition-all relative ${store.stylePreferences.layout === opt.value ? 'ring-2 ring-rose-500 bg-rose-50/20 border-rose-200' : 'hover:bg-[#fcfbf8] border-[#eceae4]'}`}
                              >
                                <div className={`w-full aspect-[9/16] rounded-lg border-2 ${opt.bg} ${opt.border} shadow-sm`} />
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center break-words w-full px-0.5">{opt.label}</span>
                                {opt.category === 'premium' && (
                                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">PREMIUM</span>
                                )}
                              </button>
                          ))}
                        </div>
                      </div>
                      </div>
                    </motion.div>
              )}

              {store.step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-0 w-full h-full flex flex-col bg-white">
                    <div className="p-4 sm:p-8 flex-1 overflow-y-auto overscroll-y-contain pb-32 pt-8">
                      <div className="text-center mb-10"><Heart className="h-7 w-7 text-rose-500 mx-auto mb-2" /><h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1c1c1c]">Data Pasangan</h2></div>
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <Input label="Nama Lengkap Mempelai Pria" placeholder="Contoh: Nama Lengkap Mempelai Pria" value={store.coupleDetails.groomName} onChange={(e) => store.setCoupleDetails({ ...store.coupleDetails, groomName: e.target.value })} />
                            <p className="text-xs text-stone-500 mt-2">Catatan: Nama lengkap yang akan tampil di halaman depan undangan. Disarankan tanpa gelar.</p>
                          </div>
                          <div>
                            <Input label="Nama Orang Tua Mempelai Pria" placeholder="Bapak [Nama Bapak] & Ibu [Nama Ibu]" value={store.coupleDetails.groomParents} onChange={(e) => store.setCoupleDetails({ ...store.coupleDetails, groomParents: e.target.value })} />
                            <p className="text-xs text-stone-500 mt-2">Catatan: Gunakan format standar: Bapak [Nama] & Ibu [Nama].</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <Input label="Nama Lengkap Mempelai Wanita" placeholder="Contoh: Nama Lengkap Mempelai Wanita" value={store.coupleDetails.brideName} onChange={(e) => store.setCoupleDetails({ ...store.coupleDetails, brideName: e.target.value })} />
                            <p className="text-xs text-stone-500 mt-2">Catatan: Nama lengkap yang akan tampil di halaman depan undangan. Disarankan tanpa gelar.</p>
                          </div>
                          <div>
                            <Input label="Nama Orang Tua Mempelai Wanita" placeholder="Bapak [Nama Bapak] & Ibu [Nama Ibu]" value={store.coupleDetails.brideParents} onChange={(e) => store.setCoupleDetails({ ...store.coupleDetails, brideParents: e.target.value })} />
                            <p className="text-xs text-stone-500 mt-2">Catatan: Gunakan format standar: Bapak [Nama] & Ibu [Nama].</p>
                          </div>
                        </div>
                      </div>
                      </div>
                    </motion.div>
              )}

              {store.step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-0 w-full h-full flex flex-col bg-white">
                    <div className="p-4 sm:p-8 flex-1 overflow-y-auto overscroll-y-contain pb-32 pt-8">
                      <div className="text-center mb-10"><Calendar className="h-7 w-7 text-rose-500 mx-auto mb-2" /><h2 className="text-2xl sm:text-3xl font-display font-bold">Detail Acara</h2></div>
                      
                      {subStep === 1 && (
                        <motion.div key="sub1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                              <Input label="Tanggal Acara" type="date" value={store.eventDetails.eventDate} onChange={(e) => store.setEventDetails({ ...store.eventDetails, eventDate: e.target.value })} icon={<Calendar className="h-5 w-5 text-rose-500" />} />
                              <p className="text-xs text-stone-500 mt-2">Catatan: Tanggal pelaksanaan acara utama pernikahan.</p>
                            </div>
                            <div>
                              <Input label="Waktu Mulai" type="time" value={store.eventDetails.eventTime} onChange={(e) => store.setEventDetails({ ...store.eventDetails, eventTime: e.target.value })} icon={<Clock className="h-5 w-5 text-rose-500" />} />
                              <p className="text-xs text-stone-500 mt-2">Catatan: Jam mulai acara utama (contoh: 09:00).</p>
                            </div>
                          </div>
                          <div>
                            <Input label="Nama Lokasi Acara" placeholder="Contoh: Nama Gedung, Aula, atau Rumah" value={store.eventDetails.venueName} onChange={(e) => store.setEventDetails({ ...store.eventDetails, venueName: e.target.value })} icon={<MapPin className="h-5 w-5 text-rose-500" />} />
                            <p className="text-xs text-stone-500 mt-2">Catatan: Tuliskan nama tempat acara berlangsung dengan jelas.</p>
                          </div>
                          <div>
                            <Textarea label="Alamat Lengkap" placeholder="Contoh: Nama Jalan, Nomor, Kelurahan, Kecamatan, Kota" rows={3} value={store.eventDetails.venueAddress} onChange={(e) => store.setEventDetails({ ...store.eventDetails, venueAddress: e.target.value })} />
                            <p className="text-xs text-stone-500 mt-2">Catatan: Tulis alamat lengkap beserta kota untuk akurasi peta digital.</p>
                          </div>
                        </motion.div>
                      )}

                      {subStep === 2 && (
                        <motion.div key="sub2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Agenda Acara</h3>
                            <Button variant="secondary" size="sm" onClick={() => store.setEventDetails({ ...store.eventDetails, schedule: [...store.eventDetails.schedule, { id: Date.now().toString(), time: '10:00', label: 'Acara Baru', icon: 'clock' }] })}><Plus className="h-4 w-4 mr-2" /> Tambah</Button>
                          </div>
                          <div className="space-y-4">
                            {store.eventDetails.schedule.map((item, index) => (
                              <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-[#fcfbf8] p-4 rounded-2xl border border-[#eceae4]">
                                <Input type="time" value={item.time} onChange={(e) => { const newSchedule = [...store.eventDetails.schedule]; newSchedule[index].time = e.target.value; store.setEventDetails({ ...store.eventDetails, schedule: newSchedule }); }} className="w-full sm:w-32" />
                                <Input value={item.label} onChange={(e) => { const newSchedule = [...store.eventDetails.schedule]; newSchedule[index].label = e.target.value; store.setEventDetails({ ...store.eventDetails, schedule: newSchedule }); }} className="flex-1 w-full" />
                                <div className="flex gap-2 w-full sm:w-auto">
                                  <Select options={iconOptions} value={item.icon} onChange={(e) => { const newSchedule = [...store.eventDetails.schedule]; newSchedule[index].icon = e.target.value as any; store.setEventDetails({ ...store.eventDetails, schedule: newSchedule }); }} className="flex-1 sm:w-32" />
                                  <Button variant="ghost" className="text-red-500" onClick={() => { const newSchedule = store.eventDetails.schedule.filter((_, i) => i !== index); store.setEventDetails({ ...store.eventDetails, schedule: newSchedule }); }}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {subStep === 3 && (
                        <motion.div key="sub3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Kisah Cinta (Opsional)</h3>
                            <Button variant="secondary" size="sm" onClick={() => store.setEventDetails({ ...store.eventDetails, loveStory: [...store.eventDetails.loveStory, { id: Date.now().toString(), year: '2025', title: 'Babak Baru', description: 'Ceritakan kisah Anda...' }] })}><Plus className="h-4 w-4 mr-2" /> Tambah</Button>
                          </div>
                          {!hasPremium && (
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
                              <Lock className="h-5 w-5 mt-0.5 shrink-0" />
                              <p>Fitur Kisah Cinta hanya akan ditampilkan pada undangan jika Anda menggunakan Paket Premium atau Ultimate.</p>
                            </div>
                          )}
                          <div className="space-y-6">
                            {store.eventDetails.loveStory.map((item, index) => (
                              <div key={item.id} className="bg-[#fcfbf8] p-4 sm:p-6 rounded-2xl border border-[#eceae4] relative">
                                <button className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" onClick={() => { const newStory = store.eventDetails.loveStory.filter((_, i) => i !== index); store.setEventDetails({ ...store.eventDetails, loveStory: newStory }); }}><Trash2 className="h-4 w-4" /></button>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                                  <div className="sm:col-span-1"><Input label="Tahun/Waktu" value={item.year} onChange={(e) => { const newStory = [...store.eventDetails.loveStory]; newStory[index].year = e.target.value; store.setEventDetails({ ...store.eventDetails, loveStory: newStory }); }} /></div>
                                  <div className="sm:col-span-3"><Input label="Judul Momen" value={item.title} onChange={(e) => { const newStory = [...store.eventDetails.loveStory]; newStory[index].title = e.target.value; store.setEventDetails({ ...store.eventDetails, loveStory: newStory }); }} /></div>
                                </div>
                                <Textarea label="Cerita" rows={3} value={item.description} onChange={(e) => { const newStory = [...store.eventDetails.loveStory]; newStory[index].description = e.target.value; store.setEventDetails({ ...store.eventDetails, loveStory: newStory }); }} />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {subStep === 4 && (
                        <motion.div key="sub4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">Kado Digital</h3>
                            <Button variant="secondary" size="sm" onClick={() => store.setEventDetails({ ...store.eventDetails, digitalGifts: [...store.eventDetails.digitalGifts, { id: Date.now().toString(), bankName: '', accountNumber: '', accountHolder: '' }] })}><Plus className="h-4 w-4 mr-2" /> Tambah Rekening</Button>
                          </div>
                          <div className="space-y-4">
                            {store.eventDetails.digitalGifts.map((item, index) => (
                              <div key={item.id} className="bg-[#fcfbf8] p-4 sm:p-6 rounded-2xl border border-[#eceae4] relative space-y-4">
                                <button className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" onClick={() => { const newGifts = store.eventDetails.digitalGifts.filter((_, i) => i !== index); store.setEventDetails({ ...store.eventDetails, digitalGifts: newGifts }); }}><Trash2 className="h-4 w-4" /></button>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <Input label="Nama Bank / E-Wallet" placeholder="Contoh: BCA / GoPay" value={item.bankName} onChange={(e) => { const newGifts = [...store.eventDetails.digitalGifts]; newGifts[index].bankName = e.target.value; store.setEventDetails({ ...store.eventDetails, digitalGifts: newGifts }); }} />
                                  <Input label="Nomor Rekening" value={item.accountNumber} onChange={(e) => { const newGifts = [...store.eventDetails.digitalGifts]; newGifts[index].accountNumber = e.target.value; store.setEventDetails({ ...store.eventDetails, digitalGifts: newGifts }); }} />
                                </div>
                                <Input label="Atas Nama" value={item.accountHolder} onChange={(e) => { const newGifts = [...store.eventDetails.digitalGifts]; newGifts[index].accountHolder = e.target.value; store.setEventDetails({ ...store.eventDetails, digitalGifts: newGifts }); }} />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      </div>
                    </motion.div>
              )}

              {store.step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-0 w-full h-full flex flex-col bg-white">
                    <div className="p-4 sm:p-8 flex-1 overflow-y-auto overscroll-y-contain pb-32 pt-8">
                      <div className="text-center mb-10"><Camera className="h-7 w-7 text-rose-500 mx-auto mb-2" /><h2 className="text-2xl sm:text-3xl font-display font-bold">Galeri Foto</h2></div>
                      <div className="space-y-12">
                        <div className="space-y-4">
                          <h3 className="font-bold text-sm flex items-center gap-2">Foto Header / Sampul</h3>
                          {isFree ? (
                            <div className="bg-stone-50 border border-stone-200 p-6 rounded-3xl text-center">
                              <Lock className="h-6 w-6 mx-auto mb-2 text-stone-300" />
                              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Terkunci di Paket Gratis</p>
                              <Button variant="ghost" size="sm" onClick={() => router.push('/pricing')} className="text-rose-500 mt-2 text-xs">Upgrade Paket</Button>
                            </div>
                          ) : (
                            <div className="bg-[#fcfbf8] border-2 border-dashed border-[#eceae4] p-6 rounded-3xl">{store.headerPhotoUrl ? (<div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg"><Image src={store.headerPhotoUrl} alt="H" fill className="object-cover" unoptimized /><button className="absolute top-3 right-3 p-2 bg-white rounded-full text-red-500 shadow-xl" onClick={() => store.setHeaderPhotoUrl('')}><Trash2 className="h-4 w-4" /></button></div>) : (<UploadDropzone endpoint="weddingPhotos" appearance={{ button: 'bg-rose-500 text-[10px] uppercase font-bold tracking-widest px-8 py-2.5 rounded-xl', container: 'p-6 border-none bg-transparent' }} onClientUploadComplete={(res) => { if (res?.[0]) store.setHeaderPhotoUrl(res[0].ufsUrl); }} />)}</div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8"><div className="space-y-4"><h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2"><User className="h-3 w-3 text-blue-400" /> Mempelai Pria</h3><div className="bg-[#fcfbf8] border-2 border-dashed border-[#eceae4] p-4 rounded-3xl min-h-[180px] flex items-center justify-center">{store.groomPhotoUrl ? (<div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md"><Image src={store.groomPhotoUrl} alt="G" fill className="object-cover" unoptimized /><button className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500" onClick={() => store.setGroomPhotoUrl('')}><Trash2 className="h-3.5 w-3.5" /></button></div>) : (<UploadDropzone endpoint="weddingPhotos" appearance={{ button: 'bg-[#1c1c1c] text-[9px] px-4 py-2 rounded-lg', container: 'p-2 border-none bg-transparent' }} onClientUploadComplete={(res) => { if (res?.[0]) store.setGroomPhotoUrl(res[0].ufsUrl); }} />)}</div></div><div className="space-y-4"><h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2"><User className="h-3 w-3 text-pink-400" /> Mempelai Wanita</h3><div className="bg-[#fcfbf8] border-2 border-dashed border-[#eceae4] p-4 rounded-3xl min-h-[180px] flex items-center justify-center">{store.bridePhotoUrl ? (<div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md"><Image src={store.bridePhotoUrl} alt="B" fill className="object-cover" unoptimized /><button className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500" onClick={() => store.setBridePhotoUrl('')}><Trash2 className="h-3.5 w-3.5" /></button></div>) : (<UploadDropzone endpoint="weddingPhotos" appearance={{ button: 'bg-[#1c1c1c] text-[9px] px-4 py-2 rounded-lg', container: 'p-2 border-none bg-transparent' }} onClientUploadComplete={(res) => { if (res?.[0]) store.setBridePhotoUrl(res[0].ufsUrl); }} />)}</div></div></div>

                        <div className="space-y-4">
                          <h3 className="font-bold text-sm flex items-center gap-2">Galeri Foto {isBasic && <span className="text-[10px] text-blue-500 font-normal ml-2">(Maks 3)</span>} {isPremium && !isUltimate && <span className="text-[10px] text-blue-500 font-normal ml-2">(Maks 6)</span>} {isUltimate && <span className="text-[10px] text-blue-500 font-normal ml-2">(Maks 10)</span>}</h3>
                          <div className="space-y-4">
                            {(isBasic && store.photoUrls.length >= 3) ? (
                              <div className="bg-amber-50 p-4 rounded-xl text-[10px] text-amber-600 flex items-center gap-2 border border-amber-100">
                                 <AlertCircle className="h-4 w-4" /> Batas galeri Paket Basic tercapai (3 foto).
                              </div>
                            ) : (isPremium && !isUltimate && store.photoUrls.length >= 6) ? (
                              <div className="bg-amber-50 p-4 rounded-xl text-[10px] text-amber-600 flex items-center gap-2 border border-amber-100">
                                 <AlertCircle className="h-4 w-4" /> Batas galeri Paket Premium tercapai (6 foto).
                              </div>
                            ) : (isUltimate && store.photoUrls.length >= 10) ? (
                              <div className="bg-amber-50 p-4 rounded-xl text-[10px] text-amber-600 flex items-center gap-2 border border-amber-100">
                                 <AlertCircle className="h-4 w-4" /> Batas galeri Paket Ultimate tercapai (10 foto).
                              </div>
                            ) : (
                              <div className="bg-[#fcfbf8] border-2 border-dashed border-[#eceae4] p-8 rounded-3xl">
                                <UploadDropzone endpoint="weddingPhotos" appearance={{ button: 'bg-[#1c1c1c] text-[10px] uppercase font-bold tracking-widest px-8 py-2.5 rounded-xl', container: 'p-4 border-none bg-transparent' }} onClientUploadComplete={(res) => { if (res) res.forEach(f => store.addPhotoUrl(f.ufsUrl)); }} />
                              </div>
                            )}
                              <div className="grid grid-cols-4 gap-2 mt-4">{store.photoUrls.map((u, i) => (<div key={i} className="relative aspect-square rounded-xl overflow-hidden border shadow-sm group"><Image src={u} alt="G" fill className="object-cover group-hover:scale-110 transition-transform" unoptimized /><button className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" onClick={() => store.removePhotoUrl(u)}><Trash2 className="h-3.5 w-3.5 text-white" /></button></div>))}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
              )}

              {store.step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-0 w-full h-full flex flex-col bg-white">
                    <div className="p-4 sm:p-8 flex-1 overflow-y-auto overscroll-y-contain pb-32 pt-8">
                      <div className="text-center mb-10"><Sparkles className="h-7 w-7 text-rose-500 mx-auto mb-2" /><h2 className="text-2xl sm:text-3xl font-display font-bold">Pengaturan Akhir</h2></div>
                      <div className="space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"><Select label="Nuansa Bahasa" options={toneOptions} value={store.stylePreferences.tone} onChange={(e) => store.setStylePreferences({ ...store.stylePreferences, tone: e.target.value as any })} /><Select label="Bahasa" options={languageOptions} value={store.stylePreferences.language} onChange={(e) => store.setStylePreferences({ ...store.stylePreferences, language: e.target.value as any })} /></div>

                        {/* Opening Phrase */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">
                              Kalimat Pembuka <span className="text-stone-300 font-normal">(Opsional)</span>
                            </label>
                            <input
                              type="text"
                              value={store.stylePreferences.openingPhrase || ''}
                              onChange={(e) => store.setStylePreferences({ ...store.stylePreferences, openingPhrase: e.target.value })}
                              placeholder="Contoh: بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ atau Om Swastyastu..."
                              className="w-full px-5 py-4 rounded-2xl bg-[#fcfbf8] border border-[#eceae4] focus:ring-1 focus:ring-stone-300 transition-all text-stone-800 placeholder:text-stone-300 text-sm"
                            />
                            <p className="text-[10px] text-stone-400 mt-2 ml-1">Akan ditampilkan di bagian paling atas undangan dengan gaya yang dipilih.</p>
                          </div>
                          {(store.stylePreferences.openingPhrase || '') && (
                            <div className="grid grid-cols-3 gap-3">
                              {([
                                { id: 'none', label: 'Tanpa Gaya', icon: '—' },
                                { id: 'arabic-calligraphy', label: 'Kaligrafi Arab', icon: '𝓐' },
                                { id: 'latin-elegant', label: 'Teks Elegan', icon: '❦' },
                              ] as const).map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => store.setStylePreferences({ ...store.stylePreferences, openingStyle: opt.id })}
                                  className={`p-3 rounded-2xl text-center text-[10px] font-bold transition-all border ${
                                    (store.stylePreferences.openingStyle || 'none') === opt.id
                                      ? 'bg-[#1c1c1c] text-white border-[#1c1c1c]'
                                      : 'bg-white text-stone-400 border-[#eceae4] hover:border-stone-300'
                                  }`}
                                >
                                  <span className="block text-xl mb-1">{opt.icon}</span>
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>


                        {hasPremium && (
                          <div className="space-y-3">
                            <div className="relative">
                              <Select
                                label="Musik Latar"
                                options={musicOptions}
                                value={store.stylePreferences.musicUrl}
                                onChange={(e) => {
                                  store.setStylePreferences({ ...store.stylePreferences, musicUrl: e.target.value });
                                  if (e.target.value !== "custom") setCustomMusicUrl("");
                                }}
                              />
                            </div>
                            {store.stylePreferences.musicUrl === "custom" && (
                              <div className="space-y-3">
                                {customMusicUrl ? (
                                  <div className="bg-[#fcfbf8] border border-[#eceae4] rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                                        <Music className="h-4 w-4 text-rose-500" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-[#1c1c1c] truncate">
                                          {customMusicUrl.split('/').pop()?.split('?')[0] || 'Musik Kustom'}
                                        </p>
                                        <p className="text-[10px] text-stone-400">Berhasil diunggah</p>
                                      </div>
                                      <button
                                        onClick={() => setCustomMusicUrl('')}
                                        className="text-[10px] text-red-400 hover:text-red-500 font-medium shrink-0"
                                      >
                                        Ganti
                                      </button>
                                    </div>
                                    <audio key={customMusicUrl} controls className="w-full h-10" preload="metadata"><source src={customMusicUrl} type="audio/mpeg" />Browser Anda tidak mendukung audio.</audio>
                                  </div>
                                ) : (
                                  <div className="bg-[#fcfbf8] border-2 border-dashed border-[#eceae4] rounded-2xl overflow-hidden">
                                    <UploadDropzone
                                      endpoint="weddingMusic"
                                      appearance={{ button: 'bg-rose-500 text-[10px] uppercase font-bold tracking-widest px-6 py-2.5 rounded-xl', container: 'p-6 border-none bg-transparent', label: 'text-stone-500 text-xs', allowedContent: 'text-stone-400 text-[10px]' }}
                                      content={{ label: 'Seret file audio ke sini, atau klik untuk memilih', allowedContent: 'MP3, WAV, AAC — Maks 16 MB' }}
                                      onClientUploadComplete={(res) => { if (res?.[0]?.ufsUrl) { setCustomMusicUrl(res[0].ufsUrl); showToast("success", "Musik berhasil diunggah!"); } }}
                                      onUploadError={(err) => { showToast("error", `Gagal mengunggah musik: ${err.message}`); }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {isUltimate && (
                          <div className="space-y-3 pt-4 border-t border-[#eceae4]">
                            <div className="relative">
                              <Input label="Video Embed (YouTube URL) - Opsional" placeholder="https://www.youtube.com/watch?v=..." value={store.stylePreferences.videoUrl || ""} onChange={(e) => store.setStylePreferences({ ...store.stylePreferences, videoUrl: e.target.value })} />
                            </div>
                          </div>
                        )}

                        <div className="pt-6 border-t border-[#eceae4] space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                              <FileText className="h-4 w-4 text-rose-500" /> Teks Undangan
                            </h3>
                            <Button variant="ghost" size="sm" onClick={handleGenerateAI} isLoading={store.isGenerating} className="text-rose-500 hover:bg-rose-50">
                              {!store.isGenerating && <RotateCcw className="h-4 w-4 mr-2" />}
                              {store.generatedInvitation ? 'Ganti Teks (AI)' : 'Generate Teks (AI)'}
                            </Button>
                          </div>

                          <div className="bg-[#fcfbf8] p-1.5 rounded-2xl border border-[#eceae4] flex gap-1">
                            <button type="button" onClick={() => { setAiMode("auto"); store.setStylePreferences({ ...store.stylePreferences, additionalNotes: "" }); }} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${aiMode === "auto" ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>Auto-Generate</button>
                            <button type="button" onClick={() => setAiMode("custom")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${aiMode === "custom" ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>Tulis Petunjuk</button>
                          </div>

                          {aiMode === "custom" && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2 overflow-hidden">
                              <Textarea label="Petunjuk Khusus AI (Opsional)" placeholder="Contoh: Gunakan kutipan pantun di awal, dan sebutkan bahwa acara mengusung adat Sunda." value={store.stylePreferences.additionalNotes || ""} onChange={(e) => store.setStylePreferences({ ...store.stylePreferences, additionalNotes: e.target.value }) } rows={3} />
                            </motion.div>
                          )}

                          {store.generatedInvitation ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                              <Textarea label="Salam Pembuka" value={store.generatedInvitation.greeting} onChange={(e) => store.setGeneratedInvitation({ ...store.generatedInvitation!, greeting: e.target.value })} rows={3} />
                              <Textarea label="Narasi Utama" value={store.generatedInvitation.mainBody} onChange={(e) => store.setGeneratedInvitation({ ...store.generatedInvitation!, mainBody: e.target.value })} rows={5} />
                              <Textarea label="Info Acara" value={store.generatedInvitation.eventInfo} onChange={(e) => store.setGeneratedInvitation({ ...store.generatedInvitation!, eventInfo: e.target.value })} rows={3} />
                              <Textarea label="Salam Penutup" value={store.generatedInvitation.closing} onChange={(e) => store.setGeneratedInvitation({ ...store.generatedInvitation!, closing: e.target.value })} rows={3} />
                            </motion.div>
                          ) : (
                            <div className="bg-[#fcfbf8] border border-[#eceae4] border-dashed rounded-2xl p-8 text-center">
                              <p className="text-sm text-[#5f5f5d]">
                                Klik tombol Generate Teks (AI) untuk membuat teks undangan berdasarkan detail yang telah diisi.
                              </p>
                            </div>
                          )}
                        </div>
                        <Textarea label="Quotes favorit" placeholder="Kutipan kata mutiara..." rows={2} value={store.eventDetails.quotes} onChange={(e) => store.setEventDetails({ ...store.eventDetails, quotes: e.target.value })} />

                        {hasPremium && (
                          <div className="pt-6 border-t border-[#eceae4] flex items-center justify-between bg-stone-50/50 p-6 rounded-3xl border border-stone-200/50">
                            <div className="space-y-1">
                              <label className="text-sm font-bold text-stone-900 block">Fitur QR Code Check-in</label>
                              <p className="text-xs text-stone-500 leading-relaxed max-w-md">Aktifkan kode QR unik untuk pencatatan kehadiran tamu di lokasi.</p>
                            </div>
                            <button type="button" onClick={() => store.setQrEnabled(!store.qrEnabled)} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${store.qrEnabled ? 'bg-emerald-500' : 'bg-stone-200'}`}>
                              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${store.qrEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      </div>
                    </motion.div>
              )}
            </AnimatePresence>
          </div>

          
            {/* CENTRALIZED NAVIGATION FOOTER */}
            <div className={`p-4 sm:px-8 sm:py-5 border-t border-[#eceae4] bg-stone-50 shrink-0 flex ${store.step === 1 ? 'justify-end' : 'flex-col-reverse sm:flex-row justify-between gap-3'} z-10`}>
              {store.step > 1 && (
                <Button 
                  variant="secondary" 
                  className="h-12 sm:h-auto" 
                  onClick={() => {
                    if (store.step === 3 && subStep > 1) {
                      setSubStep(subStep - 1);
                    } else {
                      store.prevStep();
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> 
                  {store.step === 3 && subStep === 1 ? 'Kembali Ke Pasangan' : 'Kembali'}
                </Button>
              )}
              
              {store.step === 1 && (
                <Button onClick={() => store.nextStep()} size="lg" className="w-full sm:w-auto bg-[#1c1c1c] text-white">
                  Lanjut Ke Pasangan <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              {store.step === 2 && (
                <Button onClick={() => store.nextStep()} disabled={!canProceedStep2} size="lg" className="w-full sm:w-auto bg-[#1c1c1c] text-white">
                  Lanjut Ke Acara <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              {store.step === 3 && (
                <Button size="lg" className="h-14 sm:h-auto bg-[#1c1c1c] text-white" onClick={() => subStep < 4 ? setSubStep(subStep + 1) : store.nextStep()} disabled={subStep === 1 && !canProceedStep3}>
                  {subStep === 4 ? 'Lanjut Ke Foto' : 'Lanjut'}
                </Button>
              )}
              {store.step === 4 && (
                <Button size="lg" className="h-14 sm:h-auto bg-[#1c1c1c] text-white" onClick={() => store.nextStep()}>
                  Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              {store.step === 5 && (
                <Button onClick={handleSave} isLoading={store.isSaving} disabled={!store.generatedInvitation} size="lg" className="h-14 sm:h-auto bg-rose-500 hover:bg-rose-600 text-white font-bold tracking-widest transition-all">
                  SIMPAN & BAYAR <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
            
          {/* End of FORM COLUMN */}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-[#eceae4]" />

          {/* PREVIEW COLUMN */}
          <div className={`w-full lg:w-[45%] xl:w-[40%] flex flex-col items-center justify-center bg-[#fcfbf8] relative overflow-hidden ${store.activeMobileTab === "preview" ? 'flex' : 'hidden lg:flex'}`}>
            <div className="w-full h-full p-4 lg:p-8 flex items-center justify-center relative overflow-hidden">
              {/* MOCKUP WRAPPER - Responsive with aspect ratio */}
              <div 
                className="relative mx-auto flex justify-center shrink-0 w-full max-w-[400px]"
                style={{ aspectRatio: '375/812', maxHeight: '100%' }}
              >
                <div 
                  className="relative w-full h-full rounded-[2.5rem] sm:rounded-[3.5rem] border-[8px] sm:border-[12px] border-[#1c1c1c] bg-[#1c1c1c] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] overflow-hidden"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1c1c1c] rounded-b-3xl z-50 flex items-center justify-center">
                    <div className="w-12 h-1 bg-white/10 rounded-full" />
                  </div>
                  <div className="absolute inset-0 bg-white overflow-hidden rounded-[2.5rem]">
                    <IframePreview ref={previewScrollRef} title="Live Preview" className="w-full h-full">
                       <InvitationPreview key={store.stylePreferences.layout} invitation={mockInvitation} isPreview={true} />
                    </IframePreview>
                  </div>
                  {/* Scroll indicator */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-0.5 opacity-60 animate-bounce">
                    <div className="w-4 h-4 border-b-2 border-r-2 border-white/70 rotate-45" />
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      </div>
    </>
  );
}
