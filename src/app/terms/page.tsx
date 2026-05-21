import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Term and Service — Sahinaja',
  description:
    'Syarat & Ketentuan Layanan, Kebijakan Privasi, dan Matriks Fitur paket undangan digital.',
};

// ─── Data ────────────────────────────────────────────────────────────────────

const navItems = [
  { id: 'tos', label: 'Syarat & Ketentuan', sub: 'Ruang lingkup, pembayaran, infrastruktur' },
  { id: 'privacy', label: 'Kebijakan Privasi', sub: 'Data tamu & retensi server' },
  { id: 'matrix', label: 'Matriks Fitur', sub: 'Perbandingan paket & batasan' },
];

const matrixRows = [
  {
    feature: 'Kategori Tema',
    basic: 'Minimalist',
    premium: 'Minimalist & Premium',
    ultimate: 'Semua Katalog',
  },
  {
    feature: 'Kuota Foto',
    basic: 'Maks. 3 foto',
    premium: 'Maks. 6 foto',
    ultimate: 'Maks. 10 foto',
  },
  {
    feature: 'Kuota Tamu',
    basic: '150 tamu',
    premium: '300 tamu',
    ultimate: 'Unlimited',
  },
  {
    feature: 'Regenerasi Teks AI',
    basic: 'Maks. 3 kali',
    premium: 'Unlimited',
    ultimate: 'Unlimited',
  },
  {
    feature: 'Musik & RSVP Live',
    basic: '—',
    premium: 'Aktif',
    ultimate: 'Aktif',
  },
  {
    feature: 'Video',
    basic: '—',
    premium: '—',
    ultimate: 'Aktif (Embed saja)',
  },
  {
    feature: 'WhatsApp',
    basic: '—',
    premium: 'Manual Redirect',
    ultimate: 'Automated WA Blast',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ed] mt-20">
      {/* ── Page Header ────────────────────────────────────── */}
      <header className="border-b border-stone-200/70 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
            Term and Service
          </h1>
          <p className="text-xs text-stone-400 font-medium mb-4">
            Pembaruan Terakhir: Mei 2026 &nbsp;|&nbsp; Versi: 1.2
          </p>
          <p className="text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Dokumen ini merupakan satu kesatuan instrumen hukum dan operasional yang mengatur
            penggunaan platform pembuatan undangan digital{' '}
            <strong className="text-stone-800">Sahinaja</strong>.
          </p>
        </div>
      </header>

      {/* ── Two-Column Layout ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Sidebar Navigation (25%) ───────────────────── */}
          <aside className="lg:w-1/4 shrink-0">
            <nav className="sticky top-24 space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400 mb-4 px-2">
                Daftar Isi
              </p>

              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group flex flex-col gap-0.5 px-4 py-3 rounded-xl border border-transparent hover:border-stone-200 hover:bg-white transition-all duration-150"
                >
                  <span className="text-sm font-semibold text-stone-700 group-hover:text-rose-500 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-stone-400 leading-snug">{item.sub}</span>
                </a>
              ))}

              {/* Contact box */}
              <div className="mt-6 p-4 bg-white border border-stone-200 rounded-2xl space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
                  Kontak Resmi
                </p>
                <a
                  href="mailto:official@sahinaja.com"
                  className="block text-xs text-rose-500 hover:underline font-medium"
                >
                  ✉️ official@sahinaja.com
                </a>
                <a
                  href="https://wa.me/6282116179745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-rose-500 hover:underline font-medium"
                >
                  💬 +62 821-1617-9745
                </a>
                <p className="text-[9px] text-stone-400 leading-snug">
                  Kab. Sumedang, Jawa Barat 45311
                </p>
              </div>

              <div className="mt-4 px-2">
                <Link
                  href="/"
                  className="text-[10px] font-bold text-stone-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                >
                  ← Kembali ke Beranda
                </Link>
              </div>
            </nav>
          </aside>

          {/* ── Main Content Area (75%) ────────────────────── */}
          <main className="flex-1 min-w-0 space-y-10">

            {/* ══════════════════════════════════════════════
                SECTION 1 — SYARAT DAN KETENTUAN
            ══════════════════════════════════════════════ */}
            <section
              id="tos"
              className="bg-white border border-stone-200/60 rounded-3xl p-8 sm:p-10 scroll-mt-24"
            >
              {/* Section badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold">
                  01
                </span>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Syarat dan Ketentuan Layanan
                  </h2>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                    Terms of Service
                  </p>
                </div>
              </div>

              <div className="space-y-8 text-sm text-stone-700 leading-relaxed">

                {/* 1.1 */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">
                    1.1 Ruang Lingkup dan Transaksi Final
                  </h3>
                  <p className="text-justify">
                    Sahinaja menyediakan platform bagi
                    pasangan pengantin untuk menyusun undangan pernikahan mereka secara digital.
                    Seluruh bentuk transaksi pembelian paket (<strong>Basic, Premium,
                    Ultimate</strong>) diproses secara final melalui payment gateway resmi. Semua
                    bentuk pembayaran bersifat{' '}
                    <strong className="text-rose-600">Non-Refundable (tidak dapat dikembalikan)</strong>{' '}
                    dengan alasan apa pun, termasuk pembatalan acara, penundaan jadwal, maupun
                    kesalahan input data oleh Pengguna.
                  </p>
                </div>

                {/* 1.2 */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">
                    1.2 Kebijakan Tegas Masa Aktif Tautan (Link Expiry)
                  </h3>
                  <p className="text-justify mb-4">
                    Demi menjaga stabilitas dan efisiensi alokasi database, hak akses publik
                    terhadap tautan  undangan digital dibatasi secara otomatis
                    berdasarkan tanggal acara pernikahan yang dimasukkan Pengguna:
                  </p>
                  <ul className="space-y-2 pl-1">
                    {[
                      { tier: 'Paket Basic', detail: 'Akses publik aktif sampai dengan Hari H + 3 Hari' },
                      { tier: 'Paket Premium', detail: 'Akses publik aktif sampai dengan Hari H + 14 Hari' },
                      { tier: 'Paket Ultimate', detail: 'Akses publik aktif sampai dengan Hari H + 30 Hari' },
                    ].map((row) => (
                      <li key={row.tier} className="flex gap-3 items-start">
                        <span className="mt-0.5 w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                        <span>
                          <strong className="text-stone-800">{row.tier}:</strong> {row.detail}.
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-justify text-stone-500 text-xs border-t border-stone-100 pt-4">
                    Pasca ambang batas waktu, sistem otomatis memutus akses publik dan menghapus
                    berkas transien dalam siklus retensi.
                  </p>
                </div>

                {/* 1.3
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">
                    1.3 Batasan Tanggung Jawab Infrastruktur Pihak Ketiga
                  </h3>
                  <div className="space-y-4">
                    <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl">
                      <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">
                        Layanan WhatsApp Blast — Paket Ultimate
                      </p>
                      <p className="text-justify text-xs text-stone-600">
                        Menggunakan layanan pihak ketiga <strong>Fonnte</strong>. Sahinaja
                        menerapkan delay otomatis 15 detik per pesan. Sahinaja dibebaskan
                        sepenuhnya dari tanggung jawab hukum jika terjadi kegagalan pengiriman
                        atau pemblokiran nomor WhatsApp oleh algoritma anti-spam Meta.
                      </p>
                    </div>
                    <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                      <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
                        Penyematan Konten Video — Paket Ultimate
                      </p>
                      <p className="text-justify text-xs text-stone-600">
                        Menggunakan tautan embed (YouTube / TikTok / Instagram). Sahinaja tidak
                        bertanggung jawab atas kegagalan pemutaran akibat perubahan kebijakan API
                        eksternal atau penghapusan video oleh platform asal.
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* Hukum */}
                <div className="border-t border-stone-100 pt-6 text-xs text-stone-500">
                  <p className="text-justify">
                    Syarat &amp; Ketentuan ini tunduk kepada hukum{' '}
                    <strong className="text-stone-700">Negara Kesatuan Republik Indonesia</strong>.
                    Sengketa hukum diselesaikan melalui musyawarah mufakat; jika tidak tercapai,
                    melalui yurisdiksi{' '}
                    <strong className="text-stone-700">
                      Pengadilan Negeri Sumedang, Jawa Barat
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════
                SECTION 2 — KEBIJAKAN PRIVASI
            ══════════════════════════════════════════════ */}
            <section
              id="privacy"
              className="bg-white border border-stone-200/60 rounded-3xl p-8 sm:p-10 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold">
                  02
                </span>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Kebijakan Privasi &amp; Retensi Data
                  </h2>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                    Privacy Policy
                  </p>
                </div>
              </div>

              <div className="space-y-8 text-sm text-stone-700 leading-relaxed">

                {/* 2.1 */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">
                    2.1 Keamanan Data Pribadi Tamu
                  </h3>
                  <p className="text-justify">
                    Sahinaja melindungi kerahasiaan data tamu undangan yang dikumpulkan melalui
                    sistem RSVP. Data tamu — mencakup nama, nomor telepon, konfirmasi kehadiran,
                    dan ucapan pribadi — secara mutlak hanya digunakan untuk kebutuhan dashboard
                    Pengguna (pemilik undangan) yang bersangkutan.{' '}
                    <strong className="text-stone-900">
                      Data tersebut tidak diperjualbelikan, disewakan, maupun dibagikan kepada
                      pihak ketiga untuk keperluan komersial apa pun.
                    </strong>
                  </p>
                </div>

                {/* 2.2 */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">
                    2.2 Penghapusan Data Otomatis
                  </h3>
                  <p className="text-justify mb-4">
                    Untuk menjaga efisiensi sistem dan keamanan privasi, seluruh log data berikut
                    akan dihapus secara permanen paling lambat{' '}
                    <strong className="text-rose-600">90 hari</strong> setelah masa aktif tautan
                    undangan berakhir:
                  </p>
                  <ul className="space-y-2 pl-1 text-stone-600 text-xs">
                    {[
                      'Log data tamu dan konfirmasi RSVP',
                      'Foto dan media yang diunggah melalui UploadThing',
                      'Riwayat ucapan dan pesan dari tamu',
                      'Catatan aktivitas sesi pengguna yang telah berakhir',
                    ].map((item) => (
                      <li key={item} className="flex gap-2 items-start">
                        <span className="mt-0.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cookie RSVP note */}
                <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-500">
                  <p className="font-bold text-stone-700 mb-1.5">Pencegahan Duplikasi RSVP</p>
                  <p className="text-justify">
                    Untuk menghindari pengisian RSVP ganda dari perangkat yang sama, sistem kami menyimpan penanda digital
                    otomatis (cookie) pada browser Anda selama 1 tahun. Penanda ini hanya berfungsi untuk mendeteksi
                    bahwa perangkat Anda telah mengisi RSVP, dan tidak merekam atau menyimpan data pribadi apa pun.
                  </p>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════
                SECTION 3 — MATRIKS FITUR
            ══════════════════════════════════════════════ */}
            <section
              id="matrix"
              className="bg-white border border-stone-200/60 rounded-3xl p-8 sm:p-10 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 text-violet-600 text-xs font-bold">
                  03
                </span>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Matriks Pembatasan Fitur
                  </h2>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                    Feature Constraint Matrix
                  </p>
                </div>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                Tabel berikut merinci batasan fitur teknis setiap paket layanan Sahinaja.
                Perubahan pada matriks ini dapat dilakukan sewaktu-waktu seiring pembaruan platform.
              </p>

              {/* Scrollable table container — prevents layout break on mobile */}
              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-sm text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="px-5 py-3.5 text-xs font-bold text-stone-500 uppercase tracking-widest w-1/4">
                        Fitur
                      </th>
                      <th className="px-5 py-3.5 text-xs font-bold text-stone-500 uppercase tracking-widest text-center">
                        Basic
                      </th>
                      <th className="px-5 py-3.5 text-xs font-bold text-violet-500 uppercase tracking-widest text-center bg-violet-50/50">
                        Premium
                      </th>
                      <th className="px-5 py-3.5 text-xs font-bold text-amber-600 uppercase tracking-widest text-center bg-amber-50/50">
                        Ultimate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {matrixRows.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/40'}
                      >
                        <td className="px-5 py-4 font-semibold text-stone-800 text-xs">
                          {row.feature}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <FeatureCell value={row.basic} />
                        </td>
                        <td className="px-5 py-4 text-center bg-violet-50/20">
                          <FeatureCell value={row.premium} color="violet" />
                        </td>
                        <td className="px-5 py-4 text-center bg-amber-50/20">
                          <FeatureCell value={row.ultimate} color="amber" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-5 text-[10px] text-stone-400 leading-relaxed">
                <strong>Catatan:</strong> Kuota dan fitur dapat berubah tanpa pemberitahuan
                terlebih dahulu. Geser tabel ke kanan pada layar kecil untuk melihat seluruh
                kolom.
              </p>
            </section>

            {/* Footer note */}
            <div className="text-center py-6 border-t border-stone-200">
              <p className="text-xs text-stone-400">
                © 2026 Sahinaja. Seluruh hak cipta dilindungi undang-undang.
              </p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <Link href="/" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest hover:text-rose-500 transition-colors">
                  ← Beranda
                </Link>
                <span className="text-stone-200">|</span>
                <a href="mailto:official@sahinaja.com" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest hover:text-rose-500 transition-colors">
                  Hubungi Kami
                </a>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Component ─────────────────────────────────────────────────────────

function FeatureCell({
  value,
  color,
}: {
  value: string;
  color?: 'violet' | 'amber';
}) {
  const isEmpty = value === '—';

  if (isEmpty) {
    return <span className="text-stone-300 text-base font-light">—</span>;
  }

  const colorMap = {
    violet: 'text-violet-700 font-semibold',
    amber: 'text-amber-700 font-semibold',
  };

  return (
    <span className={`text-xs ${color ? colorMap[color] : 'text-stone-600'}`}>{value}</span>
  );
}
