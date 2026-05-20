'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, UtensilsCrossed, Gift, Users, X, Loader2, CheckCircle2 } from 'lucide-react';
import { submitLead } from '@/actions/lead';

const VENDOR_CATEGORIES = [
  {
    id: 'venue',
    label: 'Gedung Pernikahan (Venue)',
    description: 'Temukan venue eksklusif untuk hari istimewa Anda',
    icon: Building,
    color: 'rose',
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
    borderColor: 'border-rose-100',
    hoverBorder: 'hover:border-rose-300',
  },
  {
    id: 'catering',
    label: 'Katering & Dekorasi',
    description: 'Sajian lezat dan dekorasi impian yang sempurna',
    icon: UtensilsCrossed,
    color: 'amber',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-100',
    hoverBorder: 'hover:border-amber-300',
  },
  {
    id: 'souvenir',
    label: 'Souvenir Premium',
    description: 'Cendera mata elegan untuk tamu undangan Anda',
    icon: Gift,
    color: 'blue',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-100',
    hoverBorder: 'hover:border-blue-300',
  },
  {
    id: 'mitra',
    label: 'Mitra',
    description: 'Konsultasi dengan WO berpengalaman & terpercaya',
    icon: Users,
    color: 'emerald',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-100',
    hoverBorder: 'hover:border-emerald-300',
  },
];

interface FormData {
  clientName: string;
  phone: string;
  eventDate: string;
  budget: string;
  guestCount: string;
}

export default function EcosystemTeaser() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    clientName: '',
    phone: '',
    eventDate: '',
    budget: '',
    guestCount: '',
  });

  const openModal = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSubmitted(false);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      clientName: form.clientName,
      phone: form.phone,
      eventDate: form.eventDate,
      budget: parseFloat(form.budget) || 0,
      guestCount: parseInt(form.guestCount) || 1,
    };

    const result = await submitLead(payload);

    if (result.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(result.message || 'Terjadi kesalahan, silakan coba lagi.');
    }
    setIsSubmitting(false);
  };

  const categoryLabel = VENDOR_CATEGORIES.find((c) => c.id === selectedCategory)?.label || '';

  return (
    <section id="ecosystem" className="py-16 md:py-24 lg:py-32 px-4 md:px-6 lg:px-8 bg-[#f7f4ed] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-rose-500/3 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-amber-500/3 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-rose-500 mb-4">Ekosistem Terintegrasi</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-[#1c1c1c] tracking-[-0.03em] leading-[1.1] mb-6 text-balance">
            Semua Kebutuhan Pernikahan, <br className="hidden md:block" />
            <span className="text-rose-500 italic font-normal">Satu Titik Akses.</span>
          </h2>
          <p className="text-base md:text-lg text-[#6b6b6b] max-w-2xl mx-auto leading-relaxed">
            Konsultasikan kebutuhan Anda secara gratis. Tim kurator kami akan menghubungkan Anda dengan vendor & WO terbaik di wilayah Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VENDOR_CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -4 }}
                className={`${cat.bg} rounded-2xl p-6 border ${cat.borderColor} ${cat.hoverBorder} transition-all duration-300 flex flex-col cursor-pointer group`}
                onClick={() => openModal(cat.id)}
              >
                <div className={`w-11 h-11 rounded-xl ${cat.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComp className={`h-5 w-5 ${cat.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-[#1c1c1c] mb-1.5">{cat.label}</h3>
                <p className="text-xs text-[#6b6b6b] leading-relaxed mb-5 flex-1">{cat.description}</p>
                <button className="w-full py-2.5 rounded-xl bg-white text-sm font-bold text-[#1c1c1c] border border-[#e8e4db] hover:border-rose-300 hover:text-rose-500 transition-all cursor-pointer">
                  Konsultasi Vendor
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lead Capture Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1c1c1c]/60 backdrop-blur-[4px]"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative bg-[#fdfcf9] rounded-[2rem] p-8 sm:p-10 max-w-lg w-full shadow-2xl border border-rose-500/10 z-10"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5 text-[#8c8885]" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-3">Terima Kasih!</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-xs mx-auto">
                    Tim kurator kami akan segera menghubungi Anda dengan rekomendasi <strong className="text-[#1c1c1c]">{categoryLabel}</strong> terbaik di wilayah Anda.
                  </p>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="mt-8 px-8 py-3 rounded-xl bg-stone-100 text-sm font-bold text-[#1c1c1c] hover:bg-stone-200 transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-rose-500 mb-2">Konsultasi Gratis</p>
                    <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-1">
                      {categoryLabel}
                    </h3>
                    <p className="text-sm text-[#6b6b6b]">Isi form singkat ini, kami akan mencarikan yang terbaik untuk Anda.</p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 mb-5">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-[#4a4745] mb-1 block">Nama Lengkap</label>
                      <input
                        required
                        value={form.clientName}
                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-sm"
                        placeholder="Nama Anda"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#4a4745] mb-1 block">Nomor WhatsApp</label>
                      <input
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-sm"
                        placeholder="+6281234567890"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-[#4a4745] mb-1 block">Tanggal Acara</label>
                        <input
                          required
                          type="date"
                          value={form.eventDate}
                          onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#4a4745] mb-1 block">Jumlah Tamu</label>
                        <input
                          required
                          type="number"
                          value={form.guestCount}
                          onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-sm"
                          placeholder="500"
                          min={1}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#4a4745] mb-1 block">Estimasi Budget (Rp)</label>
                      <input
                        required
                        type="number"
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-sm"
                        placeholder="50000000"
                        min={0}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3.5 rounded-xl bg-rose-gradient text-white text-sm font-bold hover:shadow-lg hover:shadow-rose-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Mengirim...
                        </span>
                      ) : (
                        'Kirim Permintaan Konsultasi'
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
