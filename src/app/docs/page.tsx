import type { Metadata } from 'next';
import { Book, CreditCard, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Panduan & Dokumentasi — Sahinaja',
  description: 'Pelajari cara membuat, mengelola, dan meningkatkan paket undangan pernikahan digital Anda dengan Sahinaja.',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ed] py-32 px-4">
      <div className="max-w-4xl mx-auto bg-[#f7f4ed] rounded-xl p-8 sm:p-12 border border-[#eceae4] shadow-sm">
        
        {/* Header */}
        <div className="border-b border-[#eceae4] pb-10 mb-10 text-center sm:text-left">
          <div className="inline-flex p-3 rounded-full bg-[#1c1c1c]/5 mb-4 sm:hidden">
            <Book className="h-6 w-6 text-[#1c1c1c]" />
          </div>
          <h1 className="text-[36px] font-display font-bold text-[#1c1c1c] tracking-[-1px] flex items-center gap-4 justify-center sm:justify-start">
            <Book className="h-8 w-8 text-[#1c1c1c]/20 hidden sm:block" />
            Panduan & Dokumentasi
          </h1>
          <p className="text-[#5f5f5d] mt-3 text-lg leading-[1.38]">
            Segala hal yang perlu Anda ketahui tentang penggunaan Sahinaja.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-[#5f5f5d] leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-[#1c1c1c] mb-6 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#1c1c1c]" />
              Cara Membuat Undangan Anda
            </h2>
            <p className="mb-4">
              Menghadirkan undangan pernikahan impian Anda sekarang jauh lebih mudah dan menyenangkan. Ikuti langkah sederhana berikut:
            </p>
            <ol className="list-decimal pl-5 space-y-3 mb-6 font-medium">
              <li>Masuk ke akun Anda atau daftarkan akun baru secara gratis.</li>
              <li>Buka halaman <strong><Link href="/create" className="text-[#1c1c1c] underline">Buat Undangan</Link></strong>.</li>
              <li>Tuliskan nama kedua mempelai yang berbahagia beserta nama kedua orang tua tercinta.</li>
              <li>Tentukan lokasi, tanggal, dan waktu pelaksanaan akad serta resepsi pernikahan Anda.</li>
              <li>Unggah foto-foto terbaik Anda berdua untuk menghiasi galeri kebahagiaan.</li>
              <li>Pilih gaya tema, alunan musik latar romantis, serta kata-kata mutiara pilihan Anda.</li>
              <li>Simpan dan draf undangan mewah Anda akan langsung tercipta seketika!</li>
              <li>Lihat pratinjaunya, jika sudah sesuai, Anda siap membagikannya kepada para tamu.</li>
            </ol>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-[#1c1c1c] mb-6 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[#1c1c1c]" />
              Daftar Paket Harga
            </h2>
            <p className="mb-6">
              Kami menghadirkan paket sekali bayar yang sangat terjangkau bagi para calon pengantin, serta pilihan paket khusus untuk rekanan Wedding Organizer.
            </p>
            
            <div className="space-y-6">
              {/* B2C Packages Row */}
              <div className="bg-[#1c1c1c]/5 rounded-xl p-8 border border-[#eceae4] space-y-6">
                <h3 className="font-bold text-[#1c1c1c] text-lg border-b border-[#eceae4] pb-2">Untuk Calon Pengantin (Sekali Bayar)</h3>
                <p className="text-sm text-[#5f5f5d]">
                  Buka Dashboard Anda, pilih undangan yang ingin Anda bagikan, lalu klik "Upgrade". Pembayaran diproses dengan aman melalui mitra pembayaran resmi kami.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-xs font-semibold text-[#5f5f5d]">
                  <div className="bg-white p-4 rounded-xl border border-[#eceae4]/60">
                    <h4 className="font-bold text-[#1c1c1c] mb-1">Minimalist</h4>
                    <p className="text-[#6b6b6b] text-[10px] mb-2">Rp 75.000 / undangan</p>
                    <p className="text-[11px] font-normal">2 Foto Utama + 2 Galeri Foto, Google Maps, Tanpa Watermark.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-rose-500/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-rose-500 text-white text-[8px] px-2 py-0.5 font-bold uppercase">Populer</div>
                    <h4 className="font-bold text-rose-600 mb-1">Premium</h4>
                    <p className="text-[#6b6b6b] text-[10px] mb-2">Rp 150.000 / undangan</p>
                    <p className="text-[11px] font-normal">10 Galeri Foto Premium, Kisah Cinta (Love Story), Musik Latar Kustom, Countdown.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-amber-500/20">
                    <h4 className="font-bold text-amber-600 mb-1">Ultimate</h4>
                    <p className="text-[#6b6b6b] text-[10px] mb-2">Rp 250.000 / undangan</p>
                    <p className="text-[11px] font-normal">Unlimited Galeri Foto, Buku Tamu Digital (QR Check-in), WhatsApp Blast Otomatis, Kado Digital.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center sm:text-left">
              <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-4 bg-[#1c1c1c] text-[#fcfbf8] font-bold rounded-xl shadow-inset hover:opacity-90 transition-all">
                Lihat Rincian Paket Lengkap
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
