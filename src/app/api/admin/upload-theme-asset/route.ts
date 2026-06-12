import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { handleServiceError } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return errorResponse('Unauthorized', 403, 'FORBIDDEN');
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('File not found in form data', 400, 'BAD_REQUEST');
    }

    // 1. Validasi Ekstensi dan MIME Type
    const allowedExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.mp3'];
    const allowedMimeTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'audio/mpeg', 'audio/mp3'];

    const ext = path.extname(file.name).toLowerCase();
    const mimeType = file.type.toLowerCase();

    if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(mimeType)) {
      return errorResponse('File type not allowed. Allowed formats: SVG, PNG, JPG, MP3', 400, 'BAD_REQUEST');
    }

    // 2. Validasi Ukuran Berkas
    // Batasan ukuran: MP3 maks 8MB, Gambar & SVG maks 2MB
    const maxMp3Size = 8 * 1024 * 1024; // 8MB
    const maxImageSize = 2 * 1024 * 1024; // 2MB
    const maxSize = ext === '.mp3' ? maxMp3Size : maxImageSize;

    if (file.size > maxSize) {
      const displaySize = ext === '.mp3' ? '8MB' : '2MB';
      return errorResponse(`File too large. Maximum size allowed is ${displaySize}`, 400, 'BAD_REQUEST');
    }

    // 3. Tentukan direktori penyimpanan
    // Gunakan env THEME_ASSETS_DIR jika disetel (untuk production VPS di luar repo), 
    // jika tidak simpan di public/uploads/theme-assets/ (untuk local development)
    let uploadDir = process.env.THEME_ASSETS_DIR;
    if (!uploadDir) {
      uploadDir = path.join(process.cwd(), 'public', 'uploads', 'theme-assets');
    }

    // Pastikan direktori tujuan sudah ada
    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitisasi nama file agar aman dari Directory Traversal
    const sanitizedBase = path.basename(file.name)
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.\./g, '');
    const uniqueFilename = `${Date.now()}-${sanitizedBase}`;
    const destinationPath = path.join(uploadDir, uniqueFilename);

    // Tulis berkas ke disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(destinationPath, buffer);

    // URL publik yang akan digunakan oleh browser
    const fileUrl = `/uploads/theme-assets/${uniqueFilename}`;

    return successResponse({
      fileUrl,
      filename: uniqueFilename,
      size: file.size,
    });
  } catch (error: unknown) {
    const { message, status, code } = handleServiceError(error);
    return errorResponse(message, status, code);
  }
}
