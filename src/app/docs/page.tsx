import type { Metadata } from 'next';
import { Book, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Panduan & Dokumentasi — Wedding Invitation',
  description: 'Pelajari cara membuat, mengelola, dan meningkatkan paket undangan pernikahan digital Anda.',
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
            Segala hal yang perlu Anda ketahui tentang penggunaan Wedding Invitation.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-[#5f5f5d] leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-[#1c1c1c] mb-6 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#1c1c1c]" />
              Cara Membuat Undangan
            </h2>
            <p className="mb-4">
              Membuat undangan pernikahan digital mewah sangatlah mudah. Ikuti langkah-langkah berikut:
            </p>
            <ol className="list-decimal pl-5 space-y-3 mb-6 font-medium">
              <li>Masuk atau buat akun gratis.</li>
              <li>Buka halaman <strong><Link href="/create" className="text-[#1c1c1c] underline">Buat Undangan</Link></strong>.</li>
              <li>Isi nama Mempelai Pria dan Wanita beserta orang tua.</li>
              <li>Lengkapi detail acara seperti tanggal, waktu, dan lokasi.</li>
              <li>(Opsional) Unggah foto-foto terbaik Anda untuk galeri.</li>
              <li>Pilih tema, nuansa kata-kata, dan musik latar favorit.</li>
              <li>Klik <strong>Selesai & Lihat Hasil</strong>. Sistem kami akan menyusun draf undangan secara otomatis!</li>
              <li>Lihat pratinjau dan klik <strong>Simpan & Bagikan</strong>.</li>
            </ol>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-[#1c1c1c] mb-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#1c1c1c]" />
              Batas Penggunaan Gratis
            </h2>
            <div className="bg-[#1c1c1c] rounded-xl p-6 mb-4 shadow-inset">
              <p className="font-bold text-[#fcfbf8] mb-3">Ketentuan untuk akun gratis:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#fcfbf8]/80 text-sm">
                <li>Anda dapat mencoba membuat hingga <strong>3 desain draf</strong>.</li>
                <li>Untuk undangan <strong>DRAF</strong>, batas foto yang dapat ditampilkan adalah <strong>1 foto</strong>.</li>
                <li>Undangan gratis memiliki tanda air (watermark) dan fitur terbatas.</li>
              </ul>
            </div>
            <p className="text-sm">
              Untuk melihat sisa kuota draf Anda, kunjungi <strong><Link href="/dashboard" className="text-[#1c1c1c] underline">Dashboard</Link></strong>. 
              Setelah mencapai batas, Anda perlu melakukan upgrade ke paket Premium atau Ultimate.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-[#1c1c1c] mb-6 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[#1c1c1c]" />
              Harga & Pembayaran
            </h2>
            <p className="mb-6">
              Kami menawarkan sistem pembayaran sekali bayar untuk calon pengantin dan sistem berlangganan untuk Wedding Organizer.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              <div className="bg-[#1c1c1c]/5 rounded-xl p-8 border border-[#eceae4]">
                <h3 className="font-bold text-[#1c1c1c] mb-3">Untuk Calon Pengantin</h3>
                <p className="text-sm text-[#5f5f5d] mb-4">
                  Buka Dashboard, pilih draf undangan Anda, dan klik "Upgrade". 
                  Pembayaran aman melalui gerbang pembayaran Midtrans.
                </p>
                <ul className="text-xs space-y-2 text-[#5f5f5d] font-semibold">
                  <li className="flex justify-between"><span>• Premium (Rp 49k)</span> <span className="text-[#1c1c1c]">6 Foto</span></li>
                  <li className="flex justify-between"><span>• Ultimate (Rp 99k)</span> <span className="text-[#1c1c1c]">Maks 30 Foto</span></li>
                </ul>
              </div>

              <div className="bg-[#1c1c1c] rounded-xl p-8 shadow-inset">
                <h3 className="font-bold text-[#fcfbf8] mb-3">Untuk Wedding Organizer</h3>
                <p className="text-sm text-[#fcfbf8]/60 mb-4">
                  Sistem langganan yang memberikan akses tak terbatas untuk mengelola banyak klien sekaligus.
                </p>
                <ul className="text-xs space-y-2 text-[#fcfbf8]/80 font-semibold">
                  <li className="flex justify-between"><span>• Pro (Rp 199k/bln)</span> <span className="text-[#fcfbf8]">Kuota 20/bln</span></li>
                  <li className="flex justify-between"><span>• Enterprise</span> <span className="text-[#fcfbf8]">Akses Selamanya</span></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 text-center sm:text-left">
              <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-4 bg-[#1c1c1c] text-[#fcfbf8] font-bold rounded-xl shadow-inset hover:opacity-90 transition-all">
                Lihat Semua Paket
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
