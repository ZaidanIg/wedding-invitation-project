'use client';

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

  const handlePlanSelect = (plan: 'BASIC' | 'PREMIUM' | 'ULTIMATE' | 'DRAFT' | 'PRO_PLAN' | 'ENTERPRISE', planLabel: string) => {
    const confirmed = window.confirm(`Apakah benar Anda akan membeli item ${planLabel} ini?`);
    if (!confirmed) return;

    if (plan === 'DRAFT') {
      router.push(`/create?plan=${plan}`);
      return;
    }

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/5 border border-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Pricing Plans
          </div>
          <h1 className="text-[42px] md:text-[72px] font-display font-bold text-[#1c1c1c] tracking-[-0.03em] leading-[1.1] mb-8 text-balance">
            Investasi untuk Momen <br /> <span className="text-rose-500 italic font-normal">Tak Terlupakan</span>
          </h1>
          <p className="text-lg md:text-xl text-[#6b6b6b] max-w-2xl mx-auto leading-relaxed text-balance">
            Pilih paket yang sesuai dengan impian pernikahan Anda. <br className="hidden md:block" />
            Tanpa biaya langganan, cukup sekali bayar.
          </p>
        </motion.div>

        {/* B2C Plans */}
        <div className="mb-32">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {/* Free Draft */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 group border-white/40">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-stone-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#1c1c1c] mb-2 text-balance">Draft Gratis</h3>
                <p className="text-[#6b6b6b] text-xs leading-relaxed">Eksplorasi desain sepuasnya tanpa risiko.</p>
              </div>
              
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-3xl font-display font-bold text-[#1c1c1c]">Rp 0</span>
                <span className="text-xs text-[#6b6b6b]">/undangan</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {[
                  'Buat Desain dalam 5 Menit',
                  'Preview Tema Klasik',
                  'Ganti Tema Sepuasnya',
                  'Tanpa Kartu Kredit'
                ].map((feature) => (
                  <div key={feature} className="flex gap-2.5 text-xs text-[#1c1c1c]/70">
                    <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/create?plan=DRAFT" className="w-full py-3.5 px-6 rounded-2xl bg-stone-100 text-[#1c1c1c] text-sm font-bold text-center hover:bg-stone-200 transition-all duration-300">
                Mulai Sekarang
              </Link>
            </motion.div>

            {/* Minimalist */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 group border-white/40">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#1c1c1c] mb-2 text-balance">Minimalist</h3>
                <p className="text-[#6b6b6b] text-xs leading-relaxed">Undangan minimalis yang modern dan berkelas.</p>
              </div>
              
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-3xl font-display font-bold text-[#1c1c1c]">Rp 75rb</span>
                <span className="text-xs text-[#6b6b6b]">/undangan</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {[
                  'Hapus Semua Watermark',
                  '2 Foto Mempelai Utama',
                  'Galeri 2 Foto Tambahan',
                  'Navigasi Peta Google Maps',
                  'Semua Pilihan Tema Klasik'
                ].map((feature) => (
                  <div key={feature} className="flex gap-2.5 text-xs text-[#1c1c1c]/70">
                    <Check className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePlanSelect('BASIC', 'Minimalist Plan')} 
                className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 text-white text-sm font-bold text-center hover:bg-stone-800 transition-all duration-300 cursor-pointer"
              >
                {invitationId ? 'Aktifkan Minimalist' : 'Pilih Minimalist'}
              </button>
            </motion.div>

            {/* Premium */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-600 rounded-[2.6rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass rounded-[2.5rem] p-8 flex flex-col h-full border-rose-500/20 shadow-xl shadow-rose-500/10">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-rose-500 text-white px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-lg shadow-rose-500/25 flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-white" /> Paling Populer
                </div>

                <div className="mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Heart className="h-6 w-6 text-rose-500" fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#1c1c1c] mb-2 text-balance">Premium</h3>
                  <p className="text-[#6b6b6b] text-xs leading-relaxed">Sentuhan romantis dan elegan yang lengkap.</p>
                </div>

                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-3xl font-display font-bold text-[#1c1c1c]">Rp 150rb</span>
                  <span className="text-xs text-[#6b6b6b]">/undangan</span>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {[
                    'Semua Fitur Minimalist',
                    'Galeri 10 Foto Premium',
                    'Kisah Cinta (Love Story)',
                    'Countdown Timer Eksklusif',
                    'Musik Latar Belakang Kustom'
                  ].map((feature) => (
                    <div key={feature} className="flex gap-2.5 text-xs text-[#1c1c1c]">
                      <Check className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handlePlanSelect('PREMIUM', 'Premium Plan')} 
                  className="w-full py-3.5 px-6 rounded-2xl bg-rose-gradient text-white text-sm font-bold text-center hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300 scale-105 cursor-pointer"
                >
                  {invitationId ? 'Aktifkan Premium' : 'Pilih Premium'}
                </button>
              </div>
            </motion.div>

            {/* Ultimate */}
            <motion.div variants={itemVariants} className="glass rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 group border-white/40">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6 text-rose-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#1c1c1c] mb-2 text-balance">Ultimate</h3>
                <p className="text-[#6b6b6b] text-xs leading-relaxed">Fitur termewah dengan teknologi modern.</p>
              </div>

              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-3xl font-display font-bold text-[#1c1c1c]">Rp 250rb</span>
                <span className="text-xs text-[#6b6b6b]">/undangan</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {[
                  'Semua Fitur Premium',
                  'Galeri Foto Tanpa Batas',
                  'Sistem QR Check-in Tamu',
                  'Link Personalisasi Tamu',
                  'Integrasi WA Blast',
                  'Akses Semua Tema Premium'
                ].map((feature) => (
                  <div key={feature} className="flex gap-2.5 text-xs text-[#1c1c1c]/70">
                    <Check className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePlanSelect('ULTIMATE', 'Ultimate Plan')} 
                className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 text-white text-sm font-bold text-center hover:bg-stone-800 transition-all duration-300 cursor-pointer"
              >
                {invitationId ? 'Aktifkan Ultimate' : 'Pilih Ultimate'}
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* B2B Section */}
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
      </div>
    </div>
  );
}
