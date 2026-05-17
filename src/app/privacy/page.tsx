import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Eye, Database, Heart, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Informasi mengenai bagaimana platform Sahinaja melindungi, mengumpulkan, dan mengelola data pribadi Anda.',
};

export default function PrivacyPolicyPage() {
  return (
    <section className="min-h-screen bg-[#f7f4ed] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header decoration */}
        <div className="text-center mb-16">
          <div className="inline-flex p-4 rounded-3xl bg-[#a3b18a]/10 border border-[#a3b18a]/20 text-[#a3b18a] mb-6 animate-pulse">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1c1c1c] tracking-tight mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-[#6b6b6b] max-w-xl mx-auto">
            Terakhir Diperbarui: 18 Mei 2026. Kami berkomitmen penuh melindungi hak privasi data pribadi Anda dan seluruh tamu undangan Anda.
          </p>
        </div>

        {/* Legal Scroll Content */}
        <div className="bg-white border border-[#eceae4] rounded-[2.5rem] p-8 sm:p-12 shadow-sm space-y-12 text-sm text-[#3a3a3a] leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Eye className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>1. Pengumpulan Informasi Pribadi</h3>
            </div>
            <p>
              Ketika Anda mendaftar, menggunakan, atau melakukan transaksi di platform **Sahinaja**, kami mengumpulkan beberapa jenis data pribadi secara terbatas dan transparan:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Data Akun:</strong> Alamat email, nama lengkap, dan nomor telepon seluler.</li>
              <li><strong>Data Undangan Pernikahan:</strong> Informasi detail acara (tanggal, waktu, lokasi resepsi/akad), nama lengkap mempelai pria & wanita beserta orang tua, foto profil mempelai, galeri foto, kisah cinta, dan rekening kado digital.</li>
              <li><strong>Data Tamu Undangan:</strong> Nama tamu, nomor telepon WhatsApp (untuk blast undangan), serta status RSVP (kehadiran dan ucapan doa restu).</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Database className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>2. Penggunaan Informasi Pribadi</h3>
            </div>
            <p>
              Seluruh data pribadi yang dikumpulkan di sistem Sahinaja digunakan semata-mata untuk kelancaran penyediaan fitur platform:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Memproses pendaftaran akun, verifikasi keamanan, serta pemrosesan transaksi pembayaran Midtrans Snap.</li>
              <li>Merender halaman undangan pernikahan digital unik sesuai draf kustomisasi Anda agar dapat diakses oleh publik atau tamu khusus.</li>
              <li>Mengirim notifikasi blast undangan ke WhatsApp tamu penerima secara terjadwal.</li>
              <li>Menyediakan statistik rekap kehadiran RSVP serta kiriman doa restu di dalam dasbor admin pemilik undangan.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <ShieldCheck className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>3. Perlindungan & Keamanan Data (Security)</h3>
            </div>
            <p>
              Kami mengimplementasikan langkah-langkah keamanan tingkat tinggi untuk menjamin integritas data Anda:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Enkripsi Transportasi Data (SSL/HTTPS):</strong> Seluruh data yang mengalir antara browser Anda, server produksi Vercel, serta basis data terenkripsi Supabase dilindungi sepenuhnya menggunakan enkripsi SSL/TLS 256-bit standar industri perbankan.</li>
              <li><strong>Tanpa Penjualan Data:</strong> Sahinaja **tidak akan pernah** menjual, menyewakan, memperdagangkan, atau memberikan data pribadi pengguna atau tamu undangan Anda kepada pihak ketiga mana pun tanpa persetujuan eksplisit Anda.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Eye className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>4. Cookie Browser</h3>
            </div>
            <p>
              Platform kami memanfaatkan *cookies* berukuran kecil di browser Anda semata-mata untuk menyimpan status autentikasi login (NextAuth session) agar Anda tidak perlu berulang kali memasukkan kata sandi saat berpindah halaman dasbor. Anda dapat menonaktifkan cookie melalui pengaturan browser Anda, namun beberapa fungsi dasbor mungkin menjadi tidak bekerja maksimal.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Heart className="h-5 w-5 text-[#a3b18a] shrink-0 animate-heartbeat" />
              <h3>5. Hak Akses & Penghapusan Data</h3>
            </div>
            <p>
              Anda memiliki hak penuh untuk mengakses, memperbarui, memodifikasi, atau meminta penghapusan permanen atas seluruh data pribadi Anda dari server kami kapan saja melalui menu dasbor akun Anda. Penghapusan akun berbayar juga akan secara permanen menghapus subdomain undangan Anda dari internet.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Mail className="h-5 w-5 text-[#a3b18a] shrink-0" />
              <h3>6. Kontak Pertanyaan Privasi</h3>
            </div>
            <p>
              Apabila Anda memiliki pertanyaan lebih lanjut, keraguan, atau kekhawatiran terkait bagaimana data pribadi Anda dikelola di sistem kami, silakan menghubungi Petugas Perlindungan Data (*Data Protection Officer*) kami di:
            </p>
            <div className="bg-stone-50 border border-stone-200/50 p-6 rounded-2xl font-mono text-xs text-[#6b6b6b]">
              <p>✉️ <strong>Email Kebijakan Privasi:</strong> <a href="mailto:privacy@sahinaja.com" className="text-rose-500 hover:underline">privacy@sahinaja.com</a> / <a href="mailto:support@sahinaja.com" className="text-rose-500 hover:underline">support@sahinaja.com</a></p>
              <p>📍 <strong>Alamat Kantor:</strong> Sahinaja HQ, Jl. Kemewahan No. 1, Jakarta Selatan, Indonesia</p>
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
