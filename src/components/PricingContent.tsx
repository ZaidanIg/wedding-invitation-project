'use client';

import React, { useState } from 'react';
import { Check, X, QrCode, Palette, Globe, Heart, Building2, Sparkles, ArrowRight, Users, CalendarDays, Zap, Crown, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Audience = 'b2c' | 'b2b';

interface PricingContentProps {
  invitationId?: string;
}

export default function PricingContent({ invitationId }: PricingContentProps) {
  const router = useRouter();
  const [audience, setAudience] = useState<Audience>('b2c');

  const handleB2CSelect = (plan: string) => {
    if (invitationId) {
      router.push(`/checkout?plan=${plan}&invitationId=${invitationId}`);
    } else {
      router.push(`/create?plan=${plan}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#f43f5e 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-[#1c1c1c] tracking-[-0.03em] leading-[1.1] mb-6 text-balance">
            Harga yang <span className="text-rose-500 italic font-normal">Transparan</span>
          </h1>
          <p className="text-base md:text-lg text-[#6b6b6b] max-w-xl mx-auto leading-relaxed">
            Pilih paket yang sesuai dengan kebutuhan Anda.
          </p>
        </motion.div>

        {/* Toggle Switcher */}
        <div className="flex justify-center mb-16">
          <div className="relative inline-flex bg-stone-100 rounded-2xl p-1.5 shadow-inner">
            {/* Animated pill background */}
            <motion.div
              layout
              className="absolute top-1.5 bottom-1.5 rounded-[14px] bg-white shadow-md shadow-stone-200/50"
              style={{ width: 'calc(50% - 6px)' }}
              animate={{ x: audience === 'b2c' ? 0 : 'calc(100% + 6px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />

            <button
              onClick={() => setAudience('b2c')}
              className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-[14px] text-sm font-bold transition-colors duration-200 cursor-pointer ${
                audience === 'b2c' ? 'text-rose-500' : 'text-[#8c8885] hover:text-[#4a4745]'
              }`}
            >
              <Heart className="h-3.5 w-3.5" />
              Pasangan Pengantin
            </button>
            <button
              onClick={() => setAudience('b2b')}
              className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-[14px] text-sm font-bold transition-colors duration-200 cursor-pointer ${
                audience === 'b2b' ? 'text-[#1c1c1c]' : 'text-[#8c8885] hover:text-[#4a4745]'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Mitra
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {audience === 'b2c' ? (
            <B2CView key="b2c" onSelect={handleB2CSelect} />
          ) : (
            <B2BView key="b2b" onStart={() => router.push('/auth/signin')} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   B2C VIEW — Elegant Multi-Tier Cards
   ═══════════════════════════════════════════════════════════════════════ */
function B2CView({ onSelect }: { onSelect: (plan: string) => void }) {
  const b2cPlans = [
    {
      id: 'BASIC',
      name: 'Basic Plan',
      price: 'Rp 75.000',
      description: 'Desain minimalis, bersih, dan modern untuk hari bahagia Anda.',
      features: [
        'Desain Klasik & Elegan',
        'Galeri 3 Foto Mempelai',
        'Informasi Acara Lengkap',
        'Integrasi Google Maps Aktif',
        'Buku Tamu Digital Standar',
        'Masa Aktif 1 Tahun'
      ],
      icon: Heart,
      color: 'text-blue-500',
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/10',
      iconBg: 'bg-blue-500/10',
      popular: false,
    },
    {
      id: 'PREMIUM',
      name: 'Premium Plan',
      price: 'Rp 150.000',
      description: 'Rekomendasi terbaik dengan fitur interaktif romantis dan kisah cinta Anda.',
      features: [
        'Semua Fitur Minimalist',
        'Galeri 10 Foto Premium',
        'Kisah Cinta Romantis (Love Story)',
        'Countdown Timer Pernikahan',
        'Musik Latar Kustom (Instrumental)',
        'Masa Aktif Selamanya'
      ],
      icon: Zap,
      color: 'text-rose-500',
      bg: 'bg-rose-500/5',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500/10',
      popular: true,
    },
    {
      id: 'ULTIMATE',
      name: 'Ultimate Plan',
      price: 'Rp 250.000',
      description: 'Kemewahan tanpa batas dengan integrasi WA Blast & QR Check-in.',
      features: [
        'Semua Fitur Premium',
        'Galeri Foto Tanpa Batas',
        'Sistem QR Code Check-in Tamu',
        'Link Personalisasi Tamu Spesial',
        'Integrasi Layanan WA Blast',
        'Akses Semua Tema Premium'
      ],
      icon: Crown,
      color: 'text-amber-500',
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/10',
      iconBg: 'bg-amber-500/10',
      popular: false,
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto items-stretch">
        {b2cPlans.map((plan) => {
          const PlanIcon = plan.icon;
          return (
            <div key={plan.id} className="relative group flex flex-col">
              {plan.popular && (
                <div className="absolute -top-[15px] left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-rose-gradient text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md shadow-rose-500/10">
                    Paling Populer
                  </span>
                </div>
              )}

              {/* Glow effect for popular card */}
              {plan.popular && (
                <div className="absolute -inset-[2px] bg-gradient-to-br from-rose-500/20 to-amber-500/10 rounded-[2.6rem] blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              <div className={`flex flex-col h-full glass rounded-[2.5rem] p-6 sm:p-8 border-white/40 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500 ${
                plan.popular ? 'border-rose-500/20 bg-white/60 shadow-rose-500/5' : 'bg-white/40 shadow-stone-500/5'
              }`}>
                {/* Subtle shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-rose-50/0 via-stone-50/20 to-rose-50/0" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${plan.iconBg}`}>
                      <PlanIcon className={`h-5 w-5 ${plan.color}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-[#1c1c1c]">{plan.name}</h3>
                      <p className="text-[9px] uppercase tracking-widest text-[#8c8885] font-bold">Paket Mandiri</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mt-2 mb-3">
                    <span className="text-3xl font-display font-bold text-[#1c1c1c]">{plan.price}</span>
                    <span className="text-xs text-[#8c8885] font-medium">/undangan</span>
                  </div>
                  <p className="text-[11px] text-[#6b6b6b] leading-relaxed mb-6 font-medium">
                    {plan.description}
                  </p>

                  <div className="h-px bg-stone-200/50 my-2" />

                  {/* Features List */}
                  <div className="space-y-3.5 my-6 flex-1">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.iconBg}`}>
                          <Check className={`h-3 w-3 ${plan.color}`} />
                        </div>
                        <span className="text-xs text-[#1c1c1c] font-medium leading-normal">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => onSelect(plan.id)}
                    className={`group/btn w-full py-4 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      plan.popular
                        ? 'bg-rose-gradient text-white shadow-lg shadow-rose-500/15 hover:shadow-rose-500/30'
                        : 'bg-[#1c1c1c] text-white hover:bg-stone-800'
                    }`}
                  >
                    Buat Undangan Sekarang
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-[#8c8885] pt-4">
        Butuh bantuan memilih? Konsultasikan kebutuhan Anda melalui{' '}
        <a href="/contact" className="text-rose-500 font-bold hover:underline">
          Tim Layanan
        </a>.
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   B2B VIEW — Dashboard + Add-on Menu (2-column)
   ═══════════════════════════════════════════════════════════════════════ */
function B2BView({ onStart }: { onStart: () => void }) {
  const dashboardFeatures = [
    'Manajemen proyek klien tanpa batas',
    'Pembuatan akun pengantin otomatis',
    'Kapasitas tamu tanpa batasan kuota',
    'Unggah aset visual tak terbatas',
    'Pemantauan status RSVP terpusat',
  ];

  const dashboardLocks = [
    'Identitas visual Sahinaja aktif',
    'Fitur pemindaian hari-H terkunci',
  ];

  const addOns = [
    {
      name: 'D-Day QR Scanner',
      desc: 'Pemindai kehadiran tamu instan di lokasi acara',
      price: 'Rp 50.000',
      bg: 'bg-rose-50/60',
      border: 'border-rose-100',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-500',
      priceColor: 'text-rose-500',
      icon: QrCode,
    },
    {
      name: 'Hapus Identitas Merek',
      desc: 'Label merek Sahinaja sepenuhnya dihilangkan',
      price: 'Rp 75.000',
      bg: 'bg-amber-50/60',
      border: 'border-amber-100',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      priceColor: 'text-amber-600',
      icon: Palette,
    },
    {
      name: 'Domain Khusus',
      desc: 'Undangan tampil di domain agensi Anda',
      price: 'Rp 150.000',
      bg: 'bg-blue-50/60',
      border: 'border-blue-100',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      priceColor: 'text-blue-600',
      icon: Globe,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto"
    >
      {/* Card 1: Dashboard Agensi (Free) */}
      <div className="glass rounded-[2.5rem] p-8 sm:p-9 flex flex-col border-white/40 shadow-sm shadow-[#1c1c1c]/5 hover:shadow-xl transition-all duration-500 group">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 className="h-5 w-5 text-[#4a4745]" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-[#1c1c1c]">Dashboard Agensi</h3>
            <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Gratis Selamanya</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-8">
          <span className="text-4xl font-display font-bold text-[#1c1c1c]">Rp 0</span>
          <span className="text-sm text-[#8c8885]">/ bulan</span>
        </div>

        <div className="space-y-3 mb-5 flex-1">
          {dashboardFeatures.map((f) => (
            <div key={f} className="flex gap-2.5 text-sm text-[#1c1c1c]">
              <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{f}</span>
            </div>
          ))}

          <div className="pt-4 mt-2 border-t border-stone-200/60">
            <p className="text-[10px] font-bold text-[#8c8885] uppercase tracking-wider mb-2">Fitur Terkunci</p>
            {dashboardLocks.map((f) => (
              <div key={f} className="flex gap-2.5 text-sm text-[#a09d99] mb-2">
                <X className="h-4.5 w-4.5 text-stone-300 shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-2xl bg-[#1c1c1c] text-white text-sm font-bold hover:bg-[#333] transition-all duration-300 cursor-pointer"
        >
          Daftar Gratis Sekarang
        </button>
      </div>

      {/* Card 2: Add-on Menu */}
      <div className="relative group">
        {/* Glow ring */}
        <div className="absolute -inset-[3px] bg-gradient-to-br from-rose-500/20 via-amber-500/15 to-blue-500/20 rounded-[2.6rem] blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative glass rounded-[2.5rem] p-8 sm:p-9 flex flex-col h-full border-rose-500/10 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-[#1c1c1c]">Fitur Tambahan</h3>
              <p className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">Bayar Per-Proyek</p>
            </div>
          </div>

          <p className="text-xs text-[#6b6b6b] leading-relaxed mt-3 mb-8">
            Aktifkan hanya untuk proyek yang memerlukan. Tanpa langganan, tanpa biaya berulang.
          </p>

          <div className="space-y-4 flex-1">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className={`flex items-start gap-3.5 p-4 rounded-xl ${addon.bg} border ${addon.border} transition-all hover:scale-[1.01]`}
              >
                <div className={`w-9 h-9 rounded-lg ${addon.iconBg} flex items-center justify-center shrink-0`}>
                  <addon.icon className={`h-4.5 w-4.5 ${addon.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1c1c1c]">{addon.name}</p>
                  <p className="text-xs text-[#6b6b6b] mt-0.5">{addon.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${addon.priceColor}`}>{addon.price}</p>
                  <p className="text-[10px] text-[#8c8885]">/proyek</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-stone-200/60">
            <button
              onClick={onStart}
              className="group/btn w-full py-3.5 rounded-2xl bg-rose-gradient text-white text-sm font-bold shadow-lg shadow-rose-500/15 hover:shadow-rose-500/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Mulai Gratis, Upgrade Nanti
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-[10px] text-[#8c8885] mt-3">
              Add-on dapat diaktifkan kapan saja dari Dashboard Anda.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
