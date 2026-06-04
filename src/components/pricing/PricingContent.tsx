'use client';

import React, { useState } from 'react';
import { Check, Star, Sparkles, Heart, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface PricingContentProps {
  invitationId?: string;
}

// ─── Plan Config ──────────────────────────────────────────────────────────────
const PLANS = [
  {
    key: 'BASIC'   as const,
    label:    'Basic',
    price:    'Rp 75.000',
    tagline:  'Fitur yang penting sahinaja',
    icon:     Sparkles,
    iconBg:   'bg-blue-50',
    iconColor:'text-blue-500',
    accent:   'blue',
    cta:      (hasId: boolean) => hasId ? 'Aktifkan Basic'   : 'Pilih Basic',
    ctaClass: 'bg-stone-900 text-white hover:bg-stone-700',
    popular:  false,
    features: [
      'Tema Basic',
      'Detail Acara',
      'Galeri foto (maks 3)',
      'Digital Gift / Amplop',
      'Kirim ke 10 nomor WhatsApp',
      'To Do List pernikahan',
      'Masa aktif 7 hari',
      'Costumer Support'
    ],
  },
  {
    key: 'PREMIUM' as const,
    label:    'Premium',
    price:    'Rp 99.000',
    tagline:  'Fitur Lengkap buat kamu Sahinaja',
    icon:     Heart,
    iconBg:   'bg-rose-50',
    iconColor:'text-rose-500',
    accent:   'rose',
    cta:      (hasId: boolean) => hasId ? 'Aktifkan Premium' : 'Pilih Premium',
    ctaClass: 'bg-rose-gradient text-white hover:shadow-lg hover:shadow-rose-500/30',
    popular:  true,
    features: [
      'Akses Semua Tema',
      'Gmaps Lokasi',
      'Detail Acara',
      'Love Story',
      'Digital Gift / Amplop ',
      'Buku Tamu & RSVP Online',
      'QR Code tamu',
      'Bebas Pilih Musik Latar',
      'Galeri foto (maks 6) + Carousel',
      'Kirim ke 30 nomor WhatsApp',
      'To Do List pernikahan',
      'Masa Aktif 14 Hari',
      'Customer Support',
    ],
  },
  {
    key: 'ULTIMATE' as const,
    label:    'Ultimate',
    price:    'Rp 149.000',
    tagline:  'Fitur terlengkap Sahinaja',
    icon:     Crown,
    iconBg:   'bg-amber-50',
    iconColor:'text-amber-500',
    accent:   'amber',
    cta:      (hasId: boolean) => hasId ? 'Aktifkan Ultimate': 'Pilih Ultimate',
    ctaClass: 'bg-stone-900 text-white hover:bg-stone-700',
    popular:  false,
    features: [
      'Akses Semua Tema',
      'Gmaps Lokasi',
      'Detail Acara',
      'Love Story',
      'Digital Gift / Amplop',
      'Buku Tamu & RSVP Online',
      'QR Code tamu',
      'Bebas Pilih Musik Latar',
      'Galerry foto (maks 10) + Carousel',
      'Kirim ke 50 nomor WhatsApp',
      'WhatsApp Blast Otomatis',
      'Embed Video Pernikahan',
      'To Do List pernikahan',
      'Masa Aktif 1 bulan',
      'Customer Support Prioritas',
    ],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PricingContent({ invitationId }: PricingContentProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ key: typeof PLANS[number]['key']; label: string } | null>(null);

  const handleSelect = (key: typeof PLANS[number]['key'], label: string) => {
    setSelectedPlan({ key, label });
    setModalOpen(true);
  };

  const executePlanSelect = () => {
    if (!selectedPlan) return;
    setModalOpen(false);
    if (invitationId) {
      router.push(`/checkout?plan=${selectedPlan.key}&invitationId=${invitationId}`);
    } else {
      document.cookie = `selected_plan=${selectedPlan.key}; path=/; max-age=86400`;
      router.push(`/create?plan=${selectedPlan.key}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-32 pb-24 px-4 relative overflow-hidden">

      {/* ─── Decorative background ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/5 blur-[150px] rounded-full animate-float-delayed" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ─── Hero header ─── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-lg md:text-xl text-[#6b6b6b] max-w-xl mx-auto leading-relaxed">
            Pilih paket yang sesuai. Semua harga sudah mencakup seluruh fitur—
            tanpa biaya tersembunyi.
          </p>
        </motion.div>

        {/* ─── Plan Header Cards ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10"
        >
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.key}
                className={`relative glass rounded-[2rem] p-7 flex flex-col transition-all duration-500 ${
                  plan.popular
                    ? 'border-rose-500/25 shadow-xl shadow-rose-500/10 animate-card-glow'
                    : 'border-white/40 shadow-sm shadow-[#1c1c1c]/5 hover:shadow-lg hover:shadow-[#1c1c1c]/8'
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-7 transform -translate-y-1/2 bg-rose-500 text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md shadow-rose-500/25 flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 fill-white" /> Paling Populer
                  </div>
                )}

                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${plan.iconColor}`} fill={plan.popular ? 'currentColor' : 'none'} />
                  </div>
                  <div>
                    <p className="text-base font-display font-bold text-[#1c1c1c]">{plan.label}</p>
                    <p className="text-[11px] text-[#6b6b6b] leading-tight">{plan.tagline}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-2xl font-display font-bold text-[#1c1c1c]">{plan.price}</span>
                  <span className="text-xs text-[#6b6b6b]">/undangan</span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSelect(plan.key, `Paket ${plan.label}`)}
                  className={`w-full py-3 px-5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer mb-6 ${plan.ctaClass}`}
                >
                  {plan.cta(!!invitationId)}
                </button>

                {/* Quick Features List */}
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#1c1c1c] uppercase tracking-wider mb-4">Fitur Unggulan:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-full p-0.5 ${
                          plan.accent === 'rose' ? 'bg-rose-100 text-rose-500' :
                          plan.accent === 'amber' ? 'bg-amber-100 text-amber-500' :
                          'bg-blue-100 text-blue-500'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm text-[#5f5f5d] leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </motion.div>

      </div>

      {/* ─── Confirmation Modal ─── */}
      {modalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#1c1c1c]/40 backdrop-blur-[4px]"
            onClick={() => setModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-[#fdfcf9] rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl border border-rose-500/10 z-10 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-rose-500/5 border border-rose-500/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-6 w-6 text-rose-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-3">
              Konfirmasi Pilihan
            </h3>
            <p className="text-[#6b6b6b] text-sm leading-relaxed mb-8">
              Anda akan memilih{' '}
              <strong className="text-rose-500">{selectedPlan.label}</strong>.
              Lanjutkan ke halaman pembuatan undangan?
            </p>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 justify-center">
              <button
                onClick={() => setModalOpen(false)}
                className="py-3.5 px-6 rounded-2xl bg-stone-100 text-[#1c1c1c] text-sm font-bold hover:bg-stone-200 transition-all cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={executePlanSelect}
                className="py-3.5 px-8 rounded-2xl bg-rose-gradient text-white text-sm font-bold hover:shadow-lg hover:shadow-rose-500/25 transition-all cursor-pointer"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── Glow animation style ─── */}
      <style>{`
        @keyframes card-glow {
          0%, 100% {
            box-shadow: 0 20px 25px -5px rgba(244,63,94,0.08), 0 8px 10px -6px rgba(244,63,94,0.08);
            border-color: rgba(244,63,94,0.15);
          }
          50% {
            box-shadow: 0 25px 45px -2px rgba(244,63,94,0.22), 0 12px 22px -3px rgba(244,63,94,0.12);
            border-color: rgba(244,63,94,0.35);
          }
        }
        .animate-card-glow {
          animation: card-glow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
