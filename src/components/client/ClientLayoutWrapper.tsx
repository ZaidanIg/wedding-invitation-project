"use client";

import React, { useState } from 'react';
import { ClientSidebar } from './ClientSidebar';
import { ClientTopbar } from './ClientTopbar';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  userName?: string | null;
  invitationSlug?: string | null;
}

export function ClientLayoutWrapper({
  children,
  userName,
  invitationSlug,
}: ClientLayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-[#2c2a29]">
      <ClientSidebar 
        invitationSlug={invitationSlug} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      <div className="flex flex-col lg:pl-64 min-h-screen">
        <ClientTopbar 
          userName={userName} 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
