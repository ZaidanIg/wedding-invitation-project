'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ChevronLeft, Heart, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghubungi server' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfcf9] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group mb-8">
            <div className="p-2 rounded-xl bg-rose-gradient shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-display font-bold text-[#1c1c1c]">
              Wedding <span className="text-rose-500">Invitation</span>
            </span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Lupa Kata Sandi?</h1>
          <p className="text-[#6b6b6b] mt-3">Masukkan email Anda untuk menerima link reset.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 border-[#eceae4] shadow-2xl bg-white/80 backdrop-blur-xl rounded-[2.5rem]">
            {message ? (
              <div className="text-center space-y-6 py-4">
                <div className={`p-4 rounded-2xl ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} text-sm font-medium`}>
                  {message.text}
                </div>
                {message.type === 'success' && (
                  <p className="text-sm text-[#6b6b6b]">Silakan periksa kotak masuk atau folder spam email Anda.</p>
                )}
                <Button 
                  variant="secondary" 
                  className="w-full rounded-2xl h-12"
                  onClick={() => setMessage(null)}
                >
                  Coba lagi
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Alamat Email"
                  type="email"
                  placeholder="name@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-2xl h-12"
                />

                <Button
                  type="submit"
                  className="w-full bg-[#1c1c1c] text-white rounded-2xl h-14 text-lg shadow-xl shadow-stone-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  isLoading={isLoading}
                >
                  Kirim Link Reset
                </Button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-[#eceae4]/50 text-center">
              <Link 
                href="/auth/signin" 
                className="inline-flex items-center text-sm font-bold text-[#1c1c1c]/60 hover:text-rose-500 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali ke Login
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
