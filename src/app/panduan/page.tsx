import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Panduan Pengguna — Sahinaja',
  description: 'Dokumentasi komprehensif untuk penggunaan platform Sahinaja bagi Mitra Agen dan Pasangan Pengantin.',
};

export default function PanduanPengguna() {
  return (
    <div className="min-h-screen bg-[#fdfcf9] py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 border-b border-rose-500/10 pb-8">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-rose-500 mb-4">Dokumentasi Platform</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#1c1c1c] tracking-[-0.02em] mb-4">
            Panduan Pengguna
          </h1>
          <p className="text-[#6b6b6b] text-sm font-medium">Tanggal Efektif: Mei 2026</p>
        </header>

        <div className="prose prose-rose max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-[#4a4745] prose-p:leading-relaxed prose-li:text-[#4a4745] prose-strong:text-[#1c1c1c] prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline">
          <p>
            Selamat datang di Pusat Bantuan dan Dokumentasi Sahinaja. <strong>Mitra Agen</strong> yang mengelola infrastruktur logistik klien secara profesional, dan <strong>Pengguna Mandiri</strong> yang merancang undangan digital secara personal. Silakan merujuk pada bagian yang relevan dengan peran Anda.
          </p>

          <hr className="my-12 border-stone-200" />

          <h2>1. Panduan Mitra</h2>
          <p>
            Sebagai mitra agen, Anda mendapatkan akses ke Halaman Kerja Utama Sahinaja untuk mengelola puluhan portofolio pernikahan klien dari satu antarmuka terpusat yang aman dan andal.
          </p>

          <h3>1.1. Langkah Pendaftaran Akun & Aktivasi Halaman Kerja Utama</h3>
          <p>
            Akses ke sistem manajemen agen membutuhkan autentikasi melalui portal khusus. Setelah melakukan registrasi atau masuk melalui <Link href="/auth/signin">Portal Login Agensi</Link>, Anda akan secara otomatis dialihkan ke antarmuka Halaman Kerja Utama. Seluruh acara klien yang Anda inisiasi akan ditautkan secara aman ke identitas agensi Anda.
          </p>

          <h3>1.2. Prosedur Pembuatan Acara Pernikahan Klien & Mekanisme Penyerahan Akses</h3>
          <p>
            Untuk setiap klien baru, Anda diwajibkan untuk membuat sebuah entitas Acara Pernikahan. Sistem kami akan secara otomatis menghasilkan kredensial akses yang aman untuk akun khusus pengantin.
          </p>
          <ul>
            <li>Setelah acara tercipta, klik tombol <strong>"Bagikan Akses Klien"</strong> pada detail acara.</li>
            <li>Sistem akan menyusun pesan otomatis yang mengandung tautan akses eksklusif menuju portal pengantin.</li>
            <li>Klien Anda (pasangan pengantin) dapat masuk menggunakan akses tersebut untuk mengisi data pernikahan mereka tanpa memerlukan campur tangan teknis dari pihak agen.</li>
          </ul>

          <h3>1.3. Siklus Aktivasi Fitur Tambahan Komersial</h3>
          <p>
            Kami mengimplementasikan model bisnis modular untuk mengoptimalkan operasional Anda. Fitur lanjutan dapat diaktifkan secara terpisah sesuai kebutuhan spesifik setiap acara.
          </p>
          <ul>
            <li><strong>Sistem Pemindaian Hari-H:</strong> Modul pemindai kehadiran tamu instan di lokasi acara.</li>
            <li><strong>Penghapusan Label Merek:</strong> Menghapus seluruh atribusi merek Sahinaja dari undangan publik klien Anda untuk memberikan kesan eksklusif (layanan label putih).</li>
            <li><strong>Domain Khusus:</strong> Menautkan undangan klien ke alamat situs kustom milik agensi Anda.</li>
          </ul>
          <p>
            <em>Catatan:</em> Setiap aktivasi fitur tambahan bersifat spesifik dan terikat pada satu acara pernikahan secara tunggal. Aktivasi ini tidak dapat dipindahtangankan ke acara klien lainnya.
          </p>

          <h3>1.4. Panduan Operasional Manajemen Tamu Hari-H</h3>
          <p>
            Sistem Pemindaian Hari-H dirancang untuk memproses kedatangan tamu secara presisi melalui pemindaian sandi respons cepat (QR) pada hari pernikahan. Untuk memastikan kelancaran teknis:
          </p>
          <ul>
            <li>Sistem dirancang untuk tetap mencatat aktivitas meskipun terjadi fluktuasi koneksi. Sistem akan melakukan sinkronisasi ulang secara otomatis ke peladen kami saat koneksi internet kembali stabil.</li>
            <li>Dianjurkan bagi staf lapangan agen untuk menyediakan koneksi nirkabel cadangan di meja penerima tamu guna mengamankan proses penyelarasan daftar hadir tamu.</li>
          </ul>

          <hr className="my-12 border-stone-200" />

          <h2>2. Panduan Pengguna Mandiri (Untuk Pasangan Pengantin DIY)</h2>
          <p>
            Platform Sahinaja menawarkan kemandirian penuh bagi pasangan pengantin untuk menyusun dan mengonfigurasi undangan digital eksklusif dengan mudah.
          </p>

          <h3>2.1. Prosedur Pengisian Data Mandiri</h3>
          <p>
            Melalui <Link href="/client/login">Portal Pengantin</Link>, Anda memiliki fasilitas untuk mengatur berbagai informasi penting:
          </p>
          <ul>
            <li><strong>Detail Informasi Mempelai:</strong> Pengisian nama lengkap, nama orang tua, dan deskripsi singkat.</li>
            <li><strong>Peta Lokasi Acara:</strong> Konfigurasi lokasi tempat acara berlangsung secara presisi yang terintegrasi dengan layanan pemetaan elektronik.</li>
            <li><strong>Kisah Cinta:</strong> Ruang khusus untuk membagikan perjalanan cerita asmara Anda kepada para tamu.</li>
            <li><strong>Panduan Unggah Album Foto:</strong> Anda dapat mengunggah koleksi foto pramelangsung (<em>pre-wedding</em>). Sistem kami akan memproses ukuran visual foto secara otomatis agar halaman undangan dapat dimuat dengan cepat bagi pengunjung.</li>
          </ul>

          <h3>2.2. Aturan Operasional Layanan Mandiri</h3>
          <p>
            Sesuai dengan ketentuan layanan, akun mandiri memiliki batasan fitur operasional demi menjaga keseimbangan kualitas sistem bagi seluruh pengguna:
          </p>
          <ul>
            <li><strong>Batasan Kuota Konfirmasi Kehadiran:</strong> Layanan pengguna mandiri membatasi penerimaan daftar konfirmasi kehadiran tamu hingga <strong>maksimal 150 tamu</strong>.</li>
            <li><strong>Ketentuan Visual Label Merek:</strong> Undangan publik yang diterbitkan secara mandiri akan selalu menyertakan label visual yang mengidentifikasi bahwa layanan tersebut disediakan oleh Sahinaja.</li>
          </ul>
        </div>

        <div className="mt-16 pt-8 border-t border-rose-500/10 text-center">
          <p className="text-sm text-[#6b6b6b] mb-4">Membutuhkan bantuan teknis lebih lanjut?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl bg-stone-100 text-[#1c1c1c] hover:bg-stone-200 transition-colors">
            Hubungi Tim Layanan Pelanggan
          </Link>
        </div>
      </div>
    </div>
  );
}
