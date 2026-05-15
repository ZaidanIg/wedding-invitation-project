'use client';

import { signIn } from 'next-auth/react';
import { Heart, Mail, Lock, User, ArrowRight, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
  });

  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-transparent' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score === 3 || score === 4) return { score, label: 'Good', color: 'bg-amber-400' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);
  const isMatch = formData.password && formData.confirmPassword === formData.password;

  const handleSendCode = async () => {
    if (!formData.email) {
      setError('Please enter your email first to receive a code.');
      return;
    }
    setIsSendingCode(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send code.');
      } else {
        setSuccessMsg('Code sent! Please check your email.');
        setCooldown(60);
      }
    } catch (err) {
      setError('An error occurred while sending the code.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch {
      setError('Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        // Login
        const res = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (res?.error) {
          setError(res.error);
          setIsLoading(false);
        } else {
          router.push('/dashboard');
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
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
          setError(data.error || 'Failed to register');
          setIsLoading(false);
          return;
        }

        // Auto login after successful registration since email is already verified by the code
        const loginRes = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (loginRes?.error) {
          setError('Registered successfully, but failed to log in');
          setIsLoading(false);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl animate-float-delayed" />
        </div>

        {/* Card */}
        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl shadow-rose-500/5">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 mb-4 shadow-lg shadow-rose-500/25">
              <Heart className="h-6 w-6 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-sm text-foreground/50">
              {isLogin
                ? 'Sign in to access your wedding invitations'
                : 'Sign up to create your perfect wedding invitation'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-foreground/40" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-foreground/40" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground"
                  placeholder="you@example.com"
                />
              </div>
              
              {!isLogin && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isSendingCode || cooldown > 0 || !formData.email}
                    className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-medium transition-colors disabled:opacity-50"
                  >
                    {isSendingCode ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send Code'}
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Verification Code</label>
                <input
                  type="text"
                  required={!isLogin}
                  maxLength={6}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground"
                  placeholder="------"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/80">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-foreground/40" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground"
                  placeholder="••••••••"
                />
              </div>
              {isLogin && (
                <div className="pt-1 flex justify-end">
                  <Link href="/auth/forgot-password" className="text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors">
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
                  <p className={`text-xs mt-1 text-right ${
                    strength.label === 'Weak' ? 'text-rose-500' : strength.label === 'Good' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/80">Re-type Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-foreground/40" />
                  </div>
                  <input
                    type="password"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-foreground"
                    placeholder="••••••••"
                  />
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
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isLogin && (!isMatch || formData.code.length !== 6))}
              className="w-full flex items-center justify-center gap-2 mt-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium text-sm hover:opacity-90 transition-all duration-200 shadow-md shadow-rose-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-foreground/30">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white text-gray-800 font-medium text-sm hover:bg-gray-100 transition-all duration-200 shadow-md disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Toggle */}
          <p className="mt-8 text-center text-sm text-foreground/50">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccessMsg('');
                setFormData({ name: '', email: '', password: '', confirmPassword: '', code: '' });
              }}
              className="text-rose-500 hover:text-rose-400 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
