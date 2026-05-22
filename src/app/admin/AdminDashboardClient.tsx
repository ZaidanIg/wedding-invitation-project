'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  Clock, 
  CreditCard, 
  Search, 
  Settings, 
  UserCheck, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

interface Metrics {
  totalUsers: number;
  totalInvitations: number;
  paidInvitations: number;
  unpaidInvitations: number;
  totalVolume: number;
}

interface AdminDashboardClientProps {
  initialMetrics: Metrics;
}

export default function AdminDashboardClient({ initialMetrics }: AdminDashboardClientProps) {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [activeTab, setActiveTab] = useState<'users' | 'invitations'>('users');
  
  // Users lists
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  // Invitations lists
  const [invitations, setInvitations] = useState<any[]>([]);
  const [invitationSearch, setInvitationSearch] = useState('');
  const [isInvitationsLoading, setIsInvitationsLoading] = useState(false);

  // Selected invitation for modal override
  const [selectedInv, setSelectedInv] = useState<any | null>(null);
  const [modalTier, setModalTier] = useState<'DRAFT' | 'BASIC' | 'PREMIUM' | 'ULTIMATE'>('DRAFT');
  const [modalResetAi, setModalResetAi] = useState(false);
  const [isSavingOverride, setIsSavingOverride] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchInvitations();
  }, []);

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        showToast('error', data.error || 'Gagal mengambil data pengguna');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan koneksi server');
    } finally {
      setIsUsersLoading(false);
    }
  };

  const fetchInvitations = async () => {
    setIsInvitationsLoading(true);
    try {
      const res = await fetch('/api/admin/invitations');
      const data = await res.json();
      if (data.success) {
        setInvitations(data.data);
      } else {
        showToast('error', data.error || 'Gagal mengambil data undangan');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan koneksi server');
    } finally {
      setIsInvitationsLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: 'USER' | 'ADMIN') => {
    const nextRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Ubah role pengguna ini menjadi ${nextRole}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: nextRole }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Role pengguna berhasil diperbarui!');
        fetchUsers();
      } else {
        showToast('error', data.error || 'Gagal memperbarui role');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan koneksi server');
    }
  };

  const handleOpenManageModal = (inv: any) => {
    setSelectedInv(inv);
    setModalTier(inv.tier);
    setModalResetAi(false);
  };

  const handleSaveOverrides = async () => {
    if (!selectedInv) return;
    setIsSavingOverride(true);
    try {
      const res = await fetch(`/api/admin/invitations/${selectedInv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: modalTier,
          // v1.2: isPaid removed — tier is the single source of truth
          resetAiCount: modalResetAi,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Tier undangan berhasil diperbarui!');
        setSelectedInv(null);
        fetchInvitations();
        // Refresh metrics
        const prevActive = selectedInv.tier !== 'DRAFT' ? 1 : 0;
        const newActive = modalTier !== 'DRAFT' ? 1 : 0;
        setMetrics(prev => ({
          ...prev,
          paidInvitations: prev.paidInvitations + (newActive - prevActive),
          unpaidInvitations: prev.unpaidInvitations + (prevActive - newActive),
        }));
      } else {
        showToast('error', data.error || 'Gagal menyimpan perubahan');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan koneksi server');
    } finally {
      setIsSavingOverride(false);
    }
  };

  // Search filter computes
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    user.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredInvitations = invitations.filter(inv => 
    inv.groomName?.toLowerCase().includes(invitationSearch.toLowerCase()) || 
    inv.brideName?.toLowerCase().includes(invitationSearch.toLowerCase()) ||
    inv.slug?.toLowerCase().includes(invitationSearch.toLowerCase()) ||
    inv.user?.email?.toLowerCase().includes(invitationSearch.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-[#fdfcf9] py-32 px-6 relative overflow-hidden">
      {/* Decorative Blur Backdrops */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1c1c1c] tracking-tight leading-tight flex items-center gap-3">
              <Settings className="h-10 w-10 text-rose-500 animate-spin-slow" />
              Kontrol Platform Admin
            </h1>
            <p className="text-lg text-[#6b6b6b] mt-3">
              Pantau metrik penjualan, kelola pengguna, dan override lisensi undangan secara real-time.
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => { fetchUsers(); fetchInvitations(); }}
              variant="secondary" 
              className="h-12 px-5 rounded-2xl bg-white border-[#eceae4] text-[#1c1c1c] font-bold"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Segarkan Data
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {/* Card 1: Revenue */}
          <Card className="p-8 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl w-fit mb-5">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider block">Volume Transaksi</span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold font-display text-[#1c1c1c]">
                Rp {metrics.totalVolume.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] block text-emerald-600 font-bold mt-1">Midtrans Settled</span>
            </div>
          </Card>

          {/* Card 2: Total Users */}
          <Card className="p-8 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl w-fit mb-5">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider block">Pengguna Terdaftar</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold font-display text-[#1c1c1c]">
                {metrics.totalUsers}
              </span>
              <span className="text-[10px] block text-[#6b6b6b] font-medium mt-1">Pasangan B2C</span>
            </div>
          </Card>

          {/* Card 3: Total Invitations */}
          <Card className="p-8 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl w-fit mb-5">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider block">Total Undangan</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold font-display text-[#1c1c1c]">
                {metrics.totalInvitations}
              </span>
              <span className="text-[10px] block text-[#6b6b6b] font-medium mt-1">Draf & Aktif</span>
            </div>
          </Card>

          {/* Card 4: Paid Active */}
          <Card className="p-8 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl w-fit mb-5">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider block">Paket Aktif (Paid)</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold font-display text-[#1c1c1c]">
                {metrics.paidInvitations}
              </span>
              <span className="text-[10px] block text-amber-600 font-bold mt-1">Siap Disebar</span>
            </div>
          </Card>

          {/* Card 5: Unpaid */}
          <Card className="p-8 bg-white border-[#eceae4] rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="p-2.5 bg-stone-100 text-stone-600 rounded-xl w-fit mb-5">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-[#6b6b6b] uppercase tracking-wider block">Drafts (Belum Bayar)</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold font-display text-[#1c1c1c]">
                {metrics.unpaidInvitations}
              </span>
              <span className="text-[10px] block text-[#6b6b6b] font-medium mt-1">Belum Publish</span>
            </div>
          </Card>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#eceae4] mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-8 text-sm font-bold tracking-tight border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-rose-500 text-rose-500 font-black'
                : 'border-transparent text-[#6b6b6b] hover:text-[#1c1c1c]'
            }`}
          >
            Direktori Pengguna ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('invitations')}
            className={`py-4 px-8 text-sm font-bold tracking-tight border-b-2 transition-all ${
              activeTab === 'invitations'
                ? 'border-rose-500 text-rose-500 font-black'
                : 'border-transparent text-[#6b6b6b] hover:text-[#1c1c1c]'
            }`}
          >
            Kontrol Undangan ({invitations.length})
          </button>
        </div>

        {/* Users Tab View */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-[#eceae4] shadow-sm overflow-hidden p-6">
            <div className="flex items-center gap-4 mb-6 max-w-md bg-[#fdfcf9] border border-[#eceae4] px-4 py-3 rounded-2xl">
              <Search className="h-5 w-5 text-[#6b6b6b]" />
              <input
                type="text"
                placeholder="Cari nama atau email pengguna..."
                className="bg-transparent border-none outline-none text-sm w-full text-[#1c1c1c] font-semibold"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {isUsersLoading ? (
              <div className="py-20 flex justify-center items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
                <span className="text-sm text-[#6b6b6b] font-bold">Memuat data pengguna...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-20 text-[#6b6b6b] font-semibold text-sm">
                Tidak ada pengguna yang cocok.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest">
                      <th className="py-4 px-4">Nama</th>
                      <th className="py-4 px-4">Email</th>
                      <th className="py-4 px-4">Role</th>
                      <th className="py-4 px-4 text-center">Jumlah Undangan</th>
                      <th className="py-4 px-4">Bergabung Pada</th>
                      <th className="py-4 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-[#fdfcf9] hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                        <td className="py-4 px-4 font-bold">{user.name || 'User'}</td>
                        <td className="py-4 px-4 text-[#6b6b6b] font-mono text-xs">{user.email}</td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleUpdateRole(user.id, user.role)}
                            className="focus:outline-none"
                            title="Klik untuk ubah role"
                          >
                            {user.role === 'ADMIN' ? (
                              <Badge className="bg-red-500 text-white border-red-500 text-[10px] uppercase font-bold px-3 py-1 cursor-pointer hover:bg-red-600 transition-colors">
                                Admin
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-200 text-slate-700 border-slate-300 text-[10px] uppercase font-bold px-3 py-1 cursor-pointer hover:bg-slate-300 transition-colors">
                                User
                              </Badge>
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-lg">{user._count?.invitations || 0}</td>
                        <td className="py-4 px-4 text-xs text-[#6b6b6b]">
                          {new Date(user.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleUpdateRole(user.id, user.role)}
                            className="inline-flex items-center text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                          >
                            <UserCheck className="h-4 w-4 mr-1" /> Toggle Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Invitations Tab View */}
        {activeTab === 'invitations' && (
          <div className="bg-white rounded-3xl border border-[#eceae4] shadow-sm overflow-hidden p-6">
            <div className="flex items-center gap-4 mb-6 max-w-md bg-[#fdfcf9] border border-[#eceae4] px-4 py-3 rounded-2xl">
              <Search className="h-5 w-5 text-[#6b6b6b]" />
              <input
                type="text"
                placeholder="Cari pengantin, slug, atau email pemilik..."
                className="bg-transparent border-none outline-none text-sm w-full text-[#1c1c1c] font-semibold"
                value={invitationSearch}
                onChange={(e) => setInvitationSearch(e.target.value)}
              />
            </div>

            {isInvitationsLoading ? (
              <div className="py-20 flex justify-center items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
                <span className="text-sm text-[#6b6b6b] font-bold">Memuat data undangan...</span>
              </div>
            ) : filteredInvitations.length === 0 ? (
              <div className="text-center py-20 text-[#6b6b6b] font-semibold text-sm">
                Tidak ada undangan yang cocok.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest">
                      <th className="py-4 px-4">Pengantin</th>
                      <th className="py-4 px-4">Slug / Link</th>
                      <th className="py-4 px-4">Pemilik (Email)</th>
                      <th className="py-4 px-4">Paket</th>
                      <th className="py-4 px-4">Status Bayar</th>
                      <th className="py-4 px-4 text-center">Klik / AI Regen</th>
                      <th className="py-4 px-4 text-right">Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvitations.map((inv) => (
                      <tr key={inv.id} className="border-b border-[#fdfcf9] hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                        <td className="py-4 px-4">
                          <div className="font-bold">{inv.groomName} & {inv.brideName}</div>
                          <div className="text-[10px] text-[#6b6b6b]/60 uppercase tracking-widest mt-1 font-bold">Layout: {inv.layout}</div>
                        </td>
                        <td className="py-4 px-4">
                          <a 
                            href={`/invitation/${inv.slug}`} 
                            target="_blank"
                            className="text-blue-500 hover:text-blue-600 transition-colors font-mono text-xs underline block"
                          >
                            /{inv.slug}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-xs text-[#6b6b6b]">
                          {inv.user?.name || 'User'}{' '}
                          <span className="block text-[10px] text-[#6b6b6b]/60 font-mono mt-0.5">{inv.user?.email}</span>
                        </td>
                        <td className="py-4 px-4">
                          {inv.tier === 'DRAFT' ? (
                            <Badge className="bg-slate-400 text-white border-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              Draft
                            </Badge>
                          ) : inv.tier === 'ULTIMATE' ? (
                            <Badge className="bg-amber-500 text-white border-amber-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              Ultimate
                            </Badge>
                          ) : inv.tier === 'PREMIUM' ? (
                            <Badge className="bg-rose-500 text-white border-rose-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              Premium
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-500 text-white border-blue-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                              Basic
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {/* v1.2: isPaid removed — status derived from tier */}
                          {inv.tier !== 'DRAFT' ? (
                            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Draft
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center font-bold">
                          <span className="text-[#1c1c1c]">{inv.viewCount} Klik</span>
                          <span className="block text-[10px] text-[#6b6b6b]/60 font-semibold mt-0.5">AI count: {inv.aiRegenCount}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            onClick={() => handleOpenManageModal(inv)}
                            variant="ghost"
                            size="sm"
                            className="h-9 px-4 rounded-xl text-rose-500 border border-rose-100 hover:bg-rose-50 hover:border-rose-200 text-xs font-bold"
                          >
                            <Settings className="h-3.5 w-3.5 mr-1" /> Kelola
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Override Management Modal */}
      {selectedInv && (
        <div className="fixed inset-0 z-50 bg-[#1c1c1c]/20 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-lg bg-white border-[#eceae4] rounded-[3rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden animate-scale-up">
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
                  <p className="text-xs text-[#6b6b6b] font-medium mt-0.5">Edit parameter database secara manual.</p>
                </div>
              </div>

              <div className="border border-[#eceae4] rounded-2xl bg-[#fdfcf9] p-4 mb-6 text-xs text-[#6b6b6b] space-y-2 font-medium">
                <div><span className="font-bold text-[#1c1c1c]">Undangan ID:</span> <span className="font-mono">{selectedInv.id}</span></div>
                <div><span className="font-bold text-[#1c1c1c]">Nama Pengantin:</span> {selectedInv.groomName} & {selectedInv.brideName}</div>
                <div><span className="font-bold text-[#1c1c1c]">Email Pemilik:</span> {selectedInv.user?.email}</div>
                <div><span className="font-bold text-[#1c1c1c]">AI Count Saat Ini:</span> {selectedInv.aiRegenCount}</div>
              </div>

              {/* Form Controls */}
              <div className="space-y-6">
                {/* Select Tier */}
                <div>
                  <label className="block text-xs font-bold text-[#1c1c1c] uppercase tracking-wider mb-2">Paket Layanan (Tier)</label>
                  <select
                    className="w-full h-12 bg-white border border-[#eceae4] rounded-xl px-4 text-sm font-semibold text-[#1c1c1c] focus:outline-none focus:border-rose-500"
                    value={modalTier}
                    onChange={(e) => setModalTier(e.target.value as any)}
                  >
                    <option value="DRAFT">DRAFT (Terkunci — Belum Bayar)</option>
                    <option value="BASIC">BASIC (Minimalist)</option>
                    <option value="PREMIUM">PREMIUM (Exclusive Layouts)</option>
                    <option value="ULTIMATE">ULTIMATE (WA Blast & Video Embed)</option>
                  </select>
                </div>

                {/* v1.2: isPaid removed — tier is the single source of truth.
                    Admin activates by setting tier to BASIC/PREMIUM/ULTIMATE.
                    Setting tier back to DRAFT = deactivate. */}

                {/* Reset AI Count Checkbox */}
                <div className="flex items-center justify-between border-t border-b border-[#eceae4] py-4">
                  <div>
                    <label className="block text-sm font-bold text-rose-500">Reset Kuota AI Text</label>
                    <p className="text-xs text-[#6b6b6b] font-medium mt-0.5">Kembalikan batas regenerasi AI ke 0.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-6 w-6 rounded border-stone-300 text-rose-500 focus:ring-rose-500"
                    checked={modalResetAi}
                    onChange={(e) => setModalResetAi(e.target.checked)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Button
                  onClick={handleSaveOverrides}
                  disabled={isSavingOverride}
                  className="flex-1 h-12 rounded-xl bg-[#1c1c1c] text-white font-bold text-sm hover:bg-[#2c2a29] transition-all flex items-center justify-center gap-2"
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
