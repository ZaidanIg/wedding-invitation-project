import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fdfcf9] flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 overflow-x-hidden">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
