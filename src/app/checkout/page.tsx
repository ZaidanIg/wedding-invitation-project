'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Crown, 
  Zap, 
  Heart, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  FileText,
  User
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

declare global {
  interface Window {
    snap: any;
  }
}

// Define Plan Interfaces
interface PlanDetails {
  name: string;
  price: number;
  description: string;
  features: string[];
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
}

const PLANS: Record<string, PlanDetails> = {
  BASIC: {
    name: 'Minimalist Plan',
    price: 75000,
    description: 'Desain minimalis, bersih, dan modern untuk hari bahagia Anda.',
    features: [
      'Desain Klasik & Elegan',
      'Galeri 3 Foto Resolusi Tinggi',
      'Informasi Acara Lengkap',
      'Integrasi Google Maps Aktif',
      'Buku Tamu Digital Standar',
      'Masa Aktif 1 Tahun'
    ],
    icon: <Heart className="h-6 w-6 text-blue-500" />,
    bgClass: 'bg-blue-500/5 border-blue-500/20',
    textClass: 'text-blue-500'
  },
  PREMIUM: {
    name: 'Premium Plan',
    price: 150000,
    description: 'Rekomendasi terbaik dengan fitur interaktif romantis dan kisah cinta Anda.',
    features: [
      'Semua Fitur Minimalist',
      'Galeri 10 Foto Premium',
      'Kisah Cinta Romantis (Love Story)',
      'Countdown Timer Pernikahan',
      'Musik Latar Kustom (Instrumental)',
      'Masa Aktif Selamanya'
    ],
    icon: <Zap className="h-6 w-6 text-rose-500" />,
    bgClass: 'bg-rose-500/5 border-rose-500/20',
    textClass: 'text-rose-500'
  },
  ULTIMATE: {
    name: 'Ultimate Plan',
    price: 250000,
    description: 'Kemewahan tanpa batas dengan integrasi WA Blast & QR Check-in.',
    features: [
      'Semua Fitur Premium',
      'Galeri Foto Tanpa Batas',
      'Sistem QR Code Check-in Tamu',
      'Link Personalisasi Tamu Spesial',
      'Integrasi Layanan WA Blast',
      'Akses Semua Tema Premium'
    ],
    icon: <Crown className="h-6 w-6 text-amber-500" />,
    bgClass: 'bg-amber-500/5 border-amber-500/20',
    textClass: 'text-amber-500'
  },
  PRO_PLAN: {
    name: 'Paket Pro (Bulanan)',
    price: 500000,
    description: 'Sangat cocok untuk Wedding Organizer profesional untuk kelola banyak undangan.',
    features: [
      'Hingga 5 Undangan Aktif/Bulan',
      'Akses Semua Fitur Premium & Ultimate',
      'Manajemen Klien Unggulan',
      'Dashboard Analitik Tamu',
      'White-label (Tanpa Logo Platform)',
      'Uptime Prioritas 99.9%'
    ],
    icon: <Zap className="h-6 w-6 text-purple-500" />,
    bgClass: 'bg-purple-500/5 border-purple-500/20',
    textClass: 'text-purple-500'
  },
  ENTERPRISE: {
    name: 'Enterprise (Seumur Hidup)',
    price: 2500000,
    description: 'Akses tanpa batas selamanya. Solusi white-label mutlak untuk bisnis Anda.',
    features: [
      'Undangan Aktif Tanpa Batas',
      'Akses Fitur Premium Selamanya',
      'White-label Kustom Sempurna',
      'Dukungan API Integrasi WO',
      'Customer Service Prioritas Utama',
      'Lisensi Bisnis Komersial Penuh'
    ],
    icon: <Crown className="h-6 w-6 text-amber-600" />,
    bgClass: 'bg-amber-500/10 border-amber-500/30',
    textClass: 'text-amber-600'
  }
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();

  const planKey = searchParams.get('plan') || 'PREMIUM';
  const invitationId = searchParams.get('invitationId') || '';

  const [invitationData, setInvitationData] = useState<any>(null);
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(false);
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'AUTO'>('AUTO');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId?: string;
    grossAmount?: number;
    paymentType?: string;
  } | null>(null);

  const plan = PLANS[planKey] || PLANS.PREMIUM;

  // Pricing Calculations
  const subtotal = plan.price;
  const ppn = Math.round(subtotal * 0.11); // PPN 11%
  const adminFee = 2500; // Biaya layanan / admin
  const total = subtotal + ppn + adminFee;

  // Protect Route
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/checkout?plan=${planKey}&invitationId=${invitationId}`);
    }
  }, [sessionStatus, router, planKey, invitationId]);

  // Fetch Invitation if invitationId is present
  useEffect(() => {
    if (!invitationId) return;

    const fetchInvitation = async () => {
      setIsLoadingInvitation(true);
      try {
        const response = await fetch(`/api/invitations/${invitationId}`);
        const data = await response.json();
        if (response.ok && data.success) {
          setInvitationData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch invitation:', err);
      } finally {
        setIsLoadingInvitation(false);
      }
    };

    fetchInvitation();
  }, [invitationId]);

  const handleCheckout = async () => {
    if (!agreedToTerms) {
      showToast('error', 'Anda harus menyetujui Ketentuan & Lisensi terlebih dahulu');
      return;
    }

    const confirmed = window.confirm(`Apakah benar Anda akan melanjutkan ke pembayaran untuk ${plan.name}?`);
    if (!confirmed) return;

    setIsCheckoutProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey, invitationId: invitationId || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memproses checkout');
      }

      if (data.success && data.data.token) {
        // Open Midtrans Snap popup directly inline!
        if (typeof window.snap !== 'undefined') {
          window.snap.pay(data.data.token, {
            onSuccess: (result: any) => {
              console.log('Payment success result:', result);
              setPaymentDetails({
                orderId: result.order_id,
                grossAmount: result.gross_amount ? Number(result.gross_amount) : total,
                paymentType: result.payment_type ? result.payment_type.toUpperCase().replace('_', ' ') : 'ONLINE GATEWAY'
              });
              setShowSuccessModal(true);
            },
            onPending: (result: any) => {
              showToast('info', 'Pembayaran tertunda. Silakan selesaikan pembayaran Anda.');
              setTimeout(() => {
                router.push('/dashboard');
              }, 2000);
            },
            onError: (result: any) => {
              showToast('error', 'Gagal memproses pembayaran. Silakan coba lagi.');
            },
            onClose: () => {
              showToast('info', 'Anda menutup jendela pembayaran.');
            }
          });
        } else {
          // Fallback to redirect if snap.js is not loaded
          window.location.href = data.data.redirect_url;
        }
      } else {
        throw new Error('Tidak ada token pembayaran yang diterima');
      }
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Terjadi kesalahan sistem');
    } finally {
      setIsCheckoutProcessing(false);
    }
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const isSandbox = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.startsWith('SB-') ?? true;
  const snapScriptUrl = isSandbox 
    ? 'https://app.sandbox.midtrans.com/snap/snap.js'
    : 'https://app.midtrans.com/snap/snap.js';

  return (
    <div className="min-h-screen bg-[#fdfcf9] pt-24 pb-16">
      <Script 
        src={snapScriptUrl}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#1c1c1c] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        {/* Title */}
        <div className="mb-10">
          <span className="text-rose-500 text-xs font-bold uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Secure Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1c1c1c] mt-3">
            Selesaikan Pemesanan Anda
          </h1>
          <p className="text-sm sm:text-base text-[#6b6b6b] mt-1 font-medium">
            Tinjau detail item, lisensi, dan lakukan pembayaran dengan aman melalui gerbang pembayaran kami.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Details & Agreement */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Item Details Card */}
            <div className="glass rounded-[2rem] p-8 border-white/50 shadow-xl shadow-stone-500/5 relative overflow-hidden bg-white/40">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6b6b6b] tracking-widest block mb-1">PAKET LAYANAN</span>
                  <h2 className="text-2xl font-bold text-[#1c1c1c]">{plan.name}</h2>
                </div>
                <div className={`p-3 rounded-2xl ${plan.bgClass}`}>
                  {plan.icon}
                </div>
              </div>
              <p className="text-sm text-[#6b6b6b] leading-relaxed mb-6 font-medium">
                {plan.description}
              </p>
              
              <div className="h-px bg-stone-200/50 my-6" />

              <h3 className="text-sm font-bold text-[#1c1c1c] uppercase tracking-wider mb-4">FITUR UTAMA YANG DIAPLIKASIKAN:</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex gap-2.5 items-center text-xs text-[#1c1c1c]/70 font-medium">
                    <Check className={`h-4 w-4 shrink-0 ${plan.textClass}`} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalization Info Card (If invitationId exists) */}
            {invitationId && (
              <div className="glass rounded-[2rem] p-8 border-white/50 shadow-xl shadow-stone-500/5 bg-white/40">
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="p-2.5 rounded-xl bg-rose-500/5 text-rose-500">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6b6b6b] tracking-widest block">PERSONALISASI UNDANGAN</span>
                    <h3 className="text-base font-bold text-[#1c1c1c] mt-0.5">Detail Undangan Anda</h3>
                  </div>
                </div>

                {isLoadingInvitation ? (
                  <div className="py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500 mx-auto"></div>
                  </div>
                ) : invitationData ? (
                  <div className="grid sm:grid-cols-2 gap-4 bg-[#fdfcf9]/80 border border-stone-200/40 p-5 rounded-2xl shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wide">Nama Pasangan</span>
                      <p className="text-sm font-bold text-[#1c1c1c]">
                        {invitationData.groomNickname} & {invitationData.brideNickname}
                      </p>
                    </div>
                    {invitationData.eventDate && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wide">Tanggal Acara</span>
                        <p className="text-sm font-semibold text-[#1c1c1c] flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#6b6b6b]" />
                          {new Date(invitationData.eventDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wide">Lokasi Utama</span>
                      <p className="text-xs font-semibold text-[#1c1c1c] flex items-start gap-1.5 line-clamp-2 leading-relaxed">
                        <MapPin className="h-3.5 w-3.5 text-[#6b6b6b] shrink-0 mt-0.5" />
                        {invitationData.venueName} - {invitationData.venueAddress}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-rose-500 font-semibold bg-rose-50 p-4 rounded-xl border border-rose-100 shadow-sm">
                    <AlertCircle className="h-4.5 w-4.5" />
                    Gagal memuat detail data undangan.
                  </div>
                )}
              </div>
            )}

            {/* Terms and License Card */}
            <div className="glass rounded-[2rem] p-8 border-white/50 shadow-xl shadow-stone-500/5 bg-white/40">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="p-2.5 rounded-xl bg-stone-900/5 text-[#1c1c1c]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6b6b6b] tracking-widest block">KETENTUAN LAYANAN</span>
                  <h3 className="text-base font-bold text-[#1c1c1c] mt-0.5">Lisensi & Perjanjian Sahin</h3>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[#fdfcf9] border border-stone-200/50 mt-0.5 shrink-0 shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1c1c1c] mb-0.5">Lisensi Penggunaan Aktif Selamanya</h4>
                    <p className="text-xs text-[#6b6b6b] leading-relaxed font-medium">
                      Undangan digital pernikahan Anda akan di-hosting secara permanen di server cloud kami dan dapat diakses kapan saja tanpa biaya tambahan berkala tersembunyi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[#fdfcf9] border border-stone-200/50 mt-0.5 shrink-0 shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1c1c1c] mb-0.5">Keamanan Data Sensitif Terenkripsi</h4>
                    <p className="text-xs text-[#6b6b6b] leading-relaxed font-medium">
                      Kami menjaga kerahasiaan data pribadi Anda, pasangan, serta daftar RSVP tamu. Enkripsi koneksi SSL 256-bit mutlak aktif di seluruh halaman publik.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[#fdfcf9] border border-stone-200/50 mt-0.5 shrink-0 shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1c1c1c] mb-0.5">Garansi Server Uptime 99.9%</h4>
                    <p className="text-xs text-[#6b6b6b] leading-relaxed font-medium">
                      Infrastruktur berkinerja tinggi kami menjamin akses super cepat bagi seluruh tamu Anda di penjuru Indonesia tanpa lag pada hari perayaan Anda.
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 bg-[#fdfcf9]/80 border border-stone-200/50 rounded-2xl cursor-pointer hover:bg-stone-50/50 transition-all shadow-sm">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                />
                <span className="text-xs text-[#1c1c1c]/80 leading-relaxed font-semibold">
                  Saya memahami dan menyetujui seluruh Ketentuan Layanan, Lisensi Selamanya, serta Kebijakan Privasi yang berlaku pada platform Sahin.
                </span>
              </label>
            </div>

          </div>

          {/* RIGHT COLUMN: Payment Summary */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Payment Summary Card */}
            <div className="glass rounded-[2rem] p-8 border-white/50 shadow-xl shadow-stone-500/5 bg-white/40">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="p-2.5 rounded-xl bg-rose-500/5 text-rose-500">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6b6b6b] tracking-widest block">BILLING INVOICE</span>
                  <h3 className="text-base font-bold text-[#1c1c1c] mt-0.5">Ringkasan Pembayaran</h3>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-[#6b6b6b] font-medium">
                  <span>Subtotal ({plan.name})</span>
                  <span className="text-[#1c1c1c] font-bold">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#6b6b6b] font-medium">
                  <span>PPN / Pajak (11%)</span>
                  <span className="text-[#1c1c1c] font-bold">
                    Rp {ppn.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#6b6b6b] font-medium border-b border-stone-200/50 pb-4">
                  <span>Biaya Admin & Layanan</span>
                  <span className="text-[#1c1c1c] font-bold">
                    Rp {adminFee.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-base text-[#1c1c1c] font-bold pt-2">
                  <span>Total Bayar</span>
                  <span className="text-rose-500 text-lg font-display">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="h-px bg-stone-200/50 my-6" />

              {/* Decorative Payment Methods Selection */}
              <div className="mb-8">
                <span className="text-[10px] uppercase font-bold text-[#6b6b6b] tracking-widest block mb-4">METODE PEMBAYARAN DIKIRIMKAN</span>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setSelectedMethod('AUTO')}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      selectedMethod === 'AUTO' 
                        ? 'border-rose-500/80 bg-rose-500/[0.02] shadow-sm shadow-rose-500/5' 
                        : 'border-stone-200/60 bg-[#fdfcf9] hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#1c1c1c]">Instant Gateway</h4>
                      <p className="text-[9px] text-[#6b6b6b] mt-0.5 font-medium">QRIS, VA, E-Wallet, Kartu</p>
                    </div>
                    <div className="h-4.5 w-4.5 rounded-full border-2 border-rose-500 flex items-center justify-center p-0.5">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                    </div>
                  </button>
                  
                  <div className="flex items-center justify-center p-4 rounded-2xl border border-stone-200/40 bg-[#fdfcf9]/40 opacity-50 select-none cursor-not-allowed">
                    <div>
                      <h4 className="text-xs font-bold text-stone-400">Transfer Manual</h4>
                      <p className="text-[9px] text-stone-400 mt-0.5 font-medium">Proses Verifikasi 2 Jam</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Logos */}
                <div className="mt-4 flex flex-wrap gap-2.5 items-center justify-center p-3 rounded-2xl border border-stone-200/30 bg-[#fdfcf9]/60">
                  {['qris.png', 'gopay.png', 'bca.png', 'mandiri.png', 'shopeepay.png'].map((logo, i) => (
                    <div key={logo} className="text-[10px] text-stone-400 font-semibold px-2 py-0.5 bg-stone-100 rounded-lg border border-stone-200/20">
                      {logo.split('.')[0].toUpperCase()}
                    </div>
                  ))}
                  <span className="text-[9px] text-[#6b6b6b]/60 font-medium ml-1">& 12 Lainnya</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckoutProcessing}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer ${
                  agreedToTerms 
                    ? 'bg-rose-gradient shadow-rose-500/25 hover:shadow-rose-500/45 hover:scale-[1.02]' 
                    : 'bg-stone-300 shadow-none cursor-not-allowed'
                }`}
              >
                {isCheckoutProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Memproses Pembayaran...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Lanjutkan ke Pembayaran
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#6b6b6b]/60 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Semua transaksi dienkripsi & aman.
              </div>
            </div>
            
          </div>
        </div>
      </div>
      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#fdfcf9] border border-stone-200/50 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Decorative gold/rose glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 blur-[50px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full" />

              <div className="relative z-10 text-center">
                {/* Checkmark Icon Container */}
                <div className="mx-auto w-20 h-20 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5">
                  <Check className="h-10 w-10 stroke-[3]" />
                </div>

                <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-2">
                  Pembayaran Berhasil!
                </h3>
                <p className="text-xs text-[#6b6b6b] leading-relaxed font-semibold max-w-xs mx-auto mb-8">
                  Terima kasih! Pembayaran Anda telah kami terima dan diverifikasi secara instan. Paket premium Anda kini telah aktif.
                </p>

                {/* Details Invoice Box */}
                <div className="bg-white border border-stone-200/50 p-6 rounded-2xl text-left space-y-3 shadow-inner mb-8">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#6b6b6b]">Nomor Order</span>
                    <span className="text-[#1c1c1c] font-bold font-mono">
                      {paymentDetails?.orderId || 'ORD-TX-84918'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#6b6b6b]">Paket Aktif</span>
                    <span className="text-rose-500 font-bold">
                      {plan.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#6b6b6b]">Metode Pembayaran</span>
                    <span className="text-[#1c1c1c] font-bold">
                      {paymentDetails?.paymentType || 'ONLINE GATEWAY'}
                    </span>
                  </div>
                  <div className="h-px bg-stone-200/50 my-1" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#1c1c1c]">Total Bayar</span>
                    <span className="text-[#1c1c1c] font-display">
                      Rp {(paymentDetails?.grossAmount || total).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="w-full py-4 rounded-2xl bg-rose-gradient text-white font-bold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all text-sm cursor-pointer"
                  >
                    Masuk ke Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
