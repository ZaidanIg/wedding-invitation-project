'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Pagination, { type PaginationMeta } from '@/components/ui/Pagination';
import { showToast } from '@/components/ui/Toast';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  RefreshCw, 
  DollarSign
} from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  category: 'INFRASTRUCTURE' | 'MARKETING' | 'PAYROLL' | 'SOFTWARE' | 'OPERATIONAL' | 'OTHER';
  description: string;
  amount: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  INFRASTRUCTURE: 'Infrastruktur / Server',
  MARKETING: 'Pemasaran / Iklan',
  PAYROLL: 'Gaji Tim',
  SOFTWARE: 'SaaS / Software Pendukung',
  OPERATIONAL: 'Operasional Kantor',
  OTHER: 'Lainnya',
};

const CATEGORY_BG: Record<string, string> = {
  INFRASTRUCTURE: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  MARKETING: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  PAYROLL: 'bg-sky-50 text-sky-700 border-sky-100',
  SOFTWARE: 'bg-amber-50 text-amber-700 border-amber-100',
  OPERATIONAL: 'bg-violet-50 text-violet-700 border-violet-100',
  OTHER: 'bg-stone-50 text-stone-700 border-stone-100',
};

const LIMIT = 15;
const DEFAULT_META: PaginationMeta = { page: 1, limit: LIMIT, total: 0, totalPages: 1 };

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [category, setCategory] = useState<'INFRASTRUCTURE' | 'MARKETING' | 'PAYROLL' | 'SOFTWARE' | 'OPERATIONAL' | 'OTHER'>('OPERATIONAL');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadExpenses = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: String(LIMIT) });
      const res = await fetch(`/api/admin/expenses?${params}`);
      const json = await res.json();
      if (json.success) {
        setExpenses(json.data);
        setMeta(json.meta);
      }
    } catch {
      showToast('error', 'Gagal memuat daftar pengeluaran');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => { loadExpenses(page); }, 0);
  }, [page, loadExpenses]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showToast('error', 'Jumlah pengeluaran harus angka positif');
      return;
    }
    if (!description.trim()) {
      showToast('error', 'Deskripsi pengeluaran harus diisi');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          amount: Math.round(Number(amount)),
          description: description.trim(),
          date,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Pengeluaran berhasil ditambahkan!');
        setAmount('');
        setDescription('');
        setIsAdding(false);
        setPage(1);
        loadExpenses(1);
      } else {
        showToast('error', json.message ?? 'Gagal menambahkan pengeluaran');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan sistem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Hapus item pengeluaran ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/admin/expenses?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Pengeluaran dihapus!');
        loadExpenses(page);
      } else {
        showToast('error', json.message ?? 'Gagal menghapus pengeluaran');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan sistem');
    }
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group by category for simple breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] ?? 0) + exp.amount;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Pengeluaran Bulanan (Expenses)</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Catat biaya infrastruktur, operasional, gaji, dan kampanye pemasaran platform.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAdding(!isAdding)}
            className="h-10 px-4 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Catat Pengeluaran
          </Button>
          <button 
            onClick={() => loadExpenses(page)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eceae4] rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Segarkan
          </button>
        </div>
      </div>

      {/* KPI & Category Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-fit mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider block">Total Pengeluaran</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-display text-[#1c1c1c]">
              Rp {totalSpent.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] block font-bold mt-1 text-[#6b6b6b]">Biaya akumulatif</span>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm md:col-span-2">
          <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider block mb-4">Breakdown Kategori</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.keys(CATEGORY_LABELS).map((cat) => {
              const amount = categoryTotals[cat] ?? 0;
              const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
              return (
                <div key={cat} className="p-3 border border-[#eceae4] rounded-2xl bg-stone-50/40">
                  <span className="text-[10px] font-bold text-[#6b6b6b] block truncate">{CATEGORY_LABELS[cat]}</span>
                  <span className="text-sm font-bold text-[#1c1c1c] block mt-1">Rp {amount.toLocaleString('id-ID')}</span>
                  <span className="text-[9px] font-semibold text-rose-500 block mt-0.5">{percentage}% kontribusi</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Form Card */}
      {isAdding && (
        <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm max-w-lg">
          <h3 className="text-lg font-bold text-[#1c1c1c] mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-500" />
            Tambah Catatan Pengeluaran
          </h3>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                >
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Tanggal</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Jumlah (Rupiah)</label>
              <input
                type="number"
                placeholder="Contoh: 150000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Deskripsi / Catatan</label>
              <input
                type="text"
                placeholder="Contoh: Pembayaran Cloud VPS Contabo Bulan Juni"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                disabled={submitting}
                type="submit"
                className="flex-1 h-11 rounded-xl bg-[#1c1c1c] text-white font-bold text-sm hover:bg-[#2c2a29] transition-all"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Transaksi'}
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

      {/* Table Card */}
      <Card className="bg-white border-[#eceae4] rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
            <span className="text-sm text-[#6b6b6b] font-bold">Memuat data pengeluaran...</span>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-20 text-[#6b6b6b] font-semibold text-sm">
            Belum ada catatan pengeluaran bulan ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest bg-stone-50/50">
                  <th className="py-4 px-5">Tanggal</th>
                  <th className="py-4 px-5">Kategori</th>
                  <th className="py-4 px-5">Deskripsi</th>
                  <th className="py-4 px-5 text-right">Jumlah</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b border-[#eceae4]/40 hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                    <td className="py-4 px-5 text-xs text-[#6b6b6b]">
                      {new Date(exp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-5">
                      <Badge className={`${CATEGORY_BG[exp.category] ?? ''} text-[10px] font-bold uppercase px-2 py-0.5 border`}>
                        {CATEGORY_LABELS[exp.category]}
                      </Badge>
                    </td>
                    <td className="py-4 px-5 text-stone-700">{exp.description}</td>
                    <td className="py-4 px-5 text-right font-bold text-rose-600">
                      -Rp {exp.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => handleDeleteExpense(exp.id)} 
                        className="inline-flex items-center text-xs font-bold text-[#b91c1c] hover:text-red-700 transition-colors p-1.5 bg-red-50 border border-red-100 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination meta={meta} onPageChange={setPage} />
      </Card>
    </div>
  );
}
