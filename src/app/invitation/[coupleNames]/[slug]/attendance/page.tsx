'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, Check, AlertCircle, User, Phone, MessageSquare, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/Toast';

export default function PublicAttendancePage() {
  const params = useParams<{ coupleNames: string; slug: string }>();
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
    guest?: { name: string; isVip: boolean; attendees: number };
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
      <div className="min-h-screen bg-[#fcfbf8] flex items-center justify-center p-6 w-full">
        <div className="w-full max-w-md bg-white border border-[#eceae4] p-8 rounded-[2.5rem] shadow-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <Skeleton variant="circular" className="w-16 h-16 mx-auto" />
            <Skeleton variant="text" className="w-2/3 h-6 mx-auto" />
            <Skeleton variant="text" className="w-1/2 h-4 mx-auto" />
          </div>
          {/* Form Fields */}
          <Skeleton variant="form" />
          {/* Button */}
          <Skeleton variant="rectangular" className="h-14 w-full rounded-2xl" />
        </div>
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
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-[#eceae4] text-xs focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-300"
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">
                  No. WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-[#eceae4] text-xs focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-300"
                    required
                  />
                </div>
              </div>

              {/* Attendees Count */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">
                  Jumlah Tamu Yang Dibawa *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <select
                    value={attendees}
                    onChange={(e) => setAttendees(Number(e.target.value))}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-[#eceae4] text-xs focus:ring-1 focus:ring-amber-500 outline-none transition-all appearance-none cursor-pointer text-stone-700"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Orang
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">
                  Ucapan & Doa Restu (Opsional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-stone-400" />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat & doa terbaik untuk kedua mempelai..."
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-[#eceae4] text-xs focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none h-24 placeholder:text-stone-300"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-amber-500 text-white rounded-[2rem] font-bold shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all flex items-center justify-center gap-3 text-xs"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Mengirim...' : 'Kirim Buku Tamu'}
              </Button>

            </form>
          </Card>
        ) : (
          <Card className={`bg-white/70 backdrop-blur-md border border-[#eceae4] p-8 sm:p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all`}>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-emerald-100/50 rounded-full flex items-center justify-center mb-4 text-emerald-500 border border-emerald-200">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-display font-bold text-stone-900">
                {result.message}
              </h2>
              <p className="text-xs text-stone-500 mt-1">Terima kasih atas partisipasi Anda.</p>
            </div>

            {result.success && result.guest && (
              <div className="mb-6 p-5 bg-stone-50 border border-stone-100 rounded-2xl text-center space-y-3">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Nama Tamu</p>
                <p className="text-stone-900 font-bold text-lg">{result.guest.name}</p>
                <div className="h-px bg-stone-200/50" />
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Kategori Tamu</p>
                <p className="text-stone-700 font-bold text-xs bg-white border border-stone-150 px-3 py-1 rounded-full inline-block">
                  {result.guest.isVip ? 'VIP' : 'Tamu Biasa'}
                </p>
                <div className="h-px bg-stone-200/50" />
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Jumlah Hadir</p>
                <p className="text-stone-700 font-bold text-sm">
                  {result.guest.attendees} Orang
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {result.success ? (
                <Button
                  onClick={() => router.push(`/invitation/${params.coupleNames}/${params.slug}`)} 
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
