import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.accountType === 'B2C_FREE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans text-zinc-900">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-zinc-200 max-w-md w-full">
          <h1 className="text-2xl font-bold text-rose-600 mb-4">Akses Ditolak</h1>
          <p className="text-zinc-600 mb-6">
            Dashboard ini hanya diperuntukkan bagi Agency atau Mitra. Akun Anda saat ini adalah akun reguler.
          </p>
          <a href="/" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 transition-colors">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Sidebar />
      <div className="flex flex-col lg:pl-64 min-h-screen">
        <Topbar />
        <main className="flex-1 p-3 sm:p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
