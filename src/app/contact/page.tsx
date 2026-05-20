'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitLead } from '@/actions/lead';
import { Clock, Mail, Building2, ShieldCheck, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

// Validation Schema for the Contact / Lead Form
const contactSchema = z.object({
  clientName: z.string().min(2, 'Nama lengkap wajib diisi dengan benar.'),
  email: z.string().email('Format alamat email tidak valid.'),
  userType: z.enum(['Mitra', 'Pasangan Pengantin']),
  message: z.string().min(10, 'Pesan terlalu singkat (minimal 10 karakter).'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Format nomor telepon tidak valid.').optional().or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      userType: 'Mitra',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('IDLE');
    setErrorMessage('');

    try {
      const payload = {
        clientName: `[${data.userType}] ${data.clientName} - ${data.email} - Msg: ${data.message.substring(0, 50)}`,
        phone: data.phone || '+62000000000',
        eventDate: new Date().toISOString(),
        budget: 0,
        guestCount: 1,
      };

      const result = await submitLead(payload);

      if (result.success) {
        setSubmitStatus('SUCCESS');
        reset();
      } else {
        setSubmitStatus('ERROR');
        setErrorMessage(result.message || 'Terjadi kesalahan sistem yang menghambat pengiriman pesan Anda.');
      }
    } catch (error) {
      setSubmitStatus('ERROR');
      setErrorMessage('Komunikasi terputus. Silakan periksa jaringan dan coba beberapa saat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-rose-500 mb-4">Layanan Dukungan Perusahaan</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#1c1c1c] tracking-[-0.02em]">
            Hubungi Perwakilan Kami
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
          
          {/* Panel Informasi (Kiri) */}
          <div className="flex flex-col space-y-10">
            <div>
              <h2 className="text-2xl font-display font-bold text-[#1c1c1c] mb-4">Informasi Jam Operasional</h2>
              <p className="text-[#6b6b6b] leading-relaxed text-sm">
                Tim dukungan layanan dan representatif mitra korporat kami siap melayani kebutuhan administratif dan teknis Anda. Waktu pelayanan tunduk pada kalender hari kerja resmi nasional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#eceae4] shadow-sm">
                <Clock className="h-6 w-6 text-rose-500 mb-4" />
                <h3 className="font-bold text-[#1c1c1c] mb-1">Pusat Layanan</h3>
                <p className="text-sm text-[#6b6b6b]">Senin - Jumat<br/>09:00 - 18:00 WIB</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#eceae4] shadow-sm">
                <Mail className="h-6 w-6 text-amber-500 mb-4" />
                <h3 className="font-bold text-[#1c1c1c] mb-1">Korespondensi Surat</h3>
                <p className="text-sm text-[#6b6b6b]">mitra@sahinaja.id<br/>dukungan@sahinaja.id</p>
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 flex gap-4 items-start">
              <div className="mt-1">
                <ShieldCheck className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-[#1c1c1c] mb-2">Peluang Kemitraan Skala Besar</h3>
                <p className="text-sm text-[#4a4745] leading-relaxed mb-4">
                  Bagi entitas layanan pengelolaan acara skala besar yang mencari dukungan kustomisasi infrastruktur tingkat tinggi, layanan kemitraan eksklusif kami menyediakan ruang diskresi operasional khusus di seluruh ranah Indonesia.
                </p>
                <button className="text-sm font-bold text-rose-500 hover:text-rose-600 border-b border-rose-200 hover:border-rose-600 transition-colors cursor-pointer">
                  Hubungi Manajer Pengembangan Bisnis
                </button>
              </div>
            </div>
          </div>

          {/* Panel Form Interaktif (Kanan) */}
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl border border-stone-100 relative overflow-hidden">
            {submitStatus === 'SUCCESS' ? (
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center flex flex-col items-center justify-center min-h-[400px]">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                <h4 className="text-xl font-bold text-[#1c1c1c] mb-2">Permintaan Berhasil Diterima</h4>
                <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-sm">
                  Apresiasi terdalam atas ketertarikan Anda. Perwakilan perusahaan kami segera mengoordinasikan pesan Anda untuk ditindaklanjuti secara seksama pada hari kerja selanjutnya.
                </p>
                <button 
                  onClick={() => setSubmitStatus('IDLE')}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Kirim Pesan Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10 transition-opacity duration-300">
                <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-6">Penjadwalan Diskusi Lanjutan</h3>

                {submitStatus === 'ERROR' && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-red-800">Gangguan Pengiriman</h5>
                      <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#4a4745] uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input 
                      {...register('clientName')}
                      className={`w-full px-4 py-3 rounded-xl bg-[#fcfbf9] border focus:ring-2 focus:ring-rose-400 outline-none transition-all text-sm ${errors.clientName ? 'border-red-400 focus:border-red-400' : 'border-[#e8e4db] focus:border-rose-400'}`}
                      placeholder="Nama Sesuai Tanda Pengenal"
                    />
                    {errors.clientName && <p className="mt-1.5 text-xs text-red-500">{errors.clientName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4a4745] uppercase tracking-wider mb-2">Alamat Email Resmi</label>
                    <input 
                      {...register('email')}
                      type="email"
                      className={`w-full px-4 py-3 rounded-xl bg-[#fcfbf9] border focus:ring-2 focus:ring-rose-400 outline-none transition-all text-sm ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-[#e8e4db] focus:border-rose-400'}`}
                      placeholder="email@korespondensi.com"
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4745] uppercase tracking-wider mb-2">Tipe Identitas</label>
                  <div className="relative">
                    <select 
                      {...register('userType')}
                      className="w-full px-4 py-3 rounded-xl bg-[#fcfbf9] border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="Mitra">Penyedia Jasa</option>
                      <option value="Pasangan Pengantin">Pasangan Pengantin</option>
                    </select>
                    <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c8885] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4745] uppercase tracking-wider mb-2">Nomor Telepon Seluler (Opsional)</label>
                  <input 
                    {...register('phone')}
                    className={`w-full px-4 py-3 rounded-xl bg-[#fcfbf9] border focus:ring-2 focus:ring-rose-400 outline-none transition-all text-sm ${errors.phone ? 'border-red-400 focus:border-red-400' : 'border-[#e8e4db] focus:border-rose-400'}`}
                    placeholder="+62 8xx xxxx xxxx"
                  />
                  {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a4745] uppercase tracking-wider mb-2">Detail Pesan Pendahuluan</label>
                  <textarea 
                    {...register('message')}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl bg-[#fcfbf9] border focus:ring-2 focus:ring-rose-400 outline-none transition-all text-sm resize-none ${errors.message ? 'border-red-400 focus:border-red-400' : 'border-[#e8e4db] focus:border-rose-400'}`}
                    placeholder="Uraikan kebutuhan esensial pelayanan teknis Anda..."
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-rose-gradient text-white text-sm font-bold shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.01] transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Proses Transmisi Berjalan...
                    </>
                  ) : (
                    'Kirim Pengajuan'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
