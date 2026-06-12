'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Login page: render without any shell (no sidebar/header)
  if (isLoginPage) {
    return <>{children}</>;
  }

  const isBuilderPage = pathname === '/admin/themes/builder';

  return (
    <div className="h-screen bg-[#f7f5f2] flex overflow-hidden">
      {/* Fixed sidebar */}
      <AdminSidebar />

      {/* Main content area — offset by sidebar width */}
      <div className={`flex-1 ml-64 flex flex-col h-screen min-w-0 relative ${isBuilderPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        {/* Sticky header */}
        {!isBuilderPage && <AdminHeader />}

        {/* Page content */}
        <main className={`flex-1 min-w-0 ${isBuilderPage ? 'p-0 flex flex-col overflow-hidden h-full' : 'p-6 lg:p-8'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
