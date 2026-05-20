import React from 'react';

export const metadata = {
  title: 'Kebijakan Privasi — Sahinaja',
  description: 'Kebijakan privasi Sahinaja yang patuh terhadap UU Perlindungan Data Pribadi.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#fdfcf9] py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 border-b border-rose-500/10 pb-8">
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-rose-500 mb-4">Perlindungan Data</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#1c1c1c] tracking-[-0.02em] mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-[#6b6b6b] text-sm font-medium">Tanggal Efektif: Mei 2026</p>
        </header>

        <div className="prose prose-rose max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-[#4a4745] prose-p:leading-relaxed prose-li:text-[#4a4745] prose-strong:text-[#1c1c1c] prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline">
          <p>
            Kerahasiaan dan perlindungan data Anda adalah fondasi utama layanan Sahinaja. Kebijakan Privasi ini disusun khusus guna mematuhi <strong>Undang-Undang Perlindungan Data Pribadi (UU PDP) No. 27 Tahun 2022</strong> Republik Indonesia. Aturan ini memastikan proses transparan bagaimana informasi sensitif dan rahasia ditata kelola secara legal di seluruh operasional layanan platform kami.
          </p>

          <h2>1. Peran Pengelolaan Data</h2>
          <p>
            Dalam konteks struktur relasional pelindungan hak atas informasi rahasia, pengoperasian tanggung jawab dibagi secara spesifik berdasarkan ketentuan UU PDP:
          </p>
          <ul>
            <li><strong>Sahinaja berkedudukan sebagai Pengolah Data (<em>Data Processor</em>).</strong> Kami menyelenggarakan fasilitas infrastruktur komputasi untuk menyimpan informasi sebatas pada instruksi yang dimandatkan.</li>
            <li><strong>Pengguna Akhir (Mitra Agen atau Pengantin) berkedudukan sebagai Pengendali Data (<em>Data Controller</em>).</strong> Pengguna memiliki kedaulatan mutlak untuk memutuskan pengumpulan informasi logistik hari-H dan menentukan tujuan penggunaan data tamu acara yang bersangkutan.</li>
          </ul>

          <h2>2. Perlindungan Data Pengantin & Tamu</h2>
          <p>
            Semua catatan informasi pribadi—baik identitas pendaftaran pengguna, detail pasangan pengantin, hingga himpunan informasi yang memuat nama dan kontak tamu undangan pada layanan acara—diisolasi penuh secara ketat demi keamanan. 
          </p>
          <p>
            Kami menegaskan dengan komitmen penuh dan ikatan sanksi regulasi bahwa Sahinaja <strong>tidak akan pernah menjual, mengkomersialkan, menyewakan, atau menyalahgunakan informasi rahasia tersebut kepada entitas pihak ketiga</strong>. Kami menolak semua bentuk pemanfaatan daftar tamu acara demi kepentingan komersial, seperti iklan digital, monetisasi pemasaran eksternal, atau penjualan data silang di luar batas operasional fungsionalitas sistem pengelolaan pernikahan Anda.
          </p>

          <h2>3. Keamanan Informasi Sisi Server</h2>
          <p>
            Guna melawan potensi intrusi data, perlindungan lapis ganda diimplementasikan pada pusat penyimpanan informasi kami. Keamanan jaringan difokuskan pada pengamanan lalu lintas informasi dan pelindungan akses kata sandi:
          </p>
          <ol>
            <li><strong>Enkripsi Kredensial Terpadu:</strong> Setiap rumusan kata sandi rahasia serta titik otentikasi akan selalu dilindungi menggunakan teknologi enkripsi searah berstandar industri. Kata sandi pengguna tidak akan pernah terekam dalam format yang terbaca langsung pada sistem kami, sehingga privasi Anda dipastikan aman bahkan dari akses tim internal perusahaan.</li>
            <li><strong>Transmisi Terlindungi:</strong> Jalur komunikasi antara perangkat pengguna dan sistem pelayanan kami selalu diamankan melalui protokol aman terenkripsi tingkat atas. Sistem komunikasi yang terisolir memastikan perlindungan penuh saat proses pengiriman catatan logistik penting tamu Anda.</li>
          </ol>

          <h2>4. Retensi & Penghapusan Data</h2>
          <p>
            Demi menjaga operasional efisiensi ruang komputasi dan menjamin perlindungan jangka panjang informasi lama pengguna, Sahinaja menerapkan strategi retensi informasi dan manajemen siklus aset terstruktur.
          </p>
          <p>
            Aset digital berskala besar yang dikelola pengguna—seperti dokumen foto potret memori pranikah atau material visual berat lainnya yang berada dalam pusat penyimpanan mitra penyimpanan awan pihak ketiga yang aman—tunduk pada durasi kebijakan penyimpanan berkala kami:
          </p>
          <ul>
            <li>Kami menginisiasi proses pembersihan data secara rutin terhadap seluruh aset visual setelah proyek acara pernikahan resmi kedaluwarsa atau acara dinyatakan telah lama diselesaikan secara operasional kalender.</li>
            <li>Pengguna memikul kewajiban penuh untuk memastikan tersedianya salinan mandiri dari momen berharga sebelum platform menyelesaikan fase retensi data tersebut, dikarenakan kami akan menihilkan arsip guna melindungi sisa ruang infrastruktur dari penyalahgunaan.</li>
          </ul>

          <h2>5. Pengajuan Hak Subjek Data</h2>
          <p>
            Sebagaimana perlindungan warga negara terhadap kontrol informasi pribadi, Anda dapat sewaktu-waktu mengajukan permohonan atas pembaharuan informasi, penghapusan catatan identitas, atau pencabutan layanan. Permintaan dapat difasilitasi melalui layanan korespondensi departemen hukum resmi perusahaan kami dan akan diproses sesuai dengan tenggat waktu kepatuhan birokrasi negara yang sah.
          </p>
        </div>
      </div>
    </div>
  );
}
