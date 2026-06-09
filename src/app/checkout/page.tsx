'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  Tag,
} from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import Navbar from '@/components/shared/Navbar';

interface SnapPaymentResult {
  order_id?: string;
  gross_amount?: string;
  payment_type?: string;
}

interface InvitationTransaction {
  id: string;
}

interface InvitationData {
  groomName: string;
  brideName: string;
  eventDate?: string;
  venueName?: string;
  venueAddress?: string;
  transactions?: InvitationTransaction[];
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess?: (result: SnapPaymentResult) => void;
        onPending?: (result: SnapPaymentResult) => void;
        onError?: (result: SnapPaymentResult) => void;
        onClose?: () => void;
      }) => void;
    };
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
      'Asisten Teks AI (Maks 3x)',
      'Masa Aktif 1 Tahun'
    ],
    icon: <Heart className="h-6 w-6 text-blue-500" />,
    bgClass: 'bg-blue-500/5 border-blue-500/20',
    textClass: 'text-blue-500'
  },
  PREMIUM: {
    name: 'Premium Plan',
    price: 149000,
    description: 'Rekomendasi terbaik dengan fitur interaktif romantis dan kisah cinta Anda.',
    features: [
      'Semua Fitur Minimalist',
      'Galeri 10 Foto Premium',
      'Kisah Cinta Romantis (Love Story)',
      'Countdown Timer Pernikahan',
      'Musik Latar Kustom (Instrumental)',
      'Asisten Teks AI (Maks 10x)',
      'Masa Aktif Selamanya'
    ],
    icon: <Zap className="h-6 w-6 text-rose-500" />,
    bgClass: 'bg-rose-500/5 border-rose-500/20',
    textClass: 'text-rose-500'
  },
  ULTIMATE: {
    name: 'Ultimate Plan',
    price: 185000,
    description: 'Kemewahan tanpa batas dengan integrasi WA Blast & QR Check-in.',
    features: [
      'Semua Fitur Premium',
      'Galeri Foto Tanpa Batas',
      'Sistem QR Code Check-in Tamu',
      'Link Personalisasi Tamu Spesial',
      'Integrasi Layanan WA Blast',
      'Akses Semua Tema Premium',
      'Asisten Teks AI (Maks 30x)'
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

  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(false);
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'AUTO'>('AUTO');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [checkoutConfirmOpen, setCheckoutConfirmOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId?: string;
    grossAmount?: number;
    paymentType?: string;
  } | null>(null);

  // Promo States
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number; description?: string } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const plan = PLANS[planKey] || PLANS.PREMIUM;

  // Pricing Calculations
  const basePrice = plan.price;
  const subtotal = appliedPromo ? basePrice - appliedPromo.discountAmount : basePrice;
  const ppn = Math.round(subtotal * 0.11); // PPN 11%
  const adminFee = 2500; // Biaya layanan / admin
  const total = subtotal + ppn + adminFee;

  const handleDownloadDraftInvoice = () => {
    const invoiceHtml = `
      <html>
        <head>
          <title>Draft Invoice #${invitationId || 'DRAFT'}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; background: #fff; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); font-size: 16px; line-height: 24px; border-radius: 10px; }
            .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
            .invoice-box table td { padding: 10px; vertical-align: top; }
            .invoice-box table tr td:nth-child(2) { text-align: right; }
            .invoice-box table tr.top table td { padding-bottom: 20px; }
            .invoice-box table tr.top table td.title { font-size: 45px; line-height: 45px; color: #e11d48; font-weight: bold; }
            .invoice-box table tr.information table td { padding-bottom: 40px; }
            .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
            .invoice-box table tr.details td { padding-bottom: 20px; }
            .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
            .invoice-box table tr.item.last td { border-bottom: none; }
            .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; color: #e11d48; }
            .brand { font-size: 28px; font-weight: bold; color: #1c1c1c; }
            .brand span { color: #e11d48; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
            .btn-print { background: #1c1c1c; color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 20px; font-size: 14px; }
            @media print { .btn-print { display: none; } }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
          </div>
          <div class="invoice-box">
            <table>
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <div class="brand">Sahin<span>aja</span></div>
                      </td>
                      <td>
                        Draft Invoice #: ${invitationData?.transactions?.[0]?.id ? invitationData.transactions[0].id : `INV-DRF-${invitationId ? invitationId.slice(0, 8).toUpperCase() : 'NEW'}`}<br />
                        Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                        Status: <strong style="color: #e11d48;">DRAFT INVOICE</strong>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr class="information">
                <td colspan="2">
                  <table>
                    <tr>
                      <td>
                        <strong>Sahinaja Office Address:</strong><br />
                        Jln. Pager betis dsn, Jl. Tenjolaya No.15, RT.03/RW.01<br />
                        Sukagalih, Kec. Sumedang selatan, Kabupaten Sumedang<br />
                        Jawa Barat 45311
                      </td>
                      <td>
                        <strong>Penerima Layanan:</strong><br />
                        ${session?.user?.name || 'Pelanggan Sahinaja'}<br />
                        ${session?.user?.email || '-'}<br />
                        Pasangan: ${invitationData ? `${invitationData.groomName} & ${invitationData.brideName}` : 'Draf Undangan'}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr class="heading">
                <td>Item Deskripsi</td>
                <td>Harga</td>
              </tr>
              <tr class="item">
                <td>Subtotal (${plan.name})</td>
                <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
              </tr>
              <tr class="item">
                <td>PPN / Pajak (11%)</td>
                <td>Rp ${ppn.toLocaleString('id-ID')}</td>
              </tr>
              <tr class="item last">
                <td>Biaya Admin & Layanan</td>
                <td>Rp ${adminFee.toLocaleString('id-ID')}</td>
              </tr>
              <tr class="total">
                <td></td>
                <td>Total Bayar: Rp ${total.toLocaleString('id-ID')}</td>
              </tr>
            </table>
            <div class="footer">
              Terima kasih telah mempercayakan momen bahagia Anda bersama Sahinaja.<br />
              Dokumen ini merupakan draf resmi penawaran sebelum konfirmasi checkout pembayaran.
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
    }
  };

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

  const handleCheckoutTrigger = () => {
    if (!agreedToTerms) {
      showToast('error', 'Anda harus menyetujui Ketentuan & Lisensi terlebih dahulu');
      return;
    }
    setCheckoutConfirmOpen(true);
  };

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) {
      showToast('error', 'Masukkan kode voucher terlebih dahulu');
      return;
    }
    
    setIsApplyingPromo(true);
    try {
      const res = await fetch('/api/checkout/apply-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCodeInput.trim(), plan: planKey }),
      });
      const data = await res.json();
      
      if (data.success) {
        setAppliedPromo({
          code: data.data.promoCode,
          discountAmount: data.data.discountAmount,
          description: data.data.description,
        });
        showToast('success', 'Voucher berhasil digunakan!');
        setPromoCodeInput('');
      } else {
        showToast('error', data.message || 'Gagal menerapkan voucher');
        setAppliedPromo(null);
      }
    } catch (_err) {
      showToast('error', 'Terjadi kesalahan sistem');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    showToast('info', 'Voucher dilepas');
  };

  const executeCheckout = async () => {
    setCheckoutConfirmOpen(false);
    setIsCheckoutProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: planKey, 
          invitationId: invitationId || undefined,
          promoCode: appliedPromo?.code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memproses checkout');
      }

      if (data.success && data.data.token) {
        // Open Midtrans Snap popup directly inline!
        if (typeof window.snap !== 'undefined') {
          window.snap.pay(data.data.token, {
            onSuccess: (result: SnapPaymentResult) => {
              setPaymentDetails({
                orderId: result.order_id,
                grossAmount: result.gross_amount ? Number(result.gross_amount) : total,
                paymentType: result.payment_type ? result.payment_type.toUpperCase().replace('_', ' ') : 'ONLINE GATEWAY'
              });
              setShowSuccessModal(true);
            },
            onPending: () => {
              showToast('info', 'Pembayaran tertunda. Silakan selesaikan pembayaran Anda.');
              setTimeout(() => {
                router.push('/dashboard');
              }, 2000);
            },
            onError: () => {
              showToast('error', 'Gagal memproses pembayaran. Silakan coba lagi.');
            },
            onClose: () => {
              showToast('info', 'Anda menutup jendela pembayaran.');
            }
          });
        } else {
          // Fallback to redirect if snap.js is not loaded
          router.push(data.data.redirect_url as string);
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
              <p className="text-xs text-[#6b6b6b] font-medium mt-1">
                Paket {plan.name} — Rp {plan.price.toLocaleString('id-ID')}
              </p>
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
                        {invitationData.groomName} & {invitationData.brideName}
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
                  <h3 className="text-base font-bold text-[#1c1c1c] mt-0.5">Lisensi & Perjanjian Sahinaja</h3>
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
                  Saya telah membaca dan menyetujui{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-500 underline underline-offset-2 hover:text-rose-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Syarat &amp; Ketentuan Layanan
                  </Link>
                  {' '}serta{' '}
                  <Link
                    href="/terms#privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-500 underline underline-offset-2 hover:text-rose-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Kebijakan Privasi
                  </Link>
                  {' '}yang berlaku pada platform Sahinaja.
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
                    Rp {basePrice.toLocaleString('id-ID')}
                  </span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-sm text-emerald-600 font-bold bg-emerald-50 -mx-4 px-4 py-2 rounded-lg">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> 
                      Diskon Voucher ({appliedPromo.code})
                    </span>
                    <span>
                      - Rp {appliedPromo.discountAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
                
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

              {/* Promo Code Input Block */}
              {!appliedPromo ? (
                <div className="mb-6 bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4">
                  <label className="block text-xs font-bold text-[#6b6b6b] mb-2 uppercase tracking-wide">Punya Kode Voucher?</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Masukkan kode..." 
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-stone-200 rounded-xl px-3 text-sm font-semibold uppercase focus:outline-none focus:border-rose-500 transition-colors"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo}
                      className="bg-[#1c1c1c] hover:bg-[#2c2c2c] text-white px-4 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {isApplyingPromo ? 'Cek...' : 'Terapkan'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block mb-0.5">Voucher Aktif</span>
                    <p className="text-sm font-bold text-emerald-700">{appliedPromo.code}</p>
                  </div>
                  <button onClick={handleRemovePromo} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
                    Hapus
                  </button>
                </div>
              )}

              <div className="mt-4 mb-6">
                <button
                  type="button"
                  onClick={handleDownloadDraftInvoice}
                  className="w-full py-3 rounded-2xl border border-stone-200 text-stone-700 font-bold hover:bg-stone-50 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-stone-500" />
                  Cetak / Unduh Draft Invoice (PDF)
                </button>
              </div>

              <div className="h-px bg-stone-200/50 my-6" />

              {/* Decorative Payment Methods Selection */}
              <div className="mb-8">
                <span className="text-[10px] uppercase font-bold text-[#6b6b6b] tracking-widest block mb-4">METODE PEMBAYARAN</span>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setSelectedMethod('AUTO')}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${selectedMethod === 'AUTO'
                        ? 'border-rose-500/80 bg-rose-500/[0.02] shadow-sm shadow-rose-500/5'
                        : 'border-stone-200/60 bg-[#fdfcf9] hover:bg-stone-50'
                      }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#1c1c1c]">Instant QRIS Gateway</h4>
                      <p className="text-[9px] text-[#6b6b6b] mt-0.5 font-medium">QRIS &amp; GoPay (Verifikasi Instan)</p>
                    </div>
                    <div className="h-4.5 w-4.5 rounded-full border-2 border-rose-500 flex items-center justify-center p-0.5">
                      <div className="h-2 w-2 rounded-full bg-rose-500" />
                    </div>
                  </button>
                </div>

                {/* Decorative Logos */}
                <div className="mt-4 flex flex-wrap gap-2.5 items-center justify-start p-3 rounded-2xl border border-stone-200/30 bg-[#fdfcf9]/60">
                  {['qris.png', 'gopay.png'].map((logo) => (
                    <div key={logo} className="text-[10px] text-stone-400 font-semibold px-2 py-0.5 bg-stone-100 rounded-lg border border-stone-200/20">
                      {logo.split('.')[0].toUpperCase()}
                    </div>
                  ))}
                  <span className="text-[9px] text-[#6b6b6b]/60 font-medium ml-1">Diproses Instan via Midtrans</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handleCheckoutTrigger}
                disabled={isCheckoutProcessing}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer ${agreedToTerms
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

      {/* Custom Checkout Confirmation Modal */}
      <AnimatePresence>
        {checkoutConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-[#fdfcf9] rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl border border-rose-500/10 z-10 text-center"
            >
              {/* Pulsing Shield/Sparkles Accent */}
              <div className="w-16 h-16 rounded-full bg-rose-500/5 border border-rose-500/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-rose-500 animate-pulse" />
              </div>

              {/* Modal Title */}
              <h3 className="text-2xl font-display font-bold text-[#1c1c1c] mb-3">
                Konfirmasi Pembayaran
              </h3>

              {/* Description */}
              <p className="text-[#6b6b6b] text-sm leading-relaxed mb-8">
                Apakah Anda yakin ingin melanjutkan ke proses pembayaran untuk <strong className="text-rose-500 font-bold">{plan.name}</strong> dengan total bayar <strong className="text-stone-900 font-bold">Rp {total.toLocaleString('id-ID')}</strong>?
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 justify-center">
                <button
                  onClick={() => setCheckoutConfirmOpen(false)}
                  className="py-3.5 px-6 rounded-2xl bg-stone-100 text-[#1c1c1c] text-sm font-bold hover:bg-stone-200 transition-all duration-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={executeCheckout}
                  className="py-3.5 px-8 rounded-2xl bg-rose-gradient text-white text-sm font-bold hover:shadow-lg hover:shadow-rose-500/25 transition-all duration-300 cursor-pointer"
                >
                  Ya, Lanjutkan
                </button>
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
