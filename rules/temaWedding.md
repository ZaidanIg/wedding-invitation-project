# Rules Pembuatan Tema Undangan Pernikahan (temaWedding)

Dokumen ini berisi standar mutu, arsitektur, dan panduan pembuatan tema undangan pernikahan pada platform. Seluruh pengembangan tema baru **WAJIB** mematuhi aturan ini secara ketat.

---

## 🛑 PROTOKOL UTAMA: Klarifikasi Kategori (WAJIB)
Setiap kali USER meminta pembuatan atau modifikasi tema undangan baru, AI **MUST** (harus):
1. **Berhenti dan Bertanya**: Tanyakan kepada USER terlebih dahulu apakah tema yang ingin dibuat termasuk dalam kategori **KLASIK (Classic)** atau **PREMIUM (Premium)**.
2. **Tunggu Jawaban**: Jangan menulis kode, membuat file tema, atau memberikan draf desain sebelum USER memberikan jawaban/konfirmasi kategori tersebut.
3. **Gunakan Panduan Spasial**: Setelah kategori dipilih, buat tema dengan mengikuti aturan teknis di bawah ini.

---

## 🎨 Kategori Undangan & Standar Desain

### 🌸 1. KATEGORI KLASIK (Classic)
Ditujukan untuk pengguna umum (B2C Free). Desain menonjolkan kesederhanaan yang anggun, bersih, dan berkelas.

*   **Palet Warna**: Pastel lembut, Krem (*Cream*), Beige, Putih Gading (*Ivory*), Soft Rose, dengan aksen garis emas tipis.
*   **Tipografi**: 
    *   Nama Pengantin: Serif klasik yang sangat terbaca (e.g., `Playfair Display`, `Cinzel`).
    *   Teks Konten: Sans-serif bersih (e.g., `Montserrat`, `Inter`).
*   **Layout**: Tata letak tradisional vertikal searah (*single-column grid*), batas margin yang simetris, dan spasi yang lega.
*   **Animasi**: Transisi sederhana dan elegan (e.g., `fade-in`, `gentle slide-up` dengan durasi cepat 300ms - 500ms).
*   **Fitur**: Informasi dasar (Waktu, Tempat, RSVP sederhana, dan Galeri Grid statis).

### 💎 2. KATEGORI PREMIUM (Premium)
Ditujukan untuk pengguna berbayar (B2C Pro / B2B Partner). Desain harus memberikan kesan ultra-mewah, eksklusif, imersif, dan modern yang memukau.

*   **Palet Warna**: Kontras tinggi & mewah (e.g., *Emerald Green* dengan Emas, *Deep Ruby Red*, *Midnight Navy Blue*, *Classic Charcoal & Gold*).
*   **Tipografi**: Pairing font tingkat lanjut.
    *   Nama Pengantin: Font handwriting/calligraphy premium (e.g., `Cormorant Garamond`, `Great Vibes`, `Outfit`).
*   **Layout**: Layout dinamis dengan *split screen*, efek tumpang tindih (*overlapping cards*), dan *full-screen hero*.
*   **Animasi & Interaktivitas (Wajib)**:
    *   *Floating Particles*: Efek kelopak bunga sakura gugur, debu emas berkilau (*gold dust*), atau daun musim gugur yang melayang lembut.
    *   *Parallax Scrolling*: Efek kedalaman latar belakang saat di-scroll.
    *   *Interactive Audio Player*: Pemutar musik latar belakang dengan animasi piringan hitam berputar atau gelombang suara (*waveform animation*).
*   **Fitur Premium**:
    *   **Love Story Timeline**: Kisah perjalanan cinta pengantin dengan kartu linimasa yang interaktif.
    *   **Premium Photo & Video Gallery**: Galeri carousel 3D, lightbox slider premium, dan integrasi video latar belakang.
    *   **Manajemen RSVP & Tamu**: QR Code Scanner untuk check-in tamunya secara instan, integrasi peta interaktif (*Google Maps Embed*).

---

## 💻 Aturan Penulisan Kode & Struktur (Semua Kategori)

1.  **Impor Berbagi (Shared Components)**:
    *   Gunakan komponen standar dan logika utilitas dari `src/components/layouts/shared.tsx` untuk menjaga konsistensi.
2.  **Responsivitas (Mobile-First)**:
    *   Semua tema harus terlihat sangat cantik di layar perangkat seluler (iPhone/Android) dengan mockup frame yang rapi, dan responsif sempurna saat dibuka di desktop.
3.  **Bebas Placeholder**:
    *   Jangan pernah menggunakan gambar placeholder kosong. Selalu gunakan gambar aset beresolusi tinggi.
4.  **Optimasi Aset**:
    *   Pastikan seluruh aset dekoratif menggunakan pembungkus yang aman untuk mencegah bocornya memori atau penurunan performa FPS (*smooth 60fps scrolling*).
