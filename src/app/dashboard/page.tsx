'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import InvitationCard from '@/components/InvitationCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heart, Plus } from 'lucide-react';
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
    <section className="min-h-screen bg-[#f7f4ed] py-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-[32px] font-display font-bold text-[#1c1c1c] tracking-tight">
              Undangan Saya
            </h1>
            <p className="text-sm text-[#5f5f5d] mt-1">
              Kelola semua undangan pernikahan Anda di sini
            </p>
          </div>
          <Link href="/create">
            <Button size="md" className="bg-[#1c1c1c] text-[#fcfbf8] shadow-inset">
              <Plus className="h-4 w-4" />
              Buat Baru
            </Button>
          </Link>
        </div>

        {/* Quota / Upgrade Banner */}
        {userStats && userStats.accountType === 'B2C_FREE' && (
          <div className="bg-[#1c1c1c] rounded-xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inset">
            <div className="text-center sm:text-left">
              <h3 className="text-[#fcfbf8] font-bold mb-1">Paket Gratis</h3>
              <p className="text-[#fcfbf8]/60 text-xs">
                Anda telah mencoba {Math.min(userStats.freeGeneratesUsed, 3)} dari 3 desain gratis.
              </p>
              <div className="w-full sm:w-64 bg-[#fcfbf8]/10 rounded-full h-1.5 mt-3">
                <div 
                  className="bg-[#fcfbf8] h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(Math.min(userStats.freeGeneratesUsed, 3) / 3) * 100}%` }}
                ></div>
              </div>
            </div>
            <Link href="/pricing">
              <Button size="md" className="shrink-0 w-full sm:w-auto bg-[#fcfbf8] text-[#1c1c1c] font-bold shadow-focus hover:opacity-90">
                <Heart className="h-4 w-4 mr-2" />
                Upgrade Sekarang
              </Button>
            </Link>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : invitations.length === 0 ? (
          <Card className="text-center py-20 bg-[#f7f4ed] border-[#eceae4]">
            <div className="inline-flex p-4 rounded-full bg-[#1c1c1c]/5 mb-6">
              <Heart className="h-8 w-8 text-[#1c1c1c]/20" />
            </div>
            <h2 className="text-xl font-bold text-[#1c1c1c] mb-2">
              Belum Ada Undangan
            </h2>
            <p className="text-sm text-[#5f5f5d] mb-10 max-w-sm mx-auto leading-[1.38]">
              Buat undangan pernikahan digital mewah pertama Anda hanya dalam 5 menit.
            </p>
            <Link href="/create">
              <Button size="lg" className="bg-[#1c1c1c] text-[#fcfbf8] shadow-inset">
                <Plus className="h-4 w-4" />
                Mulai Buat Undangan
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv) => (
              <InvitationCard key={inv.id} invitation={inv} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
