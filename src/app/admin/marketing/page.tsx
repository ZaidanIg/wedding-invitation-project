'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { showToast } from '@/components/ui/Toast';
import { 
  Megaphone, 
  RefreshCw, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign
} from 'lucide-react';

const MARKETING_CHANNELS = [
  { channel: 'Instagram Ads', spend: 1200000, leads: 145, conversionRate: 14.2, cac: 8200 },
  { channel: 'TikTok Ads', spend: 850000, leads: 110, conversionRate: 11.5, cac: 7700 },
  { channel: 'Google Search Ads', spend: 950000, leads: 85, conversionRate: 18.8, cac: 11100 },
  { channel: 'WhatsApp / Referral', spend: 150000, leads: 60, conversionRate: 35.0, cac: 2500 },
];

export default function MarketingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('success', 'Data pemasaran berhasil diperbarui');
    }, 600);
  };

  // Aggregated totals
  const totalSpend = MARKETING_CHANNELS.reduce((sum, ch) => sum + ch.spend, 0);
  const totalLeads = MARKETING_CHANNELS.reduce((sum, ch) => sum + ch.leads, 0);
  const avgCac = Math.round(totalSpend / totalLeads);
  const roas = 4.8; // Stand-in ROAS ratio based on simulated revenue

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Dashboard Pemasaran (Marketing)</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Pantau efektivitas iklan, biaya akuisisi pelanggan (CAC), dan kinerja saluran akuisisi.</p>
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
          <span className="text-sm text-[#6b6b6b] font-bold">Menganalisis iklan...</span>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Total Pengeluaran Iklan</span>
              <span className="text-2xl font-bold font-display text-[#1c1c1c] block mt-2">
                Rp {totalSpend.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-stone-400 block mt-1">Bulan Juni 2026</span>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Total Prospek (Leads)</span>
              <span className="text-2xl font-bold font-display text-violet-600 block mt-2">
                {totalLeads} Prospek
              </span>
              <span className="text-[10px] text-violet-400 block mt-1">Registrasi dari iklan</span>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Rata-rata CAC</span>
              <span className="text-2xl font-bold font-display text-emerald-700 block mt-2">
                Rp {avgCac.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-emerald-500 block mt-1">Cost Per Acquisition</span>
            </Card>

            <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Return on Ad Spend (ROAS)</span>
              <span className="text-2xl font-bold font-display text-amber-600 block mt-2">
                {roas}x Lipat
              </span>
              <span className="text-[10px] text-amber-500 block mt-1">Target minimal 3.0x</span>
            </Card>
          </div>

          {/* Channels Performance Table */}
          <Card className="bg-white border-[#eceae4] rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#eceae4]">
              <h3 className="text-lg font-bold text-[#1c1c1c] flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-500" />
                Performa Berdasarkan Saluran Iklan
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest bg-stone-50/50">
                    <th className="py-4 px-5">Saluran Iklan</th>
                    <th className="py-4 px-5 text-right">Biaya Iklan</th>
                    <th className="py-4 px-5 text-center">Prospek (Leads)</th>
                    <th className="py-4 px-5 text-right">CAC</th>
                    <th className="py-4 px-5 text-center">Tingkat Konversi</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKETING_CHANNELS.map((ch, idx) => (
                    <tr key={idx} className="border-b border-[#eceae4]/40 hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                      <td className="py-4 px-5 font-bold text-[#1c1c1c]">{ch.channel}</td>
                      <td className="py-4 px-5 text-right font-semibold">Rp {ch.spend.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-5 text-center font-semibold text-violet-600">{ch.leads}</td>
                      <td className="py-4 px-5 text-right text-emerald-700 font-bold">Rp {ch.cac.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-5 text-center">
                        <span className="inline-flex items-center text-xs font-bold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full border border-violet-100">
                          {ch.conversionRate}%
                        </span>
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
