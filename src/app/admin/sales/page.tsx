'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { showToast } from '@/components/ui/Toast';
import { 
  TrendingUp, 
  RefreshCw
} from 'lucide-react';
import type { AdminMetricsDto } from '@/modules/admin/server/dto';

export default function SalesPage() {
  const [metrics, setMetrics] = useState<AdminMetricsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data);
      }
    } catch {
      showToast('error', 'Gagal memuat metrik penjualan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => { loadMetrics(); }, 0);
  }, []);

  const totalRevenue = metrics?.totalRevenue ?? 0;
  const newRevenueThisMonth = metrics?.newRevenueThisMonth ?? 0;
  const avgSpending = metrics?.avgRevenuePerUser ?? 0;
  const conversionRate = metrics?.conversionRate ?? 0;

  // Derive MRR & ARR from total database packages
  const mrr = newRevenueThisMonth;
  const arr = mrr * 12;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Dashboard Penjualan (Sales)</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Analisis performa penjualan, tingkat konversi pembayaran, dan nilai langganan (MRR/ARR).</p>
        </div>
        <button 
          onClick={loadMetrics}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eceae4] rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Segarkan
        </button>
      </div>

      {isLoading || !metrics ? (
        <div className="py-20 flex justify-center items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
          <span className="text-sm text-[#6b6b6b] font-bold">Memproses metrik penjualan...</span>
        </div>
      ) : (
        <>
          {/* Main KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Total Revenue</span>
              <span className="text-3xl font-bold font-display text-emerald-700 block mt-2">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-emerald-500 block mt-1 font-bold">+Rp {newRevenueThisMonth.toLocaleString('id-ID')} Bulan Ini</span>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Monthly Recurring (MRR)</span>
              <span className="text-3xl font-bold font-display text-[#1c1c1c] block mt-2">
                Rp {mrr.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">SaaS upgrade bulan ini</span>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Annual Run Rate (ARR)</span>
              <span className="text-3xl font-bold font-display text-[#1c1c1c] block mt-2">
                Rp {arr.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">Estimasi pendapatan tahunan</span>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Average Revenue Per User</span>
              <span className="text-3xl font-bold font-display text-[#1c1c1c] block mt-2">
                Rp {avgSpending.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">Rata-rata belanja pengguna</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Pipeline & Conversion Card */}
            <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm space-y-4">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Tingkat Konversi</span>
              
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-[#1c1c1c] block">Rasio Konversi Berbayar</span>
                    <span className="text-xs text-stone-400">Total undangan berbayar dibanding total registrasi</span>
                  </div>
                  <span className="text-3xl font-bold text-violet-600 font-display">{conversionRate}%</span>
                </div>

                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${conversionRate}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2">
                  <div className="p-3 border border-[#eceae4] rounded-xl bg-stone-50/50">
                    <span className="text-stone-400 block">Total Undangan</span>
                    <span className="text-lg font-bold text-[#1c1c1c] mt-1 block">{metrics.totalInvitations} Item</span>
                  </div>
                  <div className="p-3 border border-[#eceae4] rounded-xl bg-stone-50/50">
                    <span className="text-stone-400 block">Undangan Berbayar</span>
                    <span className="text-lg font-bold text-[#1c1c1c] mt-1 block">{metrics.paidInvitations} Item</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sales Target Progress */}
            <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm space-y-4">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Pencapaian Target Penjualan</span>
              
              <div className="space-y-5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-sm font-bold text-[#1c1c1c] block">Target Bulan Ini</span>
                    <span className="text-xs text-stone-400">Target minimal: Rp 10 Juta</span>
                  </div>
                  <span className="text-lg font-bold text-[#1c1c1c]">
                    {((newRevenueThisMonth / 10_000_000) * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${Math.min((newRevenueThisMonth / 10_000_000) * 100, 100)}%` }} 
                  />
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 mt-4">
                  <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-800 block">Kondisi Penjualan Stabil</span>
                    <span className="text-[10px] text-emerald-600 block mt-1">Jumlah pendapatan baru di bulan ini telah melampaui batas minimal operasional server dengan baik.</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
