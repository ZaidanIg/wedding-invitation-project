import { z } from 'zod';

export const sendCodeSchema = z.object({
  email: z.string().email('Format email tidak valid'),
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .regex(/[A-Z]/, 'Kata sandi harus mengandung minimal 1 huruf besar')
    .regex(/[a-z]/, 'Kata sandi harus mengandung minimal 1 huruf kecil')
    .regex(/[0-9]/, 'Kata sandi harus mengandung minimal 1 angka')
    .regex(/[^A-Za-z0-9]/, 'Kata sandi harus mengandung minimal 1 karakter spesial'),
  code: z.string().length(6, 'Kode verifikasi harus 6 digit'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Format email tidak valid'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token reset kata sandi wajib diisi'),
  password: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .regex(/[A-Z]/, 'Kata sandi harus mengandung minimal 1 huruf besar')
    .regex(/[a-z]/, 'Kata sandi harus mengandung minimal 1 huruf kecil')
    .regex(/[0-9]/, 'Kata sandi harus mengandung minimal 1 angka')
    .regex(/[^A-Za-z0-9]/, 'Kata sandi harus mengandung minimal 1 karakter spesial'),
});
