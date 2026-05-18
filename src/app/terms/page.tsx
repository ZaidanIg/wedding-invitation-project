import type { Metadata } from 'next';
import Link from 'next/link';
import { Scroll, ShieldAlert, BadgeInfo, Scale, CreditCard, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan Layanan — Sahinaja',
  description: 'Dokumen hukum resmi Syarat & Ketentuan Layanan platform Sahinaja. Aturan hak cipta, tata cara pembayaran, kebijakan pengembalian dana, dan batasan tanggung jawab hukum.',
};

export default function TermsOfServicePage() {
  return (
    <section className="min-h-screen bg-[#f7f4ed] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header decoration */}
        <div className="text-center mb-16">
          <div className="inline-flex p-4 rounded-3xl bg-rose-500/5 border border-rose-500/10 text-rose-500 mb-6">
            <Scroll size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1c1c1c] tracking-tight mb-4">
            Syarat & Ketentuan Layanan
          </h1>
          <p className="text-sm text-[#6b6b6b] max-w-xl mx-auto">
            Tanggal Berlaku: 18 Mei 2026. Harap membaca seluruh ketentuan hukum di bawah ini secara teliti sebelum Anda menggunakan layanan kami.
          </p>
        </div>

        {/* Legal Scroll Content */}
        <div className="bg-white border border-[#eceae4] rounded-[2.5rem] p-8 sm:p-12 shadow-sm space-y-12 text-sm text-[#3a3a3a] leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Scale className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>1. Penerimaan Ketentuan Hukum</h3>
            </div>
            <p>
              Dengan mendaftar, mengakses, atau menggunakan seluruh fitur yang tersedia pada platform <strong>Sahinaja</strong> (selanjutnya disebut "Layanan"), Anda menyatakan telah membaca, memahami, dan menyetujui secara sadar tanpa paksaan untuk terikat oleh seluruh Syarat & Ketentuan Layanan ini. Apabila Anda tidak menyetujui salah satu atau seluruh poin dalam dokumen ini, Anda diwajibkan secara hukum untuk segera menghentikan akses dan penggunaan Layanan.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <BadgeInfo className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>2. Ruang Lingkup & Deskripsi Layanan</h3>
            </div>
            <p>
              Sahinaja bertindak sebagai penyedia platform perangkat lunak pembuatan undangan pernikahan digital berbasis website secara mandiri (*self-service*). Kami menyediakan fasilitas desain, pengaturan musik latar, input informasi detail acara, galeri foto, rekap kehadiran tamu (RSVP), serta penyediaan sistem pesan undangan personal. Pengguna memikul tanggung jawab penuh atas keakuratan data, hak cipta materi visual yang diunggah, serta validitas informasi pernikahan yang dipublikasikan.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <CreditCard className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>3. Sistem Pembayaran & Peningkatan Layanan</h3>
            </div>
            <p>
              Akses dasar Layanan disediakan secara gratis dengan batasan fitur tertentu. Untuk membuka fitur eksklusif, Pengguna dapat melakukan peningkatan paket (*upgrade*) dengan ketentuan sebagai berikut:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Seluruh transaksi pembayaran diproses secara aman melalui kerja sama resmi dengan mitra gerbang pembayaran berlisensi kami (Midtrans).</li>
              <li>Metode pembayaran resmi yang tersedia meliputi transfer bank otomatis (*Virtual Account*), QRIS, serta saluran pembayaran ritel resmi lainnya.</li>
              <li>Aktivasi fitur berbayar akan berjalan secara otomatis seketika setelah sistem kami menerima notifikasi pelunasan sukses dari mitra pembayaran.</li>
            </ul>
          </div>

          {/* Section 4 - CRITICAL MIDTRANS REQUIREMENT - ZERO AMBIGUITY REFUND POLICY */}
          <div className="space-y-4 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <RefreshCw className="h-5 w-5 text-amber-600 shrink-0" />
              <h3>4. Kebijakan Pengembalian Dana (Refund Policy)</h3>
            </div>
            <p className="text-xs text-stone-800">
              Mengingat produk yang kami sediakan merupakan produk digital instan yang langsung aktif dan dapat digunakan seketika setelah pembayaran terkonfirmasi, kami menerapkan kebijakan pengembalian dana yang ketat dan transparan untuk menghindari multitafsir:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-xs text-stone-800">
              <li><strong>Pembelian Bersifat Final:</strong> Seluruh transaksi peningkatan paket yang telah sukses dikonfirmasi dinyatakan bersifat <strong>final</strong> dan tidak dapat dibatalkan, ditukar, atau diubah dengan alasan apa pun.</li>
              <li><strong>Pengecualian Pengembalian Dana:</strong> Pengembalian dana secara penuh hanya dapat diajukan secara eksklusif dalam kondisi berikut:
                <ul className="list-circle pl-6 mt-1 space-y-1">
                  <li>Terjadi kesalahan transaksi ganda (*double payment*) di mana Pengguna terdebit lebih dari satu kali untuk satu nomor pesanan yang sama akibat keterlambatan respons gerbang pembayaran.</li>
                  <li>Terjadi kegagalan teknis fatal pada infrastruktur sistem kami yang mengakibatkan undangan premium tidak dapat diakses publik secara permanen selama lebih dari 3x24 jam kerja sejak konfirmasi pembayaran diterima.</li>
                </ul>
              </li>
              <li><strong>Prosedur Pengajuan Resmi:</strong> Pengajuan pengembalian dana wajib dikirimkan secara tertulis ke email resmi kami <strong>official@sahinaja.com</strong> menggunakan alamat email terdaftar akun Anda, melampirkan bukti transfer pembayaran dari gerbang pembayaran resmi, dan diajukan selambat-lambatnya 7 (tujuh) hari kalender sejak transaksi dilakukan. Pengembalian dana yang disetujui akan ditransfer ke rekening asal Pengguna dalam jangka waktu maksimal 7 (tujuh) hari kerja.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>5. Kewajiban & Batasan Perilaku Pengguna</h3>
            </div>
            <p>
              Dalam memanfaatkan Layanan, Pengguna secara hukum berkewajiban untuk mematuhi larangan berikut secara mutlak:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dilarang keras mengunggah foto, dokumen, nama, atau kalimat yang melanggar hukum positif di Indonesia, mengandung pornografi, ujaran kebencian, pencemaran nama baik, atau hak kekayaan intelektual milik pihak lain tanpa izin tertulis.</li>
              <li>Dilarang keras menyalahgunakan sistem pengiriman pesan undangan untuk mengirimkan pesan beruntun tanpa batas secara sepihak (spamming) di luar lingkup relasi tamu undangan pernikahan yang bersangkutan.</li>
              <li>Pengguna bertanggung jawab secara mandiri atas keamanan data kredensial masuk akun miliknya dan membebaskan kami dari tanggung jawab atas kelalaian pengamanan kata sandi.</li>
            </ul>
          </div>

          {/* Section 6 - LIMITATION OF LIABILITY */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Scale className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>6. Batasan Tanggung Jawab Hukum (Limitation of Liability)</h3>
            </div>
            <p>
              Sahinaja menyediakan platform ini dengan dasar "apa adanya" (*as is*) tanpa jaminan tersurat maupun tersirat mengenai kepastian kehadiran tamu undangan Anda atau kesempurnaan teknis perangkat keras pengirim pesan pihak ketiga. Kami tidak bertanggung jawab secara hukum atas:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Kerugian moral, materiel, atau sengketa keluarga yang timbul akibat kesalahan pengisian nama, lokasi, tanggal acara, atau foto yang dilakukan secara mandiri oleh Pengguna.</li>
              <li>Gangguan jaringan telekomunikasi internet, pemeliharaan sistem mendadak dari server global penyedia platform hosting, atau pemblokiran nomor kontak oleh pihak otoritas pesan eksternal akibat aktivitas pengiriman pesan berlebihan.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Scale className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>7. Hukum Yang Berlaku & Penyelesaian Sengketa</h3>
            </div>
            <p>
              Syarat & Ketentuan Layanan ini diatur, ditafsirkan, dan tunduk sepenuhnya kepada hukum serta peraturan perundang-undangan di <strong>Negara Kesatuan Republik Indonesia</strong>. Segala bentuk perselisihan atau sengketa hukum yang timbul dari penafsiran dokumen ini wajib diupayakan penyelesaiannya secara damai melalui musyawarah mufakat. Apabila kesepakatan damai tidak tercapai, perselisihan tersebut akan diajukan dan diselesaikan melalui yurisdiksi hukum tetap <strong>Kantor Kepaniteraan Pengadilan Negeri Sumedang</strong>.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <BadgeInfo className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>8. Kontak Resmi Layanan Hukum</h3>
            </div>
            <p>
              Apabila terdapat pertanyaan, masukan hukum, permohonan resmi, atau aduan terkait dokumen hukum Syarat & Ketentuan Layanan ini, silakan menghubungi divisi hukum kami di:
            </p>
            <div className="bg-stone-50 border border-stone-200/50 p-6 rounded-2xl space-y-2 font-mono text-xs text-[#6b6b6b]">
              <p>📍 <strong>Alamat Kantor Terdaftar:</strong> Jln. Pager betis dsn, Jl. Tenjolaya No.15, RT.03/RW.01, Sukagalih, Kec. Sumedang selatan, Kabupaten Sumedang, Jawa Barat 45311</p>
              <p>✉️ <strong>Email Resmi:</strong> <a href="mailto:official@sahinaja.com" className="text-rose-500 hover:underline">official@sahinaja.com</a></p>
              <p>💬 <strong>WhatsApp CS:</strong> <a href="https://wa.me/6282116179745" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">+62 821-1617-9745</a></p>
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
