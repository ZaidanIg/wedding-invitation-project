import type { Metadata } from 'next';
import Link from 'next/link';
import { Scroll, ShieldAlert, BadgeInfo, Scale, CreditCard, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan Layanan',
  description: 'Aturan, panduan penggunaan, lisensi, serta syarat pembayaran dan pengembalian dana pada platform Sahinaja.',
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
            Terakhir Diperbarui: 18 Mei 2026. Harap baca seluruh dokumen ini secara saksama sebelum menggunakan layanan kami.
          </p>
        </div>

        {/* Legal Scroll Content */}
        <div className="bg-white border border-[#eceae4] rounded-[2.5rem] p-8 sm:p-12 shadow-sm space-y-12 text-sm text-[#3a3a3a] leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Scale className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>1. Ketentuan Umum & Penerimaan</h3>
            </div>
            <p>
              Dengan mengakses, mendaftar, atau menggunakan platform **Sahinaja** (dikelola oleh Sahinaja Team), Anda secara sadar dan sukarela menyatakan menyetujui dan terikat oleh seluruh Syarat & Ketentuan Layanan ini. Jika Anda tidak menyetujui salah satu poin di dalam dokumen ini, Anda diwajibkan untuk segera menghentikan penggunaan situs dan seluruh layanan Sahinaja.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <BadgeInfo className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>2. Definisi & Deskripsi Layanan</h3>
            </div>
            <p>
              Sahinaja merupakan platform pembuatan undangan pernikahan digital berbasis website. Kami menyediakan antarmuka mandiri (*self-service*) bagi pengguna untuk membuat draf undangan, mengonfigurasi musik latar, melampirkan informasi mempelai/acara, mengelola daftar tamu RSVP, serta mengirimkan undangan otomatis menggunakan integrasi WhatsApp Gateway.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <CreditCard className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>3. Pembayaran & Peningkatan Paket (Upgrade)</h3>
            </div>
            <p>
              Platform kami menyediakan paket gratis (Demo) serta beberapa pilihan paket berbayar (Minimalist, Premium, Ultimate). 
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Seluruh transaksi peningkatan paket diproses secara aman menggunakan **Midtrans Snap Payment Gateway**.</li>
              <li>Pilihan metode pembayaran yang didukung meliputi transfer bank (Virtual Account), QRIS (GoPay, ShopeePay, LinkAja), dan gerai ritel resmi.</li>
              <li>Layanan undangan berbayar akan segera aktif secara otomatis di server produksi setelah sistem pembayaran Midtrans memberikan konfirmasi sukses kepada sistem kami.</li>
            </ul>
          </div>

          {/* Section 4 - CRITICAL MIDTRANS REQUIREMENT */}
          <div className="space-y-4 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <RefreshCw className="h-5 w-5 text-amber-600 shrink-0" />
              <h3>4. Kebijakan Pengembalian Dana & Pembatalan (Refund Policy)</h3>
            </div>
            <p className="text-xs text-stone-800">
              Harap perhatikan kebijakan pengembalian dana berikut secara saksama:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-xs text-stone-800">
              <li><strong>Pembelian Final:</strong> Karena sifat dari produk kami berupa konten/layanan digital yang langsung aktif dan dapat diakses seketika, seluruh transaksi yang telah berhasil dikonfirmasi statusnya dinyatakan bersifat **final** dan tidak dapat dibatalkan.</li>
              <li><strong>Kondisi Pengembalian Khusus:</strong> Pengembalian dana (*refund*) dapat diajukan secara eksklusif hanya apabila terjadi gangguan sistem pembayaran ganda (*double payment*) akibat gangguan pada gateway, atau kegagalan aktivasi teknis permanen dari sisi server kami yang tidak dapat diatasi dalam kurun waktu 3x24 jam kerja.</li>
              <li><strong>Mekanisme Pengajuan:</strong> Permohonan pengembalian dana wajib dikirimkan secara tertulis melalui email resmi kami di <strong>support@sahinaja.com</strong> dengan melampirkan bukti transaksi pembayaran Midtrans secara lengkap. Proses verifikasi dan pencairan dana memakan waktu maksimal 7 (tujuh) hari kerja setelah disetujui.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>5. Kewajiban & Larangan Pengguna</h3>
            </div>
            <p>
              Sebagai pengguna Sahinaja, Anda setuju untuk:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tidak menyisipkan konten pornografi, ujaran kebencian, SARA, atau konten ilegal lainnya ke dalam undangan Anda.</li>
              <li>Tidak menyalahgunakan integrasi WhatsApp Blast otomatis untuk tujuan spamming massal yang mengganggu nomor di luar tamu undangan pernikahan yang bersangkutan.</li>
              <li>Menjaga kerahasiaan informasi akun dasbor Anda secara penuh dari akses ilegal pihak ketiga.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <Scale className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>6. Hukum Yang Berlaku</h3>
            </div>
            <p>
              Seluruh ketentuan di dalam dokumen Syarat & Ketentuan Layanan ini diatur, ditafsirkan, dan tunduk sepenuhnya kepada peraturan perundang-undangan hukum yang berlaku di **Negara Kesatuan Republik Indonesia**.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-stone-900 font-bold text-base">
              <BadgeInfo className="h-5 w-5 text-rose-500 shrink-0" />
              <h3>7. Kontak Layanan Dukungan</h3>
            </div>
            <p>
              Apabila Anda memiliki pertanyaan, keluhan, masukan, atau permohonan bantuan teknis terkait penggunaan platform Sahinaja, silakan menghubungi tim layanan dukungan kami:
            </p>
            <div className="bg-stone-50 border border-stone-200/50 p-6 rounded-2xl space-y-2 font-mono text-xs text-[#6b6b6b]">
              <p>📍 <strong>Alamat Kantor:</strong> Sahinaja HQ, Jl. Kemewahan No. 1, Jakarta Selatan, Indonesia</p>
              <p>✉️ <strong>Email Resmi:</strong> <a href="mailto:support@sahinaja.com" className="text-rose-500 hover:underline">support@sahinaja.com</a></p>
              <p>💬 <strong>WhatsApp CS:</strong> +62 812-3456-7890</p>
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
