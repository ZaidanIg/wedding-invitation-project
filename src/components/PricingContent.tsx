'use client';

import React, { useState } from 'react';
import { Check, X, Minus, Star, Sparkles, Heart, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface PricingContentProps {
  invitationId?: string;
}

// ─── Feature Rows ─────────────────────────────────────────────────────────────
// null  = not available (X)
// true  = included (✓)
// string = custom label for that tier

type FeatureValue = boolean | string | null;

interface FeatureCategory {
  category: string;
  rows: {
    label: string;
    basic: FeatureValue;
    premium: FeatureValue;
    ultimate: FeatureValue;
  }[];
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    category: 'Desain & Tampilan',
    rows: [
      { label: 'Tema Undangan',        basic: 'Minimalist',              premium: 'Minimalist + Premium',    ultimate: 'Minimalist + Premium'   },
      { label: 'Galeri Foto',          basic: 'Maks 3 foto',             premium: 'Maks 6 foto',             ultimate: 'Maks 10 foto'           },
      { label: 'Carousel Foto',        basic: null,                      premium: true,                      ultimate: true                     },
      { label: 'Embed Video',          basic: null,                      premium: null,                      ultimate: true                     },
      { label: 'Musik Latar',          basic: null,                      premium: 'Kustom pilihan Anda',     ultimate: 'Kustom pilihan Anda'    },
    ],
  },
  {
    category: 'Manajemen Tamu',
    rows: [
      { label: 'Batas Tamu',           basic: 'Maks 150 tamu',           premium: 'Maks 300 tamu',           ultimate: 'Tidak terbatas'         },
      { label: 'RSVP Online',          basic: null,                      premium: true,                      ultimate: true                     },
      { label: 'Buku Tamu Digital',    basic: null,                      premium: true,                      ultimate: true                     },
      { label: 'WA Blast Otomatis',    basic: null,                      premium: null,                      ultimate: true                     },
      { label: 'Kirim via WhatsApp',   basic: true,                      premium: true,                      ultimate: true                     },
    ],
  },
  {
    category: 'Fitur Acara',
    rows: [
      { label: 'Countdown Pernikahan', basic: null,                      premium: true,                      ultimate: true                     },
      { label: 'Digital Gift / Amplop',basic: true,                      premium: true,                      ultimate: true                     },
      { label: 'AI Teks Undangan',     basic: 'Maks 3× generate',        premium: 'Maks 10× generate',       ultimate: 'Maks 30× generate'      },
    ],
  },
  {
    category: 'Layanan & Dukungan',
    rows: [
      { label: 'Masa Aktif Tautan',    basic: '7 hari setelah acara',    premium: '2 minggu setelah acara',  ultimate: '1 bulan setelah acara'  },
      { label: 'Customer Support',     basic: null,                      premium: true,                      ultimate: 'Prioritas'              },
    ],
  },
];

// ─── Plan Config ──────────────────────────────────────────────────────────────
const PLANS = [
  {
    key: 'BASIC'   as const,
    label:    'Basic',
    price:    'Rp 75.000',
    tagline:  'Untuk memulai dengan elegan',
    icon:     Sparkles,
    iconBg:   'bg-blue-50',
    iconColor:'text-blue-500',
    accent:   'blue',
    cta:      (hasId: boolean) => hasId ? 'Aktifkan Basic'   : 'Pilih Basic',
    ctaClass: 'bg-stone-900 text-white hover:bg-stone-700',
    popular:  false,
  },
  {
    key: 'PREMIUM' as const,
    label:    'Premium',
    price:    'Rp 149.000',
    tagline:  'Lengkap untuk hari istimewa Anda',
    icon:     Heart,
    iconBg:   'bg-rose-50',
    iconColor:'text-rose-500',
    accent:   'rose',
    cta:      (hasId: boolean) => hasId ? 'Aktifkan Premium' : 'Pilih Premium',
    ctaClass: 'bg-rose-gradient text-white hover:shadow-lg hover:shadow-rose-500/30',
    popular:  true,
  },
  {
    key: 'ULTIMATE' as const,
    label:    'Ultimate',
    price:    'Rp 185.000',
    tagline:  'Fitur terlengkap tanpa kompromi',
    icon:     Crown,
    iconBg:   'bg-amber-50',
    iconColor:'text-amber-500',
    accent:   'amber',
    cta:      (hasId: boolean) => hasId ? 'Aktifkan Ultimate': 'Pilih Ultimate',
    ctaClass: 'bg-stone-900 text-white hover:bg-stone-700',
    popular:  false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function FeatureCell({ value, accent }: { value: FeatureValue; accent: string }) {
  const checkColor = accent === 'rose' ? 'text-rose-500' : accent === 'amber' ? 'text-amber-500' : 'text-blue-500';

  if (value === null) {
    return (
      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center">
          <Minus className="w-3 h-3 text-stone-300" />
        </div>
      </div>
    );
  }
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
          accent === 'rose' ? 'bg-rose-50' : accent === 'amber' ? 'bg-amber-50' : 'bg-blue-50'
        }`}>
          <Check className={`w-3 h-3 ${checkColor}`} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <span className={`text-[11px] font-medium text-center leading-tight ${
        accent === 'rose' ? 'text-rose-600' : accent === 'amber' ? 'text-amber-600' : 'text-blue-600'
      }`}>{value}</span>
    </div>
  );
}

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
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Sekali bayar · Tanpa langganan
          </div>
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
                  className={`w-full py-3 px-5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${plan.ctaClass}`}
                >
                  {plan.cta(!!invitationId)}
                </button>
              </div>
            );
          })}
        </motion.div>

        {/* ─── Comparison Table ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-[2rem] overflow-hidden border-white/40 shadow-sm"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1fr_repeat(3,_minmax(0,_1fr))] border-b border-stone-100">
            <div className="p-5 sm:p-6" />
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`p-4 sm:p-6 text-center border-l border-stone-100 ${
                  plan.popular ? 'bg-rose-500/[0.03]' : ''
                }`}
              >
                <p className={`text-xs sm:text-sm font-bold ${
                  plan.popular ? 'text-rose-500' : 'text-[#1c1c1c]'
                }`}>{plan.label}</p>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {FEATURE_CATEGORIES.map((cat, ci) => (
            <div key={cat.category}>
              {/* Category header */}
              <div className="grid grid-cols-[1fr_repeat(3,_minmax(0,_1fr))]">
                <div className="col-span-4 px-5 sm:px-6 py-3 bg-stone-50/60 border-t border-stone-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    {cat.category}
                  </p>
                </div>
              </div>

              {/* Rows */}
              {cat.rows.map((row, ri) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1fr_repeat(3,_minmax(0,_1fr))] ${
                    ri < cat.rows.length - 1 || ci < FEATURE_CATEGORIES.length - 1
                      ? 'border-b border-stone-100/80'
                      : ''
                  } hover:bg-stone-50/50 transition-colors`}
                >
                  {/* Feature label */}
                  <div className="px-5 sm:px-6 py-3.5 flex items-center">
                    <span className="text-xs sm:text-sm text-stone-600">{row.label}</span>
                  </div>

                  {/* Values per plan */}
                  {(
                    [
                      { value: row.basic,   accent: PLANS[0].accent },
                      { value: row.premium, accent: PLANS[1].accent },
                      { value: row.ultimate,accent: PLANS[2].accent },
                    ] as { value: FeatureValue; accent: string }[]
                  ).map((cell, ci2) => (
                    <div
                      key={ci2}
                      className={`px-3 py-3.5 flex items-center justify-center border-l border-stone-100 ${
                        ci2 === 1 ? 'bg-rose-500/[0.03]' : ''
                      }`}
                    >
                      <FeatureCell value={cell.value} accent={cell.accent} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Table footer CTA row */}
          <div className="grid grid-cols-[1fr_repeat(3,_minmax(0,_1fr))] border-t border-stone-100 bg-stone-50/40">
            <div className="p-5 sm:p-6 flex items-center">
              <p className="text-xs text-stone-400 leading-relaxed">
                Semua paket sudah termasuk halaman undangan yang dapat dibagikan via tautan.
              </p>
            </div>
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`p-4 sm:p-6 flex items-center justify-center border-l border-stone-100 ${
                  plan.popular ? 'bg-rose-500/[0.03]' : ''
                }`}
              >
                <button
                  onClick={() => handleSelect(plan.key, `Paket ${plan.label}`)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${plan.ctaClass}`}
                >
                  {plan.cta(!!invitationId)}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Legend ─── */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-rose-50 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-rose-500" />
            </div>
            Termasuk
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-stone-100 flex items-center justify-center">
              <Minus className="w-2.5 h-2.5 text-stone-300" />
            </div>
            Tidak tersedia
          </div>
          <div className="flex items-center gap-2">
            <span className="text-rose-500 font-medium">Teks berwarna</span>
            = Detail fitur
          </div>
        </div>

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
