'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RsvpTable from '@/components/dashboard/RsvpTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import WaBlastModal from '@/components/dashboard/WaBlastModal';
import AddGuestModal from '@/components/dashboard/AddGuestModal';
import { UserPlus, Sparkles, Eye, MessageSquare, ArrowLeft } from 'lucide-react';
import type { Guest } from '@/types';

interface RsvpStats {
  attending: number;
  notAttending: number;
  pending: number;
  totalResponses: number;
  estimatedGuests: number;
}

export default function RsvpManagementPage() {
  const params = useParams<{ coupleNames: string; slug: string }>();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<RsvpStats>({ attending: 0, notAttending: 0, pending: 0, totalResponses: 0, estimatedGuests: 0 });
  const [tier, setTier] = useState<string>('');
  const [qrEnabled, setQrEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showBlastModal, setShowBlastModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);

  const fetchRsvps = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await fetch(`/api/invitations/${params.slug}/rsvp`);
      const data = await res.json();
      if (data.success) {
        setGuests(data.data.guests);
        setStats(data.data.stats);
        setTier(data.data.tier);
        setQrEnabled(data.data.qrEnabled !== false);
      }
    } catch (error) {
      console.error('Failed to fetch RSVPs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRsvps(true);
    
    // Auto-open blast modal if requested via URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('blast') === 'true') {
      setShowBlastModal(true);
    }
  }, [params.slug]);

  return (
    <section className="min-h-[calc(100dvh-4rem)] py-12 px-4 pt-20 mt-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Buku Tamu</h1>
            <p className="text-sm text-foreground/40 mt-0.5">Daftar kehadiran dan rsvp tamu</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="space-y-8">
            {/* Pro Tools Header */}
            {(guests.length > 0 || tier === 'PREMIUM' || tier === 'ULTIMATE' || tier === 'B2B_GENERATED') && (
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white border border-[#eceae4] rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1c1c1c]">Buku Tamu</h3>
                    <p className="text-[10px] text-[#6b6b6b] uppercase tracking-wider">{tier === 'PREMIUM' ? 'Premium' : 'Ultimate'} Tier Features</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50"
                    onClick={() => setShowAddGuestModal(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah Tamu
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    onClick={() => setShowBlastModal(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WA Blast
                  </Button>
                  {qrEnabled && (
                    <Link href={`${window.location.pathname}/scanner`}>
                      <Button size="sm" className="bg-amber-500 text-white rounded-xl">
                        <Eye className="h-4 w-4 mr-2" />
                        Scan QR
                      </Button>
                    </Link>
                  )}
                  <Button variant="secondary" size="sm" className="rounded-xl border-[#eceae4]" onClick={() => showToast('success', 'Exporting to Excel...')}>
                    Export Excel
                  </Button>
                </div>
              </div>
            )}

            <RsvpTable guests={guests} stats={stats} />
          </div>
        )}

        {showAddGuestModal && (
          <AddGuestModal 
            invitationSlug={params.slug}
            onClose={() => setShowAddGuestModal(false)}
            onSuccess={() => {
               // Re-fetch guests to update the list in-place without reloading the page
               fetchRsvps(); 
            }}
          />
        )}

        {showBlastModal && (
          <WaBlastModal 
            guests={guests} 
            onClose={() => setShowBlastModal(false)} 
            invitationUrl={`${window.location.origin}/invitation/${params.coupleNames}/${params.slug}`}
          />
        )}
      </div>
    </section>
  );
}
