'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { 
  TrendingUp, 
  CreditCard, 
  Users, 
  Activity, 
  DollarSign, 
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw
} from 'lucide-react';

// Color Helper for KPIs
function getStatusColor(status: 'success' | 'warning' | 'danger') {
  switch (status) {
    case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'danger': return 'bg-rose-50 text-rose-600 border-rose-100';
    default: return 'bg-stone-100 text-stone-600 border-stone-200';
  }
}

function KpiCard({
  icon, label, value, sub, status
}: {
  icon: React.ReactNode; label: string; value: string; sub: string; status?: 'success' | 'warning' | 'danger'
}) {
  return (
    <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl w-fit ${status ? getStatusColor(status) : 'bg-stone-100 text-stone-600'}`}>
          {icon}
        </div>
        {status && (
          <div className="flex gap-1 items-center">
            {status === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
            {status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {status === 'danger' && <XCircle className="w-4 h-4 text-rose-500" />}
          </div>
        )}
      </div>
      <div>
        <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider block mb-1">{label}</span>
        <span className="text-2xl font-bold font-display text-[#1c1c1c]">{value}</span>
        <span className={`text-[10px] block font-bold mt-1 ${status ? getStatusColor(status).split(' ')[1] : 'text-[#6b6b6b]'}`}>{sub}</span>
      </div>
    </Card>
  );
}

export default function ExecutiveSummaryPage() {
  const [loading, setLoading] = useState(true);

  // MOCK DATA for now until backend APIs are ready
  const data = {
    revenueThisMonth: 12500000,
    revenueYTD: 145000000,
    netProfit: 8500000,
    activeCustomer: 150,
    newCustomer: 45,
    conversionRate: 12.5,
    churnRate: 2.1,
    mrr: 15000000,
    arr: 180000000,
    cac: 25000,
    roas: 4.5
  };

  useEffect(() => {
    // Simulate fetch delay
    setTimeout(() => setLoading(false), 800);
  }, []);

  const formatIDR = (n: number) => `Rp ${(n / 1000000).toFixed(1)}Jt`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-[#1c1c1c] tracking-tight">Executive Summary</h1>
          <p className="text-sm text-[#6b6b6b] font-medium mt-2">7 Angka Utama Pemantauan Bisnis Mingguan</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eceae4] rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
            <span className="font-bold text-[#6b6b6b]">Memuat Metrik...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              icon={<CreditCard className="w-5 h-5" />}
              label="Revenue (Bulan Ini)"
              value={formatIDR(data.revenueThisMonth)}
              sub="Target: Tercapai"
              status="success"
            />
            <KpiCard
              icon={<DollarSign className="w-5 h-5" />}
              label="Net Profit"
              value={formatIDR(data.netProfit)}
              sub="Margin 68%"
              status="success"
            />
            <KpiCard
              icon={<Users className="w-5 h-5" />}
              label="Active Customer"
              value={String(data.activeCustomer)}
              sub="+45 bulan ini"
              status="success"
            />
            <KpiCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Conversion Rate"
              value={`${data.conversionRate}%`}
              sub="Di bawah target (15%)"
              status="warning"
            />
            <KpiCard
              icon={<Activity className="w-5 h-5" />}
              label="Customer Acquisition Cost (CAC)"
              value={`Rp ${data.cac.toLocaleString('id-ID')}`}
              sub="Optimal"
              status="success"
            />
            <KpiCard
              icon={<Activity className="w-5 h-5" />}
              label="Monthly Recurring Revenue (MRR)"
              value={formatIDR(data.mrr)}
              sub="SaaS Subscription"
              status="success"
            />
            <KpiCard
              icon={<Activity className="w-5 h-5" />}
              label="Churn Rate"
              value={`${data.churnRate}%`}
              sub="Perlu perhatian"
              status="warning"
            />
            <KpiCard
              icon={<Activity className="w-5 h-5" />}
              label="ROAS (Return on Ad Spend)"
              value={`${data.roas}x`}
              sub="Sangat Baik"
              status="success"
            />
          </div>
        </>
      )}
    </div>
  );
}
