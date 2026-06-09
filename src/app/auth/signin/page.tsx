'use client';

import { signIn } from 'next-auth/react';
import { Heart, Mail, Lock, User, ArrowRight, Check, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

// Frontend validation schemas
const sendCodeSchema = z.object({
  email: z.string().email('Format email tidak valid'),
});

const loginFormSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

const registerFormSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  code: z.string().length(6, 'Kode verifikasi harus 6 digit'),
  password: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .regex(/[A-Z]/, 'Kata sandi harus mengandung minimal 1 huruf besar')
    .regex(/[a-z]/, 'Kata sandi harus mengandung minimal 1 huruf kecil')
    .regex(/[0-9]/, 'Kata sandi harus mengandung minimal 1 angka')
    .regex(/[^A-Za-z0-9]/, 'Kata sandi harus mengandung minimal 1 karakter spesial'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi kata sandi tidak cocok',
  path: ['confirmPassword'],
});

export default function SignInPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
  });

  // Initial session restore
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('auth_email');
    const cooldownUntil = sessionStorage.getItem('cooldown_until');
    
    if (savedEmail) {
      setTimeout(() => { setFormData(prev => ({ ...prev, email: savedEmail })); }, 0);
    }
    
    if (cooldownUntil) {
      const until = parseInt(cooldownUntil, 10);
      const now = Date.now();
      if (until > now) {
        setCooldown(Math.ceil((until - now) / 1000));
      }
    }
  }, []);

  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Read NextAuth errors from URL search parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get('error');
      const urlCode = params.get('code');
      // NextAuth v5 beta: custom code may be in 'code' param, error type in 'error'
      const errorKey = urlCode || urlError;
      if (errorKey) {
        if (
          errorKey === 'OAuthAccountNotLinked' ||
          errorKey === 'OAuthNotLinked' ||
          errorKey.toLowerCase().includes('oauth')
        ) {
          setTimeout(() => { setError('Email Anda sudah terdaftar. Silakan masuk menggunakan kata sandi yang Anda buat sebelumnya.'); }, 0);
        } else if (errorKey === 'USER_NOT_FOUND') {
          setError('Akun dengan email ini tidak terdaftar. Silakan daftar terlebih dahulu.');
        } else if (errorKey === 'EMAIL_NOT_VERIFIED') {
          setError('Akun Anda belum diverifikasi. Silakan periksa email Anda untuk tautan verifikasi.');
        } else if (errorKey === 'TOO_MANY_REQUESTS') {
          setError('Terlalu banyak percobaan masuk. Silakan coba lagi dalam 1 menit.');
        } else if (errorKey === 'INVALID_EMAIL_OR_PASSWORD') {
          setError('Kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
        } else if (errorKey === 'CallbackRouteError' || urlError === 'CallbackRouteError') {
          // Jangan tampilkan error teknis NextAuth ke user
          setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
        } else if (urlError && urlError !== 'CallbackRouteError') {
          // Hide semua internal/technical error lainnya
          setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
        }
      }
    }
  }, []);

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-transparent' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Lemah', color: 'bg-rose-500' };
    if (score === 3 || score === 4) return { score, label: 'Sedang', color: 'bg-amber-400' };
    return { score, label: 'Kuat', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);
  const isMatch = formData.password && formData.confirmPassword === formData.password;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSendCode = async () => {
    setValidationErrors({});
    setError('');
    setSuccessMsg('');

    const parsed = sendCodeSchema.safeParse({ email: formData.email });
    if (!parsed.success) {
      const err = parsed.error.issues[0];
      setValidationErrors({ email: err.message });
      return;
    }

    setIsSendingCode(true);

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Gagal mengirim kode verifikasi.');
      } else {
        setSuccessMsg(data.message || 'Kode verifikasi berhasil dikirim! Silakan periksa email Anda.');
        setCooldown(60);
        sessionStorage.setItem('auth_email', formData.email);
        sessionStorage.setItem('cooldown_until', (Date.now() + 60 * 1000).toString());
      }
    } catch (_err) {
      setError('Terjadi kesalahan saat mengirimkan kode verifikasi.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch {
      setError('Gagal masuk menggunakan Google');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    setSuccessMsg('');
    setValidationErrors({});

    try {
      if (isLogin) {
        // Validate login on client
        const parsed = loginFormSchema.safeParse({
          email: formData.email,
          password: formData.password,
        });

        if (!parsed.success) {
          const errors: Record<string, string> = {};
          parsed.error.issues.forEach((err) => {
            if (err.path[0]) errors[err.path[0].toString()] = err.message;
          });
          setValidationErrors(errors);
          setIsLoading(false);
          return;
        }

        // Login NextAuth
        const res = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (res?.error) {
          // NextAuth v5 beta: custom error code is in res.code, res.error = 'CallbackRouteError'
          const errorCode = (res as any).code || res.error;

          // Map custom error codes to user-friendly Indonesian messages
          if (errorCode === 'USER_NOT_FOUND') {
            setError('Akun dengan email ini tidak terdaftar. Silakan daftar terlebih dahulu.');
          } else if (errorCode === 'INVALID_EMAIL_OR_PASSWORD') {
            setError('Kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
          } else if (errorCode === 'EMAIL_NOT_VERIFIED') {
            setError('Akun Anda belum diverifikasi. Silakan periksa email Anda untuk tautan verifikasi.');
          } else if (errorCode === 'EMAIL_PASSWORD_REQUIRED') {
            setError('Email dan kata sandi wajib diisi.');
          } else if (errorCode === 'TOO_MANY_REQUESTS') {
            setError('Terlalu banyak percobaan masuk. Silakan coba lagi dalam 1 menit.');
          } else if (
            errorCode === 'OAuthAccountNotLinked' ||
            errorCode === 'OAuthNotLinked' ||
            (typeof errorCode === 'string' && errorCode.toLowerCase().includes('oauth'))
          ) {
            setError('Email Anda sudah terdaftar. Silakan masuk menggunakan kata sandi yang Anda buat sebelumnya.');
          } else {
            // Catch-all: jangan tampilkan error teknis seperti 'CallbackRouteError' ke user
            setError('Terjadi kesalahan saat masuk. Silakan coba lagi atau hubungi dukungan.');
          }
          setIsLoading(false);
        } else {
          router.push('/dashboard');
        }
      } else {
        // Validate registration on client
        const parsed = registerFormSchema.safeParse(formData);

        if (!parsed.success) {
          const errors: Record<string, string> = {};
          parsed.error.issues.forEach((err) => {
            if (err.path[0]) errors[err.path[0].toString()] = err.message;
          });
          setValidationErrors(errors);
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            code: formData.code,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Gagal mendaftarkan akun');
          setIsLoading(false);
          return;
        }

        // Auto redirect to login after successful registration
        setIsLogin(true);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '', code: '' }));
        setSuccessMsg('Registrasi berhasil! Silakan masuk dengan email dan kata sandi Anda.');
        setIsLoading(false);
      }
    } catch (_err) {
      setError('Terjadi kesalahan yang tidak terduga.');
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl animate-float-delayed" />
        </div>

        {/* Card */}
        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-[0_0_50px_rgba(225,29,72,0.15)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 mb-4 shadow-lg shadow-rose-500/25">
              <Heart className="h-6 w-6 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </h1>
            <p className="text-sm text-foreground/50">
              {isLogin
                ? 'Masuk ke akun Sahinaja untuk mengelola undangan Anda'
                : 'Daftar akun Sahinaja untuk membuat undangan pernikahan premium'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex items-start gap-2.5">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-foreground/40" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${
                      validationErrors.name ? 'border-rose-500/50' : 'border-white/10'
                    } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground`}
                    placeholder="Nama Anda"
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-xs text-rose-500 mt-1 ml-1 font-medium">{validationErrors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-foreground/40" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${
                    validationErrors.email ? 'border-rose-500/50' : 'border-white/10'
                  } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground`}
                  placeholder="you@example.com"
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs text-rose-500 mt-1 ml-1 font-medium">{validationErrors.email}</p>
              )}
              
              {!isLogin && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isSendingCode || cooldown > 0 || !formData.email}
                    className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSendingCode ? 'Mengirim...' : cooldown > 0 ? `Kirim ulang dalam ${cooldown}s` : 'Kirim Kode Verifikasi'}
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Kode Verifikasi</label>
                <input
                  type="text"
                  required={!isLogin}
                  maxLength={6}
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white/5 border ${
                    validationErrors.code ? 'border-rose-500/50' : 'border-white/10'
                  } rounded-xl text-sm text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground`}
                  placeholder="------"
                />
                {validationErrors.code && (
                  <p className="text-xs text-rose-500 mt-1 text-center font-medium">{validationErrors.code}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-foreground/40" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 bg-white/5 border ${
                    validationErrors.password ? 'border-rose-500/50' : 'border-white/10'
                  } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/40 hover:text-foreground/80 transition-colors focus:outline-none cursor-pointer"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5 animate-eye-blink" />
                  ) : (
                    <Eye className="h-4.5 w-4.5 animate-eye-blink" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-xs text-rose-500 mt-1 ml-1 font-medium">{validationErrors.password}</p>
              )}

              {isLogin && (
                <div className="pt-1 flex justify-end">
                  <Link href="/auth/forgot-password" className="text-xs text-rose-500 hover:text-rose-400 font-semibold transition-colors">
                    Lupa Kata Sandi?
                  </Link>
                </div>
              )}
              {!isLogin && formData.password.length > 0 && (
                <div className="pt-2">
                  <div className="flex gap-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 transition-all duration-300 ${
                          i <= strength.score ? strength.color : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 text-right font-medium ${
                    strength.label === 'Lemah' ? 'text-rose-500' : strength.label === 'Sedang' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    Kekuatan Kata Sandi: {strength.label}
                  </p>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Ketik Ulang Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-foreground/40" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-16 py-2.5 bg-white/5 border ${
                      validationErrors.confirmPassword ? 'border-rose-500/50' : 'border-white/10'
                    } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-7 pr-1 flex items-center text-foreground/40 hover:text-foreground/80 transition-colors focus:outline-none cursor-pointer"
                    title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4.5 w-4.5 animate-eye-blink" />
                    ) : (
                      <Eye className="h-4.5 w-4.5 animate-eye-blink" />
                    )}
                  </button>
                  {formData.confirmPassword.length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {isMatch ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <X className="h-4 w-4 text-rose-500" />
                      )}
                    </div>
                  )}
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-rose-500 mt-1 ml-1 font-medium">{validationErrors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isLogin && (formData.code.length !== 6))}
              className="w-full flex items-center justify-center gap-2 mt-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm hover:opacity-90 transition-all duration-200 shadow-md shadow-rose-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-foreground/30">atau</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white text-gray-800 font-bold text-sm hover:bg-gray-100 transition-all duration-200 shadow-md disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Masuk dengan Google
          </button>

          {/* Toggle */}
          <p className="mt-8 text-center text-sm text-foreground/50">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMsg('');
                setValidationErrors({});
                setFormData({ name: '', email: '', password: '', confirmPassword: '', code: '' });
              }}
              className="text-rose-500 hover:text-rose-400 font-bold transition-colors"
            >
              {isLogin ? 'Daftar' : 'Masuk'}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
