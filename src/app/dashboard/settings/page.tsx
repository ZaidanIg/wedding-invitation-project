'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Building2, Mail, Shield, Save, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [agencyName, setAgencyName] = useState('');
  const [userName, setUserName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || '');
      fetchAgency();
    }
  }, [session]);

  const fetchAgency = async () => {
    try {
      const res = await fetch('/api/agency');
      const data = await res.json();
      if (data.success && data.data) {
        setAgencyName(data.data.name || '');
      }
    } catch {}
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await fetch('/api/agency', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: agencyName }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // handle error
    } finally {
      setIsSaving(false);
    }
  };

  const tierLabel = (type?: string) => {
    switch (type) {
      case 'B2B_ALL_TIME': return 'Enterprise (Lifetime)';
      case 'B2B_PRO': return 'B2B Professional';
      default: return 'Free';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-zinc-900">Settings</h2>
        <p className="text-xs lg:text-sm text-zinc-500">Kelola profil dan pengaturan akun Anda.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900">Profil</h3>
        </div>
        <div className="p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="Profile" width={64} height={64} className="rounded-full object-cover" />
              ) : (
                <User className="h-7 w-7 text-zinc-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-zinc-400">{session?.user?.email}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300"
              />
            </div>
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agency Section */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900">Agency</h3>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Nama Agency</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Nama Agensi Anda"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Tier */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900">Paket Langganan</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">{tierLabel(session?.user?.accountType)}</p>
              <p className="text-xs text-zinc-400">Paket aktif Anda saat ini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Perubahan
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Tersimpan!
          </span>
        )}
      </div>
    </div>
  );
}
