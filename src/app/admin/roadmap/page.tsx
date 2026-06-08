'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { 
  Map, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED' | 'BACKLOG';
  description: string;
}

const STATUS_LABELS: Record<RoadmapItem['status'], string> = {
  COMPLETED: 'Selesai',
  IN_PROGRESS: 'Sedang Dikerjakan',
  PLANNED: 'Direncanakan',
  BACKLOG: 'Ide / Backlog',
};

const STATUS_BG: Record<RoadmapItem['status'], string> = {
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-100',
  PLANNED: 'bg-amber-50 text-amber-700 border-amber-100',
  BACKLOG: 'bg-stone-50 text-stone-700 border-stone-100',
};

const STATUS_ICONS: Record<RoadmapItem['status'], React.ReactNode> = {
  COMPLETED: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  IN_PROGRESS: <Clock className="w-4 h-4 text-blue-500 animate-pulse" />,
  PLANNED: <Circle className="w-4 h-4 text-amber-500" />,
  BACKLOG: <AlertCircle className="w-4 h-4 text-stone-400" />,
};

const DEFAULT_ROADMAP: RoadmapItem[] = [
  { id: '1', title: 'Integrasi Whatsapp Gateway', quarter: 'Q1', status: 'COMPLETED', description: 'Pengiriman rsvp otomatis ke whatsapp mempelai.' },
  { id: '2', title: 'Fitur Custom Lagu Pengantin', quarter: 'Q1', status: 'COMPLETED', description: 'Penyediaan musik kustom melalui unggah mandiri.' },
  { id: '3', title: 'Buku Tamu Digital (QR Code)', quarter: 'Q2', status: 'IN_PROGRESS', description: 'Scan QR di lokasi pernikahan untuk absensi tamu.' },
  { id: '4', title: 'Analisis Pendapatan Admin (ERP)', quarter: 'Q2', status: 'IN_PROGRESS', description: 'Dashboard detail profit-loss, expenses dan leads.' },
  { id: '5', title: 'Custom Subdomain Undangan', quarter: 'Q3', status: 'PLANNED', description: 'Menggunakan domain custom untuk pengantin premium.' },
  { id: '6', title: 'Tema Interaktif 3D', quarter: 'Q4', status: 'BACKLOG', description: 'Tema undangan mewah menggunakan Three.js/WebGL.' },
];

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [quarter, setQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q2');
  const [status, setStatus] = useState<RoadmapItem['status']>('PLANNED');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('erp_roadmap');
    if (saved) {
      setRoadmap(JSON.parse(saved));
    } else {
      setRoadmap(DEFAULT_ROADMAP);
      localStorage.setItem('erp_roadmap', JSON.stringify(DEFAULT_ROADMAP));
    }
  }, []);

  const saveRoadmap = (updated: RoadmapItem[]) => {
    setRoadmap(updated);
    localStorage.setItem('erp_roadmap', JSON.stringify(updated));
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('error', 'Semua kolom formulir harus diisi');
      return;
    }

    const newItem: RoadmapItem = {
      id: String(Date.now()),
      title: title.trim(),
      quarter,
      status,
      description: description.trim(),
    };

    saveRoadmap([newItem, ...roadmap]);
    setTitle('');
    setDescription('');
    setIsAdding(false);
    showToast('success', 'Rencana fitur ditambahkan ke roadmap!');
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('Hapus rencana fitur ini dari roadmap?')) return;
    const updated = roadmap.filter((item) => item.id !== id);
    saveRoadmap(updated);
    showToast('success', 'Roadmap item dihapus!');
  };

  const handleUpdateStatus = (id: string, nextStatus: RoadmapItem['status']) => {
    const updated = roadmap.map((item) => {
      if (item.id === id) {
        return { ...item, status: nextStatus };
      }
      return item;
    });
    saveRoadmap(updated);
    showToast('success', 'Status roadmap diperbarui!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Roadmap Pengembangan Produk</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Kelola rencana perilisan fitur platform Sahinaja dan status pengerjaannya.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="h-10 px-4 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Rencana Fitur Baru
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm max-w-md">
          <h3 className="text-lg font-bold text-[#1c1c1c] mb-4 flex items-center gap-2">
            <Map className="w-5 h-5 text-rose-500" />
            Tambah Roadmap Baru
          </h3>
          <form onSubmit={handleCreateItem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Nama Fitur</label>
              <input
                type="text"
                placeholder="Contoh: Fitur Musik Background Latar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Target Kuartal</label>
                <select
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value as any)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                >
                  <option value="Q1">Q1 (Kuartal 1)</option>
                  <option value="Q2">Q2 (Kuartal 2)</option>
                  <option value="Q3">Q3 (Kuartal 3)</option>
                  <option value="Q4">Q4 (Kuartal 4)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-11 bg-white border border-[#eceae4] rounded-xl px-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                >
                  <option value="BACKLOG">Backlog</option>
                  <option value="PLANNED">Direncanakan</option>
                  <option value="IN_PROGRESS">Sedang Dikerjakan</option>
                  <option value="COMPLETED">Selesai</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6b6b6b] uppercase tracking-wider mb-1">Keterangan Fitur</label>
              <textarea
                placeholder="Rincian fungsionalitas fitur..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-white border border-[#eceae4] rounded-xl p-3 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-[#1c1c1c] text-white font-bold text-sm hover:bg-[#2c2a29] transition-all"
              >
                Simpan Rencana
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

      {/* Timeline List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => {
          const items = roadmap.filter((item) => item.quarter === q);

          return (
            <Card key={q} className="p-6 bg-white border-[#eceae4] rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="font-display font-bold text-lg text-[#1c1c1c]">Target Kuartal {q}</span>
                <span className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                  {items.length} Fitur
                </span>
              </div>

              <div className="space-y-4 pt-2">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs italic">
                    Belum ada rencana perilisan untuk kuartal ini.
                  </div>
                ) : (
                  items.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 border border-[#eceae4] rounded-2xl bg-stone-50/20 hover:bg-stone-50/50 transition-colors space-y-3 relative group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="font-bold text-sm text-[#1c1c1c] block">{item.title}</span>
                          <span className="text-xs text-[#6b6b6b] mt-1 block leading-relaxed">{item.description}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white rounded-lg border border-stone-200 shrink-0"
                          title="Hapus Rencana"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-stone-100/60">
                        <div className="flex items-center gap-1.5">
                          {STATUS_ICONS[item.status]}
                          <Badge className={`${STATUS_BG[item.status]} text-[9px] font-bold uppercase px-2 py-0.5 border`}>
                            {STATUS_LABELS[item.status]}
                          </Badge>
                        </div>

                        {/* Status Transitions */}
                        <div className="flex bg-white border border-stone-200 rounded-lg p-0.5 gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(['BACKLOG', 'PLANNED', 'IN_PROGRESS', 'COMPLETED'] as const)
                            .filter((st) => st !== item.status)
                            .map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateStatus(item.id, st)}
                                className="text-[8px] font-bold uppercase px-1.5 py-0.5 hover:bg-rose-50 hover:text-rose-600 rounded transition-colors text-stone-500"
                                title={`Ubah ke ${STATUS_LABELS[st]}`}
                              >
                                {st.replace('_', ' ').substring(0, 4)}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
