import React from 'react';
import { prisma } from '@/lib/prisma';
import { EmptyState } from '@/components/ui/EmptyState';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { Plus, Calendar, Users, FolderKanban } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === 'PUBLISHED'
    ? 'bg-emerald-100 text-emerald-800'
    : status === 'COMPLETED'
    ? 'bg-zinc-100 text-zinc-800'
    : 'bg-amber-100 text-amber-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {status.toLowerCase()}
    </span>
  );
}

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const projects = await prisma.project.findMany({
    where: {
      agency: {
        ownerId: session.user.id,
      }
    },
    include: {
      _count: {
        select: { guests: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold tracking-tight text-zinc-900">Proyek Undangan</h2>
          <p className="text-xs lg:text-sm text-zinc-500">Kelola proyek dan undangan pernikahan klien Anda di sini.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-rose-gradient shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 rounded-xl transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Undangan Baru
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="Belum Ada Proyek Undangan"
          description="Anda belum membuat proyek undangan apa pun. Mulai dengan membuat proyek baru untuk mengelola undangan klien Anda."
          actionLabel="Buat Undangan Baru"
          actionHref="/dashboard/projects/new"
        />

      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-600">
              <thead className="text-xs uppercase bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Project Name</th>
                  <th scope="col" className="px-6 py-4 font-medium">Status</th>
                  <th scope="col" className="px-6 py-4 font-medium">Created At</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Total Guests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {project.name}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums">
                      {project._count.guests}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="block lg:hidden divide-y divide-zinc-100">
            {projects.map((project) => (
              <div key={project.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                      <FolderKanban className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{project.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3 text-zinc-400 shrink-0" />
                        <span className="text-[11px] text-zinc-400">{formatDate(project.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 pl-12">
                  <Users className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{project._count.guests} tamu terdaftar</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
