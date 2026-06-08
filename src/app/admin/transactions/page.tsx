'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import type { AdminTransactionDto } from '@/modules/admin/server/dto';

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransactionDto[]>([]);
  const [txMeta, setTxMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [txPage, setTxPage] = useState(1);
  const [txStatusFilter, setTxStatusFilter] = useState('');
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

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
    } catch { 
      showToast('error', 'Gagal memuat transaksi'); 
    } finally {
      setIsLoadingTx(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions(txPage, txStatusFilter);
  }, [txPage, txStatusFilter, loadTransactions]);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Daftar Transaksi</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Pantau dan kelola riwayat pembayaran user secara real-time.</p>
        </div>
        <button 
          onClick={() => loadTransactions(txPage, txStatusFilter)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eceae4] rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingTx ? 'animate-spin' : ''}`} />
          Segarkan
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#eceae4] px-3 py-1.5 rounded-xl">
            <Filter className="w-4 h-4 text-[#6b6b6b]" />
            <select
              value={txStatusFilter}
              onChange={(e) => { setTxStatusFilter(e.target.value); setTxPage(1); }}
              className="bg-transparent border-none text-sm font-semibold text-[#1c1c1c] focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="SUCCESS">Sukses</option>
              <option value="SETTLEMENT">Settled</option>
              <option value="PENDING">Tertunda</option>
              <option value="FAILED">Gagal</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Dibatalkan</option>
            </select>
          </div>
        </div>
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
                <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest bg-stone-50/50">
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
                      className="border-b border-[#eceae4]/40 hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium cursor-pointer"
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
                        <td colSpan={9} className="px-5 py-4 border-b border-[#eceae4]/60">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="font-bold text-[#6b6b6b] block mb-1">Midtrans ID</span>
                              <span className="font-mono text-[#1c1c1c]">{tx.midtransId ?? '—'}</span>
                            </div>
                            <div>
                              <span className="font-bold text-[#6b6b6b] block mb-1">Tipe Transaksi</span>
                              <span className="text-[#1c1c1c] font-semibold">{tx.type.replace(/_/g, ' ')}</span>
                            </div>
                            <div>
                              <span className="font-bold text-[#6b6b6b] block mb-1">Terakhir Diperbarui</span>
                              <span className="text-[#1c1c1c]">{formatDate(tx.updatedAt)}</span>
                            </div>
                            {tx.invitation && (
                              <div>
                                <span className="font-bold text-[#6b6b6b] block mb-1">Link Undangan</span>
                                <a href={`/invitation/${tx.invitation.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-mono font-semibold">
                                  /{tx.invitation.slug}
                                </a>
                              </div>
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
                onClick={() => setTxPage(txPage - 1)}
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-xl border border-[#eceae4]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                disabled={txPage >= txMeta.totalPages}
                onClick={() => setTxPage(txPage + 1)}
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
  );
}
