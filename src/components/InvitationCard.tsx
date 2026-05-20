'use client';

import Link from 'next/link';
import { Eye, Users, Calendar, Trash2, ExternalLink, Copy, Sparkles, MapPin, Share2, QrCode, Download, MessageSquare, FolderKanban } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import WhatsAppGenerator from './WhatsAppGenerator';
import { QRCodeSVG } from 'qrcode.react';
import type { Invitation, AccountType } from '@/types';


interface InvitationCardProps {
  invitation: Invitation & { 
    _count?: { guests: number };
    transactions?: Array<{ id: string; status: string; paymentUrl?: string | null; tier?: string | null; amount: number }>;
  };
  accountType?: AccountType;
  onDelete?: (id: string) => void;
}

export default function InvitationCard({ invitation, accountType, onDelete }: InvitationCardProps) {
  const formattedDate = new Date(invitation.eventDate).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const invitationUrl = `/invitation/${invitation.slug}`;
  const isB2CUnpaid = invitation.tier === 'DRAFT' && accountType !== 'B2B_PRO' && accountType !== 'B2B_ALL_TIME';

  const pendingTx = invitation.transactions?.find((tx: any) => tx.status === 'PENDING');
  const paymentLink = pendingTx?.paymentUrl || `/checkout?plan=${pendingTx?.tier || 'PREMIUM'}&invitationId=${invitation.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + invitationUrl);
      showToast('success', 'Link undangan berhasil disalin!');
    } catch { showToast('error', 'Gagal menyalin link'); }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById(`qr-inv-${invitation.id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${invitation.slug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    showToast('success', 'QR Code berhasil diunduh!');
  };
  const handleDelete = async () => {
    if (!confirm('Hapus undangan ini selamanya?')) return;
    try {
      const res = await fetch(`/api/invitations/${invitation.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Gagal menghapus undangan');
      showToast('success', 'Undangan dihapus');
      onDelete?.(invitation.id);
    } catch (error: any) { 
      showToast('error', error.message || 'Gagal menghapus undangan'); 
    }
  };


  const showUpgrade = invitation.tier === 'DRAFT' && accountType !== 'B2B_ALL_TIME' && accountType !== 'B2B_PRO';

  return (
    <Card className="group bg-white border-[#eceae4] hover:border-rose-200 transition-all shadow-sm hover:shadow-lg p-8 sm:p-10 rounded-[3rem]">
      <div className="flex flex-col gap-8">
        {/* Info Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-2xl font-display font-bold text-[#1c1c1c] tracking-tight">
                {invitation.groomName} & {invitation.brideName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {invitation.project && (
                  <Badge className="bg-rose-500/10 text-rose-700 border-rose-200/50 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 flex items-center gap-1.5 shadow-sm">
                    <FolderKanban className="h-3 w-3 text-rose-500" />
                    Proyek: {invitation.project.name}
                  </Badge>
                )}
                <Badge className="bg-[#1c1c1c]/5 text-[#1c1c1c]/60 border-[#eceae4] text-[10px] uppercase tracking-widest font-bold px-3 py-1">
                  {invitation.tone}
                </Badge>
                {invitation.tier === 'DRAFT' ? (
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-[10px] uppercase tracking-widest font-bold px-3 py-1">
                    Draf
                  </Badge>
                ) : invitation.tier === 'BASIC' ? (
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 text-[10px] uppercase tracking-widest font-bold px-3 py-1">
                    Minimalist
                  </Badge>
                ) : (invitation.tier === 'ULTIMATE' || invitation.tier === 'B2B_GENERATED') ? (
                  <Badge className="bg-amber-500 text-white border-amber-500 text-[10px] uppercase tracking-widest font-bold px-3 py-1 shadow-lg shadow-amber-500/20">
                    Ultimate
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

        {/* Action Panel */}
        <div className="bg-[#fcfbf8] rounded-[2rem] p-6 sm:p-8 border border-[#eceae4]">
          {isB2CUnpaid ? (
            <div className="flex flex-col">
              {/* Notice Block */}
              <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl mb-6">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Sparkles className="h-5 w-5 fill-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1c1c1c] tracking-tight">
                      {pendingTx ? 'Menunggu Pembayaran' : 'Selesaikan Pembayaran'}
                    </h4>
                    <p className="text-xs text-[#6b6b6b] mt-1 font-semibold leading-relaxed">
                      {pendingTx 
                        ? 'Anda memiliki transaksi yang sedang tertunda untuk undangan ini. Silakan selesaikan pembayaran untuk mengaktifkan seluruh fitur premium.' 
                        : 'Desain undangan mewah Anda telah berhasil disimpan! Silakan selesaikan pembayaran untuk mengaktifkan seluruh fitur premium (WhatsApp Blast, Salin Link, Buka Tautan, Manajemen Tamu, dan QR Check-in).'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={paymentLink} className="flex-1 w-full" target={pendingTx?.paymentUrl ? "_blank" : undefined}>
                  <Button className="w-full h-12 rounded-2xl bg-rose-gradient text-white font-bold text-sm shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-white fill-white animate-pulse" />
                    {pendingTx ? 'Lanjutkan Pembayaran' : 'Pilih Paket & Bayar Sekarang'}
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleDelete} className="w-full sm:w-auto h-12 px-6 rounded-2xl text-red-500 hover:bg-red-50 font-bold text-sm flex items-center justify-center">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Hapus Draf
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                   <Share2 className="h-4 w-4 text-[#1c1c1c]/40" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c1c1c]/40">Kelola & Bagikan</span>
                </div>
                {(invitation.tier === 'ULTIMATE' || invitation.tier === 'B2B_GENERATED' || accountType === 'B2B_PRO' || accountType === 'B2B_ALL_TIME') && (
                  <div className="flex items-center gap-3">
                    <div className="hidden">
                      <QRCodeSVG 
                        id={`qr-inv-${invitation.id}`}
                        value={`${window.location.origin}/invitation/${invitation.slug}`}
                        size={256}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleDownloadQR}
                      className="h-8 rounded-full bg-amber-500/10 text-amber-600 border-none text-[10px] font-bold uppercase tracking-widest px-4"
                    >
                      <Download className="h-3 w-3 mr-2" /> Download QR
                    </Button>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200/50">
                      <Sparkles className="h-3 w-3 fill-amber-500" /> Pro Active
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* WhatsApp (Dynamic Component) */}
                <WhatsAppGenerator invitationSlug={invitation.slug} groomName={invitation.groomName} brideName={invitation.brideName} />
                
                {/* Copy Link with Clear Label */}
                <Button variant="secondary" onClick={handleCopyLink} className="h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                  <Copy className="h-5 w-5 mr-3 text-rose-500 group-hover:text-white transition-colors" />
                  Salin Link
                </Button>

                {/* View Invitation with Clear Label */}
                <Link href={invitationUrl} target="_blank" className="w-full">
                  <Button variant="secondary" className="w-full h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                    <ExternalLink className="h-5 w-5 mr-3 text-blue-500 group-hover:text-white transition-colors" />
                    Lihat Hasil
                  </Button>
                </Link>

                {/* RSVP List / Management */}
                <Link href={`${invitationUrl}/rsvp`} className="w-full">
                  <Button variant="secondary" className="w-full h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                    <Users className="h-5 w-5 mr-3 text-emerald-500 group-hover:text-white transition-colors" />
                    Manajemen Tamu
                  </Button>
                </Link>
              </div>

              {/* Special Actions (Upgrade/Delete) */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                {(invitation.tier === 'PREMIUM' || invitation.tier === 'ULTIMATE' || invitation.tier === 'B2B_GENERATED' || accountType === 'B2B_PRO' || accountType === 'B2B_ALL_TIME') && (
                  <>
                    <Link href={`${invitationUrl}/blast`} className="flex-1 w-full">
                      <Button className="w-full h-12 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg hover:bg-emerald-600 transition-all">
                        <MessageSquare className="h-5 w-5 mr-3" />
                        WA Blast Pro
                      </Button>
                    </Link>
                    {invitation.qrEnabled !== false && (
                      <Link href={`${invitationUrl}/rsvp/scanner`} className="flex-1 w-full">
                         <Button className="w-full h-12 rounded-2xl bg-amber-500 text-white font-bold text-sm shadow-lg hover:bg-amber-600 transition-all">
                           <QrCode className="h-5 w-5 mr-3" />
                           Scan QR Check-in
                         </Button>
                      </Link>
                    )}
                  </>
                )}

                {showUpgrade && (
                  <Link href={`/pricing?invitationId=${invitation.id}`} className="flex-1 w-full">
                    <Button className="w-full h-12 rounded-2xl bg-rose-500 text-white font-bold text-sm shadow-lg hover:bg-rose-600 hover:scale-[1.01] transition-all">
                      <Sparkles className="h-5 w-5 mr-3 text-white fill-white" />
                      Upgrade Paket
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={handleDelete} className="w-full sm:w-auto h-12 px-6 rounded-2xl text-red-400 hover:bg-red-50 font-bold text-sm">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Hapus
                </Button>
              </div>
            </>
          )}
        </div>

      </div>
    </Card>
  );
}
