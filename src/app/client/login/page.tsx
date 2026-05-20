"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ClientLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: username,
        password,
        loginType: 'CLIENT',
      });

      if (res?.error) {
        setErrorMsg("Invalid username or password");
      } else {
        router.push('/client');
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 font-serif">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-[#f0ebe1]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-[#2c2a29] mb-2 font-display">
            Sahinaja<span className="text-rose-400">.</span>
          </Link>
          <h1 className="text-xl text-[#5c5957]">Client Portal Access</h1>
          <p className="text-sm text-[#8c8885] mt-2 font-sans">Enter the credentials provided by vendor.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-sans">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5 font-sans">
            <label className="text-sm font-medium text-[#4a4745]">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-[#2c2a29]"
              placeholder="username"
            />
          </div>

          <div className="space-y-1.5 font-sans">
            <label className="text-sm font-medium text-[#4a4745]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#e8e4db] focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-[#2c2a29]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center py-3 px-4 bg-[#2c2a29] hover:bg-[#1a1918] text-white rounded-lg transition-colors font-sans font-medium mt-6 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
