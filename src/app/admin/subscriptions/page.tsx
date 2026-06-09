'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { showToast } from '@/components/ui/Toast';
import { 
  Repeat, 
  RefreshCw
} from 'lucide-react';

const PLAN_PERFORMANCE = [
  { tier: 'BASIC', name: 'Minimalist Package', price: 99000, activeCount: 45, mrrContribution: 4455000, color: 'bg-blue-500 text-white border-blue-500' },
  { tier: 'PREMIUM', name: 'Exclusive Package', price: 199000, activeCount: 85, mrrContribution: 16915000, color: 'bg-rose-500 text-white border-rose-500' },
  { tier: 'ULTIMATE', name: 'Full Access Package', price: 299000, activeCount: 20, mrrContribution: 5980000, color: 'bg-amber-500 text-white border-amber-500' },
];

export default function SubscriptionsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('success', 'Metrik langganan berhasil diperbarui');
    }, 600);
  };

  const totalActive = PLAN_PERFORMANCE.reduce((sum, pl) => sum + pl.activeCount, 0);
  const totalMrr = PLAN_PERFORMANCE.reduce((sum, pl) => sum + pl.mrrContribution, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Pengelolaan Paket Layanan (Subscriptions)</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Pantau performa penjualan tiap paket layanan, kontribusi MRR, dan jumlah pelanggan aktif.</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eceae4] rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Segarkan
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
          <span className="text-sm text-[#6b6b6b] font-bold">Menganalisis paket...</span>
        </div>
      ) : (
        <>
          {/* Subscriptions Aggregations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Total Pelanggan Aktif</span>
              <span className="text-3xl font-bold font-display text-[#1c1c1c] block mt-2">{totalActive} Akun</span>
              <span className="text-[10px] text-stone-400 block mt-1">Akun yang telah membayar upgrade</span>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Kontribusi MRR</span>
              <span className="text-3xl font-bold font-display text-emerald-700 block mt-2">
                Rp {totalMrr.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-emerald-500 block mt-1">Bulan berjalan</span>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Pertumbuhan Pelanggan</span>
              <span className="text-3xl font-bold font-display text-violet-600 block mt-2">+12% Bulan ini</span>
              <span className="text-[10px] text-violet-400 block mt-1">Tren pertumbuhan stabil</span>
            </Card>
          </div>

          {/* Subscriptions Plans Detail Card */}
          <Card className="bg-white border-[#eceae4] rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#eceae4]">
              <h3 className="text-lg font-bold text-[#1c1c1c] flex items-center gap-2">
                <Repeat className="w-5 h-5 text-rose-500" />
                Performa Rincian Paket Layanan
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest bg-stone-50/50">
                    <th className="py-4 px-5">Kode Paket</th>
                    <th className="py-4 px-5">Nama Paket</th>
                    <th className="py-4 px-5 text-right">Harga Satuan</th>
                    <th className="py-4 px-5 text-center">Pelanggan Aktif</th>
                    <th className="py-4 px-5 text-right">Total Pendapatan (MRR)</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAN_PERFORMANCE.map((pl, idx) => (
                    <tr key={idx} className="border-b border-[#eceae4]/40 hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                      <td className="py-4 px-5">
                        <Badge className={`${pl.color} text-[10px] font-bold uppercase px-2 py-0.5`}>
                          {pl.tier}
                        </Badge>
                      </td>
                      <td className="py-4 px-5 font-bold">{pl.name}</td>
                      <td className="py-4 px-5 text-right font-semibold text-stone-700">Rp {pl.price.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-5 text-center font-bold text-violet-600">{pl.activeCount}</td>
                      <td className="py-4 px-5 text-right text-emerald-700 font-bold">
                        Rp {pl.mrrContribution.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
