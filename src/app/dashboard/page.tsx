'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import InvitationCard from '@/components/InvitationCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Invitation } from '@/types';

type InvitationWithCount = Invitation & { _count?: { guests: number } };

export default function DashboardPage() {
  const [invitations, setInvitations] = useState<InvitationWithCount[]>([]);
  const [userStats, setUserStats] = useState<{ accountType: string, freeGeneratesUsed: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/invitations?limit=50');
      const data = await res.json();
      if (data.success) {
        setInvitations(data.data);
        setUserStats(data.user);
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
              Dashboard {userStats?.accountType !== 'B2C_FREE' ? 'Pro' : 'Saya'}
            </h1>
            <p className="text-lg text-[#6b6b6b] mt-4 max-w-2xl">
              {userStats?.accountType !== 'B2C_FREE' 
                ? 'Kelola bisnis dan undangan premium Anda dengan fitur eksklusif.'
                : 'Kelola semua momen berharga Anda di satu tempat'}
            </p>
          </div>
          <Link href="/create" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-16 px-10 bg-rose-gradient text-white shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 rounded-2xl font-bold">
              <Plus className="h-5 w-5 mr-2" />
              Buat Undangan Baru
            </Button>
          </Link>
        </div>

        {/* Pro Banner / Stats for Subscribers */}
        {userStats && userStats.accountType !== 'B2C_FREE' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Card className="p-10 bg-[#1c1c1c] text-white border-none shadow-2xl shadow-rose-500/10 rounded-[3rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Heart className="h-32 w-32 fill-rose-500 text-rose-500" />
               </div>
               <div className="relative z-10">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-6">Account Tier</div>
                  <div className="text-4xl font-display font-bold mb-3">
                    {userStats.accountType === 'B2B_ALL_TIME' ? 'Enterprise' : 'B2B Pro'}
                  </div>
                  <p className="text-white/40 text-xs font-medium">Aktif Selamanya • Akses Penuh Fitur</p>
               </div>
            </Card>
            
            <Card className="p-10 bg-white border-[#eceae4] rounded-[3rem] shadow-sm hover:shadow-md transition-all">
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b6b6b] mb-6">Total Engagement</div>
               <div className="text-4xl font-display font-bold text-[#1c1c1c] mb-3">
                  {invitations.reduce((acc, inv) => acc + inv.viewCount, 0).toLocaleString()}
               </div>
               <p className="text-[#6b6b6b] text-xs font-medium">Klik Undangan (Kumulatif)</p>
            </Card>
 
            <Card className="p-10 bg-white border-[#eceae4] rounded-[3rem] shadow-sm hover:shadow-md transition-all">
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b6b6b] mb-6">Manajemen Tamu</div>
               <div className="text-4xl font-display font-bold text-[#1c1c1c] mb-3">
                  {invitations.reduce((acc, inv) => acc + (inv._count?.guests || 0), 0).toLocaleString()}
               </div>
               <p className="text-[#6b6b6b] text-xs font-medium">Total RSVP Masuk</p>
            </Card>
          </div>
        )}

        {/* Quota / Upgrade Banner for Free Users */}
        {userStats && userStats.accountType === 'B2C_FREE' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[3rem] p-10 mb-20 flex flex-col sm:flex-row items-center justify-between gap-12 border-rose-500/10 shadow-xl shadow-rose-500/5"
          >
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/5 text-rose-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                <Heart className="h-3.5 w-3.5 fill-rose-500" /> Paket Gratis
              </div>
              <h3 className="text-[#1c1c1c] text-2xl font-bold mb-3 tracking-tight">Eksplorasi Desain Anda</h3>
              <p className="text-[#6b6b6b] text-sm leading-relaxed max-w-md">
                Tersisa {Math.max(0, 3 - userStats.freeGeneratesUsed)} desain gratis dari kuota 3 desain yang diberikan. Tingkatkan ke Pro untuk desain tanpa batas.
              </p>
              <div className="w-full sm:w-80 bg-rose-500/10 rounded-full h-2.5 mt-8 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(Math.min(userStats.freeGeneratesUsed, 3) / 3) * 100}%` }}
                  className="bg-rose-gradient h-full rounded-full" 
                  transition={{ duration: 1.2, ease: "circOut" }}
                />
              </div>
            </div>
            <Link href="/pricing" className="shrink-0 w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 bg-[#1c1c1c] text-white rounded-2xl hover:bg-stone-800 transition-all shadow-xl font-bold">
                <Heart className="h-4 w-4 mr-3 text-rose-500 fill-rose-500" />
                Upgrade Paket
              </Button>
            </Link>
          </motion.div>
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
                accountType={userStats?.accountType as any}
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

