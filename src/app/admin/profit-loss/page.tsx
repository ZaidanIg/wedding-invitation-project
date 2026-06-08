'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import { showToast } from '@/components/ui/Toast';
import { 
  Calculator, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight,
  Percent,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PLSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueCount: number;
  expenseCount: number;
}

export default function ProfitLossPage() {
  const [summary, setSummary] = useState<PLSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/profit-loss');
      const json = await res.json();
      if (json.success) {
        setSummary(json.data);
      }
    } catch {
      showToast('error', 'Gagal memuat ringkasan Laba & Rugi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const totalRevenue = summary?.totalRevenue ?? 0;
  const totalExpenses = summary?.totalExpenses ?? 0;
  const netProfit = summary?.netProfit ?? 0;
  const margin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;
  const isLoss = netProfit < 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Laporan Laba &amp; Rugi (P&amp;L)</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Analisis profitabilitas platform secara real-time dengan membandingkan omzet (Revenue) dan beban biaya (Expenses).</p>
        </div>
        <button 
          onClick={loadSummary}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eceae4] rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Segarkan
        </button>
      </div>

      {isLoading || !summary ? (
        <div className="py-20 flex justify-center items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
          <span className="text-sm text-[#6b6b6b] font-bold">Menghitung keuangan...</span>
        </div>
      ) : (
        <>
          {/* Top Level Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Total Pendapatan</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold font-display text-emerald-700">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">{summary.revenueCount} Transaksi Sukses</span>
              </div>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-fit mb-4">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Total Beban Biaya</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold font-display text-rose-700">
                  Rp {totalExpenses.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">{summary.expenseCount} Catatan Pengeluaran</span>
              </div>
            </Card>

            <Card className={`p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between ${isLoss ? 'border-red-300' : 'border-emerald-300'}`}>
              <div>
                <div className={`p-2.5 rounded-xl w-fit mb-4 ${isLoss ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {isLoss ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Laba / Rugi Bersih</span>
              </div>
              <div className="mt-3">
                <span className={`text-2xl font-bold font-display ${isLoss ? 'text-rose-700' : 'text-emerald-700'}`}>
                  Rp {netProfit.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">{isLoss ? 'Kerugian Bersih' : 'Keuntungan Bersih'}</span>
              </div>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl w-fit mb-4">
                  <Percent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Margin Keuntungan</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold font-display text-violet-700">
                  {margin}%
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">Rasio Margin Laba Bersih</span>
              </div>
            </Card>
          </div>

          {/* Detailed Financial Statement */}
          <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm max-w-2xl">
            <h3 className="text-lg font-bold text-[#1c1c1c] mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-rose-500" />
              Laporan Keuangan Komprehensif
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between font-bold text-[#1c1c1c] border-b border-[#eceae4] pb-2">
                <span>Keterangan</span>
                <span>Jumlah (Rupiah)</span>
              </div>

              {/* Revenue Section */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-emerald-800 bg-emerald-50/30 px-3 py-1.5 rounded-lg">
                  <span>Total Pendapatan (Omzet)</span>
                  <span>Rp {totalRevenue.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pl-6 text-stone-600 text-xs">
                  <span>- Upgrade Undangan &amp; Lisensi SaaS</span>
                  <span>Rp {totalRevenue.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Expenses Section */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between font-semibold text-rose-800 bg-rose-50/30 px-3 py-1.5 rounded-lg">
                  <span>Total Pengeluaran (Beban Biaya)</span>
                  <span>-Rp {totalExpenses.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pl-6 text-stone-600 text-xs">
                  <span>- Biaya Server &amp; Penunjang IT</span>
                  <span>-Rp {totalExpenses.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Summary Section */}
              <div className={`flex justify-between font-bold text-lg border-t-2 border-[#eceae4] pt-4 px-3 py-2 rounded-xl mt-6 ${isLoss ? 'bg-red-500/10 text-rose-700' : 'bg-emerald-500/10 text-emerald-700'}`}>
                <span>Pendapatan Bersih (Net Income)</span>
                <span>Rp {netProfit.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
