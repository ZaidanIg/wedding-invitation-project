'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import InvitationCard from '@/components/InvitationCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Invitation } from '@/types';

type InvitationWithCount = Invitation & { _count?: { guests: number } };

export default function DashboardPage() {
  const [invitations, setInvitations] = useState<InvitationWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/invitations?limit=50');
      const data = await res.json();
      if (data.success) {
        setInvitations(data.data?.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  return (
    <section className="min-h-screen bg-[#fdfcf9] py-32 px-4 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12 mb-20 text-center sm:text-left">
          <div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1c1c1c] tracking-tight leading-tight">
              Dashboard Saya
            </h1>
            <p className="text-lg text-[#6b6b6b] mt-4 max-w-2xl">
              Kelola momen berharga Anda di satu tempat, dengan undangan premium yang mewah.
            </p>
          </div>
          <Link href="/create" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-16 px-10 bg-rose-gradient text-white shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 rounded-2xl font-bold">
              <Plus className="h-5 w-5 mr-2" />
              Buat Undangan Baru
            </Button>
          </Link>
        </div>

        {/* Stats for B2C Users */}
        {invitations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <Card className="p-8 bg-white border-[#eceae4] rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b6b6b] mb-5">Total Undangan</div>
              <div className="text-4xl font-display font-bold text-[#1c1c1c] mb-2">{invitations.length}</div>
              <p className="text-[#6b6b6b] text-xs font-medium">Dibuat</p>
            </Card>

            <Card className="p-8 bg-white border-[#eceae4] rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b6b6b] mb-5">Total Klik</div>
              <div className="text-4xl font-display font-bold text-[#1c1c1c] mb-2">
                {invitations.reduce((acc, inv) => acc + inv.viewCount, 0).toLocaleString()}
              </div>
              <p className="text-[#6b6b6b] text-xs font-medium">Kumulatif dibuka</p>
            </Card>

            <Card className="p-8 bg-white border-[#eceae4] rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b6b6b] mb-5">Total RSVP</div>
              <div className="text-4xl font-display font-bold text-[#1c1c1c] mb-2">
                {invitations.reduce((acc, inv) => acc + (inv._count?.guests || 0), 0).toLocaleString()}
              </div>
              <p className="text-[#6b6b6b] text-xs font-medium">Tamu konfirmasi</p>
            </Card>

            <Card className="p-8 bg-white border-[#eceae4] rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b6b6b] mb-5">Status Aktif</div>
              <div className="text-4xl font-display font-bold text-[#1c1c1c] mb-2">
                {invitations.filter(inv => inv.tier !== 'DRAFT').length}
              </div>
              <p className="text-[#6b6b6b] text-xs font-medium">Sudah diaktifkan</p>
            </Card>
          </div>
        )}


        {/* Content */}
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : invitations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 glass rounded-[2.5rem] border-dashed border-2 border-rose-500/20"
          >
            <div className="inline-flex p-6 rounded-3xl bg-rose-500/5 mb-8">
              <Plus className="h-10 w-10 text-rose-500/20" />
            </div>
            <h2 className="text-2xl font-display font-bold text-[#1c1c1c] mb-3">
              Belum Ada Undangan
            </h2>
            <p className="text-[#6b6b6b] mb-12 max-w-sm mx-auto leading-relaxed">
              Mulai buat undangan pernikahan digital mewah Anda hanya dalam 5 menit.
            </p>
            <Link href="/create">
              <Button size="lg" className="bg-rose-gradient text-white rounded-2xl px-10 shadow-lg shadow-rose-500/20">
                <Plus className="h-5 w-5" />
                Mulai Sekarang
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {invitations.map((inv) => (
              <InvitationCard 
                key={inv.id} 
                invitation={inv} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

