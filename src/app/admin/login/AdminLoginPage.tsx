'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

const ERROR_MAP: Record<string, string> = {
  USER_NOT_FOUND:            'Akun tidak ditemukan.',
  INVALID_EMAIL_OR_PASSWORD: 'Email atau kata sandi salah.',
  EMAIL_NOT_VERIFIED:        'Akun belum diverifikasi.',
  TOO_MANY_REQUESTS:         'Terlalu banyak percobaan. Coba lagi dalam 1 menit.',
  EMAIL_PASSWORD_REQUIRED:   'Email dan kata sandi wajib diisi.',
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState('');

  // Read error from URL if redirected by NextAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code') || params.get('error');
    setTimeout(() => { if (code) setError(ERROR_MAP[code] ?? 'Terjadi kesalahan. Silakan coba lagi.'); }, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        const code = (res as any).code || res.error;
        setError(ERROR_MAP[code] ?? 'Terjadi kesalahan. Silakan coba lagi.');
      } else {
        if (window.location.hostname.startsWith('admin.')) {
          window.location.href = '/';
        } else {
          router.push('/admin');
        }
      }
    } catch {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-[#eceae4] rounded-3xl shadow-xl shadow-stone-200/50 p-8 relative z-10">
        
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-200 mb-4">
            S
          </div>
          <h1 className="text-2xl font-bold text-[#1c1c1c] tracking-tight">
            Admin Portal
          </h1>
          <p className="text-sm text-[#6b6b6b] mt-1 font-medium">
            Sahinaja ERP System
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-rose-600 border border-red-100 rounded-2xl text-sm font-medium flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@sahinaja.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#eceae4] rounded-xl text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-[#1c1c1c]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 bg-white border border-[#eceae4] rounded-xl text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-[#1c1c1c]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 transition-all shadow-md shadow-rose-200"
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-[#eceae4] pt-6">
          <p className="text-[10px] font-semibold text-[#1c1c1c]/40 uppercase tracking-widest">
            Protected Area • Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
