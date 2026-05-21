'use client';

import React, { useState } from 'react';
import { Check, Star, Zap, Crown, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CheckoutButton from '@/components/CheckoutButton';
import { useRouter } from 'next/navigation';

interface PricingContentProps {
  invitationId?: string;
}

export default function PricingContent({ invitationId }: PricingContentProps) {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    code: 'BASIC' | 'PREMIUM' | 'ULTIMATE' | 'PRO_PLAN' | 'ENTERPRISE';
    label: string;
  } | null>(null);

  const handlePlanSelect = (plan: 'BASIC' | 'PREMIUM' | 'ULTIMATE' | 'PRO_PLAN' | 'ENTERPRISE', planLabel: string) => {
    setSelectedPlan({ code: plan, label: planLabel });
    setModalOpen(true);
  };

  const executePlanSelect = () => {
    if (!selectedPlan) return;
    const { code: plan } = selectedPlan;
    setModalOpen(false);

    if (plan === 'PRO_PLAN' || plan === 'ENTERPRISE') {
      router.push(`/checkout?plan=${plan}`);
      return;
    }

    if (invitationId) {
      router.push(`/checkout?plan=${plan}&invitationId=${invitationId}`);
    } else {
      router.push(`/create?plan=${plan}`);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] py-32 px-4 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/5 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/5 blur-[150px] rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f43f5e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          {/* <h1 className="text-[42px] md:text-[72px] font-display font-bold text-[#1c1c1c] tracking-[-0.03em] leading-[1.1] mb-8 text-balance">
            Satu Sentuhan Indah <br /> Untuk Mengabarkan <span className="text-rose-500 italic font-normal">Hari Istimewa Anda</span>
          </h1> */}
          <p className="text-lg md:text-xl text-[#6b6b6b] max-w-2xl mx-auto leading-relaxed text-balance">
            Temukan paket terbaik untuk mengabadikan momen terindah Anda. <br className="hidden md:block" />
            Tanpa biaya tersembunyi, tanpa langganan—cukup sekali bayar untuk selamanya.
          </p>
        </motion.div>

        {/* B2C Plans */}
        <div className="mb-32 ">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {/* BASIC */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 group border-white/40 shadow-sm shadow-[#1c1c1c]/5">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#1c1c1c] mb-2">Paket Basic</h3>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-display font-bold text-[#1c1c1c]">Rp 75rb</span>
                <span className="text-xs text-[#6b6b6b]">/undangan</span>
              </div>

              <div className="w-full h-px bg-stone-200/60 mb-6" />

              <div className="space-y-3 mb-10 flex-1">
                {[
                  { text: 'Tema Minimalist', ok: true },
                  { text: '3 Foto', ok: true },
                  { text: 'Maks 150 Tamu', ok: true },
                  { text: 'AI Teks Undangan (dengan batasan 3 kali generated', ok: true },
                  { text: 'Digital Gift', ok: true },
                  { text: 'Aktif 7 Hari Setelah Acara', ok: true },
                  { text: 'Musik Latar Belakang', ok: false },
                  { text: 'RSVP', ok: false },
                ].map(({ text, ok }) => (
                  <div key={text} className={`flex gap-2.5 text-xs ${ok ? 'text-[#1c1c1c]/70' : 'text-[#1c1c1c]/30'}`}>
                    <Check className={`h-4 w-4 shrink-0 ${ok ? 'text-blue-500' : 'text-[#1c1c1c]/20'}`} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanSelect('BASIC', 'Paket Basic')}
                className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 text-white text-sm font-bold text-center hover:bg-stone-800 transition-all duration-300 cursor-pointer"
              >
                {invitationId ? 'Aktifkan Basic' : 'Pilih Basic'}
              </button>
            </motion.div>

            {/* PREMIUM */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-600 rounded-[2.6rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass rounded-[2.5rem] p-8 flex flex-col h-full border-rose-500/20 shadow-xl shadow-rose-500/10 animate-card-glow">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-rose-500 text-white px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-lg shadow-rose-500/25 flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-white" /> Paling Populer
                </div>

                <div className="mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Heart className="h-6 w-6 text-rose-500" fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#1c1c1c] mb-2">Paket Premium</h3>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-display font-bold text-[#1c1c1c]">Rp 149rb</span>
                  <span className="text-xs text-[#6b6b6b]">/undangan</span>
                </div>

                <div className="w-full h-px bg-rose-500/10 mb-6" />

                <div className="space-y-3 mb-10 flex-1">
                  {[
                    { text: 'Semua Tema Minimalist & Premium', ok: true },
                    { text: '6 Foto', ok: true },
                    { text: 'Maks 300 Tamu', ok: true },
                    { text: 'AI Teks Undangan (Regenerasi Bebas)', ok: true },
                    { text: 'Musik Latar Belakang Kustom', ok: true },
                    { text: 'RSVP', ok: true },
                    { text: 'Digital Gift', ok: true },
                    { text: 'Countdown Hari Pernikahan', ok: true },
                    { text: 'Carousel Foto', ok: true },
                    { text: 'Kirim Undangan via WhatsApp', ok: true },
                    { text: 'Customer Support', ok: true },
                    { text: 'Aktif 2 Minggu Setelah Acara', ok: true },
                  ].map(({ text, ok }) => (
                    <div key={text} className="flex gap-2.5 text-xs text-[#1c1c1c]">
                      <Check className={`h-4 w-4 shrink-0 ${ok ? 'text-rose-500' : 'text-[#1c1c1c]/20'}`} />
                      <span className="font-medium">{text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanSelect('PREMIUM', 'Paket Premium')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-rose-gradient text-white text-sm font-bold text-center hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300 scale-105 cursor-pointer"
                >
                  {invitationId ? 'Aktifkan Premium' : 'Pilih Premium'}
                </button>
              </div>
            </motion.div>

            {/* ULTIMATE */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 group border-white/40 shadow-sm shadow-[#1c1c1c]/5">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Crown className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#1c1c1c] mb-2">Paket Ultimate</h3>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-display font-bold text-[#1c1c1c]">Rp 185rb</span>
                <span className="text-xs text-[#6b6b6b]">/undangan</span>
              </div>

              <div className="w-full h-px bg-amber-500/10 mb-6" />

              <div className="space-y-3 mb-10 flex-1">
                {[
                  { text: 'Semua Tema Minimalist & Premium', ok: true },
                  { text: '10 Foto', ok: true },
                  { text: 'Tamu Tak Terbatas', ok: true },
                  { text: 'WA Blast Otomatis', ok: true },
                  { text: 'Musik Latar Belakang Kustom', ok: true },
                  { text: 'AI Teks Undangan', ok: true },
                  { text: 'RSVP', ok: true },
                  { text: 'Digital Gift', ok: true },
                  { text: 'Video Embed', ok: true },
                  { text: 'Buku Tamu Digital Tamu', ok: true },
                  { text: 'Carousel Foto', ok: true },
                  { text: 'Countdown Hari Pernikahan', ok: true },
                  { text: 'Aktif 1 Bulan Setelah Acara', ok: true },
                  { text: 'Priority Customer Support', ok: true },
                ].map(({ text, ok }) => (
                  <div key={text} className="flex gap-2.5 text-xs text-[#1c1c1c]/70">
                    <Check className={`h-4 w-4 shrink-0 ${ok ? 'text-amber-500' : 'text-[#1c1c1c]/20'}`} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanSelect('ULTIMATE', 'Paket Ultimate')}
                className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 text-white text-sm font-bold text-center hover:bg-stone-800 transition-all duration-300 cursor-pointer"
              >
                {invitationId ? 'Aktifkan Ultimate' : 'Pilih Ultimate'}
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* B2B Section - Hidden For Now */}
        {false && (
          <div className="relative pt-32 border-t border-rose-500/10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-[#1c1c1c] mb-4">Untuk Profesional</h2>
              <p className="text-[#6b6b6b]">Paket khusus untuk Wedding Organizer & Agency.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Pro Plan */}
              <motion.div
                whileHover={{ y: -5 }}
                className="glass rounded-[2rem] p-10 border-white/40 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/5 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1c1c1c]">Paket Pro</h3>
                    <p className="text-xs text-[#6b6b6b]">Berlangganan Bulanan</p>
                  </div>
                </div>

                <div className="text-3xl font-display font-bold text-[#1c1c1c] mb-8">
                  Rp 500rb<span className="text-sm text-[#6b6b6b] font-normal"> /bulan</span>
                </div>

                <ul className="space-y-4 mb-10">
                  {['5 Undangan Aktif', 'Masa Aktif Selamanya', 'Manajemen Dashboard Pro'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#1c1c1c]/70">
                      <Check className="h-4 w-4 text-rose-500" /> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect('PRO_PLAN', 'Paket Pro')}
                  className="w-full py-3.5 px-6 rounded-xl border-2 border-rose-500 text-rose-500 font-bold hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Berlangganan Sekarang
                </button>
              </motion.div>

              {/* Enterprise */}
              <motion.div
                whileHover={{ y: -5 }}
                className="glass-dark rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                  <Crown className="h-32 w-32 text-amber-400" />
                </div>

                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Enterprise</h3>
                    <p className="text-xs text-white/50">Seumur Hidup</p>
                  </div>
                </div>

                <div className="text-3xl font-display font-bold text-white mb-8 relative z-10">
                  Rp 2.5jt<span className="text-sm text-white/40 font-normal"> /sekali bayar</span>
                </div>

                <ul className="space-y-4 mb-10 relative z-10">
                  {['Akses Selamanya', 'Tanpa Branding (White-label)', 'Custom Domain Support'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                      <Check className="h-4 w-4 text-amber-400" /> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect('ENTERPRISE', 'Enterprise')}
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-400 text-[#1c1c1c] font-bold hover:bg-amber-300 transition-all duration-300 relative z-10 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  Beli Akses Seumur Hidup
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Premium Confirmation Modal */}
      {modalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[#1c1c1c]/40 backdrop-blur-[4px]"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-[#fdfcf9] rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl border border-rose-500/10 z-10 text-center"
          >
            {/* Pulsing Sparkles Accent */}
            <div className="w-16 h-16 rounded-full bg-rose-500/5 border border-rose-500/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Sparkles className="h-6 w-6 text-rose-500 animate-pulse" />
            </div>

            {/* Modal Title */}
            <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-3">
              Konfirmasi Pilihan Paket
            </h3>

            {/* Description */}
            <p className="text-[#6b6b6b] text-sm leading-relaxed mb-8">
              Apakah Anda yakin ingin memilih paket <strong className="text-rose-500 font-bold">{selectedPlan.label}</strong> untuk hari bahagia Anda?
            </p>

            {/* Custom CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 justify-center">
              <button
                onClick={() => setModalOpen(false)}
                className="py-3.5 px-6 rounded-2xl bg-stone-100 text-[#1c1c1c] text-sm font-bold hover:bg-stone-200 transition-all duration-300 cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={executePlanSelect}
                className="py-3.5 px-8 rounded-2xl bg-rose-gradient text-white text-sm font-bold hover:shadow-lg hover:shadow-rose-500/25 transition-all duration-300 cursor-pointer"
              >
                Ya, Pilih Paket
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Premium Card Glow Animation Style */}
      <style>{`
        @keyframes card-glow {
          0%, 100% {
            box-shadow: 0 20px 25px -5px rgba(244, 63, 94, 0.08), 0 8px 10px -6px rgba(244, 63, 94, 0.08);
            border-color: rgba(244, 63, 94, 0.15);
          }
          50% {
            box-shadow: 0 25px 45px -2px rgba(244, 63, 94, 0.22), 0 12px 22px -3px rgba(244, 63, 94, 0.12);
            border-color: rgba(244, 63, 94, 0.35);
          }
        }
        .animate-card-glow {
          animation: card-glow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
