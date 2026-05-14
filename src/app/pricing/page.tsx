import type { Metadata } from 'next';
import { Check, Star, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';

export const metadata: Metadata = {
  title: 'Harga — Wedding Invitation',
  description: 'Pilih paket terbaik untuk undangan pernikahan digital Anda.',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PricingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const invitationId = typeof params?.invitationId === 'string' ? params.invitationId : undefined;

  return (
    <div className="min-h-screen bg-[#f7f4ed] py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-[48px] md:text-[60px] font-display font-bold text-[#1c1c1c] tracking-[-1.5px] leading-tight mb-6">
            Harga Jujur & Transparan
          </h1>
          <p className="text-lg text-[#5f5f5d] max-w-2xl mx-auto leading-[1.38]">
            Buat undangan mewah dalam <span className="text-[#1c1c1c] font-semibold">5 menit</span> dengan harga paling <span className="text-[#1c1c1c] font-semibold">murah</span>. Tanpa biaya tersembunyi.
          </p>
        </div>

        {/* B2C Plans (Couples) */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-[12px] font-bold text-[#1c1c1c]/60 uppercase tracking-[2px] mb-2">Untuk Pasangan</h2>
            <p className="text-[#5f5f5d]">Sekali bayar per undangan. Tanpa biaya langganan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Draft */}
            <div className="bg-[#f7f4ed] rounded-xl p-8 border border-[#eceae4] flex flex-col hover:border-[#1c1c1c]/20 transition-all">
              <h3 className="text-xl font-bold text-[#1c1c1c] mb-2">Draft Gratis</h3>
              <p className="text-[#5f5f5d] mb-6 text-sm">Coba desain sepuasnya sebelum membayar.</p>
              <div className="text-[40px] font-display font-bold text-[#1c1c1c] mb-6">
                Rp 0
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Buat Desain dalam 5 Menit</span>
                </li>
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Preview Semua Tema</span>
                </li>
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Ganti Tema Sepuasnya</span>
                </li>
              </ul>
              <Link href="/create" className="w-full py-3 px-6 rounded-lg bg-[#1c1c1c]/5 text-[#1c1c1c] font-semibold text-center hover:bg-[#1c1c1c]/10 transition">
                Mulai Gratis
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-[#1c1c1c] rounded-xl p-8 shadow-inset border border-[#1c1c1c] flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-[#f7f4ed] text-[#1c1c1c] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#eceae4] shadow-sm flex items-center gap-1">
                <Star className="h-3 w-3 fill-[#1c1c1c]" /> Paling Populer
              </div>
              <h3 className="text-xl font-bold text-[#fcfbf8] mb-2">Premium</h3>
              <p className="text-[#fcfbf8]/60 mb-6 text-sm">Pilihan terbaik untuk kebanyakan pasangan.</p>
              <div className="text-[40px] font-display font-bold text-[#fcfbf8] mb-6">
                Rp 50rb
                <span className="text-lg text-[#fcfbf8]/40 font-normal"> /undangan</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-[#fcfbf8]/80 text-sm">
                  <Check className="h-5 w-5 text-[#fcfbf8]/40 shrink-0" />
                  <span>Hapus Watermark</span>
                </li>
                <li className="flex gap-3 text-[#fcfbf8]/80 text-sm">
                  <Check className="h-5 w-5 text-[#fcfbf8]/40 shrink-0" />
                  <span>Galeri 6 Foto Mewah</span>
                </li>
                <li className="flex gap-3 text-[#fcfbf8]/80 text-sm">
                  <Check className="h-5 w-5 text-[#fcfbf8]/40 shrink-0" />
                  <span>Konfirmasi RSVP Tamu</span>
                </li>
                <li className="flex gap-3 text-[#fcfbf8]/80 text-sm">
                  <Check className="h-5 w-5 text-[#fcfbf8]/40 shrink-0" />
                  <span>Musik Latar Kustom</span>
                </li>
              </ul>
              {invitationId ? (
                <CheckoutButton 
                  plan="PREMIUM" 
                  invitationId={invitationId}
                  className="w-full py-3 px-6 rounded-lg bg-[#fcfbf8] text-[#1c1c1c] font-bold text-center hover:opacity-90 transition shadow-focus"
                >
                  Aktifkan Sekarang
                </CheckoutButton>
              ) : (
                <Link href="/create" className="w-full py-3 px-6 block rounded-lg bg-[#fcfbf8] text-[#1c1c1c] font-bold text-center hover:opacity-90 transition shadow-focus">
                  Mulai Buat Undangan
                </Link>
              )}
            </div>

            {/* Ultimate */}
            <div className="bg-[#f7f4ed] rounded-xl p-8 border border-[#eceae4] flex flex-col hover:border-[#1c1c1c]/20 transition-all">
              <h3 className="text-xl font-bold text-[#1c1c1c] mb-2">Ultimate</h3>
              <p className="text-[#5f5f5d] mb-6 text-sm">Fitur terlengkap untuk hari spesial Anda.</p>
              <div className="text-[40px] font-display font-bold text-[#1c1c1c] mb-6">
                Rp 100rb
                <span className="text-lg text-[#5f5f5d]/40 font-normal"> /undangan</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Galeri 10 Foto Mewah</span>
                </li>
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Semua Fitur Premium</span>
                </li>
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Dukungan Prioritas</span>
                </li>
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Fitur Angpao Digital</span>
                </li>
              </ul>
              {invitationId ? (
                <CheckoutButton 
                  plan="ULTIMATE" 
                  invitationId={invitationId}
                  className="w-full py-3 px-6 rounded-lg bg-[#1c1c1c]/5 text-[#1c1c1c] font-semibold text-center hover:bg-[#1c1c1c]/10 transition"
                >
                  Pilih Paket Ultimate
                </CheckoutButton>
              ) : (
                <Link href="/create" className="w-full py-3 px-6 block rounded-lg bg-[#1c1c1c]/5 text-[#1c1c1c] font-semibold text-center hover:bg-[#1c1c1c]/10 transition">
                  Pilih Paket Ultimate
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* B2B Plans (Organizers) */}
        <div className="pt-24 border-t border-[#eceae4]">
          <div className="text-center mb-12">
            <h2 className="text-[12px] font-bold text-[#1c1c1c]/60 uppercase tracking-[2px] mb-2">Untuk Organizer & Kreator</h2>
            <p className="text-[#5f5f5d]">Paket khusus untuk Wedding Organizer dengan volume tinggi.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pro Plan */}
            <div className="bg-[#f7f4ed] rounded-xl p-8 border border-[#eceae4] flex flex-col hover:border-[#1c1c1c]/20 transition-all">
              <div className="inline-flex p-3 rounded-full bg-[#1c1c1c]/5 w-fit mb-6">
                <Zap className="h-6 w-6 text-[#1c1c1c]" />
              </div>
              <h3 className="text-xl font-bold text-[#1c1c1c] mb-2">Paket Pro</h3>
              <p className="text-[#5f5f5d] mb-6 text-sm">Langganan bulanan untuk WO aktif.</p>
              <div className="text-[40px] font-display font-bold text-[#1c1c1c] mb-6">
                Rp 200rb
                <span className="text-lg text-[#5f5f5d]/40 font-normal"> /bulan</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-[#1c1c1c]/40 shrink-0" />
                  <span>Unlimited Pembuatan Undangan</span>
                </li>
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-[#1c1c1c]/40 shrink-0" />
                  <span>Masa Aktif Selamanya</span>
                </li>
                <li className="flex gap-3 text-[#5f5f5d] text-sm">
                  <Check className="h-5 w-5 text-[#1c1c1c]/40 shrink-0" />
                  <span>Max 6 Foto per Undangan</span>
                </li>
              </ul>
              <CheckoutButton 
                plan="PRO_PLAN"
                className="w-full py-3 px-6 rounded-lg bg-[#1c1c1c]/5 text-[#1c1c1c] font-semibold text-center hover:bg-[#1c1c1c]/10 transition"
              >
                Berlangganan Sekarang
              </CheckoutButton>
            </div>

            {/* All-Time */}
            <div className="bg-[#1c1c1c] rounded-xl p-8 shadow-inset border border-[#1c1c1c] flex flex-col">
              <div className="inline-flex p-3 rounded-full bg-[#fcfbf8]/10 w-fit mb-6">
                <Crown className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-[#fcfbf8] mb-2">Enterprise Seumur Hidup</h3>
              <p className="text-[#fcfbf8]/60 mb-6 text-sm">Sekali bayar, gunakan selamanya. Kebebasan penuh.</p>
              <div className="text-[40px] font-display font-bold text-[#fcfbf8] mb-6">
                Rp 2.5jt
                <span className="text-lg text-[#fcfbf8]/40 font-normal"> /sekali bayar</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex gap-3 text-[#fcfbf8]/80 text-sm">
                  <Check className="h-5 w-5 text-amber-400 shrink-0" />
                  <span>Akses Seumur Hidup</span>
                </li>
                <li className="flex gap-3 text-[#fcfbf8]/80 text-sm">
                  <Check className="h-5 w-5 text-amber-400 shrink-0" />
                  <span>Tanpa Batas Foto & Fitur</span>
                </li>
                <li className="flex gap-3 text-[#fcfbf8]/80 text-sm">
                  <Check className="h-5 w-5 text-amber-400 shrink-0" />
                  <span>White-label (Tanpa Branding Kami)</span>
                </li>
              </ul>
              <CheckoutButton 
                plan="ENTERPRISE"
                className="w-full py-3 px-6 rounded-lg bg-amber-400 text-[#1c1c1c] font-bold text-center hover:bg-amber-300 transition shadow-focus"
              >
                Beli Akses Seumur Hidup
              </CheckoutButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
