'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Heart, Clock, CreditCard, Search, Settings,
  UserCheck, RefreshCw, CheckCircle, XCircle, Sparkles,
  TrendingUp, BarChart2, PieChart, ArrowUpRight, ArrowDownRight,
  Calendar, ChevronLeft, ChevronRight, Eye, Zap, ShieldCheck, Download,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import type { AdminMetricsDto, AdminTransactionDto, AdminUserDto, AdminInvitationDto } from '@/modules/admin/server/dto';

// Lazy-load chart components to avoid SSR issues with Recharts
const RevenueChart = dynamic(() => import('@/components/admin/RevenueChart'), { ssr: false, loading: () => <ChartSkeleton /> });
const UserGrowthChart = dynamic(() => import('@/components/admin/UserGrowthChart'), { ssr: false, loading: () => <ChartSkeleton /> });
const TierDistributionChart = dynamic(() => import('@/components/admin/TierDistributionChart'), { ssr: false, loading: () => <ChartSkeleton /> });

function ChartSkeleton() {
  return <div className="h-[220px] animate-pulse bg-stone-100 rounded-2xl" />;
}

type TimeRange = 7 | 30 | 90 | 365;
type Tab = 'overview' | 'transactions' | 'users' | 'invitations';

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '7H', value: 7 },
  { label: '1B', value: 30 },
  { label: '3B', value: 90 },
  { label: '1T', value: 365 },
];

interface Props {
  initialMetrics: AdminMetricsDto;
  initialRevenueChart: { date: string; value: number }[];
  initialUserGrowthChart: { date: string; value: number }[];
  initialTierDistribution: { tier: string; count: number; percentage: number }[];
}

// ─── Status helpers ───────────────────────────────────────────
const TX_STATUS_STYLE: Record<string, string> = {
  SUCCESS:    'bg-emerald-50 text-emerald-700 border-emerald-100',
  SETTLEMENT: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  PENDING:    'bg-amber-50 text-amber-700 border-amber-100',
  FAILED:     'bg-red-50 text-red-700 border-red-100',
  EXPIRED:    'bg-stone-100 text-stone-600 border-stone-200',
  CANCELLED:  'bg-stone-100 text-stone-600 border-stone-200',
};
const TX_STATUS_LABEL: Record<string, string> = {
  SUCCESS: 'Sukses', SETTLEMENT: 'Settled', PENDING: 'Tertunda',
  FAILED: 'Gagal', EXPIRED: 'Expired', CANCELLED: 'Dibatalkan',
};

const TIER_STYLE: Record<string, string> = {
  DRAFT:    'bg-slate-400 text-white border-slate-400',
  BASIC:    'bg-blue-500 text-white border-blue-500',
  PREMIUM:  'bg-rose-500 text-white border-rose-500',
  ULTIMATE: 'bg-amber-500 text-white border-amber-500',
};

function formatRupiah(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}Jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}K`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── KPI Card ────────────────────────────────────────────────
function KpiCard({
  icon, label, value, sub, subColor = 'text-[#6b6b6b]', bg = 'bg-stone-100', iconColor = 'text-stone-600',
}: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  subColor?: string; bg?: string; iconColor?: string;
}) {
  return (
    <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className={`p-2.5 ${bg} ${iconColor} rounded-xl w-fit mb-4`}>{icon}</div>
        <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider block">{label}</span>
      </div>
      <div className="mt-3">
        <span className="text-2xl font-bold font-display text-[#1c1c1c]">{value}</span>
        <span className={`text-[10px] block font-bold mt-1 ${subColor}`}>{sub}</span>
      </div>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function AdminDashboardClient({
  initialMetrics,
  initialRevenueChart,
  initialUserGrowthChart,
  initialTierDistribution,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [metrics, setMetrics] = useState<AdminMetricsDto>(initialMetrics);
  const [isRefreshingMetrics, setIsRefreshingMetrics] = useState(false);

  // ── Overview: Charts ─────────────────────────────────────────
  const [timeRange, setTimeRange] = useState<TimeRange>(30);
  const [revenueChart, setRevenueChart] = useState(initialRevenueChart);
  const [userGrowthChart, setUserGrowthChart] = useState(initialUserGrowthChart);
  const [tierDistribution, setTierDistribution] = useState(initialTierDistribution);
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);

  // ── Transactions Tab ─────────────────────────────────────────
  const [transactions, setTransactions] = useState<AdminTransactionDto[]>([]);
  const [txMeta, setTxMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [txPage, setTxPage] = useState(1);
  const [txStatusFilter, setTxStatusFilter] = useState('');
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

  // ── Users Tab ────────────────────────────────────────────────
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // ── Invitations Tab ──────────────────────────────────────────
  const [invitations, setInvitations] = useState<AdminInvitationDto[]>([]);
  const [invitationSearch, setInvitationSearch] = useState('');
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  
  // Export
  const [isExporting, setIsExporting] = useState(false);
  const [selectedInv, setSelectedInv] = useState<AdminInvitationDto | null>(null);
  const [modalTier, setModalTier] = useState<'DRAFT' | 'BASIC' | 'PREMIUM' | 'ULTIMATE'>('DRAFT');
  const [modalResetAi, setModalResetAi] = useState(false);
  const [isSavingOverride, setIsSavingOverride] = useState(false);

  // ── Fetchers ─────────────────────────────────────────────────
  const refreshMetrics = useCallback(async () => {
    setIsRefreshingMetrics(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const json = await res.json();
      if (json.success) setMetrics(json.data);
    } catch { /* silent */ } finally {
      setIsRefreshingMetrics(false);
    }
  }, []);

  const loadCharts = useCallback(async (days: TimeRange) => {
    setIsLoadingCharts(true);
    try {
      const [rev, usr] = await Promise.all([
        fetch(`/api/admin/charts/revenue?days=${days}`).then((r) => r.json()),
        fetch(`/api/admin/charts/users?days=${days}`).then((r) => r.json()),
      ]);
      if (rev.success) setRevenueChart(rev.data);
      if (usr.success) setUserGrowthChart(usr.data);
    } catch { /* silent */ } finally {
      setIsLoadingCharts(false);
    }
  }, []);

  const loadTransactions = useCallback(async (page: number, status: string) => {
    setIsLoadingTx(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (status) params.set('status', status);
      const res = await fetch(`/api/admin/transactions?${params}`);
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data);
        setTxMeta(json.meta);
      }
    } catch { showToast('error', 'Gagal memuat transaksi'); } finally {
      setIsLoadingTx(false);
    }
  }, []);

  const loadUsers = useCallback(async (search: string) => {
    setIsLoadingUsers(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/admin/users${params}`);
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch { showToast('error', 'Gagal memuat pengguna'); } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  const loadInvitations = useCallback(async (search: string) => {
    setIsLoadingInvitations(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/admin/invitations${params}`);
      const json = await res.json();
      if (json.success) setInvitations(json.data);
    } catch { showToast('error', 'Gagal memuat undangan'); } finally {
      setIsLoadingInvitations(false);
    }
  }, []);

  // ── Effects ───────────────────────────────────────────────────
  useEffect(() => { loadTransactions(1, ''); }, [loadTransactions]);
  useEffect(() => { loadUsers(''); }, [loadUsers]);
  useEffect(() => { loadInvitations(''); }, [loadInvitations]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/admin/export');
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Sahinaja_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Gagal mengunduh laporan.');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleTimeRangeChange = (r: TimeRange) => {
    setTimeRange(r);
    loadCharts(r);
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Ubah role menjadi ${nextRole}?`)) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: nextRole }),
      });
      const json = await res.json();
      if (json.success) { showToast('success', 'Role diperbarui!'); loadUsers(userSearch); }
      else showToast('error', json.error ?? 'Gagal');
    } catch { showToast('error', 'Terjadi kesalahan'); }
  };

  const handleSaveOverrides = async () => {
    if (!selectedInv) return;
    setIsSavingOverride(true);
    try {
      const res = await fetch(`/api/admin/invitations/${selectedInv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: modalTier, resetAiCount: modalResetAi }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Tier undangan diperbarui!');
        setSelectedInv(null);
        loadInvitations(invitationSearch);
        refreshMetrics();
      } else showToast('error', json.error ?? 'Gagal menyimpan');
    } catch { showToast('error', 'Terjadi kesalahan'); } finally {
      setIsSavingOverride(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <BarChart2 className="h-4 w-4" /> },
    { key: 'transactions', label: `Transaksi (${txMeta.total})`, icon: <CreditCard className="h-4 w-4" /> },
    { key: 'users', label: `Pengguna (${users.length})`, icon: <Users className="h-4 w-4" /> },
    { key: 'invitations', label: `Undangan (${invitations.length})`, icon: <Heart className="h-4 w-4" /> },
  ];

  return (
    <section className="min-h-screen bg-[#fdfcf9] py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              Internal Access Only
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1c1c1c] tracking-tight leading-tight">
              Sahinaja Admin BI
            </h1>
            <p className="text-base text-[#6b6b6b] mt-2 font-medium">
              Pantau pertumbuhan bisnis, kelola pelanggan, dan analisis revenue secara real-time.
            </p>
          </div>
          <div className="flex gap-3 mt-6 lg:mt-0 flex-wrap">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="outline"
              className="h-12 px-5 rounded-2xl bg-white border-[#eceae4] text-[#1c1c1c] font-bold"
            >
              <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
              {isExporting ? 'Memproses...' : 'Export Laporan (.xlsx)'}
            </Button>
            <Button
              onClick={() => { refreshMetrics(); loadCharts(timeRange); loadTransactions(txPage, txStatusFilter); loadUsers(userSearch); loadInvitations(invitationSearch); }}
              variant="secondary"
              className="h-12 px-5 rounded-2xl bg-white border-[#eceae4] text-[#1c1c1c] font-bold flex-shrink-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingMetrics ? 'animate-spin' : ''}`} />
              Segarkan Semua
            </Button>
          </div>
        </div>

        {/* KPI Cards — always visible */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
          <KpiCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Total Revenue"
            value={`Rp ${(metrics.totalRevenue / 1_000_000).toFixed(1)}Jt`}
            sub={`+Rp ${(metrics.newRevenueThisMonth / 1_000_000).toFixed(1)}Jt bulan ini`}
            bg="bg-emerald-50" iconColor="text-emerald-600" subColor="text-emerald-600"
          />
          <KpiCard
            icon={<Users className="h-5 w-5" />}
            label="Total Pengguna"
            value={String(metrics.totalUsers)}
            sub={`+${metrics.newUsersThisMonth} bulan ini`}
            bg="bg-blue-50" iconColor="text-blue-600" subColor="text-blue-600"
          />
          <KpiCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            sub={`${metrics.paidInvitations} dari ${metrics.totalInvitations} undangan`}
            bg="bg-violet-50" iconColor="text-violet-600" subColor="text-violet-600"
          />
          <KpiCard
            icon={<Zap className="h-5 w-5" />}
            label="Avg Rev / User"
            value={formatRupiah(metrics.avgRevenuePerUser)}
            sub="Rata-rata spending"
            bg="bg-amber-50" iconColor="text-amber-600"
          />
          <KpiCard
            icon={<CheckCircle className="h-5 w-5" />}
            label="Paket Aktif"
            value={String(metrics.paidInvitations)}
            sub="Sudah membayar"
            bg="bg-rose-50" iconColor="text-rose-600" subColor="text-rose-600"
          />
          <KpiCard
            icon={<Clock className="h-5 w-5" />}
            label="Transaksi Pending"
            value={String(metrics.pendingTransactions)}
            sub="Menunggu pembayaran"
            bg="bg-stone-100" iconColor="text-stone-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-[#eceae4] mb-8 gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 py-3 px-5 text-sm font-bold tracking-tight border-b-2 transition-all whitespace-nowrap ${
                activeTab === t.key
                  ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-[#6b6b6b] hover:text-[#1c1c1c]'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════ TAB: OVERVIEW ══════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Time Range Selector */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1c1c1c]">Tren Bisnis</h2>
              <div className="flex bg-white border border-[#eceae4] rounded-2xl p-1 gap-1">
                {TIME_RANGES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleTimeRangeChange(r.value)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      timeRange === r.value
                        ? 'bg-[#1c1c1c] text-white'
                        : 'text-[#6b6b6b] hover:text-[#1c1c1c]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-[#1c1c1c]">Revenue Harian</h3>
                    <p className="text-xs text-[#6b6b6b] font-medium mt-0.5">Transaksi sukses (SUCCESS + SETTLEMENT)</p>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                {isLoadingCharts ? <ChartSkeleton /> : <RevenueChart data={revenueChart} />}
              </Card>

              {/* User Growth Chart */}
              <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-[#1c1c1c]">Pertumbuhan Pengguna</h3>
                    <p className="text-xs text-[#6b6b6b] font-medium mt-0.5">Registrasi baru per hari</p>
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                {isLoadingCharts ? <ChartSkeleton /> : <UserGrowthChart data={userGrowthChart} />}
              </Card>
            </div>

            {/* Tier Distribution */}
            <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-[#1c1c1c]">Distribusi Paket Undangan</h3>
                  <p className="text-xs text-[#6b6b6b] font-medium mt-0.5">Perbandingan tier aktif vs draft</p>
                </div>
                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                  <PieChart className="h-4 w-4" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <TierDistributionChart data={tierDistribution} />
                <div className="space-y-3">
                  {tierDistribution.map((t) => (
                    <div key={t.tier} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${TIER_STYLE[t.tier] ?? ''}`}>
                          {t.tier}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-400 rounded-full" style={{ width: `${t.percentage}%` }} />
                        </div>
                        <span className="text-sm font-bold text-[#1c1c1c] w-8 text-right">{t.count}</span>
                        <span className="text-xs text-[#6b6b6b] font-medium w-10 text-right">{t.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ TAB: TRANSACTIONS ═══════════════════════ */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={txStatusFilter}
                onChange={(e) => { setTxStatusFilter(e.target.value); setTxPage(1); loadTransactions(1, e.target.value); }}
                className="h-10 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-400"
              >
                <option value="">Semua Status</option>
                <option value="SUCCESS">Sukses</option>
                <option value="SETTLEMENT">Settled</option>
                <option value="PENDING">Tertunda</option>
                <option value="FAILED">Gagal</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
              <span className="text-sm text-[#6b6b6b] font-medium">{txMeta.total} total transaksi</span>
            </div>

            <Card className="bg-white border-[#eceae4] rounded-3xl shadow-sm overflow-hidden">
              {isLoadingTx ? (
                <div className="py-20 flex justify-center items-center gap-3">
                  <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
                  <span className="text-sm text-[#6b6b6b] font-bold">Memuat transaksi...</span>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-20 text-[#6b6b6b] font-semibold text-sm">
                  Tidak ada transaksi yang cocok.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest">
                        <th className="py-4 px-5">Order ID</th>
                        <th className="py-4 px-5">Pelanggan</th>
                        <th className="py-4 px-5">Undangan</th>
                        <th className="py-4 px-5">Paket</th>
                        <th className="py-4 px-5">Jumlah</th>
                        <th className="py-4 px-5">Metode</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5">Tanggal</th>
                        <th className="py-4 px-5 text-center">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <React.Fragment key={tx.id}>
                          <tr
                            className="border-b border-[#fdfcf9] hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium cursor-pointer"
                            onClick={() => setExpandedTxId(expandedTxId === tx.id ? null : tx.id)}
                          >
                            <td className="py-4 px-5 font-mono text-xs text-[#6b6b6b]">{tx.id}</td>
                            <td className="py-4 px-5">
                              <div className="font-bold text-sm">{tx.user.name ?? 'User'}</div>
                              <div className="text-[10px] font-mono text-[#6b6b6b]">{tx.user.email}</div>
                            </td>
                            <td className="py-4 px-5">
                              {tx.invitation ? (
                                <span className="text-xs font-semibold">{tx.invitation.groomName} & {tx.invitation.brideName}</span>
                              ) : <span className="text-[#6b6b6b] text-xs">—</span>}
                            </td>
                            <td className="py-4 px-5">
                              {tx.tier && (
                                <Badge className={`${TIER_STYLE[tx.tier] ?? ''} text-[10px] font-bold uppercase px-2 py-0.5`}>
                                  {tx.tier}
                                </Badge>
                              )}
                            </td>
                            <td className="py-4 px-5 font-bold text-emerald-700">
                              {`Rp ${tx.amount.toLocaleString('id-ID')}`}
                            </td>
                            <td className="py-4 px-5 text-xs font-medium text-[#6b6b6b] capitalize">
                              {tx.paymentMethod?.replace(/_/g, ' ') ?? '—'}
                            </td>
                            <td className="py-4 px-5">
                              <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${TX_STATUS_STYLE[tx.status] ?? 'bg-stone-100 text-stone-600'}`}>
                                {TX_STATUS_LABEL[tx.status] ?? tx.status}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-xs text-[#6b6b6b]">{formatDate(tx.createdAt)}</td>
                            <td className="py-4 px-5 text-center">
                              <Eye className={`h-4 w-4 mx-auto transition-colors ${expandedTxId === tx.id ? 'text-rose-500' : 'text-[#6b6b6b]'}`} />
                            </td>
                          </tr>
                          {expandedTxId === tx.id && (
                            <tr key={`${tx.id}-exp`} className="bg-stone-50">
                              <td colSpan={9} className="px-5 py-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                  <div><span className="font-bold text-[#6b6b6b] block mb-1">Midtrans ID</span><span className="font-mono text-[#1c1c1c]">{tx.midtransId ?? '—'}</span></div>
                                  <div><span className="font-bold text-[#6b6b6b] block mb-1">Tipe</span><span className="text-[#1c1c1c]">{tx.type.replace(/_/g, ' ')}</span></div>
                                  <div><span className="font-bold text-[#6b6b6b] block mb-1">Updated</span><span className="text-[#1c1c1c]">{formatDate(tx.updatedAt)}</span></div>
                                  {tx.invitation && (
                                    <div><span className="font-bold text-[#6b6b6b] block mb-1">Slug</span><a href={`/invitation/${tx.invitation.slug}`} target="_blank" className="text-blue-500 hover:underline font-mono">/{tx.invitation.slug}</a></div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {txMeta.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#eceae4]">
                  <span className="text-xs font-medium text-[#6b6b6b]">
                    Halaman {txMeta.page} dari {txMeta.totalPages} ({txMeta.total} total)
                  </span>
                  <div className="flex gap-2">
                    <Button
                      disabled={txPage <= 1}
                      onClick={() => { const p = txPage - 1; setTxPage(p); loadTransactions(p, txStatusFilter); }}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 rounded-xl border border-[#eceae4]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      disabled={txPage >= txMeta.totalPages}
                      onClick={() => { const p = txPage + 1; setTxPage(p); loadTransactions(p, txStatusFilter); }}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 rounded-xl border border-[#eceae4]"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ═══════════════ TAB: USERS ══════════════════════════════ */}
        {activeTab === 'users' && (
          <Card className="bg-white border-[#eceae4] rounded-3xl shadow-sm overflow-hidden p-6">
            <div className="flex items-center gap-4 mb-6 max-w-md bg-[#fdfcf9] border border-[#eceae4] px-4 py-3 rounded-2xl">
              <Search className="h-5 w-5 text-[#6b6b6b]" />
              <input
                type="text"
                placeholder="Cari nama atau email pengguna..."
                className="bg-transparent border-none outline-none text-sm w-full text-[#1c1c1c] font-semibold"
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); loadUsers(e.target.value); }}
              />
            </div>

            {isLoadingUsers ? (
              <div className="py-20 flex justify-center items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
                <span className="text-sm text-[#6b6b6b] font-bold">Memuat pengguna...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 text-[#6b6b6b] font-semibold text-sm">Tidak ada pengguna ditemukan.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest">
                      <th className="py-4 px-4">Nama</th>
                      <th className="py-4 px-4">Email</th>
                      <th className="py-4 px-4">Role</th>
                      <th className="py-4 px-4 text-center">Undangan</th>
                      <th className="py-4 px-4 text-right">Total Spent</th>
                      <th className="py-4 px-4">Bergabung</th>
                      <th className="py-4 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-[#fdfcf9] hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                        <td className="py-4 px-4 font-bold">{user.name ?? 'User'}</td>
                        <td className="py-4 px-4 text-[#6b6b6b] font-mono text-xs">{user.email}</td>
                        <td className="py-4 px-4">
                          <button onClick={() => handleUpdateRole(user.id, user.role)} className="focus:outline-none" title="Klik untuk ubah role">
                            {user.role === 'ADMIN' ? (
                              <Badge className="bg-red-500 text-white border-red-500 text-[10px] uppercase font-bold px-3 py-1 cursor-pointer hover:bg-red-600 transition-colors">Admin</Badge>
                            ) : (
                              <Badge className="bg-slate-200 text-slate-700 border-slate-300 text-[10px] uppercase font-bold px-3 py-1 cursor-pointer hover:bg-slate-300 transition-colors">User</Badge>
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-lg">{user.invitationCount}</td>
                        <td className="py-4 px-4 text-right font-bold text-emerald-700">
                          {user.totalSpent > 0 ? `Rp ${user.totalSpent.toLocaleString('id-ID')}` : <span className="text-[#6b6b6b] font-medium">—</span>}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#6b6b6b]">{formatDate(user.createdAt)}</td>
                        <td className="py-4 px-4 text-right">
                          <button onClick={() => handleUpdateRole(user.id, user.role)} className="inline-flex items-center text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
                            <UserCheck className="h-4 w-4 mr-1" />Toggle Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* ═══════════════ TAB: INVITATIONS ════════════════════════ */}
        {activeTab === 'invitations' && (
          <Card className="bg-white border-[#eceae4] rounded-3xl shadow-sm overflow-hidden p-6">
            <div className="flex items-center gap-4 mb-6 max-w-md bg-[#fdfcf9] border border-[#eceae4] px-4 py-3 rounded-2xl">
              <Search className="h-5 w-5 text-[#6b6b6b]" />
              <input
                type="text"
                placeholder="Cari pengantin, slug, atau email..."
                className="bg-transparent border-none outline-none text-sm w-full text-[#1c1c1c] font-semibold"
                value={invitationSearch}
                onChange={(e) => { setInvitationSearch(e.target.value); loadInvitations(e.target.value); }}
              />
            </div>

            {isLoadingInvitations ? (
              <div className="py-20 flex justify-center items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
                <span className="text-sm text-[#6b6b6b] font-bold">Memuat undangan...</span>
              </div>
            ) : invitations.length === 0 ? (
              <div className="text-center py-20 text-[#6b6b6b] font-semibold text-sm">Tidak ada undangan ditemukan.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest">
                      <th className="py-4 px-4">Pengantin</th>
                      <th className="py-4 px-4">Slug</th>
                      <th className="py-4 px-4">Pemilik</th>
                      <th className="py-4 px-4">Paket</th>
                      <th className="py-4 px-4 text-center">Views</th>
                      <th className="py-4 px-4 text-center">RSVP</th>
                      <th className="py-4 px-4">Event</th>
                      <th className="py-4 px-4 text-right">Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="border-b border-[#fdfcf9] hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                        <td className="py-4 px-4">
                          <div className="font-bold">{inv.groomName} & {inv.brideName}</div>
                          <div className="text-[10px] text-[#6b6b6b]/60 uppercase tracking-widest mt-0.5 font-bold">{inv.layout}</div>
                        </td>
                        <td className="py-4 px-4">
                          <a href={`/invitation/${inv.slug}`} target="_blank" className="text-blue-500 hover:text-blue-600 font-mono text-xs underline">/{inv.slug}</a>
                        </td>
                        <td className="py-4 px-4 text-xs text-[#6b6b6b]">
                          {inv.user.name ?? 'User'}
                          <span className="block text-[10px] font-mono text-[#6b6b6b]/60 mt-0.5">{inv.user.email}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${TIER_STYLE[inv.tier] ?? ''} text-[10px] font-bold uppercase px-2 py-0.5`}>{inv.tier}</Badge>
                        </td>
                        <td className="py-4 px-4 text-center font-bold">{inv.viewCount}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-emerald-700">{inv.rsvpAttending}</span>
                          <span className="text-[#6b6b6b]">/{inv.guestCount}</span>
                        </td>
                        <td className="py-4 px-4 text-xs text-[#6b6b6b]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />{formatDate(inv.eventDate)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            onClick={() => { setSelectedInv(inv); setModalTier(inv.tier as any); setModalResetAi(false); }}
                            variant="ghost"
                            size="sm"
                            className="h-9 px-4 rounded-xl text-rose-500 border border-rose-100 hover:bg-rose-50 text-xs font-bold"
                          >
                            <Settings className="h-3.5 w-3.5 mr-1" />Kelola
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* ── Override Modal ─────────────────────────────────── */}
      {selectedInv && (
        <div className="fixed inset-0 z-50 bg-[#1c1c1c]/20 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white border-[#eceae4] rounded-[3rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="h-32 w-32 text-rose-500 fill-rose-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                  <Settings className="h-6 w-6 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-[#1c1c1c]">Override Lisensi</h3>
                  <p className="text-xs text-[#6b6b6b] font-medium mt-0.5">Override manual tier undangan.</p>
                </div>
              </div>

              <div className="border border-[#eceae4] rounded-2xl bg-[#fdfcf9] p-4 mb-6 text-xs text-[#6b6b6b] space-y-2 font-medium">
                <div><span className="font-bold text-[#1c1c1c]">Pengantin:</span> {selectedInv.groomName} & {selectedInv.brideName}</div>
                <div><span className="font-bold text-[#1c1c1c]">Pemilik:</span> {selectedInv.user.email}</div>
                <div><span className="font-bold text-[#1c1c1c]">AI Count:</span> {selectedInv.aiRegenCount}</div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#1c1c1c] uppercase tracking-wider mb-2">Paket Layanan (Tier)</label>
                  <select
                    className="w-full h-12 bg-white border border-[#eceae4] rounded-xl px-4 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                    value={modalTier}
                    onChange={(e) => setModalTier(e.target.value as any)}
                  >
                    <option value="DRAFT">DRAFT (Terkunci)</option>
                    <option value="BASIC">BASIC (Minimalist)</option>
                    <option value="PREMIUM">PREMIUM (Exclusive)</option>
                    <option value="ULTIMATE">ULTIMATE (Full Access)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between border-t border-b border-[#eceae4] py-4">
                  <div>
                    <label className="block text-sm font-bold text-rose-500">Reset Kuota AI Text</label>
                    <p className="text-xs text-[#6b6b6b] font-medium mt-0.5">Kembalikan batas AI ke 0.</p>
                  </div>
                  <input type="checkbox" className="h-6 w-6 rounded border-stone-300 text-rose-500" checked={modalResetAi} onChange={(e) => setModalResetAi(e.target.checked)} />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={handleSaveOverrides}
                  disabled={isSavingOverride}
                  className="flex-1 h-12 rounded-xl bg-[#1c1c1c] text-white font-bold text-sm hover:bg-[#2c2a29] transition-all"
                >
                  {isSavingOverride ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
                <Button
                  onClick={() => setSelectedInv(null)}
                  variant="ghost"
                  className="h-12 px-6 rounded-xl border border-stone-200 text-stone-600 font-bold text-sm"
                >
                  Batal
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
