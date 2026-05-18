import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Eye, Database, Heart, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — Sahinaja',
  description: 'Komitmen hukum resmi platform Sahinaja dalam mengumpulkan, mengelola, menyimpang, serta menjamin keamanan data pribadi pengguna dan tamu undangan.',
};

export default function PrivacyPolicyPage() {
  return (
    <section className="min-h-screen bg-[#f7f4ed] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header decoration */}
        <div className="text-center mb-16">
          <div className="inline-flex p-4 rounded-3xl bg-[#a3b18a]/10 border border-[#a3b18a]/20 text-[#a3b18a] mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1c1c1c] tracking-tight mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-[#6b6b6b] max-w-xl mx-auto">
            Tanggal Berlaku: 18 Mei 2026. Kami berkomitmen penuh secara hukum untuk menjaga kerahasiaan, integritas, dan keamanan informasi pribadi milik Anda serta seluruh tamu undangan Anda.
          </p>
        </div>

        {/* Legal Scroll Content */}
        <div className="bg-white border border-[#eceae4] rounded-[2.5rem] p-8 sm:p-12 shadow-sm space-y-12 text-sm text-[#3a3a3a] leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Eye className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>1. Kategori Informasi Pribadi Yang Kami Kumpulkan</h3>
            </div>
            <p>
              Guna menyelenggarakan Layanan secara optimal dan aman bagi seluruh Pengguna, platform <strong>Sahinaja</strong> mengumpulkan kategori data pribadi terbatas berikut:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Data Akun Pemilik Undangan:</strong> Nama lengkap, alamat surat elektronik (email), sandi pengaman terenkripsi, serta nomor telepon kontak aktif.</li>
              <li><strong>Data Konten Undangan Pernikahan:</strong> Informasi detail acara (hari, tanggal, waktu, lokasi akad dan resepsi), data identitas lengkap kedua mempelai beserta orang tua, galeri foto kebahagiaan, deskripsi kisah cinta, serta rincian rekening bank kado digital.</li>
              <li><strong>Data Tamu Undangan Pernikahan:</strong> Daftar nama tamu penerima undangan, nomor kontak WhatsApp tamu, status konfirmasi kehadiran (RSVP), serta doa restu yang dikirimkan oleh tamu.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Database className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>2. Dasar Hukum & Tujuan Penggunaan Data</h3>
            </div>
            <p>
              Seluruh data pribadi yang kami kumpulkan diproses semata-mata atas dasar pemenuhan hak kontraktual Anda dan tujuan operasional yang sah:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Memproses pendaftaran akun, verifikasi keamanan berkala, serta kelancaran transaksi pembayaran paket premium melalui mitra pembayaran berlisensi.</li>
              <li>Menyusun, merender, dan mempublikasikan undangan pernikahan digital mewah Anda pada alamat unik undangan agar dapat diakses oleh kerabat Anda.</li>
              <li>Memproses notifikasi pesan undangan personal Anda ke nomor tamu secara tepat sasaran.</li>
              <li>Menyediakan dasbor analitik visual bagi Pengguna untuk memantau rekap jumlah tamu yang hadir secara *real-time*.</li>
            </ul>
          </div>

          {/* Section 3 - THE SECURE STATEMENT WITHOUT ARCHITECTURE REVEALING */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <ShieldCheck className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>3. Jaminan Perlindungan & Enkripsi Keamanan Data</h3>
            </div>
            <p>
              Kami mengutamakan pelindungan privasi Anda di atas segalanya. Kami menerapkan langkah-langkah keamanan tingkat tinggi untuk menjamin integritas data Anda:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Transmisi Data Terenkripsi:</strong> Seluruh pertukaran data antara browser Pengguna, sistem server, hingga basis data pusat dilindungi sepenuhnya menggunakan protokol enkripsi standar industri terpercaya. Ini memastikan data tidak dapat diintip oleh pihak luar saat ditransmisikan.</li>
              <li><strong>Komitmen Anti-Bocor & Anti-Jual Data:</strong> Kami berkomitmen secara mutlak <strong>tidak akan pernah</strong> menjual, menyewakan, membagikan, atau memberikan data pribadi Pengguna maupun data tamu undangan Anda kepada pihak ketiga mana pun untuk tujuan periklanan atau komersial lainnya.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Eye className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>4. Kebijakan Cookie Sesi Browser</h3>
            </div>
            <p>
              Kami menggunakan teknologi penanda sesi sederhana (*cookies*) pada browser Anda dengan tujuan tunggal untuk menyimpan status masuk (login) akun Anda. Hal ini bertujuan untuk memudahkan kenyamanan akses Pengguna agar Anda tidak perlu memasukkan kata sandi berulang kali saat sedang asyik berpindah halaman dasbor pengeditan undangan. Kami tidak menggunakan cookie untuk tujuan pelacakan iklan (*ad-tracking*) di luar situs kami.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Heart className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>5. Hak Pengguna Atas Kendali & Penghapusan Data</h3>
            </div>
            <p>
              Sebagai pemilik data yang sah, Anda memegang kendali penuh atas informasi pribadi Anda di platform Sahinaja. Anda berhak untuk mengakses, mengubah, memperbarui, atau mengajukan permohonan penghapusan seluruh data akun dan data undangan Anda secara permanen kapan saja langsung melalui menu dasbor akun Anda. Tindakan penghapusan akun akan memicu penghapusan bersih seluruh catatan undangan Anda dari penyimpanan sistem kami tanpa ada salinan cadangan yang tersisa demi keamanan privasi Anda.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Mail className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>6. Kontak Pengawasan Perlindungan Data</h3>
            </div>
            <p>
              Apabila terdapat pertanyaan, masukan hukum, keraguan, atau keluhan terkait dengan tata cara pengelolaan kerahasiaan data di sistem kami, silakan menghubungi divisi pengawasan pelindungan data kami:
            </p>
            <div className="bg-stone-50 border border-stone-200/50 p-6 rounded-2xl font-mono text-xs text-[#6b6b6b]">
              <p>✉️ <strong>Divisi Perlindungan Data:</strong> <a href="mailto:official@sahinaja.com" className="text-rose-500 hover:underline">official@sahinaja.com</a></p>
              <p>📍 <strong>Alamat Kantor Terdaftar:</strong> Jln. Pager betis dsn, Jl. Tenjolaya No.15, RT.03/RW.01, Sukagalih, Kec. Sumedang selatan, Kabupaten Sumedang, Jawa Barat 45311</p>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link href="/">
            <span className="text-xs font-bold text-[#1c1c1c] uppercase tracking-widest hover:text-rose-500 transition-colors cursor-pointer">
              ← Kembali ke Beranda
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
