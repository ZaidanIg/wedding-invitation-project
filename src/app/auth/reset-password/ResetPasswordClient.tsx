'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', text: 'Token reset tidak ditemukan. Silakan minta link baru.' });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus({ type: 'success', text: 'Kata sandi berhasil diperbarui! Silakan login kembali.' });
        setTimeout(() => router.push('/auth/signin'), 3000);
      } else {
        setStatus({ type: 'error', text: data.message || 'Gagal mereset kata sandi' });
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'Gagal menghubungi server' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfcf9] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-rose-gradient shadow-lg shadow-rose-500/20">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-display font-bold text-[#1c1c1c]">
              Wedding <span className="text-rose-500">Invitation</span>
            </span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Atur Ulang Kata Sandi</h1>
          <p className="text-[#6b6b6b] mt-3">Silakan masukkan kata sandi baru Anda.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8 border-[#eceae4] shadow-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem]">
            {status?.type === 'success' ? (
              <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-[#1c1c1c]">Berhasil!</h3>
                <p className="text-[#6b6b6b]">{status.text}</p>
                <p className="text-sm text-[#6b6b6b]/40">Anda akan diarahkan ke halaman login dalam 3 detik...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status?.type === 'error' && (
                  <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {status.text}
                  </div>
                )}

                <Input
                  label="Kata Sandi Baru"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  disabled={!token || isLoading}
                  className="rounded-2xl h-12"
                />

                <Input
                  label="Konfirmasi Kata Sandi Baru"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!token || isLoading}
                  className="rounded-2xl h-12"
                />

                <Button
                  type="submit"
                  className="w-full bg-[#1c1c1c] text-white rounded-2xl h-14 text-lg shadow-xl"
                  isLoading={isLoading}
                  disabled={!token}
                >
                  Simpan Kata Sandi
                </Button>
              </form>
            )}

            {!token && status?.type === 'error' && (
              <div className="mt-8 pt-8 border-t border-[#eceae4]/50 text-center">
                <Link href="/auth/forgot-password">
                  <Button variant="secondary" className="w-full rounded-2xl h-12">
                    Minta Link Baru
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
