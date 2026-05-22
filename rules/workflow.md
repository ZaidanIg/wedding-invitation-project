# Workflow & Development Rules (Sahinaja SaaS)

Dokumen ini berisi aturan main (SOP) pengembangan yang disepakati bersama antara *Developer* dan *AI Assistant (Senior Fullstack Engineer)* untuk memastikan proyek Sahinaja berjalan rapi, aman, dan *scalable*.

## 1. Versioning System (Semantic Versioning - SemVer)
Semua pembaruan pada aplikasi harus diikuti dengan pembaruan versi di `package.json` dan *changelog*:
- **Major Update (X.0.0)**: Perubahan arsitektur besar, perombakan UI masif, atau perubahan yang tidak *backward-compatible* (misal: 1.2.0 -> 2.0.0).
- **Minor Update (0.X.0)**: Penambahan fitur baru (seperti integrasi pembayaran, modul baru) yang bersifat *backward-compatible* (misal: 1.2.0 -> 1.3.0).
- **Patch Update (0.0.X)**: Perbaikan *bug* (*bugfix*), optimasi kecil, atau penyesuaian UI ringan (misal: 1.2.0 -> 1.2.1).

## 2. Kepatuhan Backend & Tema (Strict Compliance)
- **Backend API**: Penambahan atau modifikasi API **WAJIB** mematuhi pedoman di `rules/backend.md`. Harus menggunakan arsitektur *Controller-Service-Repository*, mengembalikan *response* terstandarisasi, dan divalidasi dengan Zod.
- **Tema Undangan**: Penambahan desain atau komponen tema baru **WAJIB** mematuhi `rules/temaWedding.md`.

## 3. Agile Methodology & Sprints
Pengembangan menggunakan metode Agile:
- Pekerjaan dibagi ke dalam **Sprint** dengan target yang jelas (misal: Sprint 1: Integrasi Midtrans, Sprint 2: Sistem Guest & RSVP).
- Fokus menyelesaikan satu fitur secara tuntas (*end-to-end*) sebelum melompat ke fitur lain.
- ***Feature Toggles***: Jika sebuah fitur besar harus di-*merge* ke `main` namun belum siap rilis, gunakan *Feature Flag* (Sembunyikan dari UI) alih-alih menunda *deployment*.

## 4. Keamanan & Pengujian (Testing First)
- **Security Check**: Setiap *endpoint* baru wajib dicek untuk *Authorization* (apakah *user* berhak?) dan *Input Sanitization* (mencegah XSS/SQL Injection).
- **Testing**: Setiap pembaruan yang mengubah logika bisnis inti (seperti *billing* atau *AI*) wajib diuji (baik secara manual via skenario atau *automated tests* jika ada) sebelum di-*push* ke GitHub.
- **Linting & Type Checking**: Tidak ada kode yang di-*commit* jika `npm run lint` atau `npx tsc --noEmit` gagal.

## 5. Komunikasi Kritis (Peran Senior Engineer)
Sebagai *Senior Fullstack Developer*, AI bertugas **bersikap kritis**:
- AI **WAJIB** menegur atau menolak permintaan eksekusi jika *User* meminta jalan pintas (*shortcut*) yang membahayakan keamanan atau merusak arsitektur jangka panjang.
- AI **WAJIB** memberikan saran desain sistem, normalisasi basis data, atau optimalisasi *rendering* (Next.js) sebelum mengeksekusi kode secara buta.

## 6. Aturan Tambahan Khusus SaaS (Rekomendasi)
Untuk memastikan stabilitas SaaS Sahinaja:
- **Soft Deletes**: Dilarang melakukan penghapusan data secara permanen (*hard delete*) pada data krusial seperti Pengguna, Undangan, atau Transaksi. Gunakan field `deletedAt` atau status `ARCHIVED` demi riwayat audit.
- **Rate Limiting Global**: Setiap API publik wajib memiliki *Rate Limiting* (pembatasan *request* beruntun) untuk mencegah serangan DDoS atau eksploitasi beban server.
- **Database Migrations Rule**: Dilarang mengedit file *migration* yang sudah pernah di-*push* ke produksi. Setiap perubahan skema wajib menggunakan `npx prisma migrate dev` yang menghasilkan folder migrasi baru.

## 7. Protokol Pengujian Otomatis (Automated Testing Protocol)
Untuk menjaga stabilitas, kita mengimplementasikan *testing suite* berlapis (Unit, Integration, E2E) dengan aturan ketat:
- **Stack Utama**: Jest, React Testing Library (RTL), dan Playwright/Cypress.
- **ZERO EXTERNAL API CALLS**: Dilarang keras melakukan *hit* ke *external service* asli selama pengujian (Prisma, UploadThing, Midtrans, Fonnte, Groq). **Semua** *external service* WAJIB di-*mock* menggunakan `jest-mock-extended` atau bawaan Jest demi menghemat kuota *free-tier*.
- **Isolasi Pengujian**: Setiap pengujian harus mandiri (*isolated*) dan *state* harus dibersihkan setelah setiap tes berjalan (`jest.clearAllMocks()`).
- **Prioritas *Coverage***: Fokuskan tes pada logika krusial penghasil cuan (*Revenue-Critical flows* seperti validasi *Tier/Checkout*) dan integritas data (limit pembuatan undangan/AI).
