'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Send, Check, AlertCircle, Sparkles, User, Phone, MessageSquare, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { showToast } from '@/components/ui/Toast';

export default function PublicAttendancePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const [invitation, setInvitation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [result, setResult] = useState<{
    success: boolean;
    guest?: any;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await fetch(`/api/invitations/${params.slug}`);
        const data = await res.json();
        if (data.success) {
          setInvitation(data.data);
        } else {
          showToast('error', 'Gagal memuat detail undangan');
        }
      } catch (error) {
        console.error('Failed to fetch invitation:', error);
        showToast('error', 'Kesalahan server saat memuat undangan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitation();
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch(`/api/invitations/${params.slug}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          attendees,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult({
          success: true,
          guest: data.data,
          message: 'Kehadiran Anda berhasil dicatat!',
        });
        showToast('success', 'Buku tamu berhasil diisi!');
      } else {
        setResult({
          success: false,
          message: data.message || 'Gagal mencatat kehadiran Anda.',
        });
        showToast('error', data.message || 'Gagal mengisi buku tamu.');
      }
    } catch (error) {
      console.error('Attendance submit error:', error);
      setResult({
        success: false,
        message: 'Terjadi kesalahan sistem. Silakan coba kembali.',
      });
      showToast('error', 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfbf8] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#fcfbf8] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-stone-800">Undangan Tidak Ditemukan</h2>
        <p className="text-sm text-stone-500 mt-2">Halaman buku tamu tidak dapat dimuat karena data tidak valid.</p>
        <Button onClick={() => router.push('/')} className="mt-6 bg-stone-800 text-white rounded-xl">
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#fcfbf8] relative flex items-center justify-center py-16 px-4">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.08),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-20 left-10 w-48 h-48 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4af37] bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-200/30">
            Buku Tamu Digital
          </span>
          <h1 className="text-3xl font-display font-bold text-stone-900 mt-4 leading-tight">
            {invitation.groomName} & {invitation.brideName}
          </h1>
          <p className="text-xs text-stone-500 mt-2 font-medium tracking-wide">
            Silakan isi buku tamu di bawah untuk mendaftarkan kehadiran Anda
          </p>
        </div>

        {/* Form or Result view */}
        {!result ? (
          <Card className="bg-white/70 backdrop-blur-md border border-[#eceae4] p-8 sm:p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 ml-1">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-stone-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    required
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-stone-200 focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all text-stone-850 placeholder:text-stone-300 font-medium text-sm"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 ml-1">
                  Nomor WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-stone-300" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    required
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-stone-200 focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all text-stone-850 placeholder:text-stone-300 font-medium text-sm"
                  />
                </div>
              </div>

              {/* Attendees Counter */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2.5 ml-1">
                  Jumlah Tamu Hadir
                </label>
                <div className="flex items-center gap-3">
                  <div className="p-3.5 bg-stone-50 rounded-2xl text-stone-400 border border-stone-100">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1 flex items-center justify-between bg-stone-50 border border-stone-100 rounded-2xl p-1">
                    <button
                      type="button"
                      onClick={() => setAttendees(prev => Math.max(1, prev - 1))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-stone-200 text-stone-600 font-bold transition-all text-lg"
                    >
                      -
                    </button>
                    <span className="font-bold text-stone-800 text-base">{attendees} Orang</span>
                    <button
                      type="button"
                      onClick={() => setAttendees(prev => Math.min(10, prev + 1))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-stone-200 text-stone-600 font-bold transition-all text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Wishes TextArea */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 ml-1">
                  Doa & Ucapan untuk Kedua Mempelai (Opsional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4.5 h-4.5 w-4.5 text-stone-300" />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat atau doa restu Anda..."
                    rows={4}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-stone-200 focus:ring-1 focus:ring-[#d4af37] focus:border-[#d4af37] transition-all text-stone-850 placeholder:text-stone-300 font-medium text-sm resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-[#1c1c1c] text-white rounded-2xl font-bold hover:bg-stone-850 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="h-4.5 w-4.5" />
                )}
                {isSubmitting ? 'Mencatat...' : 'Konfirmasi Kehadiran'}
              </Button>

            </form>
          </Card>
        ) : (
          /* RESULT SCREEN */
          <Card className={`p-8 sm:p-10 rounded-[3rem] text-center shadow-2xl border animate-scale-in bg-white/90 backdrop-blur-md ${result.success ? 'border-emerald-100' : 'border-red-100'}`}>
            <div className="flex justify-center mb-6">
              {result.success ? (
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-500 animate-pulse">
                  <Check className="h-10 w-10 text-emerald-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-500">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
              )}
            </div>

            <h2 className={`text-2xl font-display font-bold mb-3 ${result.success ? 'text-emerald-800' : 'text-red-800'}`}>
              {result.success ? 'Kehadiran Diterima' : 'Gagal Mendaftar'}
            </h2>
            
            <p className="text-xs text-stone-500 mb-6 max-w-xs mx-auto">
              {result.message}
            </p>

            {result.success && result.guest && (
              <div className={`mb-8 p-6 rounded-2xl border text-center inline-block w-full max-w-sm ${result.guest.isVip ? 'bg-amber-50/50 border-amber-200' : 'bg-stone-50 border-stone-150'}`}>
                
                {result.guest.isVip && (
                  <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full border border-amber-200/50 text-[9px] font-extrabold uppercase tracking-widest">
                    <Sparkles className="h-3 w-3 fill-amber-500 text-amber-500" /> VIP Guest
                  </div>
                )}
                
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Nama Tamu</p>
                <p className={`font-bold text-xl ${result.guest.isVip ? 'text-amber-850' : 'text-stone-850'}`}>
                  {result.guest.name}
                </p>
                
                <div className={`h-px my-3.5 ${result.guest.isVip ? 'bg-amber-100' : 'bg-stone-200/50'}`} />
                
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Kategori Hadir</p>
                <p className="text-stone-700 font-bold text-sm uppercase tracking-wider">
                  {result.guest.isVip ? 'VIP' : 'Biasa (Regular)'}
                </p>

                <div className={`h-px my-3.5 ${result.guest.isVip ? 'bg-amber-100' : 'bg-stone-200/50'}`} />
                
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Jumlah Hadir</p>
                <p className="text-stone-700 font-bold text-sm">
                  {result.guest.attendees} Orang
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {result.success ? (
                <Button 
                  onClick={() => router.push(`/invitation/${params.slug}`)} 
                  className="w-full bg-[#1c1c1c] text-white font-bold h-12 rounded-xl"
                >
                  Buka Undangan
                </Button>
              ) : (
                <Button 
                  onClick={() => setResult(null)} 
                  className="w-full bg-red-650 hover:bg-red-750 text-white font-bold h-12 rounded-xl"
                >
                  Coba Lagi
                </Button>
              )}
            </div>
          </Card>
        )}

      </div>
    </section>
  );
}
