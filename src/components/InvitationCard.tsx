'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Eye, Users, Calendar, Trash2, ExternalLink, Copy, Sparkles, MapPin,
  Share2, QrCode, Download, MessageSquare, Pencil, Lock, Crown
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import WhatsAppGenerator from './WhatsAppGenerator';
import SafeQRCodeSVG from '@/components/SafeQRCodeSVG';
import type { Invitation, Tier } from '@/types';
import { getCoupleSlug } from '@/lib/utils';


interface InvitationCardProps {
  invitation: Invitation & {
    _count?: { guests: number };
    transactions?: Array<{ id: string; status: string; paymentUrl?: string | null; tier?: string | null; amount: number }>;
  };
  onDelete?: (id: string) => void;
}

const TIER_CONFIG: Record<Tier, {
  label: string;
  badgeClass: string;
}> = {
  DRAFT:   { label: 'Belum Aktif',  badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  BASIC:   { label: 'Basic',        badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  PREMIUM: { label: 'Premium',      badgeClass: 'bg-rose-500 text-white border-rose-500' },
  ULTIMATE:{ label: 'Ultimate',     badgeClass: 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' },
};

export default function InvitationCard({ invitation, onDelete }: InvitationCardProps) {
  const [qrEnabled, setQrEnabled] = useState(invitation.qrEnabled);
  const [isActivating, setIsActivating] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const tier = (invitation.tier as Tier) || 'DRAFT';
  const isDraft    = tier === 'DRAFT';
  const isBasic    = tier === 'BASIC';
  const isPremium  = tier === 'PREMIUM';
  const isUltimate = tier === 'ULTIMATE';

  // Feature gates per tier
  const canCopyLink    = !isDraft;
  const canViewResult  = !isDraft;
  const canShareWA     = isPremium || isUltimate;
  const canManageGuest = isPremium || isUltimate;
  const canWaBlast     = isUltimate;
  const canQrCheckin   = isUltimate && qrEnabled !== false;
  const canDownloadQR  = isUltimate && qrEnabled !== false;
  const showUpgrade    = isBasic || isPremium;

  const formattedDate = new Date(invitation.eventDate).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const coupleSlug = getCoupleSlug(invitation.groomName, invitation.brideName);
  const invitationUrl = `/invitation/${coupleSlug}/${invitation.slug}`;

  const pendingTx = invitation.transactions?.find((tx: any) => tx.status === 'PENDING');
  const paymentLink = pendingTx?.paymentUrl
    || `/pricing?invitationId=${invitation.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + invitationUrl);
      showToast('success', 'Link undangan berhasil disalin!');
    } catch { showToast('error', 'Gagal menyalin link'); }
  };

  const handleGenerateQR = async () => {
    setIsActivating(true);
    try {
      const res = await fetch(`/api/invitations/${invitation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrEnabled: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Gagal mengaktifkan QR Code');
      
      setQrEnabled(true);
      showToast('success', 'QR Code check-in berhasil diaktifkan untuk undangan ini!');
    } catch (error: any) {
      showToast('error', error.message || 'Gagal mengaktifkan QR Code');
    } finally {
      setIsActivating(false);
    }
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

  const tierConfig = TIER_CONFIG[tier];

  return (
    <Card className="group bg-white border-[#eceae4] hover:border-rose-200 transition-all shadow-sm hover:shadow-lg p-8 sm:p-10 rounded-[3rem]">
      <div className="flex flex-col gap-8">

        {/* ── Info Section ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* Title & badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-2xl font-display font-bold text-[#1c1c1c] tracking-tight">
                {invitation.groomName} & {invitation.brideName}
              </h3>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-[#1c1c1c]/5 text-[#1c1c1c]/60 border-[#eceae4] text-[10px] uppercase tracking-widest font-bold px-3 py-1">
                  {invitation.tone}
                </Badge>
                <Badge className={`${tierConfig.badgeClass} text-[10px] uppercase tracking-widest font-bold px-3 py-1`}>
                  {isUltimate && <Crown className="h-3 w-3 inline mr-1" />}
                  {tierConfig.label}
                </Badge>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-8 gap-y-3 text-xs text-[#5f5f5d]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500"><Calendar className="h-4 w-4" /></div>
                <span className="font-bold">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><Eye className="h-4 w-4" /></div>
                <span className="font-bold">{invitation.viewCount} Klik</span>
              </div>
              {canManageGuest ? (
                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-500"><Users className="h-4 w-4" /></div>
                  <span className="font-bold">{invitation._count?.guests || 0} Tamu RSVP</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1 opacity-40">
                  <div className="p-1.5 bg-stone-100 rounded-lg text-stone-400"><Users className="h-4 w-4" /></div>
                  <span className="font-semibold text-stone-400">RSVP di {isBasic ? 'Premium+' : 'Basic+'}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-[#5f5f5d]/50 mt-5 uppercase tracking-[0.2em] font-bold">
              <MapPin className="h-3.5 w-3.5" /> {invitation.venueName}
            </div>
          </div>
        </div>

        {/* ── Action Panel ── */}
        <div className="bg-[#fcfbf8] rounded-[2rem] p-6 sm:p-8 border border-[#eceae4]">
          {isDraft ? (
            /* DRAFT — Prompt to pay */
            <div className="flex flex-col">
              <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl mb-6">
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Sparkles className="h-5 w-5 fill-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1c1c1c] tracking-tight">
                      {pendingTx ? 'Menunggu Pembayaran' : 'Aktifkan Undangan Anda'}
                    </h4>
                    <p className="text-xs text-[#6b6b6b] mt-1 font-semibold leading-relaxed">
                      {pendingTx
                        ? 'Anda memiliki transaksi yang sedang tertunda. Silakan selesaikan pembayaran untuk mengaktifkan undangan.'
                        : 'Desain undangan telah disimpan! Pilih paket untuk mengaktifkan, membagikan, dan membuka seluruh fitur premium.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Edit even while draft */}
                <Link href={`/create?edit=${invitation.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                    <Pencil className="h-4 w-4 mr-2 text-rose-500 group-hover:text-white transition-colors" />
                    Edit Undangan
                  </Button>
                </Link>
                <Link href={paymentLink} className="flex-1 w-full" target={pendingTx?.paymentUrl ? '_blank' : undefined}>
                  <Button className="w-full h-12 rounded-2xl bg-rose-gradient text-white font-bold text-sm shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-white fill-white animate-pulse" />
                    {pendingTx ? 'Lanjutkan Pembayaran' : 'Pilih Paket & Bayar'}
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleDelete} className="w-full sm:w-auto h-12 px-6 rounded-2xl text-red-500 hover:bg-red-50 font-bold text-sm flex items-center justify-center">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Hapus Draf
                </Button>
              </div>
            </div>
          ) : (
            /* ACTIVE — Feature grid based on tier */
            <>
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-[#1c1c1c]/40" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c1c1c]/40">Kelola & Bagikan</span>
                </div>

                {/* ULTIMATE — Dynamic QR activation button + pro badge */}
                {isUltimate && (
                  <div className="flex items-center gap-3">
                    {qrEnabled === false ? (
                      <Button
                        size="sm"
                        disabled={isActivating}
                        onClick={handleGenerateQR}
                        className="h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase tracking-widest px-4 cursor-pointer hover:scale-[1.02] transition-all"
                      >
                        <QrCode className="h-3.5 w-3.5 mr-1.5 animate-pulse" />
                        {isActivating ? 'Activating...' : 'Generate QR'}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQrModal(true)}
                        className="h-8 rounded-full bg-amber-500/10 text-amber-600 border-none text-[10px] font-bold uppercase tracking-widest px-4 cursor-pointer hover:bg-amber-500/20 transition-all"
                      >
                        <QrCode className="h-3.5 w-3.5 mr-1.5" /> Lihat QR
                      </Button>
                    )}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200/50 shadow-sm">
                      <Crown className="h-3 w-3 fill-amber-500" /> Ultimate
                    </div>
                  </div>
                )}
              </div>



              {/* Primary actions grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Edit — all active tiers */}
                <Link href={`/create?edit=${invitation.id}`} className="w-full">
                  <Button variant="secondary" className="w-full h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                    <Pencil className="h-5 w-5 mr-3 text-rose-500 group-hover:text-white transition-colors" />
                    Edit
                  </Button>
                </Link>

                {/* Lihat Hasil — all active */}
                {canViewResult ? (
                  <Link href={invitationUrl} target="_blank" className="w-full">
                    <Button variant="secondary" className="w-full h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                      <ExternalLink className="h-5 w-5 mr-3 text-blue-500 group-hover:text-white transition-colors" />
                      Lihat Hasil
                    </Button>
                  </Link>
                ) : null}

                {/* Salin Link — all active */}
                {canCopyLink ? (
                  <Button variant="secondary" onClick={handleCopyLink} className="h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                    <Copy className="h-5 w-5 mr-3 text-rose-500 group-hover:text-white transition-colors" />
                    Salin Link
                  </Button>
                ) : null}

                {/* WhatsApp Share — PREMIUM & ULTIMATE only */}
                {canShareWA ? (
                  <WhatsAppGenerator invitationSlug={invitation.slug} groomName={invitation.groomName} brideName={invitation.brideName} />
                ) : (
                  <div className="h-12 rounded-2xl border border-dashed border-[#eceae4] flex items-center justify-center gap-2 text-[#1c1c1c]/25 text-xs font-bold cursor-not-allowed select-none">
                    <Lock className="h-3.5 w-3.5" /> WA Share — Premium+
                  </div>
                )}

                {/* Buku Tamu — PREMIUM & ULTIMATE only */}
                {canManageGuest ? (
                  <Link href={`${invitationUrl}/rsvp`} className="w-full">
                    <Button variant="secondary" className="w-full h-12 rounded-2xl border-[#eceae4] bg-white text-[#1c1c1c] font-bold text-sm shadow-sm hover:bg-[#1c1c1c] hover:text-white transition-all group">
                      <Users className="h-5 w-5 mr-3 text-emerald-500 group-hover:text-white transition-colors" />
                      Buku Tamu
                    </Button>
                  </Link>
                ) : (
                  <div className="h-12 rounded-2xl border border-dashed border-[#eceae4] flex items-center justify-center gap-2 text-[#1c1c1c]/25 text-xs font-bold cursor-not-allowed select-none col-span-1">
                    <Lock className="h-3.5 w-3.5" /> Tamu — Premium+
                  </div>
                )}
              </div>

              {/* Special actions row */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                {/* WA Blast — ULTIMATE only */}
                {canWaBlast && (
                  <Link href={`${invitationUrl}/blast`} className="flex-1 w-full">
                    <Button className="w-full h-12 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg hover:bg-emerald-600 transition-all">
                      <MessageSquare className="h-5 w-5 mr-3" />
                      WA Blast Pro
                    </Button>
                  </Link>
                )}

                {/* QR Check-in — ULTIMATE only */}
                {canQrCheckin && (
                  <Link href={`${invitationUrl}/rsvp/scanner`} className="flex-1 w-full">
                    <Button className="w-full h-12 rounded-2xl bg-amber-500 text-white font-bold text-sm shadow-lg hover:bg-amber-600 transition-all">
                      <QrCode className="h-5 w-5 mr-3" />
                      Scan QR Check-in
                    </Button>
                  </Link>
                )}

                {/* Upgrade — BASIC & PREMIUM */}
                {showUpgrade && (
                  <Link href={`/pricing?invitationId=${invitation.id}`} className="flex-1 w-full">
                    <Button className="w-full h-12 rounded-2xl bg-rose-500 text-white font-bold text-sm shadow-lg hover:bg-rose-600 hover:scale-[1.01] transition-all">
                      <Sparkles className="h-5 w-5 mr-3 text-white fill-white" />
                      Upgrade Paket
                    </Button>
                  </Link>
                )}

                {/* Delete — always */}
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  className="w-full sm:w-auto h-12 px-6 rounded-2xl text-red-400 hover:bg-red-50 font-bold text-sm"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Hapus
                </Button>
              </div>
            </>
          )}
        </div>

      </div>

      {/* QR Code Modal for Ultimate Tier */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-2 border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full relative overflow-hidden">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-6 w-6" />
            </div>
            
            <h3 className="text-lg font-bold text-[#1c1c1c] mb-1 font-display">QR Code Buku Tamu (Attendance)</h3>
            <p className="text-[11px] text-stone-500 mb-6">Pindai QR Code di bawah untuk melakukan pengisian Buku Tamu secara digital</p>
            
            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border border-amber-100">
              <SafeQRCodeSVG
                id={`qr-inv-${invitation.id}`}
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${coupleSlug}/${invitation.slug}/attendance`}
                size={180}
                level="H"
              />
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              <Button 
                onClick={handleDownloadQR}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-3 rounded-xl shadow-md cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2 inline" /> Download PNG
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setShowQrModal(false)}
                className="w-full text-stone-500 hover:text-stone-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
