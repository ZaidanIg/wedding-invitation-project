'use client';

import Link from 'next/link';
import { Eye, Users, Calendar, Trash2, ExternalLink, Copy, Sparkles, MapPin, Share2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import WhatsAppGenerator from './WhatsAppGenerator';
import type { Invitation, AccountType } from '@/types';

interface InvitationCardProps {
  invitation: Invitation & { _count?: { guests: number } };
  accountType?: AccountType;
  onDelete?: (id: string) => void;
}

export default function InvitationCard({ invitation, accountType, onDelete }: InvitationCardProps) {
  const formattedDate = new Date(invitation.eventDate).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const invitationUrl = `/invitation/${invitation.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + invitationUrl);
      showToast('success', 'Link undangan berhasil disalin!');
    } catch { showToast('error', 'Gagal menyalin link'); }
  };

  const handleDelete = async () => {
    if (!confirm('Hapus undangan ini selamanya?')) return;
    try {
      const res = await fetch(`/api/invitations/${invitation.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      showToast('success', 'Undangan dihapus');
      onDelete?.(invitation.id);
    } catch { showToast('error', 'Gagal menghapus undangan'); }
  };

  const showUpgrade = invitation.tier === 'DRAFT' && accountType !== 'B2B_ALL_TIME' && accountType !== 'B2B_PRO';

  return (
    <Card className="group bg-white border-[#eceae4] hover:border-rose-200 transition-all shadow-sm hover:shadow-md p-5 sm:p-7 rounded-[2.5rem]">
      <div className="flex flex-col gap-8">
        {/* Info Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-2xl font-display font-bold text-[#1c1c1c] tracking-tight">
                {invitation.groomName} & {invitation.brideName}
              </h3>
              <div className="flex gap-2">
                <Badge className="bg-[#1c1c1c]/5 text-[#1c1c1c]/60 border-[#eceae4] text-[10px] uppercase tracking-widest font-bold px-3 py-1">
                  {invitation.tone}
                </Badge>
                {invitation.tier === 'DRAFT' ? (
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-[10px] uppercase tracking-widest font-bold px-3 py-1">
                    Draf
                  </Badge>
                ) : invitation.tier === 'BASIC' ? (
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 text-[10px] uppercase tracking-widest font-bold px-3 py-1">
                    Aktif (Gratis)
                  </Badge>
                ) : (
                  <Badge className="bg-rose-500 text-white border-rose-500 text-[10px] uppercase tracking-widest font-bold px-3 py-1">
                    Premium
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-8 gap-y-3 text-xs text-[#5f5f5d]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500"><Calendar className="h-4 w-4" /></div>
                <span className="font-bold">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><Eye className="h-4 w-4" /></div>
                <span className="font-bold">{invitation.viewCount} Klik</span>
              </div>
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500"><Users className="h-4 w-4" /></div>
                <span className="font-bold">{invitation._count?.guests || 0} Tamu RSVP</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-[#5f5f5d]/50 mt-5 uppercase tracking-[0.2em] font-bold">
              <MapPin className="h-3.5 w-3.5" /> {invitation.venueName}
            </div>
          </div>
        </div>

        {/* Action Panel for "Lay Users" (User Awam) */}
        <div className="bg-[#fcfbf8] rounded-3xl p-5 border border-[#eceae4]">
          <div className="flex items-center gap-2 mb-5">
             <Share2 className="h-4 w-4 text-[#1c1c1c]/40" />
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c1c1c]/40">Kelola & Bagikan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* WhatsApp (Dynamic Component) */}
            <WhatsAppGenerator invitationSlug={invitation.slug} groomName={invitation.groomName} brideName={invitation.brideName} />
            
            {/* Copy Link with Clear Label */}
            <Button variant="secondary" onClick={handleCopyLink} className="h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
              <Copy className="h-5 w-5 mr-3 text-rose-500 group-hover:text-white transition-colors" />
              Salin Link Undangan
            </Button>

            {/* View Invitation with Clear Label */}
            <Link href={invitationUrl} target="_blank" className="w-full">
              <Button variant="secondary" className="w-full h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                <ExternalLink className="h-5 w-5 mr-3 text-blue-500 group-hover:text-white transition-colors" />
                Lihat Hasil Undangan
              </Button>
            </Link>

            {/* RSVP List */}
            <Link href={`${invitationUrl}/rsvp`} className="w-full">
              <Button variant="secondary" className="w-full h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                <Users className="h-5 w-5 mr-3 text-emerald-500 group-hover:text-white transition-colors" />
                Daftar Tamu RSVP
              </Button>
            </Link>
          </div>

          {/* Special Actions (Upgrade/Delete) */}
          {(showUpgrade || true) && (
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-3">
              {showUpgrade && (
                <Link href={`/pricing?invitationId=${invitation.id}`} className="flex-1 w-full">
                  <Button className="w-full h-12 rounded-2xl bg-rose-500 text-white font-bold text-sm shadow-lg hover:bg-rose-600 hover:scale-[1.01] transition-all">
                    <Sparkles className="h-5 w-5 mr-3 text-white fill-white" />
                    Aktifkan Paket Premium
                  </Button>
                </Link>
              )}
              <Button variant="ghost" onClick={handleDelete} className="w-full sm:w-auto h-12 px-6 rounded-2xl text-red-400 hover:bg-red-50 font-bold text-sm">
                <Trash2 className="h-5 w-5 mr-2" />
                Hapus
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
