import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users, Phone, CalendarDays, Wallet, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    NEW: { cls: 'bg-blue-50 border-blue-200 text-blue-700', label: 'Baru' },
    CONTACTED: { cls: 'bg-amber-50 border-amber-200 text-amber-700', label: 'Dihubungi' },
    IN_PROGRESS: { cls: 'bg-purple-50 border-purple-200 text-purple-700', label: 'Proses' },
    CONVERTED: { cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Dikonversi' },
    LOST: { cls: 'bg-zinc-50 border-zinc-200 text-zinc-500', label: 'Hilang' },
  };
  const s = map[status] || map.NEW;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>{s.label}</span>;
}

export default async function LeadsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const agency = await prisma.agency.findFirst({ where: { ownerId: session.user.id } });
  const leads = agency
    ? await prisma.lead.findMany({ where: { assignedAgencyId: agency.id }, orderBy: { createdAt: 'desc' } })
    : [];

  const stats = {
    total: leads.length,
    newCount: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    converted: leads.filter(l => l.status === 'CONVERTED').length,
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-zinc-900">Leads</h2>
        <p className="text-xs lg:text-sm text-zinc-500">Calon klien yang tertarik dengan layanan Anda.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
        {[
          { icon: Users, label: 'Total', value: stats.total, color: 'text-zinc-400' },
          { icon: Clock, label: 'Baru', value: stats.newCount, color: 'text-blue-400' },
          { icon: Phone, label: 'Dihubungi', value: stats.contacted, color: 'text-amber-400' },
          { icon: Wallet, label: 'Konversi', value: stats.converted, color: 'text-emerald-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white border border-zinc-200 rounded-xl p-3 lg:p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5 lg:mb-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-[10px] lg:text-xs font-medium uppercase tracking-wider text-zinc-400">{label}</span>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-zinc-900 tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {leads.length === 0 ? (
        <EmptyState title="Belum ada leads" description="Leads dari calon klien akan muncul di sini ketika mereka menghubungi melalui landing page Anda." />
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-600">
              <thead className="text-xs uppercase bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Nama Klien</th>
                  <th className="px-6 py-4 font-medium">No. Telepon</th>
                  <th className="px-6 py-4 font-medium">Tanggal Acara</th>
                  <th className="px-6 py-4 font-medium">Budget</th>
                  <th className="px-6 py-4 font-medium text-center">Tamu</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Masuk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{lead.clientName}</td>
                    <td className="px-6 py-4">
                      <a href={`tel:${lead.phone}`} className="text-zinc-600 hover:text-rose-600 transition-colors">{lead.phone}</a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                        {formatDate(lead.eventDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 tabular-nums text-zinc-700">{formatCurrency(lead.budget)}</td>
                    <td className="px-6 py-4 text-center tabular-nums">{lead.guestCount}</td>
                    <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>
                    <td className="px-6 py-4 text-xs text-zinc-400">{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="block lg:hidden divide-y divide-zinc-100">
            {leads.map((lead) => (
              <div key={lead.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{lead.clientName}</p>
                    <a href={`tel:${lead.phone}`} className="text-xs text-zinc-500 hover:text-rose-600 transition-colors">{lead.phone}</a>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3 text-zinc-400" />
                    {formatDate(lead.eventDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Wallet className="h-3 w-3 text-zinc-400" />
                    {formatCurrency(lead.budget)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-zinc-400" />
                    {lead.guestCount} tamu
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
