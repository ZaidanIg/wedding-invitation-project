'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Pagination, { type PaginationMeta } from '@/components/ui/Pagination';
import { showToast } from '@/components/ui/Toast';
import { 
  Users, 
  Search, 
  UserCheck, 
  RefreshCw,
} from 'lucide-react';
import type { AdminUserDto } from '@/modules/admin/server/dto';

const LIMIT = 20;

const DEFAULT_META: PaginationMeta = { page: 1, limit: LIMIT, total: 0, totalPages: 1 };

export default function CustomersPage() {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [page, setPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search — reset to page 1 on new query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(userSearch);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [userSearch]);

  const loadUsers = useCallback(async (currentPage: number, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: String(LIMIT) });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users?${params}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
        setMeta(json.meta);
      }
    } catch { 
      showToast('error', 'Gagal memuat pengguna'); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(page, debouncedSearch);
  }, [page, debouncedSearch, loadUsers]);

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
      if (json.success) { 
        showToast('success', 'Role diperbarui!'); 
        loadUsers(page, debouncedSearch); 
      } else {
        showToast('error', json.error ?? 'Gagal memperbarui role');
      }
    } catch { 
      showToast('error', 'Terjadi kesalahan sistem'); 
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#1c1c1c]">Database Pelanggan</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Kelola data pengguna, perbarui hak akses admin, dan tinjau total belanja mereka.</p>
        </div>
        <button 
          onClick={() => loadUsers(page, debouncedSearch)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eceae4] rounded-xl text-sm font-bold text-[#1c1c1c] hover:bg-stone-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Segarkan
        </button>
      </div>

      {/* Search + total */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-4 max-w-md bg-white border border-[#eceae4] px-4 py-2.5 rounded-2xl shadow-sm flex-1">
          <Search className="h-5 w-5 text-[#6b6b6b] shrink-0" />
          <input
            type="text"
            placeholder="Cari nama atau email pelanggan..."
            className="bg-transparent border-none outline-none text-sm w-full text-[#1c1c1c] font-semibold"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>
        {meta.total > 0 && (
          <span className="text-sm text-[#6b6b6b] font-medium shrink-0">
            {meta.total} pelanggan ditemukan
          </span>
        )}
      </div>

      <Card className="bg-white border-[#eceae4] rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
            <span className="text-sm text-[#6b6b6b] font-bold">Memuat pengguna...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-[#6b6b6b] font-semibold text-sm">
            Tidak ada pengguna ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eceae4] text-[#6b6b6b] text-xs font-bold uppercase tracking-widest bg-stone-50/50">
                  <th className="py-4 px-5">Nama</th>
                  <th className="py-4 px-5">Email</th>
                  <th className="py-4 px-5">Role</th>
                  <th className="py-4 px-5 text-center">Undangan</th>
                  <th className="py-4 px-5 text-right">Total Spent</th>
                  <th className="py-4 px-5">Bergabung</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#eceae4]/40 hover:bg-stone-50 transition-colors text-sm text-[#1c1c1c] font-medium">
                    <td className="py-4 px-5 font-bold">{user.name ?? 'User'}</td>
                    <td className="py-4 px-5 text-[#6b6b6b] font-mono text-xs">{user.email}</td>
                    <td className="py-4 px-5">
                      <button onClick={() => handleUpdateRole(user.id, user.role)} className="focus:outline-none" title="Klik untuk ubah role">
                        {user.role === 'ADMIN' ? (
                          <Badge className="bg-red-500 text-white border-red-500 text-[10px] uppercase font-bold px-3 py-1 cursor-pointer hover:bg-red-600 transition-colors">Admin</Badge>
                        ) : (
                          <Badge className="bg-slate-200 text-slate-700 border-slate-300 text-[10px] uppercase font-bold px-3 py-1 cursor-pointer hover:bg-slate-300 transition-colors">User</Badge>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-center font-bold text-lg">{user.invitationCount}</td>
                    <td className="py-4 px-5 text-right font-bold text-emerald-700">
                      {user.totalSpent > 0 ? `Rp ${user.totalSpent.toLocaleString('id-ID')}` : <span className="text-[#6b6b6b] font-medium">—</span>}
                    </td>
                    <td className="py-4 px-5 text-xs text-[#6b6b6b]">{formatDate(user.createdAt)}</td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => handleUpdateRole(user.id, user.role)} 
                        className="inline-flex items-center text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />Toggle Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination meta={meta} onPageChange={setPage} />
      </Card>
    </div>
  );
}
