'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { 
  Search, 
  Settings, 
  RefreshCw,
  Sparkles,
  Calendar
} from 'lucide-react';
import type { AdminInvitationDto } from '@/modules/admin/server/dto';

const TIER_STYLE: Record<string, string> = {
  DRAFT:    'bg-slate-400 text-white border-slate-400',
  BASIC:    'bg-blue-500 text-white border-blue-500',
  PREMIUM:  'bg-rose-500 text-white border-rose-500',
  ULTIMATE: 'bg-amber-500 text-white border-amber-500',
};

export default function ThemesPage() {
  const [invitations, setInvitations] = useState<AdminInvitationDto[]>([]);
  const [invitationSearch, setInvitationSearch] = useState('');
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);

  const [selectedInv, setSelectedInv] = useState<AdminInvitationDto | null>(null);
  const [modalTier, setModalTier] = useState<'DRAFT' | 'BASIC' | 'PREMIUM' | 'ULTIMATE'>('DRAFT');
  const [modalResetAi, setModalResetAi] = useState(false);
  const [isSavingOverride, setIsSavingOverride] = useState(false);

  const loadInvitations = useCallback(async (search: string) => {
    setIsLoadingInvitations(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/admin/invitations${params}`);
      const json = await res.json();
      if (json.success) {
        setInvitations(json.data);
      }
    } catch { 
      showToast('error', 'Gagal memuat undangan'); 
    } finally {
      setIsLoadingInvitations(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => { loadInvitations(invitationSearch); }, 0);
  }, [invitationSearch, loadInvitations]);

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
      } else {
        showToast('error', json.message ?? 'Gagal menyimpan perubahan');
      }
    } catch { 
      showToast('error', 'Terjadi kesalahan sistem'); 
    } finally {
      setIsSavingOverride(false);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Performa & Lisensi Tema</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Pantau statistik kunjungan undangan, tipe tema yang digunakan, dan lakukan override paket layanan.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => loadInvitations(invitationSearch)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#eceae4] rounded-xl text-xs font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInvitations ? 'animate-spin' : ''}`} />
            Segarkan
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 max-w-md bg-white border border-[#eceae4] px-4 py-2.5 rounded-2xl shadow-sm">
        <Search className="h-5 w-5 text-[#6b6b6b]" />
        <input
          type="text"
          placeholder="Cari pengantin, slug, atau email pemilik..."
          className="bg-transparent border-none outline-none text-sm w-full text-[#1c1c1c] font-semibold"
          value={invitationSearch}
          onChange={(e) => setInvitationSearch(e.target.value)}
        />
      </div>

      <Card className="bg-white border-[#eceae4] rounded-3xl shadow-sm overflow-hidden">
        {isLoadingInvitations ? (
          <div className="py-20 flex justify-center items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
            <span className="text-sm text-[#6b6b6b] font-bold">Memuat undangan...</span>
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-20 text-[#6b6b6b] font-semibold text-sm">
            Tidak ada undangan ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest bg-stone-50/50">
                  <th className="py-4 px-5">Pengantin</th>
                  <th className="py-4 px-5">Slug</th>
                  <th className="py-4 px-5">Pemilik</th>
                  <th className="py-4 px-5">Paket</th>
                  <th className="py-4 px-5 text-center">Views</th>
                  <th className="py-4 px-5 text-center">RSVP</th>
                  <th className="py-4 px-5">Event</th>
                  <th className="py-4 px-5 text-right">Kelola</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#eceae4]/40 hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                    <td className="py-4 px-5">
                      <div className="font-bold">{inv.groomName} & {inv.brideName}</div>
                      <div className="text-[10px] text-[#6b6b6b]/60 uppercase tracking-widest mt-0.5 font-bold">{inv.layout}</div>
                    </td>
                    <td className="py-4 px-5">
                      <a href={`/invitation/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-mono text-xs underline">
                        /{inv.slug}
                      </a>
                    </td>
                    <td className="py-4 px-5 text-xs text-[#6b6b6b]">
                      {inv.user.name ?? 'User'}
                      <span className="block text-[10px] font-mono text-[#6b6b6b]/60 mt-0.5">{inv.user.email}</span>
                    </td>
                    <td className="py-4 px-5">
                      <Badge className={`${TIER_STYLE[inv.tier] ?? ''} text-[10px] font-bold uppercase px-2 py-0.5`}>{inv.tier}</Badge>
                    </td>
                    <td className="py-4 px-5 text-center font-bold">{inv.viewCount}</td>
                    <td className="py-4 px-5 text-center">
                      <span className="font-bold text-emerald-700">{inv.rsvpAttending}</span>
                      <span className="text-[#6b6b6b]">/{inv.guestCount}</span>
                    </td>
                    <td className="py-4 px-5 text-xs text-[#6b6b6b]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#a1a1aa]" />{formatDate(inv.eventDate)}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
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

      {/* Override Modal */}
      {selectedInv && (
        <div className="fixed inset-0 z-50 bg-[#1c1c1c]/20 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white border-[#eceae4] rounded-[3rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="h-32 w-32 text-rose-500 fill-rose-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-[#1c1c1c]">Override Lisensi</h3>
                  <p className="text-xs text-[#6b6b6b] font-medium mt-0.5">Ubah tier paket layanan secara manual.</p>
                </div>
              </div>

              <div className="border border-[#eceae4] rounded-2xl bg-[#fdfcf9] p-4 mb-6 text-xs text-[#6b6b6b] space-y-2 font-medium">
                <div><span className="font-bold text-[#1c1c1c]">Pengantin:</span> {selectedInv.groomName} & {selectedInv.brideName}</div>
                <div><span className="font-bold text-[#1c1c1c]">Pemilik:</span> {selectedInv.user.email}</div>
                <div><span className="font-bold text-[#1c1c1c]">Regenerasi AI:</span> {selectedInv.aiRegenCount} Kali</div>
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
                    <p className="text-xs text-[#6b6b6b] font-medium mt-0.5">Kembalikan batas penggunaan AI ke 0.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="h-6 w-6 rounded border-stone-300 text-rose-500" 
                    checked={modalResetAi} 
                    onChange={(e) => setModalResetAi(e.target.checked)} 
                  />
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
    </div>
  );
}
