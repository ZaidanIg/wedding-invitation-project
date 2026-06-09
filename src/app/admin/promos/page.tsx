'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Percent,
  Power,
  PowerOff
} from 'lucide-react';

interface Promo {
  id: string;
  code: string;
  description: string | null;
  discountPercent: number;
  maxDiscountAmount: number | null;
  maxGlobalUsage: number;
  usageCount: number;
  usageLimitPerUser: number;
  usageLimitPerIp: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [maxGlobalUsage, setMaxGlobalUsage] = useState('0');
  const [usageLimitPerUser, setUsageLimitPerUser] = useState('1');
  const [usageLimitPerIp, setUsageLimitPerIp] = useState('1');
  const [expiresAt, setExpiresAt] = useState('');

  const loadPromos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/promos');
      const json = await res.json();
      if (json.success) {
        setPromos(json.data);
      }
    } catch {
      showToast('error', 'Gagal memuat data promo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => { loadPromos(); }, 0);
  }, [loadPromos]);

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('error', 'Kode promo harus diisi');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        description: description.trim() || undefined,
        discountPercent: parseInt(discountPercent, 10),
        maxDiscountAmount: maxDiscountAmount ? parseInt(maxDiscountAmount, 10) : null,
        maxGlobalUsage: parseInt(maxGlobalUsage, 10) || 0,
        usageLimitPerUser: parseInt(usageLimitPerUser, 10) || 0,
        usageLimitPerIp: parseInt(usageLimitPerIp, 10) || 0,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      };

      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Promo berhasil dibuat!');
        setCode('');
        setDescription('');
        setIsAdding(false);
        loadPromos();
      } else {
        showToast('error', json.message ?? 'Gagal membuat promo');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan sistem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/promos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Status promo diperbarui');
        loadPromos();
      } else {
        showToast('error', 'Gagal update status promo');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan sistem');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus promo ini?')) return;
    try {
      const res = await fetch(`/api/admin/promos?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Promo dihapus');
        loadPromos();
      } else {
        showToast('error', 'Gagal menghapus promo');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan sistem');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Voucher & Promo</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Kelola kode diskon, batasan kuota, dan pantau penggunaannya.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAdding(!isAdding)}
            className="h-10 px-4 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Buat Voucher
          </Button>
          <button 
            onClick={loadPromos}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eceae4] rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Segarkan
          </button>
        </div>
      </div>

      {isAdding && (
        <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm max-w-2xl">
          <h3 className="text-lg font-bold text-[#1c1c1c] mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-rose-500" />
            Buat Voucher Diskon
          </h3>
          <form onSubmit={handleCreatePromo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Kode Promo</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SAHINAJA10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500 uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Potongan (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1" max="100" required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full h-11 bg-white border border-[#eceae4] rounded-xl pl-9 pr-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                  />
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Deskripsi Opsional</label>
              <input
                type="text"
                placeholder="Contoh: Diskon Kemerdekaan RI"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-100 pt-4 mt-4">
              <div>
                <label className="block text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Limit Global (Total)</label>
                <input
                  type="number" min="0"
                  value={maxGlobalUsage}
                  onChange={(e) => setMaxGlobalUsage(e.target.value)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                  title="0 berarti tanpa limit"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Maks Pakai per User</label>
                <input
                  type="number" min="0"
                  value={usageLimitPerUser}
                  onChange={(e) => setUsageLimitPerUser(e.target.value)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Maks Pakai per IP</label>
                <input
                  type="number" min="0"
                  value={usageLimitPerIp}
                  onChange={(e) => setUsageLimitPerIp(e.target.value)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Maksimum Diskon (Rp) - Opsional</label>
                <input
                  type="number" min="0" placeholder="Biarkan kosong jika tanpa batas atas"
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Batas Kedaluwarsa (Opsional)</label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-stone-100">
              <Button
                disabled={submitting}
                type="submit"
                className="flex-1 h-11 rounded-xl bg-[#1c1c1c] text-white font-bold text-sm hover:bg-[#2c2a29] transition-all"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Promo'}
              </Button>
              <Button
                type="button"
                onClick={() => setIsAdding(false)}
                variant="ghost"
                className="h-11 px-5 rounded-xl border border-stone-200 text-stone-600 font-bold text-sm"
              >
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="bg-white border-[#eceae4] rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
            <span className="text-sm text-[#6b6b6b] font-bold">Memuat promo...</span>
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-20 text-[#6b6b6b] font-semibold text-sm">
            Belum ada voucher yang dibuat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest bg-stone-50/50">
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Kode Promo</th>
                  <th className="py-4 px-5">Diskon</th>
                  <th className="py-4 px-5">Terpakai</th>
                  <th className="py-4 px-5">Limit (Gl/Usr/Ip)</th>
                  <th className="py-4 px-5">Kedaluwarsa</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {promos.map((promo) => (
                  <tr key={promo.id} className="border-b border-[#eceae4]/40 hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                    <td className="py-4 px-5">
                      <Badge className={promo.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}>
                        {promo.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-rose-600">{promo.code}</div>
                      <div className="text-[10px] text-stone-500">{promo.description}</div>
                    </td>
                    <td className="py-4 px-5 font-bold">
                      {promo.discountPercent}%
                      {promo.maxDiscountAmount && (
                         <div className="text-[10px] text-stone-500 block font-normal">Maks Rp {promo.maxDiscountAmount.toLocaleString('id-ID')}</div>
                      )}
                    </td>
                    <td className="py-4 px-5 font-bold">
                      {promo.usageCount}
                    </td>
                    <td className="py-4 px-5 text-xs">
                      <span title="Global Limit">{promo.maxGlobalUsage || '∞'}</span> / 
                      <span title="User Limit"> {promo.usageLimitPerUser || '∞'}</span> / 
                      <span title="IP Limit"> {promo.usageLimitPerIp || '∞'}</span>
                    </td>
                    <td className="py-4 px-5 text-xs">
                      {promo.expiresAt 
                        ? new Date(promo.expiresAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                        : 'Tanpa Batas'}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleToggleActive(promo.id, promo.isActive)} 
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600"
                          title={promo.isActive ? "Nonaktifkan Promo" : "Aktifkan Promo"}
                        >
                          {promo.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4 text-emerald-600" />}
                        </button>
                        <button 
                          onClick={() => handleDelete(promo.id)} 
                          className="p-1.5 bg-red-50 border border-red-100 rounded-lg text-red-600 hover:bg-red-100"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
