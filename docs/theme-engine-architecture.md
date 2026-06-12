# Sahinaja Theme Engine: Arsitektur & Pedoman Inti

Dokumen ini menjelaskan rancangan arsitektur, skema data, dan alur integrasi dari **Sahinaja Theme Engine** (Mesin Tema Dinamis), yang merupakan inovasi inti dari modul *Website Builder* untuk undangan pernikahan.

---

## 1. Arsitektur Utama (The Architecture)
Theme Engine dirancang dengan dua komponen yang saling terpisah sepenuhnya (*decoupled*) antara area pembuat/admin dengan area pembaca/tamu, yang dihubungkan melalui standarisasi struktur JSON.

### A. Komponen Admin: *Figma-like Visual Builder*
- **Lokasi Kode**: `src/components/admin/FabricBuilder.tsx`
- **Teknologi**: React + `Fabric.js`
- **Peran**: Menyediakan kanvas interaktif di mana tim admin (atau calon pengantin) dapat menyeret (*drag*), mengubah ukuran (*resize*), dan mengatur lapisan (*layer*) layaknya aplikasi Figma.
- **Konsep Kunci**: 
  - **Single Contiguous Canvas**: Alih-alih membuat banyak kanvas terpisah, satu kanvas memanjang vertikal digunakan, dan dibagi-bagi secara logis menggunakan "Sections" (contoh: *HeroSection*, *CoupleSection*).
  - **Smart Linked Objects**: Alih-alih menggunakan `fabric.Group` yang sangat membatasi pengeditan individu, Theme Engine menggunakan sistem "Smart Links" di mana *parent container* dan *children images* berdiri sendiri namun terikat melalui parameter `parentId`. Ini memungkinkan **Tree UI Hierarchy**, **Drag Sync**, dan **Auto-Resizing**.

### B. Komponen Klien/Tamu: *Dynamic Theme Renderer*
- **Lokasi Kode**: `src/components/layouts/DynamicThemeRenderer.tsx` dan `src/components/layouts/LayerThemeRenderer.tsx`
- **Teknologi**: React + Framer Motion (untuk animasi masuk)
- **Peran**: Mesin perender (DOM-based) super ringan yang membaca eksport JSON dari *Builder* dan mengubahnya menjadi elemen-elemen HTML standar (bukan `<canvas>`).
- **Alasan Penggunaan DOM**: Render HTML murni lebih ramah SEO, jauh lebih efisien di *mobile*, dan lebih mudah dibuat responsif ketimbang me-render *Fabric.js* *Canvas* bagi ratusan/ribuan tamu undangan.

---

## 2. Skema & Struktur Data (The Schema)

Data tema diekspor dalam format **JSON** yang ketat dan disimpan dalam basis data relasional (pada tabel/model `Theme`). Skema intinya adalah hierarki `ThemeConfig` -> `CanvasSection[]` -> `CanvasLayer[]`.

### Skema Objek Kanvas (Fabric JSON Export)
Setiap objek layer di dalam array `objects` JSON memiliki ekstensi khusus Sahinaja:

```typescript
interface SahinajaLayer extends fabric.Object {
  id: string;             // Unik per layer (ex: 'gal_16942...')
  customType: string;     // Penanda peran ('Gallery Layer', 'Gallery Image', 'Text Layer')
  parentId?: string;      // Smart Link: merujuk ke id wadah utamanya
  dataBinding?: string;   // Kunci pemetaan ke database (ex: 'couple.groom.name', 'gallery.images[0]')
  clipPath?: object;      // Untuk boolean mask (ex: foto yang dipotong bentuk lingkaran)
}
```

---

## 3. Alur Sistem (The Flow)

### Tahap 1: Pembuatan (Creation)
1. **Inisialisasi**: Pengguna masuk ke halaman `/admin/themes/builder`.
2. **Desain**: Pengguna menyusun teks, bentuk (*shapes*), tombol, dan wadah galeri.
3. **Smart Linking**: Jika menambahkan Foto ke dalam Wadah Galeri, foto otomatis diberikan `parentId` yang merujuk pada Wadah tersebut, dan kanvas melar (*auto-resize*) dengan kalkulasi `getBoundingRect()`.
4. **Data Binding**: Pengguna memilih elemen dan mengatur *Data Binding* di properti kanan (contoh: teks dihubungkan dengan `groomName`).
5. **Ekspor**: Menekan *Export JSON*, maka state dari kanvas (*state array objects*) diekstrak melalui metode `canvas.toObject()`, dibungkus, lalu disimpan ke Database via API `/api/admin/themes`.

### Tahap 2: Rendering & Konsumsi (Consumption)
1. **Kunjungan Tamu**: Tamu mengunjungi URL `/invitation/romeo-juliet`.
2. **Fetch Data**: Next.js mengambil data pernikahan (profil Romeo & Juliet, daftar RSVP, cerita cinta) dan **Konfigurasi JSON Tema** yang dipilih pasangan tersebut.
3. **Injeksi Render**: `DynamicThemeRenderer` mem-parsing `themeConfig`. 
4. **Binding Eksekusi**: Saat membaca layer yang memiliki properti `dataBinding: 'couple.groom.name'`, Renderer akan mengabaikan teks bawaan (misal "Nama Pria") dan menggantinya dengan nilai aktual dari basis data: `"Romeo"`.
5. **Masking & Tata Letak**: Renderer menempatkan lapisan dalam koordinat absolut (diubah ke persentase/`rem` untuk responsivitas) dan menerapkan CSS clip-path jika layer memiliki *masking*.

---

## 4. Keterkaitan dengan Fitur Sahinaja (Feature Integrations)

Theme Engine ini merupakan jantung visual yang mengikat seluruh fitur fungsional platform Sahinaja:

1. **Manajemen Pasangan & Pengantin (Couple Data)**
   - Engine ini tidak perlu melakukan hardcode desain per pelanggan. Dengan `dataBinding`, satu JSON desain bisa dijual ke ribuan pasangan karena teks/gambarnya dirender ulang secara dinamis sesuai profil pengantin di *database*.

2. **Smart Gallery Container**
   - Theme Engine mengenali unggahan dari *Gallery Manager* pengguna dan secara dinamis mengisi struktur *Smart Linked Objects* di dalam JSON. Indexing otomatis (`gallery.images[0]`, `gallery.images[1]`) diterapkan pada setiap anak (child) dari wadah galeri.

3. **RSVP & Sistem Kehadiran**
   - Komponen statis/interaktif non-desain (seperti *Form RSVP*, QR Code Scanner, Tombol Hadir) dirender melalui komponen *React* reaktif yang di-*inject* tepat di atas layer desain (sebagai layer terpisah di urutan atas). JSON desain hanya menentukan *koordinat* tempat komponen tersebut diletakkan.

4. **Masking Tingkat Lanjut (Boolean Operations)**
   - Fitur "Jangan gunakan *quick masking*" dari *frontend rules* kita telah ditanam ke Theme Engine. Saat desainer memotong gambar berbentuk kubah, Theme Engine mengekspor `clipPath` (*boolean geometry*) ke JSON, dan memastikannya bisa dirender dengan sempurna via CSS `clip-path` tanpa memakan RAM server.
