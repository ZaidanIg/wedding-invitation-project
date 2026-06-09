'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { 
  Magnet, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft,
  Calendar
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  source: 'INSTAGRAM' | 'TIKTOK' | 'GOOGLE' | 'REFERRAL' | 'WHATSAPP' | 'ORGANIC';
  status: 'NEW' | 'CONTACTED' | 'DEMO' | 'NEGOTIATION' | 'WON' | 'LOST';
  date: string;
}

const SOURCE_LABELS: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  GOOGLE: 'Google Search',
  REFERRAL: 'Rekomendasi',
  WHATSAPP: 'WhatsApp Chat',
  ORGANIC: 'Organik / Langsung',
};

const STATUS_COLUMNS: { key: Lead['status']; label: string; color: string }[] = [
  { key: 'NEW', label: 'Baru', color: 'border-t-sky-500 bg-sky-50/10' },
  { key: 'CONTACTED', label: 'Dihubungi', color: 'border-t-indigo-500 bg-indigo-50/10' },
  { key: 'DEMO', label: 'Presentasi', color: 'border-t-amber-500 bg-amber-50/10' },
  { key: 'NEGOTIATION', label: 'Negosiasi', color: 'border-t-violet-500 bg-violet-50/10' },
  { key: 'WON', label: 'Deal (Won)', color: 'border-t-emerald-500 bg-emerald-50/10' },
  { key: 'LOST', label: 'Gagal (Lost)', color: 'border-t-rose-400 bg-rose-50/10' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [source, setSource] = useState<Lead['source']>('INSTAGRAM');
  const [status, setStatus] = useState<Lead['status']>('NEW');

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      const json = await res.json();
      if (json.success) {
        setLeads(json.data);
      }
    } catch {
      showToast('error', 'Gagal memuat pipeline leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => { loadLeads(); }, 0);
  }, [loadLeads]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'Nama prospek (Lead Name) harus diisi');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), source, status }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Lead berhasil ditambahkan ke pipeline!');
        setName('');
        setIsAdding(false);
        loadLeads();
      } else {
        showToast('error', json.message ?? 'Gagal menambahkan lead');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan sistem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Lead['status']) => {
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Status prospek diperbarui!');
        loadLeads();
      } else {
        showToast('error', json.message ?? 'Gagal memperbarui status');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan sistem');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Hapus prospek ini dari data CRM?')) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', 'Lead dihapus!');
        loadLeads();
      } else {
        showToast('error', json.message ?? 'Gagal menghapus lead');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan sistem');
    }
  };

  // Helper values
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === 'WON').length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Pelacakan Prospek (Lead CRM)</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Pantau corong penjualan (sales pipeline) dari berbagai kanal akuisisi.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAdding(!isAdding)}
            className="h-10 px-4 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Tambah Prospek
          </Button>
          <button 
            onClick={loadLeads}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eceae4] rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Segarkan
          </button>
        </div>
      </div>

      {/* CRM Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Total Prospek Masuk</span>
          <span className="text-3xl font-bold font-display text-[#1c1c1c] block mt-2">{totalLeads} Orang</span>
          <span className="text-[10px] text-stone-400 block mt-1">Akumulasi semua channel</span>
        </Card>

        <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Berhasil Deal (Won)</span>
          <span className="text-3xl font-bold font-display text-emerald-600 block mt-2">{wonLeads} Customer</span>
          <span className="text-[10px] text-emerald-500 block mt-1">Menggunakan paket aktif</span>
        </Card>

        <Card className="p-5 bg-white border-[#eceae4] rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-[#6b6b6b] uppercase block">Tingkat Konversi</span>
          <span className="text-3xl font-bold font-display text-violet-600 block mt-2">{conversionRate}%</span>
          <span className="text-[10px] text-violet-400 block mt-1">Rasio Lead menjadi Won</span>
        </Card>
      </div>

      {/* Add Lead Panel */}
      {isAdding && (
        <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm max-w-md">
          <h3 className="text-lg font-bold text-[#1c1c1c] mb-4 flex items-center gap-2">
            <Magnet className="w-5 h-5 text-rose-500" />
            Tambah Prospek Baru
          </h3>
          <form onSubmit={handleCreateLead} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Nama Lengkap Prospek</label>
              <input
                type="text"
                placeholder="Contoh: Zaidan Izza"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Kanal / Sumber</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                >
                  {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Status Awal</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                >
                  {STATUS_COLUMNS.map((col) => (
                    <option key={col.key} value={col.key}>{col.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                disabled={submitting}
                type="submit"
                className="flex-1 h-11 rounded-xl bg-[#1c1c1c] text-white font-bold text-sm hover:bg-[#2c2a29] transition-all"
              >
                {submitting ? 'Menyimpan...' : 'Masukkan Prospek'}
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

      {/* Kanban Pipeline */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
          <span className="text-sm text-[#6b6b6b] font-bold">Memuat pipeline...</span>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 select-none min-h-[500px]">
          {STATUS_COLUMNS.map((col) => {
            const columnLeads = leads.filter((l) => l.status === col.key);

            return (
              <div 
                key={col.key} 
                className={`w-72 shrink-0 border-t-4 border-x border-b border-[#eceae4] rounded-2xl flex flex-col p-4 ${col.color}`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-sm text-[#1c1c1c]">{col.label}</span>
                  <span className="text-xs bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Column Body: Leads Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {columnLeads.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border border-dashed border-stone-200 rounded-2xl text-xs text-[#6b6b6b]/60 italic">
                      Kosong
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="bg-white border border-[#eceae4] rounded-2xl p-4 shadow-sm hover:shadow transition-all space-y-3 relative group"
                      >
                        <div>
                          <span className="font-bold text-sm text-[#1c1c1c] block">{lead.name}</span>
                          <span className="text-[10px] text-[#6b6b6b] mt-1 font-semibold bg-stone-100 px-2 py-0.5 rounded-full inline-block">
                            {SOURCE_LABELS[lead.source]}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-[#a1a1aa] font-medium pt-1 border-t border-stone-100">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(lead.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Hapus Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Status Mover Quick Actions */}
                        <div className="flex gap-1.5 pt-2 justify-end">
                          {col.key !== 'NEW' && (
                            <button
                              onClick={() => {
                                const idx = STATUS_COLUMNS.findIndex((c) => c.key === col.key);
                                if (idx > 0) handleUpdateStatus(lead.id, STATUS_COLUMNS[idx - 1].key);
                              }}
                              className="p-1 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-500"
                              title="Kembali"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {col.key !== 'LOST' && (
                            <button
                              onClick={() => {
                                const idx = STATUS_COLUMNS.findIndex((c) => c.key === col.key);
                                if (idx < STATUS_COLUMNS.length - 1) handleUpdateStatus(lead.id, STATUS_COLUMNS[idx + 1].key);
                              }}
                              className="p-1 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-500"
                              title="Lanjut"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
