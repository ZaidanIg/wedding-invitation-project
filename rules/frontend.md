# Aturan Desain & Frontend (Frontend Rules)

Dokumen ini memuat standarisasi pembuatan antarmuka (UI) dan struktur halaman (Page) pada sisi frontend aplikasi SaaS Sahinaja. Tujuan utamanya adalah memastikan konsistensi visual, *margin*, tata letak (*layout*), dan performa, terlepas dari siapa yang menulis kodenya.

## 1. Tata Letak (Layout) & Wrapper Utama
Setiap halaman baru (`page.tsx`) **harus** mengikuti standar *wrapper* berikut agar lebar konten (*max-width*) konsisten dan rapi di semua ukuran layar:

```tsx
export default function NewPage() {
  return (
    <main className="min-h-screen bg-[#fcfbf8]"> {/* Latar belakang dasar sistem */}
      {/* Container utama untuk konsistensi margin kiri/kanan */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Konten Halaman */}
      </div>
    </main>
  );
}
```
**Aturan Spasi Global:**
- Jarak antar *section* vertikal yang besar: Gunakan `gap-16` atau `gap-24` (bukan `mt-10` atau `mb-5` sembarangan).
- Jarak antar elemen kecil: Gunakan kelipatan 4 pada Tailwind (contoh: `gap-4`, `gap-8`).

## 2. Palet Warna (Color System)
Dilarang keras menggunakan warna dasar HTML sembarangan (seperti *red*, *blue* murni). Gunakan skema warna yang terkurasi untuk memberikan kesan *Premium*:
- **Background Utama**: `bg-[#fcfbf8]` (Off-white / cream yang elegan).
- **Teks Utama**: `text-[#1c1c1c]` (Hitam pekat namun tidak sekasar `#000000`).
- **Teks Sekunder**: `text-[#1c1c1c]/60` atau `text-stone-500`.
- **Aksen / Highlight**: `text-rose-500` atau `text-rose-600`.
- **Garis Pembatas (Border)**: `border-[#eceae4]`.

## 3. Komponen UI Reusable
Jangan pernah membuat tombol (`<button>`) atau input teks secara *ad-hoc* (langsung styling di file). 
Selalu impor dan gunakan komponen dari folder `src/components/ui/`:
- **Tombol**: `import Button from '@/components/ui/Button'`
- **Input Teks**: `import Input from '@/components/ui/Input'`
- **Kartu/Card**: `import Card from '@/components/ui/Card'`

Ini memastikan radius sudut (`rounded-xl`), warna fokus (`focus:ring-2`), dan *padding* tetap identik di semua halaman.

## 4. Efek Visual (Aesthetic) & Animasi
Proyek ini mengusung tema **Modern, Premium, & Dinamis**.
- **Glassmorphism**: Gunakan `bg-white/80 backdrop-blur-md` untuk elemen yang mengambang seperti *Navbar* atau *Sticky Header*.
- **Micro-animations (Hover)**: Gunakan class `transition-all duration-300 ease-out hover:scale-[1.02]` untuk interaksi *hover* pada kartu atau tombol penting.
- **Transisi Masuk (Framer Motion)**: Gunakan *library* `framer-motion` untuk *fade-in* saat halaman dimuat:
  ```tsx
  import { motion } from 'framer-motion';
  
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
  ```

## 5. Responsivitas (Mobile-First)
- Selalu mulai *styling* untuk layar *mobile*. Gunakan *prefix* `sm:`, `md:`, dan `lg:` untuk ukuran tablet dan *desktop*.
- Jangan paksa tata letak tabel pada layar kecil. Jika membuat tabel (seperti *Pricing*), berikan *wrapper* `overflow-x-auto` agar bisa digulir ke samping, atau ubah bentuknya menjadi tumpukan kartu (Stack) pada layar `sm`.

## 6. SEO & HTML Semantik
- Pastikan ada **satu** `<h1 className="font-display font-bold">` untuk setiap halaman. Sisanya menggunakan `<h2>`, `<h3>` sesuai hierarki.
- Tambahkan properti `metadata` Next.js pada halaman utama untuk *Title* dan *Description*.

> **PENTING**: Jika *layout* terlihat sederhana, membosankan, dan terasa *template* generik tanpa nyawa, maka itu dianggap **GAGAL**. Tambahkan ruang (whitespace) yang cukup, kontras font yang baik, dan detail mikro-animasi.
